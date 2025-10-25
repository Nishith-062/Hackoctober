import express from 'express'
import dotenv from 'dotenv'
import { clerkMiddleware, requireAuth } from '@clerk/express'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.route.js'
import scheduleinterviewRoute from '../src/routes/InterviewerRoutes/scheduleinterview.route.js'
import cors from 'cors'


dotenv.config()
const app=express()
app.use(cors())
app.use(express.json())
const PORT=process.env.PORT
app.use(clerkMiddleware())

app.use('/api/auth',authRoutes)
app.use('/api/interviewer',scheduleinterviewRoute)

app.listen(PORT,()=>{
    console.log(`running on http://localhost:3000`);
    connectDB()
})