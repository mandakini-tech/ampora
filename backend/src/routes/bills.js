import { Router } from 'express';
import { getBills, createBill, updateBillStatus } from '../controllers/billController.js';

const router = Router();

router.get('/', getBills);
router.post('/', createBill);
router.patch('/:id', updateBillStatus);

export default router;

