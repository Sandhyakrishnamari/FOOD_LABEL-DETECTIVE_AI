# Food Label Detective - Backend & SQLite Database

A lightweight Node.js/Express backend service powered by SQLite for persistent storage and secure server-side Gemini 2.5 Flash Vision AI analysis.

---

## Features
- **SQLite Database Persistence**: Stores scan results, nutrition facts, allergens, truth index, and ingredient analysis in `backend/database/scans.sqlite`.
- **Gemini Vision AI Proxy**: Handles Google Gemini API calls server-side, securing API credentials.
- **Full REST API Suite**: Complete CRUD operations for scan history and health diagnostics.
- **High-Capacity Image Processing**: Supports up to 50MB image payloads for high-resolution packaging photos.

---

## Setup & Running

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Set your Gemini API Key in `backend/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Run Backend Server
- **Development (Hot Reload)**:
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```

---

## API Documentation

### Diagnostics
- **`GET /api/health`**
  Returns backend status, database type, and API key presence.

### AI Label Analysis
- **`POST /api/analyze-label`**
  - **Body**: `{ "image": "data:image/jpeg;base64,...", "apiKey": "optional_override" }`
  - **Response**: Extracted product details, ingredients, nutrition data, and detected front-of-pack claims.

### Scan History & Database Persistence
- **`GET /api/history`**: Returns all saved scans from SQLite, newest first.
- **`GET /api/history/:id`**: Returns a single scan record.
- **`POST /api/history`**: Saves/upserts a scan record into SQLite.
- **`DELETE /api/history/:id`**: Deletes a scan record.
- **`DELETE /api/history`**: Clears all scan history from the database.
