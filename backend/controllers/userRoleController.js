// // controllers/userRoleController.js

// const db = require("../config/db"); // Assuming your db connection is in config/db.js

// // Function to fetch role details
// const getUserRoleDetails = async (req, res) => {
//   const roleId = req.params.id;

//   try {
//     // Query to fetch role name, parent type, and creator
//     const roleQuery = `
//       SELECT 
//         ut.type_name AS role_name,
//         parent_ut.type_name AS parent_type,
//         creator.username AS created_by
//       FROM user_types ut
//       LEFT JOIN user_types parent_ut ON ut.parent_type_id = parent_ut.id
//       LEFT JOIN users creator ON ut.user_id = creator.id
//       WHERE ut.id = ?
//     `;

//     const [roleResult] = await db.query(roleQuery, [roleId]);

//     if (!roleResult) {
//       return res.status(404).json({ error: "User role not found" });
//     }

//     // Query to fetch accessible modules
//     const moduleQuery = `
//       SELECT m.name AS module_name
//       FROM user_type_modules utm
//       JOIN modules m ON utm.module_id = m.id
//       WHERE utm.type_id = ?
//     `;

//     const [moduleResults] = await db.query(moduleQuery, [roleId]);

//     // Query to fetch additional permissions
//     const permissionQuery = `
//       SELECT p.name AS permission_name
//       FROM user_type_permissions utp
//       JOIN permissions p ON utp.permission_id = p.id
//       WHERE utp.type_id = ?
//     `;

//     const [permissionResults] = await db.query(permissionQuery, [roleId]);

//     // Format response
//     const accessibleModules =
//       moduleResults.map((module) => module.module_name).join(", ") || "None";
//     const additionalPermissions = permissionResults.length > 0 ? "All" : "None";

//     // Response
//     res.json({
//       role_name: roleResult.role_name,
//       accessible_modules: accessibleModules,
//       additional_permissions: additionalPermissions,
//       parent_type: roleResult.parent_type || "None",
//       created_by: roleResult.created_by || "Unknown",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// module.exports = { getUserRoleDetails };


const db = require("../config/db"); // Ensure this is the database connection

// Controller for getting a user role by ID
exports.getUserRoleById = (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT 
      ut.type_name AS role_name,
      GROUP_CONCAT(m.name SEPARATOR ', ') AS accessible_modules,
      'All' AS additional_permissions,
      parent_ut.type_name AS parent_type,
      u.username AS created_by
    FROM user_types ut
    LEFT JOIN user_type_modules utm ON ut.id = utm.type_id
    LEFT JOIN modules m ON utm.module_id = m.id
    LEFT JOIN user_types parent_ut ON ut.parent_type_id = parent_ut.id
    LEFT JOIN users u ON ut.user_id = u.id
    WHERE ut.id = ?
    GROUP BY ut.id, parent_ut.type_name, u.username;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User role not found" });
    }
    res.json(results[0]);
  });
};
