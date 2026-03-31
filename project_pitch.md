# Project Guide: Secure Evidence Locker using R3corda (Emulated)

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [How to Run (The Demo)](#how-to-run)
4. [User Roles & Permissions](#user-roles)
5. [Key Features for Demo](#key-features)

---

## 🚀 Project Overview
The **Secure Evidence Locker** is a blockchain-based digital evidence management system designed to maintain a "Chain of Custody" for legal evidence. It prevents tampering and ensures that evidence presented in court is authentic and verified by AI.

---

## 🏗️ Technical Architecture
To make the project demo-ready and lightweight, we use a **Three-Tier Architecture**:

1.  **React Frontend (Vite)**: A modern, high-performance UI that uses role-based access control (RBAC) to show different dashboards to Officers, Judges, and Citizens.
2.  **AI Auth & Storage Engine (Python/Flask)**: Handles user authentication, runs forensic AI analysis on images/documents, and computes cryptographic hashes (SHA-256).
3.  **Mock Blockchain Ledger (Flask)**: Emulates an R3 Corda ledger on port 10050. It records every piece of evidence as an "Asset" with a unique ID (e.g., XFR-12345).

---

## 🛠️ How to Run
We have simplified the startup process into a single command. 

> [!IMPORTANT]
> **Step 1: Open the Project Folder**
> Navigate to the root directory `secure-evidence-locker-using-r3corda`.
>
> **Step 2: Run the Ecosystem**
> Double-click the file named **`run_ecosystem.bat`**.
> This will open three terminal windows. **Do not close them.** They are:
> - Window 1: AI Backend (Port 5000)
> - Window 2: Mock Blockchain (Port 10050)
> - Window 3: React Frontend (Port 5173)
>
> **Step 3: Access the App**
> Once the terminals are ready, open your browser to **`http://localhost:5173`**.

---

## 👥 User Roles & Permissions
All accounts use the same password: **`secure2026`**

| Role | Username | Purpose |
| :--- | :--- | :--- |
| **Police Officer** | `officer_vault` | Upload evidence, run AI diagnostics, and anchor to the Ledger. |
| **Forensic Analyst** | `forensic_lab` | Deep technical forensic analysis of digital assets. |
| **Judge** | `honorable_justice` | Verify evidence authenticity, view Master Audit Docket. |
| **Citizen** | `citizen_view` | Use the AI Legal Navigator to understand case proceedings. |
| **Developer** | `dev_support` | System health monitoring and metrics. |

---

## 🌟 Key Features for Demo

### 1. Evidence Chain of Custody (Officer Flow)
1. Login as `officer_vault`.
2. Go to **"Deposit Evidence"**.
3. Upload an image. Click **Launch Forensic Pipeline**.
4. Click **Sign Evidence** (Biometric Simulation).
5. Click **Commit to Corda Ledger**. 
6. Observe the **Asset ID** (e.g., XFR-...) generated on the blockchain.

### 2. Judicial Verification (Judge Flow)
1. Login as `honorable_justice`.
2. Go to **"Master Docket"**. You will see the evidence uploaded by the officer earlier.
3. Go to **"Court Verify"**. 
4. Upload the **SAME** image. Click **Validate Admissibility**.
5. The system will match the hash against the Blockchain and show **"AUTHENTIC"**.

### 3. AI Legal Navigator (Citizen Flow)
1. Login as `citizen_view`.
2. Ask a question like: *"Someone snatched my gold chain"* or *"What is the punishment for theft?"*
3. The AI will provide relevant **BNS/IPC Sections**, **Procedural Guidelines**, and **Legal Rights**.

---

## 🛡️ Security Features
- **SHA-256 Hashing**: Every file is mathematically "fingerprinted". 
- **Immutable Ledger**: Once anchored, evidence cannot be deleted or modified.
- **RBAC**: Only authorized roles can perform sensitive actions (e.g., Only an Officer can anchor evidence).
