import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
export const connectDB= async()=>{
    try {
         console.log(process.env.MONOGODB_URL);
         
       const conn=await mongoose.connect(process.env.MONOGODB_URL)
       console.log('Mongo DB is connected succefully',conn.connection.host);
       
    } catch (error) {
        console.log(error);
        
    }
}