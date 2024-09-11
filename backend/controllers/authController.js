require("dotenv").config();
const crypto = require("crypto");
const db = require("../config/db");
const transporter = require("../config/nodemailer");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

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

  // Validate organization_id
  db.query(
    "SELECT * FROM locations WHERE id = ? AND parent_location_id = 0",
    [organization_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Organization ID not found" });
      }

      // Check if email is unique
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }
          if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
          }

          // Hash the password
          const hashedPassword = await hashPassword(password);

          // Insert new user into the database
          db.query(
            "INSERT INTO users (username, email, password, email_verified, verification_code, organization_id) VALUES (?, ?, ?, ?, ?, ?)",
            [
              username,
              email,
              hashedPassword,
              false,
              verificationCode,
              organization_id,
            ],
            (err, results) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Database error", error: err });
              }

              // Send verification email
              const mailOptions = {
                from: `"${process.env.DEFAULT_EMAIL_NAME}" <${process.env.DEFAULT_EMAIL}>`,
                to: email,
                subject: "Email Verification",
                text: `Please verify your email by entering this code: ${verificationCode}`,
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return res
                    .status(500)
                    .json({ message: "Error sending email", error });
                }
                res
                  .status(201)
                  .json({
                    message:
                      "User created successfully, please check your email for verification",
                  });
              });
            }
          );
        }
      );
    }
  );
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

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
    }
  );
};

// Resend verification email
exports.resendVerificationEmail = (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

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
        return res.status(500).json({ message: "Error sending email", error });
      }
      res.status(200).json({ message: "Verification email resent" });
    });
  });
};
