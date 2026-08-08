import Expense from "../models/Expense.model.js"

export const getExpenses = async(req, res) => {
    const {filter, start, end} = req.query
    const filteredTime = filter?.toLowerCase()
    const now = new Date()
    let time;
    let query = {}
    if(start || end){
        const range = {}
        if(start) range.$gte = new Date(start)
        if(end) range.$lte = new Date(end)
        
        query = { createdAt: range }
    }else{
        
        switch (filteredTime) {
            case 'current': {
                time = {$gt: new Date(now.getFullYear(), now.getMonth(), 1)}
                break;
            }
            case 'past week':{
                const d = new Date(now)
                d.setDate(d.getDate() - 7)
                time = d
                break;
            }
            case 'past month': {
                const d = new Date(now);
                d.setMonth(d.getMonth() - 1)
                console.log(new Date(d))
                time = d;
                break
            }
            case 'last 3 month':{
                const d = new Date(now)
                d.setMonth(d.getMonth() - 3)
                console.log(new Date(d))
                time = d
                break
            }
            default:
                time = null
                break;
        }
        query = time ? {createdAt: {$gt: new Date(time)}} : {}
    }
    try{
        const expenses = await Expense.find(query)
        return res.status(200).json(expenses)
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const setExpense = async(req, res) => {
    const { description, amount, category } = req.body
    try{
        const cat = category.toLowerCase()
        const expense = new Expense({
            description,
            amount,
            category: cat,
            user: req.user.id
        })
        
        await expense.save()
        return res.status(201).json({ data: expense })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const deleteExpense = async(req, res) => {
    const {id} = req.params
    try{
        const expense = await Expense.findOne({ _id: id })
        if(!expense) return res.status(404).json({ message: 'Expense not found' })
        if(expense.user.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' })    
        await expense.deleteOne()
        return res.status(204).send()
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export const updateExpense = async(req, res) => {
    const { description, amount, category } = req.body
    const {id} = req.params
    console.log(typeof(id))
    try{
        const expense = await Expense.findOne({ _id: id })
        if(!expense) return res.status(404).json({ messge: 'Expense not found' })
        console.log(expense)
        if(expense.user.toString() !== req.user.id){
            return res.status(403).json({ message: 'Not authorized for this expense' })
        }
        expense.description = description;
        expense.amount = amount
        expense.category = category

        await expense.save()

        return res.status(200).json({ data: expense })
    }catch(err){
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}