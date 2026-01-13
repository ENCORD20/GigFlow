import express from 'express';
import { createGig, getGigs, getGigById } from '../controllers/gigController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createGig)
  .get(protect, getGigs);

router.route('/:id').get(protect, getGigById);

export default router;

