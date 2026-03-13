# Secure Legal Vault: A Unified Legal-Tech Ecosystem

> Cryptographic Evidence Vault • R3 Corda Blockchain • AI-Powered Legal Intelligence • RBAC Authentication

## The Problem

India's judicial system faces three critical challenges:

- **Judicial Backlog:** Judges spend countless hours reviewing voluminous Charge Sheets, FIRs, and legal arguments, delaying justice.
- **Evidence Vulnerability:** With the rise of deepfakes, proving authenticity of digital evidence (under Section 65B) is increasingly difficult.
- **Legal Inaccessibility:** Citizens are largely unaware of their rights or the specific sections of law (IPC/BNS) applied against them.

## Our Solution

A production-ready ecosystem combining **Cognitive Automation (AI)** to accelerate court proceedings and **Cryptographic Security (R3 Corda Blockchain)** to mathematically guarantee evidence integrity.

### Key Modules

| Module | Description |
|---|---|
| **Neural Evidence Forensics** | Officers scan physical documents via OCR. AI verifies authenticity and legal relevance at ingest. |
| **Judicial Bench Assistant** | Semantic summarization, BNS/IPC cross-mapping, and "Bench Recommendations" for judges. |
| **Citizen Legal Navigator** | Plain-language interface that maps situations to applicable laws, defenses, and rights. |
| **Corda Blockchain Ledger** | Immutable "Chain of Custody" via SHA-256 hashing on a private R3 Corda network. |

### Role-Based Access Control (RBAC)

| Username | Role | Access |
|---|---|---|
| `officer_vault` | Officer | Upload evidence, OCR scan, case log |
| `forensic_lab` | Forensic Expert | Upload forensic data, OCR scan |
| `honorable_justice` | Judge | Full read, Bench AI, court verification |
| `citizen_view` | Public | Case diary, Legal Navigator only |
| `dev_support` | Developer | System health metrics only, zero evidence access |

> **Password for all demo accounts:** `secure2026`

---

## Quick Start

### Option 1: One-Click Boot (Windows)
```
run_ecosystem.bat
```
Double-click the file or run from terminal. It starts both servers automatically.

### Option 2: Manual Start

**Terminal 1 — AI Backend (Port 5000):**
```bash
cd services/ai-storage
pip install -r requirements.txt
python app.py
```

**Terminal 2 — React Frontend (Port 5173):**
```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173** and log in with any demo credential above.

---

## Technical Architecture

- **Frontend:** React.js + Tailwind CSS (Cyberpunk aesthetic)
- **AI Engine:** Python Flask, Scikit-learn (TF-IDF & Cosine Similarity), Pytesseract (OCR)
- **Blockchain:** R3 Corda (Java/Kotlin) for immutable evidence logging
- **Auth:** Token-based RBAC with 5 roles & granular permissions
- **Dataset:** 800+ cross-mapped BNS and IPC legal provisions

---

*Developed for the future of Indian Jurisprudence.*
