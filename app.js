import express from 'express'
import authRoute from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import expenseRoute from './routes/expense.route.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/', authRoute)
app.use('/expense', expenseRoute)

export default app