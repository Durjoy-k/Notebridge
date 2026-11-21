# Technical Architecture & Academic Defense Report: NoteBridge

**Project Title:** NoteBridge — University Academic Resource Sharing & Collaboration Platform  
**Architecture:** Decoupled Full-Stack Web Application (FastAPI Backend + React Single Page Application)  
**Database System:** PostgreSQL 18 (Enterprise Relational DBMS)  
**Target Institution Domain Validation:** North Western University (NWU) (`@nwu.ac.bd`)  
**Integrated Academic Syllabus:** Bi-Semester Summary Syllabus, Department of Computer Science & Engineering (Faculty of Science & Technology)  

---

## 1. Executive Summary & System Purpose

**NoteBridge** is a secure, institutional academic resource-sharing and curriculum management platform designed specifically for North Western University students. The platform centralizes lecture notes, laboratory experiment reports, and past examination question banks.

Recent architectural updates have introduced two major milestones:
1. **Full Integration of the CSE Bi-Semester Summary Syllabus**: A curriculum architecture housing all 8 semesters (4 academic years, 77 courses, and 162.00 total credits) with dual-mode visualization (Official Faculty Summary Syllabus Table and Interactive Course Cards).
2. **Mandatory Department Selection**: Enforces academic program selection (CSE, EEE, CE, BBA, English, Law, Economics) upon student sign-in and registration, personalizing the workspace.
3. **Migration to PostgreSQL 18**: Replaced the local file-based SQLite database with an enterprise-grade PostgreSQL 18 relational database engine (`notebridge` database), utilizing modern `psycopg` (v3) connection pooling and robust relational schemas.

---

## 2. Technical Stack Specification

| Component Layer | Technology | Rationale & Technical Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 (TypeScript)** | Delivers high-performance component-based UI rendering, strong static type safety, declarative routing, and modular code architecture. |
| **Frontend Build Engine** | **Vite** | Provides instant Hot Module Replacement (HMR) and optimized Rollup/ESBuild production bundles. |
| **Styling & Design System** | **Tailwind CSS + Lucide Icons** | Implements a responsive academic design system with custom color tokens, micro-interactions, and SVG iconography. |
| **Backend Framework** | **FastAPI (Python 3.10+)** | High-throughput asynchronous ASGI framework (`uvicorn`) featuring native Pydantic runtime schema validation and automatic OpenAPI/Swagger documentation. |
| **Database ORM** | **SQLAlchemy 2.0** | Type-annotated Object-Relational Mapper managing connection pooling, SQL transaction lifecycles, and model migrations. |
| **Database Engine** | **PostgreSQL 18** | Industrial-grade relational database management system installed on port `5432` hosting the `notebridge` database, providing strict ACID transactions, concurrency, and indexing. |
| **Database Drivers** | **psycopg (v3) & psycopg2-binary** | High-performance Python-PostgreSQL connection adapters with support for binary protocol and native Python datatypes. |
| **Authentication & Cryptography** | **Bcrypt + PyJWT** | Adaptive salted password hashing via `bcrypt` and stateless session authorization via signed JSON Web Tokens (`HS256`). |
| **Automated Test Suite** | **FastAPI TestClient + Pytest** | End-to-end integration tests verifying email regex, password hashing, department storage, login authentication, and JWT authorization directly against PostgreSQL. |

---

## 3. System Architecture & Design Patterns

NoteBridge implements a **Clean Layered Architecture (Controller-Service-Repository Pattern)** with a decoupled client-server model:

```text
+-----------------------------------------------------------------------------------------+
|                                REACT SPA FRONTEND (Vite)                                |
|  [ Login / Register ] --> [ AuthContext (localStorage) ] --> [ REST API Client (api.ts) ]|
|  [ Courses Explorer (Table & Cards) ] <-- [ CSE Bi-Semester Curriculum Engine (77 Courses) ] |
+-----------------------------------------------------------------------------------------+
                                             │  HTTP / REST JSON
                                             ▼
+-----------------------------------------------------------------------------------------+
|                                  FASTAPI REST BACKEND                                   |
|   1. Controller Layer       (app/routes/auth.py - Endpoints: /register, /login, /me)    |
|   2. Schema DTO Layer       (app/schemas/user.py - Pydantic Validation & Regex)         |
|   3. Business Logic Layer   (app/services/auth_service.py - Registration & Auth rules)   |
|   4. Security Layer         (app/core/security.py - Bcrypt Hashing & JWT Signing)       |
+-----------------------------------------------------------------------------------------+
                                             │  SQLAlchemy 2.0 ORM
                                             ▼
+-----------------------------------------------------------------------------------------+
|                            ENTERPRISE RELATIONAL DATABASE                               |
|                         PostgreSQL 18 Engine (notebridge DB)                            |
|                          - users (id, email, password, department)                      |
+-----------------------------------------------------------------------------------------+
```

### Architectural Patterns Applied:
1. **Controller-Service-Repository Pattern**: Strict separation of concerns where HTTP controllers (`routes/auth.py`) delegate directly to service layer functions (`services/auth_service.py`), keeping endpoints clean and logic testable.
2. **Context API with Dual Storage Sync**: React `AuthContext` synchronizes memory state with `localStorage` (`notebridge_user`, `notebridge_token`), preserving student authentication and active department across page refreshes.
3. **Curriculum Engine Architecture**: Dedicated data abstraction (`data/curriculum.ts`) cleanly separates the academic curriculum models (`CourseItem`, `SemesterSummary`) from UI presentation layers.
4. **Declarative Route Protection**: `ProtectedRoute` higher-order component guards authenticated views, redirecting unauthenticated traffic to `/login`.

---

## 4. Security Infrastructure & Institutional Rules

### 4.1 Strict Institutional Email Validation Rules
Registration is strictly restricted to North Western University students via an 11-digit student ID regex.

* **Regular Expression (Regex)**: `^\d{11}@nwu\.ac\.bd$`
* **Matching Criteria**:
  * Exactly 11 consecutive numeric digits (`\d{11}`).
  * Exact institutional suffix (`@nwu.ac.bd`).
* **Validation Examples**:
  * `20242087010@nwu.ac.bd` ➔ **PASSED (Valid)**
  * `2024208701@nwu.ac.bd` ➔ **REJECTED (Only 10 digits)**
  * `202420870100@nwu.ac.bd` ➔ **REJECTED (12 digits)**
  * `20242087010@gmail.com` ➔ **REJECTED (Non-institutional domain)**

### 4.2 Mandatory Institutional Department Selection
Students are required to explicitly choose their academic department upon authentication:
* **Supported Departments**:
  * Computer Science & Engineering (CSE) *(Default & Featured)*
  * Electrical & Electronic Engineering (EEE)
  * Civil Engineering (CE)
  * Business Administration (BBA)
  * English (BA in English)
  * Law (LL.B Hons)
  * Economics (BSS in Economics)
* Selected department is persisted in the PostgreSQL database `users.department` column, encoded in the JWT response, and visually badged throughout the interface.

### 4.3 Multi-Tier Validation Enforcement
1. **Client-Side Validation (`Login.tsx`, `api.ts`)**: Immediate feedback before network dispatching.
2. **Pydantic Model Schema Validation (`schemas/user.py`)**: Uses Python `@field_validator` decorators to inspect incoming request bodies at runtime.
3. **Service Layer Guard (`services/auth_service.py`)**: Secondary regex validation ensuring security cannot be bypassed even if API calls are crafted externally.

### 4.4 Password Cryptography & JWT Authorization
* **Bcrypt Salted Hashing**: Plaintext passwords are never saved. Salted hashes (`bcrypt.hashpw`) protect credentials against rainbow table and hash collision attacks.
* **Signed JWT Tokens**: Tokens are generated using the `HS256` symmetric signing algorithm, expiring automatically after 1440 minutes (24 hours).
* **Stateless Authorization**: Protected requests (`GET /auth/me`) supply credentials via HTTP `Authorization: Bearer <token>` headers.

---

## 5. Database Schema & Data Model

### Entity-Relationship Specification (PostgreSQL 18)

#### Table Name: `users`
**Database:** `notebridge` | **Schema:** `public`

| Column Name | PostgreSQL Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY`, `SERIAL`, `INDEX` | Unique auto-incrementing user identifier. |
| `email` | `VARCHAR` | `UNIQUE`, `NOT NULL`, `INDEX` | Institutional student email (`^\d{11}@nwu\.ac\.bd$`). |
| `hashed_password` | `VARCHAR` | `NOT NULL` | Cryptographic salted bcrypt hash string. |
| `full_name` | `VARCHAR` | `NULLABLE` | Student display name (e.g., "Tanvir Ahmed"). |
| `department` | `VARCHAR` | `DEFAULT 'Computer Science & Engineering (CSE)'` | Enrolled academic department / program. |
| `created_at` | `TIMESTAMP WITHOUT TIME ZONE` | `DEFAULT NOW()` | Account creation timestamp. |

---

## 6. CSE Bi-Semester Summary Syllabus Architecture

The platform embeds the complete official summary syllabus for the **Bachelor of Science in Computer Science and Engineering** under the **Faculty of Science and Technology**:

### Academic Summary Matrix (162.00 Total Credits · 77 Courses)

| Academic Term | Term ID | Theory Cr | Sessional Cr | Thesis/Project Cr | Term Total | Courses | Featured Key Subjects |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Year 1, Semester 1** | `1-1` | 18.00 | 3.75 | 0.00 | **21.75 Cr** | 10 | Chem-1135, CSE-1101, Math-1131, Phy-1133 |
| **Year 1, Semester 2** | `1-2` | 18.00 | 4.50 | 0.00 | **22.50 Cr** | 10 | CSE-1201 (C Prog), CSE-1203 (DLD), EEE-1221, Math-1231 |
| **Year 2, Semester 1** | `2-1` | 18.00 | 3.00 | 0.00 | **21.00 Cr** | 9 | CSE-2101 (OOP), CSE-2103 (Data Structures), CSE-2105, CSE-2107 |
| **Year 2, Semester 2** | `2-2` | 16.50 | 5.25 | 0.00 | **21.75 Cr** | 11 | CSE-2200, CSE-2201 (DBMS), CSE-2203 (Algorithms), CSE-2205 |
| **Year 3, Semester 1** | `3-1` | 18.00 | 3.75 | 0.00 | **21.75 Cr** | 10 | CSE-3101 (Microprocessors), CSE-3103 (SE), CSE-3105 (TOC), CSE-3121 |
| **Year 3, Semester 2** | `3-2` | 13.50 | 4.50 | 0.00 | **18.00 Cr** | 10 | CSE-3200, CSE-3201 (OS), CSE-3203 (Networks), CSE-3211 (Data Mining) |
| **Year 4, Semester 1** | `4-1` | 16.50 | 3.00 | 1.50 | **19.50 Cr** | 10 | CSE-4100 (Thesis-I), CSE-4101 (AI), CSE-4103 (Compiler), CSE-4119 (ML) |
| **Year 4, Semester 2** | `4-2` | 15.00 | 0.75 | 3.00 | **15.75 Cr** | 7 | CSE-4200 (Thesis-II), CSE-4201 (Graphics), CSE-4215 (NLP), CSE-4206 |
| **Total Program** | **8 Terms** | **133.50 Cr** | **25.50 Cr** | **4.50 Cr** | **162.00 Cr** | **77** | **Complete B.Sc. in CSE Degree Curriculum** |

### Explorer Interface Features ([Courses.tsx](file:///c:/Users/ASUS/Downloads/notebridge-frontend/notebridge-frontend/src/pages/Courses.tsx)):
* **Syllabus Summary Table View**: Recreates the official university summary syllabus table with SN, Course Code, Title, Credits, Type, and Semester Totals.
* **Interactive Cards Grid View**: Visual grid displaying course cards, credit pills, and resource count tags.
* **Dynamic Filters**: Instant filtering by Semester (`All`, `1-1` to `4-2`), Course Type (`Theory`, `Laboratory`, `Thesis/Project`), and search keyword.
* **Course Detail Drawer**: Modal presenting course credit breakdown, prerequisites, and quick links to lecture notes and past questions.

---

## 7. RESTful API Endpoint Definitions

| HTTP Method | Endpoint Path | Authentication | Request Payload | Response Code | Description |
| :--- | :--- | :---: | :--- | :--- | :--- |
| `POST` | `/auth/register` | No | `{ email, password, full_name, department }` | `201 Created` / `400 Bad Request` | Registers new student in PostgreSQL, validates NWU email format, hashes password, saves selected department, returns signed JWT. |
| `POST` | `/auth/login` | No | `{ email, password, department }` | `200 OK` / `401 Unauthorized` | Authenticates student credentials against PostgreSQL, updates/retains department, issues JWT token. |
| `GET` | `/auth/me` | Bearer Token | Header: `Authorization: Bearer <token>` | `200 OK` / `401 Unauthorized` | Validates JWT token, retrieves student profile with department and email from PostgreSQL. |

---

## 🎓 Teacher / Evaluator Presentation & Viva Defense Guide

### Q1: "What is the overall architecture of your application?"
> **Answer:**  
> "NoteBridge utilizes a **decoupled full-stack architecture**. The frontend is a Single Page Application built with React 18, TypeScript, and Vite. The backend is an asynchronous REST API built with FastAPI and SQLAlchemy 2.0 ORM, connecting to a local **PostgreSQL 18** enterprise relational database. State and session management are completely stateless over HTTP using JSON Web Tokens (JWT)."

### Q2: "Why did you migrate from SQLite to PostgreSQL?"
> **Answer:**  
> "While SQLite is convenient for local file prototyping, a university-scale academic portal requires concurrent multi-user write access, high transaction throughput, and enterprise ACID guarantees. PostgreSQL 18 provides robust connection pooling, schema isolation, row-level locking, and native JSON handling, making NoteBridge production-ready."

### Q3: "How does the CSE Bi-Semester curriculum integration work?"
> **Answer:**  
> "We integrated the official curriculum for the Department of Computer Science & Engineering under the Faculty of Science & Technology. It encompasses all **8 semesters across 4 years**, totaling **77 courses and exactly 162.00 credits**. The system models each course with its credit weight, category (Theory, Laboratory, or Thesis/Project), and prerequisites. Students can toggle between an authentic university syllabus table layout and modern interactive cards, filtering by semester or searching by course code."

### Q4: "How does the department selection work during login and registration?"
> **Answer:**  
> "Department selection is mandatory on both Sign In and Register views. Students select their official academic program (such as CSE, EEE, BBA, etc.). The chosen department is persisted in the PostgreSQL `users.department` column, returned within the JWT authentication response, stored in browser local storage, and used to personalize the student workspace, sidebar, and dashboard."

### Q5: "How do you ensure only legitimate NWU students can access the system?"
> **Answer:**  
> "We implement a strict three-tier validation check using the regular expression `^\d{11}@nwu\.ac\.bd$`. This requires exactly 11 numeric digits corresponding to the student ID, followed by `@nwu.ac.bd`. This is validated:
> 1. In the browser UI (`Login.tsx`) for instant feedback.
> 2. In FastAPI's Pydantic schema validation layer (`schemas/user.py`).
> 3. In the domain service layer (`auth_service.py`) before any database operations."

### Q6: "How are passwords secured?"
> **Answer:**  
> "Passwords are never stored in plaintext. When a student registers, we use the `bcrypt` library to generate a cryptographically secure random salt and hash the password before inserting it into PostgreSQL. During login, `bcrypt.checkpw()` verifies the input against the stored hash without ever decrypting it."
