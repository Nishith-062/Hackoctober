import express, { Router } from 'express';


import {} from '../../controllers/InterviewerControllers/scheduleinterview.controller.js'
import { getInterviews } from '../../controllers/InterviewerControllers/scheduleinterview.controller.js';

const router=express.Router();

// post interview
router.post("/scheduleInterview",scheduleInterview);
router.get("/",getInterviews)
export default router;