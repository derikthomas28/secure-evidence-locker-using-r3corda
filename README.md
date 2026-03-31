# ⚖️ SECURE EVIDENCE LOCKER (using R3 Corda)
**Next-Generation Forensic Legal-Tech Ecosystem** 

---

## 🚀 Overview
Secure Evidence Locker is a high-security, blockchain-integrated platform designed for investigative agencies and the judiciary. It provides a decentralized vault for evidence with AI-powered forensic analysis and real-time infrastructure monitoring.

### 🛡️ Key Features
- **Immutable Ledger**: Uses R3 Corda-style mock blockchain nodes for tamper-proof evidence anchoring.
- **Forensic Pipeline**: Automated OCR and Exif-based analysis for uploaded assets.
- **Role-Based Access (RBAC)**: Secure separation between Officers, Analysts, Judges, and Citizens.
- **Infrastructure Dashboard**: Real-time telemetry (CPU/RAM/Logs) for system maintainers.
- **Judicial Assistant**: LLM-aided case summaries and legal cross-referencing.

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TailwindCSS, Lucide-React.
- **Backend**: Python 3.x, Flask, psutil (Telemetry).
- **Storage**: Scalable local object storage with cryptographic tagging.
- **Ledger**: Python-based mock blockchain bridge for rapid prototyping.

---

## ⚡ Quick Start (Windows)
1. **Prerequisites**: Ensure you have `Python` and `Node.js` installed.
2. **Launch All**: Run the startup script from the root directory:
   ```bash
   .\start.bat
   ```
3. **Roles**: Login with `password: secure2026` for any of the following accounts:
   - `dev_support` (Developer)
   - `honorable_justice` (Judge)
   - `officer_vault` (Police/Forensic)

---

## 🏗️ Project Structure
- `frontend/`: Modern React dashboard with specialized sub-components.
- `services/ai-storage/`: Python backend hosting analysis engines and health telemetry.
- `contracts/`: Blockchain contract logic and verification protocols.
- `uploads/`: Centralized forensic repository for ingested evidence.

---

## 🤝 Contribution & License
This project is part of a Final Year Project ecosystem. All rights reserved.
