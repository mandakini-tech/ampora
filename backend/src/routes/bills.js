import { Router } from 'express';
import { getBills, createBill } from '../controllers/billController.js';

const router = Router();

router.get('/', getBills);
router.post('/', createBill);

export default router;

