import express, { Router } from 'express';

import { CreateRoom, getInterviewDetails, getInterviews } from '../controllers/interview.controller.js';
import { scheduleInterview } from '../controllers/interview.controller.js';
const router=express.Router();

// post interview
router.post("/scheduleInterview",scheduleInterview);
router.get("/",getInterviews)
router.get('/stats',getInterviewDetails)
router.post('/create',CreateRoom)
export default router;