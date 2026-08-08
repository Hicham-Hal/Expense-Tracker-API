import express from "express";
import { deleteExpense, getExpenses, setExpense, updateExpense } from "../controllers/expense.controller.js";
import { validate } from "../validators/validate.js";
import { expenseAddValidator, expenseUpValidator } from "../validators/expense.validator.js";
import { verifyToken } from "../middleware/verifyToken.js";

const route = express.Router()

route.get('/',  verifyToken, getExpenses)
route.post('/', verifyToken, expenseAddValidator, validate, setExpense)
route.delete('/:id', verifyToken, deleteExpense)
route.put('/:id', verifyToken, expenseUpValidator, validate, updateExpense)

export default route