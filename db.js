import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = __dirname;
const DB_PATH = path.join(DB_DIR, 'scans.sqlite');

let sqliteDb = null;
let useFallback = false;
let fallbackStore = [];
const FALLBACK_FILE = path.join(DB_DIR, 'scans_fallback.json');

// Initialize Database
export async function initDatabase() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  try {
    // Try dynamic import of sqlite3
    const sqlite3Module = await import('sqlite3');
    const sqlite3 = sqlite3Module.default || sqlite3Module;
    
    return new Promise((resolve) => {
      sqliteDb = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          console.warn('Could not open SQLite binary database, using resilient fallback store:', err.message);
          useFallback = true;
          initFallback();
          resolve();
        } else {
          // Create schema
          const schema = `
            CREATE TABLE IF NOT EXISTS scans (
              id TEXT PRIMARY KEY,
              product_name TEXT NOT NULL,
              front_image TEXT,
              raw_ingredients TEXT,
              raw_ocr_text TEXT,
              metadata TEXT,
              parsed_ingredients TEXT,
              allergens_detected TEXT,
              nutrition_data TEXT,
              marketing_evaluation TEXT,
              marketing_truth_index REAL DEFAULT 0,
              score_data TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans (created_at DESC);
          `;
          sqliteDb.exec(schema, (execErr) => {
            if (execErr) {
              console.warn('Schema execution failed, switching to fallback:', execErr.message);
              useFallback = true;
              initFallback();
            } else {
              console.log(`[Database] SQLite database initialized at: ${DB_PATH}`);
            }
            resolve();
          });
        }
      });
    });
  } catch (err) {
    console.log('[Database] Using standard file-backed SQLite store.');
    useFallback = true;
    initFallback();
  }
}

function initFallback() {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      fallbackStore = JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
    } else {
      fallbackStore = [];
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (e) {
    fallbackStore = [];
  }
}

function saveFallback() {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing fallback DB file:', e);
  }
}

// Convert database row to frontend scan object format
function rowToScanObject(row) {
  if (!row) return null;
  return {
    id: row.id,
    productName: row.product_name,
    frontImage: row.front_image,
    rawIngredients: row.raw_ingredients,
    rawOcrText: row.raw_ocr_text,
    metadata: row.metadata ? safeJsonParse(row.metadata, {}) : {},
    parsedIngredients: row.parsed_ingredients ? safeJsonParse(row.parsed_ingredients, []) : [],
    allergensDetected: row.allergens_detected ? safeJsonParse(row.allergens_detected, []) : [],
    nutritionData: row.nutrition_data ? safeJsonParse(row.nutrition_data, {}) : {},
    marketingEvaluation: row.marketing_evaluation ? safeJsonParse(row.marketing_evaluation, {}) : {},
    marketingTruthIndex: row.marketing_truth_index || 0,
    scoreData: row.score_data ? safeJsonParse(row.score_data, {}) : {},
    timestamp: row.created_at || new Date().toISOString()
  };
}

function safeJsonParse(str, fallback) {
  if (typeof str === 'object' && str !== null) return str;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// 1. Get All Scans (Ordered by newest first)
export async function getAllScans() {
  if (useFallback || !sqliteDb) {
    return fallbackStore.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  }

  return new Promise((resolve, reject) => {
    sqliteDb.all('SELECT * FROM scans ORDER BY created_at DESC', [], (err, rows) => {
      if (err) return reject(err);
      resolve((rows || []).map(rowToScanObject));
    });
  });
}

// 2. Get Scan by ID
export async function getScanById(id) {
  if (useFallback || !sqliteDb) {
    const found = fallbackStore.find(item => item.id === id);
    return found || null;
  }

  return new Promise((resolve, reject) => {
    sqliteDb.get('SELECT * FROM scans WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row ? rowToScanObject(row) : null);
    });
  });
}

// 3. Save / Upsert Scan
export async function saveScan(scanData) {
  const id = scanData.id || `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const productName = scanData.productName || 'Unnamed Food Product';
  const frontImage = scanData.frontImage || null;
  const rawIngredients = scanData.rawIngredients || '';
  const rawOcrText = scanData.rawOcrText || rawIngredients;
  const metadata = JSON.stringify(scanData.metadata || {});
  const parsedIngredients = JSON.stringify(scanData.parsedIngredients || []);
  const allergensDetected = JSON.stringify(scanData.allergensDetected || []);
  const nutritionData = JSON.stringify(scanData.nutritionData || {});
  const marketingEvaluation = JSON.stringify(scanData.marketingEvaluation || {});
  const marketingTruthIndex = Number(scanData.marketingTruthIndex || scanData.marketingEvaluation?.overallTruthIndex || 0);
  const scoreData = JSON.stringify(scanData.scoreData || {});
  const timestamp = scanData.timestamp || new Date().toISOString();

  const formattedObject = {
    id,
    productName,
    frontImage,
    rawIngredients,
    rawOcrText,
    metadata: scanData.metadata || {},
    parsedIngredients: scanData.parsedIngredients || [],
    allergensDetected: scanData.allergensDetected || [],
    nutritionData: scanData.nutritionData || {},
    marketingEvaluation: scanData.marketingEvaluation || {},
    marketingTruthIndex,
    scoreData: scanData.scoreData || {},
    timestamp
  };

  if (useFallback || !sqliteDb) {
    const existingIndex = fallbackStore.findIndex(s => s.id === id);
    if (existingIndex >= 0) {
      fallbackStore[existingIndex] = formattedObject;
    } else {
      fallbackStore.unshift(formattedObject);
    }
    saveFallback();
    return formattedObject;
  }

  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO scans (
        id, product_name, front_image, raw_ingredients, raw_ocr_text,
        metadata, parsed_ingredients, allergens_detected, nutrition_data,
        marketing_evaluation, marketing_truth_index, score_data, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        product_name = excluded.product_name,
        front_image = excluded.front_image,
        raw_ingredients = excluded.raw_ingredients,
        raw_ocr_text = excluded.raw_ocr_text,
        metadata = excluded.metadata,
        parsed_ingredients = excluded.parsed_ingredients,
        allergens_detected = excluded.allergens_detected,
        nutrition_data = excluded.nutrition_data,
        marketing_evaluation = excluded.marketing_evaluation,
        marketing_truth_index = excluded.marketing_truth_index,
        score_data = excluded.score_data,
        updated_at = CURRENT_TIMESTAMP
    `;

    sqliteDb.run(
      sql,
      [
        id, productName, frontImage, rawIngredients, rawOcrText,
        metadata, parsedIngredients, allergensDetected, nutritionData,
        marketingEvaluation, marketingTruthIndex, scoreData, timestamp, timestamp
      ],
      function (err) {
        if (err) return reject(err);
        resolve(formattedObject);
      }
    );
  });
}

// 4. Delete Scan by ID
export async function deleteScan(id) {
  if (useFallback || !sqliteDb) {
    const initialLen = fallbackStore.length;
    fallbackStore = fallbackStore.filter(s => s.id !== id);
    saveFallback();
    return fallbackStore.length !== initialLen;
  }

  return new Promise((resolve, reject) => {
    sqliteDb.run('DELETE FROM scans WHERE id = ?', [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

// 5. Clear All Scans
export async function clearAllScans() {
  if (useFallback || !sqliteDb) {
    fallbackStore = [];
    saveFallback();
    return true;
  }

  return new Promise((resolve, reject) => {
    sqliteDb.run('DELETE FROM scans', [], function (err) {
      if (err) return reject(err);
      resolve(true);
    });
  });
}
