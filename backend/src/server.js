import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import apiRoutes from './routes/api.js';
import { isSupabaseConfigured } from './config/supabase.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    name: 'Ampora Electricity Billing Management API',
    version: '1.0.0',
    documentation: '/api/health',
    supabaseConnected: isSupabaseConfigured(),
    message: 'Backend is active. See /backend/README.md for Supabase setup guide.',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`⚡ Ampora Backend Server listening on http://localhost:${PORT}`);
  console.log(`📡 Healthcheck available at: http://localhost:${PORT}/api/health`);
  console.log(`🔌 Supabase Status: ${isSupabaseConfigured() ? 'Connected' : 'Standby / Local Mode'}`);
});

export default app;
