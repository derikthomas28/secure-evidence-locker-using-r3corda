# ⚖️ SECURE EVIDENCE LOCKER (using R3 Corda)
**Next-Generation Forensic Legal-Tech Ecosystem for Investigative Integrity**

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/derikthomas28/secure-evidence-locker-using-r3corda/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview
Secure Evidence Locker is a professional-grade, blockchain-integrated platform designed for investigative agencies and the judiciary. It provides a decentralized vault for evidence with **High-Fidelity Neural Analysis**, **Senior Judicial Decision Support**, and **Mission Control Infrastructure Monitoring**. This project ensures absolute chain-of-custody integrity by anchoring every forensic event to an immutable Corda-style ledger.

### 🛡️ Core Pillars
- **⛓️ Immutable Ledger**: Uses R3 Corda-style mock blockchain nodes for tamper-proof evidence anchoring and asset lifecycle tracking, with Proof of Work (PoW) and chain validation.
- **🧠 Neural Forensic Pipeline**: Automated Scene Classification (Weapon/Biological/CCTV), High-Accuracy OCR, and Cryptographic Receipting (SHA-256 Hash/CID).
- **⚖️ Senior Judicial Bench**: LLM-aided case intelligence featuring **Case Summary**, **Crime Probability Estimate**, and **Applicable BNS/IPC Sections**.
- **📡 Mission Control (DevOps)**: Deep-level system telemetry featuring real-time **CPU/RAM/Threads**, **Live Audit Log Stream**, and **Service Matrix Monitoring**.
- **🏢 Professional Legal Navigator**: Empathetic, consultancy-grade legal guidance for citizens based on Constitutional Law and the BNS/IPC framework.
- **🔐 Enhanced Security**: JWT Bearer Token authentication, bcrypt password hashing, localStorage persistence, and Role-Based Access Control (RBAC).
- **💾 Persistent Storage**: SQLAlchemy ORM with SQLite database for Cases, Evidence, Users, Audit Logs, and Chain of Custody.
- **✅ Evidence Verification**: SHA-256 hash comparison for evidence authenticity, with dedicated UI and Chain of Custody logging.
- **📊 Case Relevance Score**: Keyword-based relevance scoring for evidence, with color-coded display.

---

## 📂 Project Structure
- `frontend/`: High-fidelity React dashboard with specialized sub-modules (Judicial Assistant, Mission Control, Citizen Portal, Evidence Verification).
- `services/ai-storage/`: Python/Flask backend hosting the Neural Analysis Engine, RBAC Auth Gate, Telemetry Cluster, and Persistent Storage.
- `mock_data/`: Pre-generated forensic assets (CCTV frames, physical weapon photos, FIR texts) for validation.
- `uploads/`: Centralized, SHA-256 verifiable repository for ingested forensic evidence.
- `.github/workflows/`: GitHub Actions CI/CD pipeline for automated testing and building.

---

## 🛠️ Installation & Setup

### 🐧 Linux Setup (Recommended)
1. **Prerequisites**: Python 3.10+, Node.js 18+, `psutil` (for telemetry), Tesseract OCR.

#### Quick Start (ONE COMMAND!)
Just run the startup script - it sets up everything and starts all services:
```bash
chmod +x start.sh  # (only needed first time)
./start.sh
```
This script:
- Creates virtual environment and installs dependencies if needed
- Kills any existing processes on ports 5000, 10050, 5173
- Starts Mock Blockchain (:10050)
- Starts AI Backend (:5000)
- Starts Frontend (:5173)
- Stops all services when you press Ctrl+C

#### (Alternative) Manual Setup
1. **AI Backend Setup**:
   ```bash
   cd services/ai-storage
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```
3. **Start Services (3 separate terminals)**:
   - **Terminal 1 (Mock Blockchain)**:
     ```bash
     cd services/ai-storage
     source venv/bin/activate
     python3 mock_blockchain.py
     ```
   - **Terminal 2 (AI Backend)**:
     ```bash
     cd services/ai-storage
     source venv/bin/activate
     python3 app.py
     ```
   - **Terminal 3 (Frontend)**:
     ```bash
     cd frontend
     npm run dev
     ```

---

## 🔑 Professional Role Matrix & Demo Credentials
| Role | Username | Access Level | Primary Capability |
| :--- | :--- | :--- | :--- |
| **Field Officer** | `officer_vault` | Level 3 | Evidence Ingestion & Case Registration |
| **Forensic Lab** | `forensic_lab` | Level 4 | Scene Analysis & Evidence Upload to Cases |
| **Hon'ble Judge** | `honorable_justice` | Level 5 | **Bench Intel**, Evidence Viewing, Verification & Final Judgment |
| **SysDev/SRE** | `dev_support` | Level 2 | **Mission Control**, Telemetry & Audit Logs |
| **Public View** | `citizen_view` | Level 1 | Legal Navigator & Public Ledger |

**All Passwords:** `secure2026`

---

## 🧪 Operational Workflows

### 👮 Field Investigation (Officer)
1. Log in as `officer_vault`.
2. Register a new Case in Case Registry.
3. Upload Evidence (Photo/Document) in Deposit Evidence.
4. Observe AI Analysis, Sign Evidence, and Anchor to Ledger.

### 🔬 Forensic Analysis (Forensic Lab)
1. Log in as `forensic_lab`.
2. Select a Case from Case Registry.
3. Upload additional Evidence to the Case.
4. View Forensic Results and Evidence Details.

### 🏛️ Judicial Analysis & Verification (Judge)
1. Log in as `honorable_justice`.
2. Go to Case Intelligence to view Case Details, Evidence, and AI Analysis.
3. Go to Court Verify to select a Case and Evidence, then upload the file to verify its authenticity (SHA-256 hash check).
4. Draft and Submit Final Judgment to close the Case.

### 📟 Infrastructure Maintenance (Developer)
1. Log in as `dev_support`.
2. Access the **Mission Control** center.
3. Monitor real-time **CPU/RAM/Threads**, **Service Matrix**, and **Audit Logs**.

---

## 🤝 Technical Support
If services fail to synchronize:
1. Ensure ports `5000`, `10050`, and `5173` are clear (`fuser -k port/tcp`).
2. Verify `GROQ_API_KEY` is active for the Neural Engine (create `.env` file in `services/ai-storage/` with your key).
3. Check the **Mission Control Service Matrix** for subsystem failures.
