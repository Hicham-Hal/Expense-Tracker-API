import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'

configDotenv()

export const verifyToken = async(req, res, next) => {
    try{
        const token = req.headers.split(' ')[1]
        const validToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = validToken
        next()
    }catch(err){
        console.log(err)
        return res.status(403).json({ error: 'Forbidden' })
    }
}