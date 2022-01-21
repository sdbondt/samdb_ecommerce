const pool = require('../db')
const asyncHandler = require('../errorhandlers/asyncHandler')
const CustomError = require('../errorhandlers/customError')
const { StatusCodes } = require("http-status-codes")
const { hashPw, getJWT, comparePw } = require("../utils/jwt")

exports.signUp = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const hashedPw = await hashPw(password)
    if (!name || !email || !password || !confirmPassword) {
        throw new CustomError('You must fill in all required fields.', StatusCodes.BAD_REQUEST)
    }
    if (confirmPassword !== password) {
        throw new CustomError('Password and confirm password don\'t match.', StatusCodes.BAD_REQUEST)
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    if (!password.match(regex)) {
        throw new CustomError('Password must be at least 6 and maximum 32 characters long,  contain one uppercase letter, one lowercase letter and a number.', StatusCodes.BAD_REQUEST)
    }

    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *;",
      [name, email, hashedPw]
    )
    const token = getJWT(newUser.rows[0])
    res.status(StatusCodes.CREATED).json({ token, data: newUser.rows[0] })
})
  
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new CustomError('You must supply an email and a password.', StatusCodes.UNAUTHORIZED)
    }
    const users = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ])    
    if (users.rows.length === 0) {
      throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
      }
      const user = users.rows[0]
      const isValid = await comparePw(password, user)
      
      if (!isValid) {
          throw new CustomError('Invalid credentials.', StatusCodes.UNAUTHORIZED)
      } else {
          const token = getJWT(user)
          res.json({ token, data: user })
      }
  
})
  
exports.getProfile = asyncHandler(async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
})