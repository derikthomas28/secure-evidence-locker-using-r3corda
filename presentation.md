# 🏛️ Secure Evidence Locker - Final Year Project Presentation Guide

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Solution Approach](#solution-approach)
4. [Key Features](#key-features)
5. [System Architecture](#system-architecture)
6. [Tech Stack](#tech-stack)
7. [Demo Workflow](#demo-workflow)
8. [Possible Questions & Answers](#possible-questions--answers)

---

## 1. Project Overview
**Title:** Secure Evidence Locker using R3 Corda (Mock Blockchain)

**Description:** A professional-grade, blockchain-integrated platform designed for investigative agencies and judiciary. It provides a decentralized vault for evidence with AI-powered forensic analysis, judicial decision support, and system health monitoring.

---

## 2. Problem Statement
- **Evidence Tampering Risk:** Traditional evidence storage systems are vulnerable to tampering and unauthorized modifications.
- **Chain-of-Custody Issues:** Maintaining a transparent and immutable record of evidence custody is challenging.
- **Inefficient Case Analysis:** Manual review of evidence and case documents is time-consuming and prone to human error.
- **Lack of Citizen Access:** Limited avenues for citizens to access legal information and track case statuses.

---

## 3. Solution Approach
- **Immutable Ledger (Mock R3 Corda):** Uses blockchain-style ledger for tamper-proof evidence anchoring and lifecycle tracking.
- **AI-Powered Analysis:** Neural forensic pipeline for scene classification, OCR, and legal document analysis.
- **Role-Based Access Control:** Secure RBAC system with 5 distinct user roles.
- **Real-time System Monitoring:** DevOps dashboard for system telemetry and audit logs.

---

## 4. Key Features

### 🔐 1. Enhanced Security & Auth
- **JWT Bearer Token Authentication:** Secure token-based authentication
- **Bcrypt Password Hashing:** Industry-standard password hashing
- **LocalStorage Persistence:** Tokens and user info are persisted across page refreshes

### 👥 2. User Roles & Access Levels
| Role | Username | Password | Access Level | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| Field Officer | `officer_vault` | `secure2026` | Level 3 | Evidence Ingestion & FIR Registration |
| Forensic Lab | `forensic_lab` | `secure2026` | Level 4 | Scene Analysis & Pattern Verification |
| Hon'ble Judge | `honorable_justice` | `secure2026` | Level 5 | Judicial AI, Precedents & Summarization, Evidence Viewing |
| SysDev/SRE | `dev_support` | `secure2026` | Level 2 | Mission Control, Telemetry & Audit Logs |
| Public View | `citizen_view` | `secure2026` | Level 1 | Legal Navigator & Public Case Diary |

### 💾 3. Persistent Storage
- **SQLAlchemy ORM:** Object-relational mapping for database interactions
- **SQLite Database:** Local persistent storage for cases, evidence, users, audit logs, and chain of custody
- **Case Model:** Stores case details, FIR numbers, status
- **Evidence Model:** Stores evidence files, hashes, metadata, forensic results, and relevance score
- **ChainOfCustody Model:** Stores every action on evidence (upload, verify, etc.) with timestamp, user, and notes

### 🧠 4. AI Modules
- **Forensic Evidence Analysis:** Classifies photos (weapon/biological/CCTV), performs OCR, computes hashes
- **Judicial Assistant:** Summarizes cases, estimates crime probability, suggests applicable laws
- **Citizen Legal Navigator:** Provides legal guidance based on BNS/IPC framework

### 🔗 5. Enhanced Mock Blockchain
- **Block Structure:** Full block implementation with index, timestamp, transactions, previous hash
- **Proof of Work:** Mining algorithm to secure blocks
- **Chain Validation:** Verify integrity of entire blockchain
- **New Endpoints:** `/api/blockchain` (full chain), `/api/blockchain/last` (last block)

### 📋 6. Audit & Compliance
- **AuditLog Model:** Every action is logged to database
- **Log Details:** Timestamp, level, module, event, username, IP address
- **Endpoint:** `/api/system/audit-logs` for developers to view audit trails

### 📊 7. System Health (Mission Control)
- Real-time CPU/RAM/Threads monitoring
- Live audit log stream
- Service matrix monitoring
- Threat simulation capabilities

### 🔍 8. Evidence Verification & Chain of Custody
- **Evidence Verification Endpoint:** `/api/evidence/<evidence_id>/verify` to check SHA-256 hash
- **Dedicated UI:** Judge can select a case and evidence, upload the file again to verify authenticity
- **Chain of Custody Log:** Every action (upload, verify, etc.) is logged to ChainOfCustody table
- **Relevance Score:** Evidence has a keyword-based relevance score, color-coded for quick assessment

### 🧪 9. Testing & CI/CD
- **Unit Tests:** Basic tests for import and hash calculation
- **GitHub Actions:** Automated CI/CD pipeline that runs tests and builds frontend

---

## 5. System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React/Vite)                │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────────┐  │
│  │ Case Filing  │ │ Judicial AI  │ │ Mission Ctrl  │  │
│  └──────────────┘ └──────────────┘ └───────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Flask + SQLAlchemy)               │
│  ┌──────────────────┐ ┌──────────────────────────────┐ │
│  │  RBAC & Auth     │ │  AI Engine (Forensic/Legal)  │ │
│  └──────────────────┘ └──────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│               Mock Blockchain (Port 10050)              │
│          Tamper-proof ledger for evidence anchoring     │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Tech Stack
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React Icons, Axios
- **Backend:** Python 3, Flask, Flask-CORS, Flask-SQLAlchemy
- **AI/ML:** OpenCV, Pillow, NumPy, Pandas, Scikit-learn, NLTK, Groq API (LLM)
- **Database:** SQLite (local), PostgreSQL (production ready)
- **Blockchain:** Mock R3 Corda-style ledger (Port 10050)

---

## 7. Demo Workflow (During Presentation)
1. **Login as Officer (`officer_vault`):** 
   - Create a new Case in Case Registry
   - Upload initial evidence in Deposit Evidence
   - Anchor to ledger
2. **Login as Forensic Lab (`forensic_lab`):**
   - Select the same case
   - Upload additional photo evidence
   - Attach evidence to the case
3. **Login as Judge (`honorable_justice`):**
   - View Case Intelligence (case details, AI analysis, evidence)
   - Go to Court Verify: Select case, select evidence, upload file to verify authenticity
   - Draft and submit final judgment to close the case
4. **Login as Dev (`dev_support`):** 
   - Show Mission Control dashboard with system telemetry and audit logs

---

## Possible Questions & Answers

### Q1: What is R3 Corda and why did you use it (or a mock version)?
**A:** R3 Corda is a distributed ledger technology (DLT) designed specifically for financial services and legal applications. It focuses on privacy and allows only relevant parties to see transaction details. We used a mock version to demonstrate the blockchain concepts without requiring a full Corda network setup for the demo.

### Q2: How do you ensure evidence integrity and prevent tampering?
**A:** Every piece of evidence is:
1. Hashed using SHA-256
2. Anchored to the immutable ledger with timestamp and submitter info
3. Any modification would change the hash, which is immediately detectable
4. Audit log of all actions is stored in database for compliance

### Q3: Is the AI model locally hosted or using an external API?
**A:** The project uses a hybrid approach:
- Basic image processing (OpenCV, OCR) is done locally
- Advanced LLM features (judicial summarization, legal navigator) use Groq API for high-quality text generation

### Q4: What are the limitations of this project?
**A:** Current limitations:
- Uses mock blockchain instead of real Corda network
- AI features depend on external API availability
- Single-node deployment (real production would have distributed nodes)

### Q5: How can this project be scaled for real-world use?
**A:** Scaling steps:
1. Replace mock blockchain with real R3 Corda network
2. Use PostgreSQL instead of SQLite
3. Add Redis for caching and session management
4. Implement proper IPFS/Filecoin for decentralized storage
5. Add HTTPS for secure communication
6. Deploy on cloud with Kubernetes for high availability

### Q6: What was the most challenging part of this project?
**A:** The most challenging part was integrating all the different modules (frontend, backend, AI, blockchain) to work together seamlessly, especially ensuring proper role-based access control across all endpoints.

### Q7: Did you use any design patterns in your code?
**A:** Yes! We used:
- **Decorator Pattern:** For RBAC (require_role decorator) and JWT authentication
- **Factory Pattern:** For AI analysis routing (different pipelines for photos/documents)
- **Repository Pattern:** For data access (SQLAlchemy ORM)

### Q8: How do you handle user authentication and authorization now?
**A:** We use:
- **JWT Bearer Token Authentication:** Secure tokens generated at login
- **Bcrypt Password Hashing:** Industry-standard password hashing (not SHA-256!)
- **Role-Based Access Control (RBAC):** 5 distinct roles with decorator-based authorization checks on each endpoint
- **LocalStorage Persistence:** Tokens and user info are saved to localStorage, so refreshing doesn't log you out!

### Q9: Can this system be integrated with existing police/court systems?
**A:** Yes! The system has RESTful APIs that can be integrated with existing systems via webhooks or API clients. The modular design allows replacing individual components as needed.

### Q10: How do you verify that evidence hasn't been tampered with?
**A:** Evidence verification steps:
1. Compute SHA-256 hash of the current file
2. Compare it with the hash stored in the database at upload time
3. If hashes match, evidence is authentic; if not, it's been tampered with

### Q11: What about the judge seeing evidence?
**A:** The Judge role has `can_view_evidence: true` and `can_view_all: true` permissions. In the Case Intelligence page, all evidence from a case is displayed in the "Forensic Evidence Vault" section!

### Q12: What future enhancements do you plan for this project?
**A:** Future plans:
1. Real Corda blockchain integration
2. Multi-language support
3. Mobile app for field officers
4. Biometric authentication
5. Advanced analytics dashboard
6. Integration with real IPFS
7. **Case Relevance Check:** AI-powered check to ensure evidence is relevant to the case
8. **Chain of Custody Log:** Detailed log of who handled evidence, when, and where
9. **Evidence Verification Tab:** Dedicated UI for verifying evidence authenticity
