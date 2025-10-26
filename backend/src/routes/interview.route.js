import express, { Router } from 'express';

import { CreateRoom, getInterviewDetails, getInterviews,EndRoom, Feedback } from '../controllers/interview.controller.js';
import { scheduleInterview } from '../controllers/interview.controller.js';
const router=express.Router();

// post interview
router.post("/scheduleInterview",scheduleInterview);
router.get("/",getInterviews)
router.get('/stats',getInterviewDetails)
router.post('/create',CreateRoom)
router.delete('/end',EndRoom)
router.post('/feedback',Feedback)
export default router;