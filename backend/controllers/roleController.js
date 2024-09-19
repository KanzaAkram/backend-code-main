const pool = require("../config/db"); // Make sure the path is correct

const AddNewRoleController = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ error: "Database connection failed" });
    }

    const { roleName, parentType, accessibleModules, updateSettings } =
      req.body;

    // Start a transaction to ensure all queries succeed or none at all
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        connection.release();
        return res.status(500).json({ error: "Transaction start failed" });
      }

      // Insert the new role into user_types table with all required fields
      connection.query(
        `INSERT INTO user_types (type_name, parent_type_id, data_email_notification) VALUES (?, ?, ?)`,
        [roleName, parentType, 0], // Provide a default value for data_email_notification
        (error, roleResult) => {
          if (error) {
            console.error("Error inserting role:", error);
            return connection.rollback(() => {
              connection.release();
              res
                .status(500)
                .json({ error: "An error occurred while adding the new role" });
            });
          }

          const roleId = roleResult.insertId; // The newly inserted role's ID

          // Insert accessible modules into user_type_modules table
          if (accessibleModules && accessibleModules.length > 0) {
            let modulesProcessed = 0;

            accessibleModules.forEach((moduleId) => {
              connection.query(
                `INSERT INTO user_type_modules (type_id, module_id) VALUES (?, ?)`,
                [roleId, moduleId],
                (moduleError) => {
                  if (moduleError) {
                    console.error("Error inserting module:", moduleError);
                    return connection.rollback(() => {
                      connection.release();
                      res
                        .status(500)
                        .json({
                          error:
                            "An error occurred while adding the accessible modules",
                        });
                    });
                  }

                  modulesProcessed += 1;

                  // Once all modules are processed, proceed
                  if (modulesProcessed === accessibleModules.length) {
                    finalizeRoleCreation();
                  }
                }
              );
            });
          } else {
            // No accessible modules to process, handle updateSettings case
            finalizeRoleCreation();
          }

          function finalizeRoleCreation() {
            // Insert permission into user_type_permissions table if updateSettings is true
            if (updateSettings) {
              connection.query(
                `INSERT INTO user_type_permissions (type_id, permission_id) VALUES (?, ?)`,
                [roleId, 1], // Assuming '1' is the permission_id for 'update settings authority'
                (permissionError) => {
                  if (permissionError) {
                    console.error(
                      "Error inserting permission:",
                      permissionError
                    );
                    return connection.rollback(() => {
                      connection.release();
                      res
                        .status(500)
                        .json({
                          error:
                            "An error occurred while adding the update settings permission",
                        });
                    });
                  }

                  // Commit the transaction if everything succeeds
                  connection.commit((commitError) => {
                    if (commitError) {
                      console.error(
                        "Error committing transaction:",
                        commitError
                      );
                      return connection.rollback(() => {
                        connection.release();
                        res
                          .status(500)
                          .json({ error: "Transaction commit failed" });
                      });
                    }

                    // Respond with success
                    connection.release();
                    res.status(201).json({
                      message: "New role created successfully!",
                      roleId,
                    });
                  });
                }
              );
            } else {
              // No permission to insert, just commit the transaction
              connection.commit((commitError) => {
                if (commitError) {
                  console.error("Error committing transaction:", commitError);
                  return connection.rollback(() => {
                    connection.release();
                    res
                      .status(500)
                      .json({ error: "Transaction commit failed" });
                  });
                }

                // Respond with success
                connection.release();
                res.status(201).json({
                  message: "New role created successfully!",
                  roleId,
                });
              });
            }
          }
        }
      );
    });
  });
};

module.exports = {
  AddNewRoleController,
};
