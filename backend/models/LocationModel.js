const db = require("../db");

// Function to validate organization ID in the locations table
async function validateOrganizationId(organizationId) {
  const query = `SELECT * FROM locations WHERE id = ? AND parent_location_id = 0`;

  return new Promise((resolve, reject) => {
    db.query(query, [organizationId], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length === 0) {
        return reject(new Error("Organization ID not found or invalid."));
      }
      resolve(results[0]);
    });
  });
}

module.exports = {
  validateOrganizationId,
};
