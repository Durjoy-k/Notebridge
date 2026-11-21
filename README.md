# NoteBridge — Academic Resource Sharing Platform

NoteBridge is a student community platform for North Western University (NWU) to preserve, discover, and build on notes, past question papers, and course materials.

---

## Project Structure

```text
NoteBridge/
├── backend/                  # Python + FastAPI Backend
│   ├── app/
│   │   ├── core/            # App Configuration & Security (JWT, bcrypt)
│   │   ├── database/        # SQLAlchemy database session & SQLite connection
│   │   ├── models/          # User ORM models
│   │   ├── routes/          # Authentication API routes (/auth/register, /auth/login, /auth/me)
│   │   ├── schemas/         # Pydantic validation schemas & strict NWU email regex
│   │   ├── services/        # Service layer & business logic
│   │   └── main.py          # FastAPI application entrypoint & CORS middleware
│   ├── .env                 # Backend environment variables
│   ├── .env.example         # Environment variable template
│   ├── .gitignore           # Git ignore rules for backend
│   ├── requirements.txt     # Python package requirements
│   └── test_auth.py         # Automated test suite for NWU email validation & auth
│
├── notebridge-frontend/      # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # UI Layout & Sidebar navigation
│   │   ├── context/         # AuthContext (token/user in memory state)
│   │   ├── pages/           # Login, Dashboard, Courses, Resources, Q&A
│   │   ├── services/        # API service helpers
│   │   ├── main.tsx         # Main router & ProtectedRoute
│   │   └── index.css        # TailwindCSS styling
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

## 🔒 Security & Validation Requirements

1. **Strict NWU Email Validation**:
   - Validation Rule: `^\d{11}@nwu\.ac\.bd$`
   - Valid Example: `20242087010@nwu.ac.bd`
   - Only 11-digit student IDs attached to domain `@nwu.ac.bd` are accepted. Both frontend and backend independently enforce this regex.
   - Exact Error Message: `Please enter a valid NWU student email (e.g., 20242087010@nwu.ac.bd).`

2. **Secure User Credential Storage**:
   - Credentials (passwords, hashes, account records) are **never stored in the browser** (`localStorage`, `sessionStorage`, cookies, IndexedDB, etc.).
   - Passwords are securely hashed on the backend using **bcrypt** salt & hash.
   - User account records are persisted safely in the SQLite database via FastAPI.
   - Secrets and environment keys are loaded via `.env` and kept out of client-side code.

---

## 🚀 How to Run NoteBridge

### 1. Run Backend (FastAPI)

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # On Windows (or source venv/bin/activate on Linux/Mac)
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI backend runs at: `http://localhost:8000`  
Swagger API Docs available at: `http://localhost:8000/docs`

### 2. Run Frontend (React + Vite)

```bash
cd notebridge-frontend
npm install
npm run dev
```
The React frontend runs at: `http://localhost:5173`

---

## 🧪 Running Backend Unit Tests

To verify email validation cases, registration, login, password hashing, and token endpoints:

```bash
cd backend
python test_auth.py
```
