import User from "../models/User.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv"

configDotenv()

export const register = async(req, res) => {
    const { name, email, password } = req.body
    try{
        const existedUser = await User.findOne({ email })
        if(existedUser) return res.status(409).json({ message: 'Email already exist' })
        const salt = await bcrypt.genSaltSync(10)
        const hashedPwd = await bcrypt.hashSync(password, salt)

        const user = new User({
            name,
            email,
            password: hashedPwd
        })

        await user.save()

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
    
        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    
        return res.status(201).json({ token: accessToken })

    }catch(err){
        console.log(err)
        return res.status(500).json({ message: 'Something went wrong' })
    }
}


export const login = async(req, res) => {
    const {email, password} = req.body
    try{
        const user = await User.findOne({ email })
        if(!user) return res.status(401).json({ message: 'Invalid email or password' })
        const pwdCompare = await bcrypt.compare(password, user.password)   
        if(!pwdCompare) return res.status(401).json({ message: 'Invalid email or password' })
        
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
    
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        return res.status(200).json({ token: accessToken })
    }catch(err){
        console.log(err)
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

export const refreshToken = async(req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({ message: 'Refresh token missing' })
    }
    try{
        const validRefresh = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const accessToken = jwt.sign({ id: validRefresh.id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
        return res.status(200).json({ token: accessToken })
    }catch(err){
        console.log(err)
        return res.status(403).json({ error: 'Forbidden' })
    }
}