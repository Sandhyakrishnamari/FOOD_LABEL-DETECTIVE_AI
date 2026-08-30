-- Food Label Detective Database Schema
-- Table: scans
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
