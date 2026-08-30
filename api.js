import express from 'express';
import { analyzeLabelWithGemini } from '../services/geminiService.js';
import {
  getAllScans,
  getScanById,
  saveScan,
  deleteScan,
  clearAllScans
} from '../database/db.js';

const router = express.Router();

// 1. Health & Status Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'food-label-detective-api',
    database: 'SQLite (scans.sqlite)',
    timestamp: new Date().toISOString(),
    hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// 2. Multimodal AI Label Analysis (Gemini)
router.post('/analyze-label', async (req, res) => {
  try {
    const { image, apiKey } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, error: 'Image base64 data is required in request body.' });
    }

    const aiData = await analyzeLabelWithGemini(image, apiKey);
    return res.json({ success: true, data: aiData });
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze food label image'
    });
  }
});

// 3. Get All Scans
router.get('/history', async (req, res) => {
  try {
    const scans = await getAllScans();
    res.json({ success: true, count: scans.length, data: scans });
  } catch (error) {
    console.error('Get History Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch scan history' });
  }
});

// 4. Get Single Scan by ID
router.get('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const scan = await getScanById(id);
    if (!scan) {
      return res.status(404).json({ success: false, error: 'Scan not found' });
    }
    res.json({ success: true, data: scan });
  } catch (error) {
    console.error('Get Single Scan Error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve scan' });
  }
});

// 5. Save Scan (Create or Update)
router.post('/history', async (req, res) => {
  try {
    const scanData = req.body;
    if (!scanData || typeof scanData !== 'object' || Object.keys(scanData).length === 0) {
      return res.status(400).json({ success: false, error: 'Scan data payload is required' });
    }

    const saved = await saveScan(scanData);
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error('Save Scan Error:', error);
    res.status(500).json({ success: false, error: 'Failed to save scan record' });
  }
});

// 6. Delete Scan by ID
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteScan(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Scan not found' });
    }
    res.json({ success: true, message: 'Scan deleted successfully' });
  } catch (error) {
    console.error('Delete Scan Error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete scan' });
  }
});

// 7. Clear All History
router.delete('/history', async (req, res) => {
  try {
    await clearAllScans();
    res.json({ success: true, message: 'Scan history cleared successfully' });
  } catch (error) {
    console.error('Clear History Error:', error);
    res.status(500).json({ success: false, error: 'Failed to clear history' });
  }
});

export default router;
