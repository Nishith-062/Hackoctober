import express, { Router } from 'express';

import { getInterviews } from '../controllers/interview.controller.js';
import { scheduleInterview } from '../controllers/interview.controller.js';
const router=express.Router();

// post interview
router.post("/scheduleInterview",scheduleInterview);
router.get("/",getInterviews)
export default router;