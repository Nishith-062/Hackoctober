import express, { Router } from 'express';
import { getInterviewsByCandidateId, joinRoom } from '../controllers/candidate.controller.js';

const router=express.Router();

// post interview
router.get("/get-interviews",getInterviewsByCandidateId)
router.get('/join',joinRoom)
export default router;