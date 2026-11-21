# NoteBridge - Detailed Project Directory & File Structure

This document provides a clear, comprehensive breakdown of every file and directory in the **NoteBridge** project, detailing what each file contains, its exact role, and how files interact with one another.

---

## 📁 Repository Overview

```text
notebridge-frontend/
├── 📄 run.bat                         # Startup script (Backend + Frontend)
├── 📄 run.ps1                         # PowerShell startup runner
├── 📄 package.json                    # Monorepo root NPM configuration
├── 📄 README.md                       # High-level overview & setup instructions
├── 📄 .gitignore                      # Git exclusion rules
├── 📄 PROJECT_STRUCTURE.md            # Detailed file directory documentation
├── 📄 TECHNICAL_REPORT.md             # Academic defense and architectural report
│
├── 📁 backend/                        # FastAPI Backend Application
│   ├── 📄 requirements.txt            # Python dependencies (FastAPI, SQLAlchemy, psycopg, bcrypt)
│   ├── 📄 test_auth.py                # Automated pytest/TestClient test suite
│   ├── 📄 .env / .env.example         # PostgreSQL & JWT environment configuration
│   └── 📁 app/
│       ├── 📄 __init__.py             # Python package marker
│       ├── 📄 main.py                 # FastAPI application factory & CORS setup
│       ├── 📁 core/
│       │   ├── 📄 config.py           # Settings & PostgreSQL DATABASE_URL configuration
│       │   └── 📄 security.py         # Bcrypt hashing & JWT token generators
│       ├── 📁 database/
│       │   └── 📄 session.py          # SQLAlchemy PostgreSQL engine & SessionLocal factory
│       ├── 📁 models/
│       │   └── 📄 user.py             # User ORM model (includes department, email, password)
│       ├── 📁 schemas/
│       │   └── 📄 user.py             # Pydantic DTOs with NWU email regex & department fields
│       ├── 📁 services/
│       │   └── 📄 auth_service.py     # Domain logic for registration & authentication
│       └── 📁 routes/
│           └── 📄 auth.py             # REST API controllers (/auth/register, /auth/login, /auth/me)
│
└── 📁 notebridge-frontend/            # React + TypeScript Frontend Application
    ├── 📄 package.json                # Frontend NPM scripts & dependencies
    ├── 📄 vite.config.ts              # Vite configuration
    ├── 📄 index.html                  # SPA HTML entry point
    └── 📁 src/
        ├── 📄 main.tsx                # React root, Router & ProtectedRoute setup
        ├── 📄 index.css               # Global styles & Tailwind CSS utilities
        ├── 📁 services/
        │   └── 📄 api.ts              # Backend API client with department support & email regex
        ├── 📁 context/
        │   └── 📄 AuthContext.tsx     # React Auth Context with localStorage persistence
        ├── 📁 components/
        │   ├── 📄 Layout.tsx          # App shell with student department pill & sidebar navigation
        │   └── 📄 UI.tsx              # Reusable UI primitives (Cards, SectionTitle, Badges)
        ├── 📁 pages/
        │   ├── 📄 Login.tsx           # Auth form with mandatory Department selector
        │   ├── 📄 Dashboard.tsx       # Student dashboard with department greeting & curriculum stats
        │   ├── 📄 Courses.tsx         # CSE Bi-Semester Syllabus Explorer (Table & Card Views)
        │   ├── 📄 Resources.tsx       # Searchable academic materials filtered by CSE courses
        │   ├── 📄 QA.tsx              # Academic Q&A forum linked to official curriculum courses
        │   └── 📄 Simple.tsx          # Upload, Bookmarks, and AI study tool stub views
        └── 📁 data/
            ├── 📄 curriculum.ts       # Full 8-Semester CSE Summary Syllabus (77 courses, 162 credits)
            └── 📄 mock.ts             # Community resources & questions mapped to syllabus courses
```

---

## 🛠️ Root Directory Files

| File Path | Description & Responsibility |
| :--- | :--- |
| [run.bat](file:///c:/Users/ASUS/Downloads/notebridge-frontend/run.bat) | Windows Batch script that launches both the FastAPI backend (`uvicorn app.main:app --port 8000`) and Vite frontend (`npm run dev --port 5173`) in concurrent command windows. |
| [run.ps1](file:///c:/Users/ASUS/Downloads/notebridge-frontend/run.ps1) | Windows PowerShell version of the startup script for launching backend and frontend servers. |
| [package.json](file:///c:/Users/ASUS/Downloads/notebridge-frontend/package.json) | Root workspace NPM configuration file. |
| [README.md](file:///c:/Users/ASUS/Downloads/notebridge-frontend/README.md) | High-level project documentation, setup instructions, and feature overview. |
| [.gitignore](file:///c:/Users/ASUS/Downloads/notebridge-frontend/.gitignore) | Git exclusion patterns for build assets, environment files, and virtual environments. |
| [PROJECT_STRUCTURE.md](file:///c:/Users/ASUS/Downloads/notebridge-frontend/PROJECT_STRUCTURE.md) | Comprehensive breakdown of every project file, architecture, and end-to-end data flows. |
| [TECHNICAL_REPORT.md](file:///c:/Users/ASUS/Downloads/notebridge-frontend/TECHNICAL_REPORT.md) | Detailed academic defense report, security specification, PostgreSQL migration details, and viva guide. |

---

## ⚙️ Backend Architecture (`backend/`)

The backend is built with **FastAPI**, **SQLAlchemy 2.0 ORM**, and **PostgreSQL 18** using **Clean Layered Architecture (Controller-Service-Repository Pattern)**.

### Root Backend Files

| File Path | Description & Responsibility |
| :--- | :--- |
| [backend/requirements.txt](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/requirements.txt) | Lists Python dependencies: `fastapi`, `uvicorn`, `sqlalchemy>=2.0.0`, `pydantic>=2.6.0`, `pyjwt>=2.8.0`, `bcrypt>=4.0.0`, `python-dotenv`, `python-multipart`, `psycopg2-binary>=2.9.0`, and `psycopg[binary]>=3.1.0`. |
| [backend/test_auth.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/test_auth.py) | Automated test suite. Validates 11-digit NWU email regex (`^\d{11}@nwu\.ac\.bd$`), registration, bcrypt password hashing, duplicate prevention, department storage, login, and JWT bearer auth against the live PostgreSQL database. |
| `backend/.env` | Environment configuration specifying `DATABASE_URL="postgresql://postgres:nwu12345@localhost:5432/notebridge"`, JWT `SECRET_KEY`, algorithm `HS256`, token expiration, and `CORS_ORIGINS`. |
| [backend/.env.example](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/.env.example) | Template configuration file showing recommended environment variables for production and local development. |

### Backend Source Modules (`backend/app/`)

| Directory / File Path | Layer / Role | Contents & Detailed Responsibility |
| :--- | :--- | :--- |
| [backend/app/main.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/app/main.py) | **Application Entry Point** | Initializes FastAPI application, configures CORS middleware, registers exception handlers for NWU email validation formatting, automatically synchronizes database tables via `Base.metadata.create_all(bind=engine)`, and mounts authentication routes. |
| [backend/app/core/config.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/app/core/config.py) | **Core Configuration** | Uses `Settings` class to resolve absolute environment paths, configure PostgreSQL connection string (`DEFAULT_PG_URL = "postgresql://postgres:nwu12345@localhost:5432/notebridge"`), JWT parameters, and allowed CORS origins. |
| [backend/app/core/security.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/app/core/security.py) | **Security & Cryptography** | Implements salted password hashing (`hash_password`, `verify_password`) using `bcrypt`, and generates/decodes signed JSON Web Tokens (`create_access_token`, `decode_access_token`). |
| [backend/app/database/session.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/app/database/session.py) | **Database Connection Layer** | Configures SQLAlchemy engine connected to PostgreSQL 18, defines `SessionLocal` factory, declares ORM `Base`, and exports the `get_db` dependency generator for FastAPI endpoints. |
| [backend/app/models/user.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/app/models/user.py) | **Data Models (ORM)** | Defines the `User` table model with columns: `id` (PK), `email` (Unique Index), `hashed_password`, `full_name`, `department` (e.g., `Computer Science & Engineering (CSE)`), and `created_at` timestamp. |
| [backend/app/schemas/user.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/app/schemas/user.py) | **Pydantic Schemas (DTOs)** | Data validation models:<br>• `UserRegisterRequest`: Enforces 11-digit NWU email regex, minimum 6-character password, full name, and chosen `department`.<br>• `UserLoginRequest`: Accepts `email`, `password`, and optional `department`.<br>• `UserResponse`: Safe user representation including `department`.<br>• `TokenResponse`: Bearer token payload with embedded `UserResponse`. |
| [backend/app/services/auth_service.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/app/services/auth_service.py) | **Business Logic Layer** | Encapsulates domain logic:<br>• `register_user()`: Validates email, verifies uniqueness, hashes password, saves student with selected academic department into PostgreSQL.<br>• `authenticate_user()`: Verifies bcrypt password hash against stored record, updates chosen department if provided, and returns user entity. |
| [backend/app/routes/auth.py](file:///c:/Users/ASUS/Downloads/notebridge-frontend/backend/app/routes/auth.py) | **REST API Controllers** | Exposes endpoints:<br>• `POST /auth/register`: Student signup.<br>• `POST /auth/login`: Student sign-in and token issuance.<br>• `GET /auth/me`: Protected endpoint returning authenticated student profile and department details. |

---

## 🎨 Frontend Architecture (`notebridge-frontend/`)

The frontend is a **Single Page Application (SPA)** built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **React Router v6**.

| File Path | Component / Module Type | Contents & Detailed Responsibility |
| :--- | :--- | :--- |
| [notebridge-frontend/index.html](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/index.html) | HTML Template | SPA DOM container root element (`<div id="root"></div>`). |
| [notebridge-frontend/src/main.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/main.tsx) | App Entry Point & Router | Initializes React DOM, wraps routes in `AuthProvider`, configures client-side routes, and protects private views with `ProtectedRoute`. |
| [notebridge-frontend/src/index.css](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/index.css) | Global Styles | Tailwind CSS utility directives, modern typography, custom scrollbars, and color tokens. |
| [notebridge-frontend/src/services/api.ts](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/services/api.ts) | HTTP Client Service | Wraps `fetch` API calls (`/auth/register`, `/auth/login`, `/auth/me`), passes `department` parameter, and validates `NWU_EMAIL_REGEX = /^\d{11}@nwu\.ac\.bd$/`. |
| [notebridge-frontend/src/context/AuthContext.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/context/AuthContext.tsx) | Global State Management | React Context providing authentication state (`user`, `token`, `login()`, `register()`, `logout()`, `isAuthenticated`) with automatic `localStorage` synchronization (`notebridge_user`, `notebridge_token`). |
| [notebridge-frontend/src/data/curriculum.ts](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/data/curriculum.ts) | **CSE Curriculum Engine** | Official **Bi-Semester Summary Syllabus** data model for **Department of Computer Science & Engineering (Faculty of Science & Technology)**. Houses all 8 semesters, 77 courses, and 162 total credits with Theory/Sessional/Project breakdowns, term labels (`1-1` to `4-2`), and university departments metadata. |
| [notebridge-frontend/src/data/mock.ts](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/data/mock.ts) | Academic Mock Repository | Links community resources, question banks, lab reports, and forum questions to real syllabus course codes (e.g., `CSE-2101`, `CSE-2201`, `CSE-3101`, `CSE-4119`). |
| [notebridge-frontend/src/components/Layout.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/components/Layout.tsx) | Navigation Layout | Application shell providing sticky top header, responsive sidebar, user card displaying student's selected academic department (`CSE`, `EEE`, etc.), and `<Outlet />` viewport. |
| [notebridge-frontend/src/components/UI.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/components/UI.tsx) | Reusable UI Elements | Card wrappers, section title headings, icon buttons, and badges. |
| [notebridge-frontend/src/pages/Login.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/pages/Login.tsx) | Authentication Page | Interactive Sign In / Register portal featuring **mandatory Department Selection** (CSE, EEE, CE, BBA, English, Law, Economics), real-time 11-digit NWU email regex validation, password visibility toggles, and official Bi-Semester syllabus badge. |
| [notebridge-frontend/src/pages/Courses.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/pages/Courses.tsx) | **Curriculum & Syllabus Explorer** | Comprehensive syllabus browser supporting **Official Syllabus Table View** and **Interactive Card Grid View**. Allows filtering by Semester (`1-1` to `4-2`), Course Type (`Theory`, `Laboratory`, `Project`), and real-time search. Includes interactive course detail drawer modal with credits, prerequisites, and resource links. |
| [notebridge-frontend/src/pages/Dashboard.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/pages/Dashboard.tsx) | Student Dashboard | Personalized greeting displaying student's chosen academic department, 162 total curriculum credits metric, featured CSE syllabus courses, and quick links. |
| [notebridge-frontend/src/pages/Resources.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/pages/Resources.tsx) | Academic Materials Page | Note repository with search and filter dropdowns supporting official CSE curriculum course codes, resource types (Previous Questions, Notes, Labs, Slides), and interactive bookmarking. |
| [notebridge-frontend/src/pages/QA.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/pages/QA.tsx) | Q&A Forum Page | Academic forum allowing students to ask questions linked to specific CSE curriculum courses, upvote discussions, and browse peer answers. |
| [notebridge-frontend/src/pages/Simple.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/pages/Simple.tsx) | Auxiliary Views | Modular views for resource uploading (`Upload`), saved library items (`Bookmarks`), and AI study tools (`AI`). |

---

## 🔄 End-to-End Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student (User)
    participant UI as React Frontend (Login.tsx)
    participant Context as AuthContext & api.ts
    participant API as FastAPI Router (auth.py)
    participant Service as AuthService (auth_service.py)
    participant DB as PostgreSQL 18 (notebridge DB)

    Student->>UI: Select Department (e.g. CSE) & Enter NWU Email + Password
    UI->>UI: Validate Department selected & Regex (^\d{11}@nwu\.ac\.bd$)
    UI->>Context: Call login(email, password, department)
    Context->>API: POST /auth/login {email, password, department}
    API->>Service: authenticate_user(db, credentials)
    Service->>DB: Query User record by email
    DB-->>Service: Return User ORM instance
    Service->>Service: Verify Bcrypt password hash
    Service->>DB: Update/Persist selected department preference
    Service-->>API: Return User entity
    API->>API: Issue Signed JWT Access Token (HS256)
    API-->>Context: Return {access_token, token_type, user: {email, department, ...}}
    Context->>Context: Store session in localStorage (notebridge_user, notebridge_token)
    Context->>UI: Update Auth state with active Department
    UI->>Student: Redirect to /courses (CSE Bi-Semester Syllabus Explorer)
```
