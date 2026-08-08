import express from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { validate } from "../validators/validate.js";

const route = express.Router()

route.post('/register', registerValidator, validate, register)
route.post('/login', loginValidator, validate, login)
route.post('/refresh-token', refreshToken)
route.post('/logout', logout)

export default route