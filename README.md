<<<<<<< HEAD
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
=======
# Secure Legal Vault: A Unified Legal-Tech Ecosystem

## 1. The Crisis in the Indian Judicial System (Problem Statement)
Our legal system currently faces three crippling challenges:

*   **Judicial Backlog & Cognitive Overload:** Judges spend countless hours reviewing voluminous Charge Sheets, FIRs, and conflicting arguments from Prosecution and Defense, delaying justice.
*   **Vulnerability of Digital Evidence:** With the rise of deepfakes and cyber-manipulation, proving the authenticity of digital evidence (under Section 65B of the Indian Evidence Act) is becoming increasingly difficult. The "Chain of Custody" is often compromised.
*   **Lack of Legal Accessibility:** The common man is largely unaware of their rights, the specific sections of the law (IPC/BNS) applied against them, and the legal strategies available for their defense.

## 2. Our Solution: A Unified Legal-Tech Ecosystem
We are building a production-ready ecosystem that combines **Cognitive Automation (AI)** to accelerate court proceedings and **Cryptographic Security (R3 Corda Blockchain)** to mathematically guarantee evidence integrity.

### Key Pillars:
1.  **Neural Evidence Forensics (OCR & AI Verification):**
    *   Officers can scan physical documents via high-speed OCR.
    *   The AI Engine automatically verifies the legal relevance and authenticity of the content.
    *   Prevents evidence tampering at the point of ingest.

2.  **Judicial Bench Assistant:**
    *   Provides instant semantic summarization of long legal documents.
    *   Maps cases to both **BNS (Bharatiya Nyaya Sanhita)** and **IPC (Indian Penal Code)** for transitional clarity.
    *   Highlights conflicting arguments and provides "Bench Recommendations" to assist judges.

3.  **Citizen Legal Navigator:**
    *   A layman-friendly interface where citizens can describe their situation in plain language.
    *   Instantly identifies applicable laws, potential punishments, and legal defenses.
    *   Educates citizens on their fundamental rights during the legal process.

4.  **Corda Blockchain Integration:**
    *   Every piece of evidence is hashed and stored on a private, permissioned R3 Corda ledger.
    *   Provides an immutable "Chain of Custody" that is mathematically verifiable in court.
    *   Ensures that Section 65B requirements are automatically met through technology.

---

## Technical Architecture
*   **Frontend:** React.js with Tailwind CSS (Cyberpunk "Police" Aesthetic).
*   **AI Engine:** Python (Flask), Scikit-learn (TF-IDF & Cosine Similarity), Pytesseract (OCR).
*   **Blockchain:** R3 Corda (Java/Kotlin) for immutable evidence logging.
*   **Dataset:** Comprehensive cross-mapping of 800+ BNS and IPC sections.

## Installation & Setup
1.  **AI Service:**
    ```bash
    cd services/ai-storage
    pip install -r requirements.txt
    python app.py
    ```
2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
3.  **Blockchain (Corda):**
    *   Ensure Java 8 is installed.
    *   Run `./gradlew deployNodes` and `build/nodes/runnodes`.

---
*Developed for the future of Indian Jurisprudence.*
>>>>>>> d2165740c73ef4c6d4a2639a12e4eddbb03146c0
