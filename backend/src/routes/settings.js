import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  getTariffSlabs,
  updateTariffSlabs,
} from '../controllers/settingsController.js';

const router = Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.get('/tariff-slabs', getTariffSlabs);
router.put('/tariff-slabs', updateTariffSlabs);

export default router;

