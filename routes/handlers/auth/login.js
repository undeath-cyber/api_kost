const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Validator = require("fastest-validator");
const v = new Validator();
const connection = require("../../../config/db");

const loginSchema = {
  email: { type: "email", empty: false },
  password: { type: "string", min: 8, empty: false },
};

module.exports = async (req, res) => {
  const { body } = req;

  // Validasi input
  const validationResponse = v.validate(body, loginSchema);

  if (validationResponse !== true) {
    return res.status(400).json({
      code: 400,
      status: "error",
      data: {
        error: "Validation failed",
        details: validationResponse,
      },
    });
  }

  try {
    // Ganti kueri SQL berikut sesuai dengan struktur database Anda
    const query = `SELECT * FROM users WHERE email = '${body.email}'`;
    connection.query(query, async (error, results) => {
      if (error) {
        return res.status(500).json({
          code: 500,
          status: "error",
          data: {
            error: "Internal Server Error.",
            details: error.message,
          },
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          code: 401,
          status: "error",
          data: {
            error:
              "Authentication failed. Please ensure your email and password are correct.",
          },
        });
      }

      const user = results[0];

      const isPasswordCorrect = bcrypt.compareSync(
        body.password,
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          code: 401,
          status: "error",
          data: {
            error:
              "Authentication failed. Please ensure your email and password are correct.",
          },
        });
      }

      const payload = {
        id: user.id,
        role: user.role,
      };

      const secret = process.env.JWT_SECRET;
      const expiresIn = "1h"; // Use "1h" for 1 hour expiration

      const token = jwt.sign(payload, secret, { expiresIn });

      return res.status(200).json({
        code: 200,
        status: "success",
        data: {
          name: user.name,
          email: user.email,
          token: token,
        },
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      status: "error",
      data: {
        error: "Internal Server Error.",
        details: error.message,
      },
    });
  }
};
