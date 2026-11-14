import { Router } from 'express';
import {
  getComplaints,
  createComplaint,
  updateComplaint,
} from '../controllers/complaintController.js';

const router = Router();

router.get('/', getComplaints);
router.post('/', createComplaint);
router.put('/:id', updateComplaint);

export default router;

