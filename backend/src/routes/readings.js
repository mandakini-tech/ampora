import { Router } from 'express';
import { getReadings, createReading } from '../controllers/readingController.js';

const router = Router();

router.get('/', getReadings);
router.post('/', createReading);

export default router;

