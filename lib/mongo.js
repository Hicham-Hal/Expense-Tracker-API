import { configDotenv } from "dotenv";
import mongoose from "mongoose";

configDotenv()

export const connectDB = async() => {
    const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xbsitch.mongodb.net/?appName=Cluster0`
    try{
        await mongoose.connect(URI)
        console.log('Connected DB')
    }catch(err){
        console.log(err)
    }
}