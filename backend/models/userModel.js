const db = require("../db"); // Import your MySQL connection

// Function to create a new user (signup)
async function createUser({
  username,
  email,
  password,
  organizationId,
  verificationCode,
}) {
  const query = `
        INSERT INTO users (username, email, password, organization_id, verification_code, email_verified)
        VALUES (?, ?, ?, ?, ?, 0)`;

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [username, email, password, organizationId, verificationCode],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
}

// Function to find a user by email (for login)
async function findUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [email], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results[0]);
    });
  });
}

// Function to update email verification status
async function verifyUserEmail(email) {
  const query = `UPDATE users SET email_verified = 1 WHERE email = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [email], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
}

module.exports = {
  createUser,
  findUserByEmail,
  verifyUserEmail,
};
