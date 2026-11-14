import { Router } from 'express';
import {
  getConsumers,
  getConsumerById,
  createConsumer,
  updateConsumer,
  deleteConsumer,
} from '../controllers/consumerController.js';

const router = Router();

router.get('/', getConsumers);
router.get('/:id', getConsumerById);
router.post('/', createConsumer);
router.put('/:id', updateConsumer);
router.delete('/:id', deleteConsumer);

export default router;

