import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { initDatabase } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors());

// Support high-resolution camera and image uploads (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount REST API endpoints
app.use('/api', apiRouter);

// Root Index
app.get('/', (req, res) => {
  res.json({
    app: 'Food Label Detective Backend API',
    status: 'Running',
    database: 'SQLite (scans.sqlite)',
    endpoints: {
      health: 'GET /api/health',
      analyzeLabel: 'POST /api/analyze-label',
      getHistory: 'GET /api/history',
      getScan: 'GET /api/history/:id',
      saveScan: 'POST /api/history',
      deleteScan: 'DELETE /api/history/:id',
      clearHistory: 'DELETE /api/history'
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Initialize database and start server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🔎 Food Label Detective Backend API`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`🩺 Health check at:   http://localhost:${PORT}/api/health`);
    console.log(`💾 Database:          SQLite (backend/database/scans.sqlite)`);
    console.log(`====================================================`);
  });
}

startServer();
