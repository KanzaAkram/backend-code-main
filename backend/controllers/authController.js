

// require("dotenv").config();
// const crypto = require("crypto");
// const mysql = require("mysql2");
// const transporter = require("../config/nodemailer");
// const { hashPassword, comparePassword } = require("../utils/hashPassword");

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
// });

// // Generate a random verification code
// const generateVerificationCode = () => crypto.randomBytes(3).toString("hex");

// // Signup controller
// exports.signup = async (req, res) => {
//   const { username, email, password, confirmPassword, id } =
//     req.body;

//   // Validate password length
//   if (password.length < 8 || password.length > 20) {
//     return res
//       .status(400)
//       .json({ message: "Password must be between 8 and 20 characters" });
//   }

//   if (password !== confirmPassword) {
//     return res.status(400).json({ message: "Passwords do not match" });
//   }

//   const verificationCode = generateVerificationCode();

//   try {
//     // Validate organization_id
//     const [orgResults] = await pool
//       .promise()
//       .query(
//         "SELECT * FROM locations WHERE id = ? AND parent_location_id = 0",
//         [id]
//       );
//     if (orgResults.length === 0) {
//       return res.status(404).json({ message: "Organization ID not found" });
//     }

//     // Check if email is unique
//     const [emailResults] = await pool
//       .promise()
//       .query("SELECT * FROM users WHERE email = ?", [email]);
//     if (emailResults.length > 0) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash the password
//     const hashedPassword = await hashPassword(password);

//     // Insert new user into the database
//     await pool
//       .promise()
//       .query(
//         "INSERT INTO users (username, email, password, email_verified, verification_code) VALUES (?, ?, ?, ?, ?)",
//         [
//           username,
//           email,
//           hashedPassword,
//           false,
//           verificationCode,
//         ]
//       );

//     // Send verification email
//     const mailOptions = {
//       from: `"${process.env.DEFAULT_EMAIL_NAME}" <${process.env.DEFAULT_EMAIL}>`,
//       to: email,
//       subject: "Email Verification",
//       text: `Please verify your email by entering this code: ${verificationCode}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return res.status(500).json({ message: "Error sending email", error });
//       }
//       res.status(201).json({
//         message:
//           "User created successfully, please check your email for verification",
//       });
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Database error", error: err });
//   }
// };

// // Login controller
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if the user exists
//     const [userResults] = await pool
//       .promise()
//       .query("SELECT * FROM users WHERE email = ?", [email]);
//     if (userResults.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = userResults[0];

//     // Check if password matches
//     const isMatch = await comparePassword(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Check if email is verified
//     if (!user.email_verified) {
//       return res.status(400).json({ message: "Email not verified" });
//     }

//     // Respond with user details
//     res.status(200).json({
//       username: user.username,
//       verification_code: user.verification_code, // Include as needed
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Database error", error: err });
//   }
// };

// // Resend verification email
// exports.resendVerificationEmail = (req, res) => {
//   const { email } = req.body;

//   pool
//     .promise()
//     .query("SELECT * FROM users WHERE email = ?", [email])
//     .then(([userResults]) => {
//       if (userResults.length === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const user = userResults[0];

//       if (user.email_verified) {
//         return res.status(400).json({ message: "Email already verified" });
//       }

//       // Send new verification email
//       const mailOptions = {
//         from: `"${process.env.DEFAULT_EMAIL_NAME}" <${process.env.DEFAULT_EMAIL}>`,
//         to: email,
//         subject: "Email Verification",
//         text: `Please verify your email by entering this code: ${user.verification_code}`,
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           return res
//             .status(500)
//             .json({ message: "Error sending email", error });
//         }
//         res.status(200).json({ message: "Verification email resent" });
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({ message: "Database error", error: err });
//     });
// };


require("dotenv").config();
const crypto = require("crypto");
const mysql = require("mysql2");
const transporter = require("../config/nodemailer");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Generate a random verification code
const generateVerificationCode = () => crypto.randomBytes(3).toString("hex");

// Signup controller
exports.signup = async (req, res) => {
  const { username, email, password, confirmPassword, organization_id } =
    req.body;

  // Validate password length
  if (password.length < 8 || password.length > 20) {
    return res
      .status(400)
      .json({ message: "Password must be between 8 and 20 characters" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const verificationCode = generateVerificationCode();

  try {
    // Validate organization_id
    const [orgResults] = await pool
      .promise()
      .query(
        "SELECT * FROM locations WHERE id = ? AND parent_location_id = 0",
        [organization_id]
      );
    if (orgResults.length === 0) {
      return res.status(404).json({ message: "Organization ID not found" });
    }

    // Check if email is unique
    const [emailResults] = await pool
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (emailResults.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert new user into the database
    await pool
      .promise()
      .query(
        "INSERT INTO users (username, email, password, email_verified, verification_code) VALUES (?, ?, ?, ?, ?)",
        [
          username,
          email,
          hashedPassword,
          false,
          verificationCode,
        ]
      );

    // Send verification email
    const mailOptions = {
      from: `"${process.env.DEFAULT_EMAIL_NAME}" <${process.env.DEFAULT_EMAIL}>`,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by entering this code: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email", error });
      }
      res.status(201).json({
        message:
          "User created successfully, please check your email for verification",
      });
    });
  } catch (err) {
    console.error("Signup error:", err); // Log detailed error
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [userResults] = await pool
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];

    // Check if password matches
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    // Respond with user details
    res.status(200).json({
      username: user.username,
      verification_code: user.verification_code, // Include as needed
    });
  } catch (err) {
    console.error("Login error:", err); // Log detailed error
    res.status(500).json({ message: "Database error", error: err });
  }
};

// Email verification controller
exports.verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Check if the user exists
    const [userResults] = await pool
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];

    // Check if verification code matches
    if (user.verification_code !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Update email_verified status
    await pool
      .promise()
      .query("UPDATE users SET email_verified = true WHERE email = ?", [email]);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Email verification error:", err); // Log detailed error
    res.status(500).json({ message: "Database error", error: err });
  }
};


// Resend verification email
exports.resendVerificationEmail = (req, res) => {
  const { email } = req.body;

  pool
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then(([userResults]) => {
      if (userResults.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = userResults[0];

      if (user.email_verified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Send new verification email
      const mailOptions = {
        from: `"${process.env.DEFAULT_EMAIL_NAME}" <${process.env.DEFAULT_EMAIL}>`,
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by entering this code: ${user.verification_code}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "Error sending email", error });
        }
        res.status(200).json({ message: "Verification email resent" });
      });
    })
    .catch((err) => {
      console.error("Resend verification email error:", err); // Log detailed error
      res.status(500).json({ message: "Database error", error: err });
    });
};
