# ⚖️ SECURE EVIDENCE LOCKER (using R3 Corda)
**Next-Generation Forensic Legal-Tech Ecosystem for Investigative Integrity**

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/derikthomas28/secure-evidence-locker-using-r3corda/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Overview
Secure Evidence Locker is a professional-grade, blockchain-integrated platform designed for investigative agencies and the judiciary. It provides a decentralized vault for evidence with **High-Fidelity Neural Analysis**, **Senior Judicial Decision Support**, and **Mission Control Infrastructure Monitoring**. This project ensures absolute chain-of-custody integrity by anchoring every forensic event to an immutable Corda-style ledger.

### 🛡️ Core Pillars
- **⛓️ Immutable Ledger**: Uses R3 Corda-style mock blockchain nodes for tamper-proof evidence anchoring and asset lifecycle tracking.
- **🧠 Neural Forensic Pipeline**: Automated Scene Classification (Weapon/Biological/CCTV), High-Accuracy OCR, and Cryptographic Receipting (Hash/CID).
- **⚖️ Senior Judicial Bench**: LLM-aided case intelligence featuring **Case Precedent Lookup (SC/HC)**, **Disposition Estimates**, and **Structured Judgment Drafting Guidance**.
- **📡 Mission Control (DevOps)**: Deep-level system telemetry featuring real-time **CPU/RAM/Threads**, **Live Audit Log Stream**, and **Service Matrix Monitoring**.
- **🏢 Professional Legal Navigator**: Empathetic, consultancy-grade legal guidance for citizens based on Constitutional Law and the BNS/IPC framework.

---

## 📂 Project Structure
- `frontend/`: High-fidelity React dashboard with specialized sub-modules (Judicial Assistant, Mission Control, Citizen Portal).
- `services/ai-storage/`: Python/Flask backend hosting the Neural Analysis Engine, RBAC Auth Gate, and Telemetry Cluster.
- `mock_data/`: Pre-generated forensic assets (CCTV frames, physical weapon photos, FIR texts) for validation.
- `uploads/`: Centralized, SHA-256 verifiable repository for ingested forensic evidence.

---

## 🛠️ Installation & Setup

### 🐧 Linux Setup (Recommended)
1. **Prerequisites**: Python 3.10+, Node.js 18+, `psutil` (for telemetry).
2. **Setup**:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
   *This automated script initializes the AI Backend (:5000), Mock Ledger (:10050), and React Dashboard (:5173).*

### 🪟 Windows Setup
1. Use the provided batch script:
   ```powershell
   .\start.bat
   ```

---

## 🔑 Professional Role Matrix & Demo Credentials
| Role | Username | Access Level | Primary Capability |
| :--- | :--- | :--- | :--- |
| **Field Officer** | `officer_vault` | Level 3 | Evidence Ingestion & FIR Registration |
| **Forensic Lab** | `forensic_lab` | Level 4 | Scene Analysis & Pattern Verification |
| **Hon'ble Judge** | `honorable_justice` | Level 5 | **Bench Intel**, Precedents & Summarization |
| **SysDev/SRE** | `dev_support` | Level 2 | **Mission Control**, Telemetry & Audit Logs |
| **Public View** | `citizen_view` | Level 1 | Legal Navigator & Public Case Diary |

**All Passwords:** `secure2026`

---

## 🧪 Operational Workflows

### 👮 Field Investigation (Officer)
1. Log in as `officer_vault`.
2. Register a new FIR using assets from `mock_data/cases/`.
3. Fill details → Click **Certify & Anchor Evidence**.
4. Observe the **Cryptographic Handshake** and receive the **Hash/CID Receipt**.

### 🏛️ Judicial Analysis (Judge)
1. Log in as `honorable_justice`.
2. Select any case with attached evidence.
3. Launch the **AI Judicial Summary**.
4. Review the **Neural Disposition Estimates**, **Case Precedents**, and **Judgment Draft Guidance**.

### 📟 Infrastructure Maintenance (Developer)
1. Log in as `dev_support`.
2. Access the **Mission Control** center.
3. Monitor real-time **Throughput (RPM)**, **Neural Token Usage**, and **Process Latency**.
4. View the **Live Audit Stream** to track system-wide events and authentication handshakes.

---

## 🤝 Technical Support
If services fail to synchronize:
1. Ensure ports `5000`, `10050`, and `5173` are clear (`fuser -k port/tcp`).
2. Verify `GROQ_API_KEY` is active for the Neural Engine.
3. Check the **Mission Control Service Matrix** for subsystem failures.
