require('dotenv').config()
const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errorHandlers/customError")
const pool = require("../db")

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new CustomError("Authentication invalid.", StatusCodes.UNAUTHORIZED)
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const users = await pool.query(
      "SELECT user_name, user_email, user_id FROM users WHERE user_id = $1",
      [payload.userId]
    );
    if (users.rows.length === 0) {
      throw new CustomError(
        "Authentication invalid.",
        StatusCodes.UNAUTHORIZED
      );
    }
    req.user = users.rows[0];
    next();
  } catch (e) {
    throw new CustomError("Authentication invalid.", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = auth;