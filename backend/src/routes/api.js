import { Router } from 'express';
import consumerRoutes from './consumers.js';
import billRoutes from './bills.js';
import readingRoutes from './readings.js';
import paymentRoutes from './payments.js';
import complaintRoutes from './complaints.js';
import settingsRoutes from './settings.js';
import statsRoutes from './stats.js';
import { isSupabaseConfigured } from '../config/supabase.js';

const router = Router();

// Health & Info Endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Ampora Electricity Billing Management API',
    supabaseConnected: isSupabaseConfigured(),
  });
});

router.use('/consumers', consumerRoutes);
router.use('/bills', billRoutes);
router.use('/readings', readingRoutes);
router.use('/payments', paymentRoutes);
router.use('/complaints', complaintRoutes);
router.use('/settings', settingsRoutes);
router.use('/stats', statsRoutes);

export default router;

