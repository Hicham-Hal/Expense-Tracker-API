import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['groceries', 'leisure', 'electronics', 'utilities', 'clothing', 'health', 'others'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, {timestamps: true})

const Expense = mongoose.model('Expense', expenseSchema)

export default Expense