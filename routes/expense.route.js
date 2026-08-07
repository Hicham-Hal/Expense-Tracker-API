import express from "express";
import { deleteExpense, getExpenses, setExpense, updateExpense } from "../controllers/expense.controller.js";

const route = express.Router()

route.get('/', getExpenses)
route.post('/', setExpense)
route.delete('/:id', deleteExpense)
route.put('/:id', updateExpense)

export default route