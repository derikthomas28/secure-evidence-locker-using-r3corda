# Secure Evidence Locker v2.0 🛡️

> **Outstanding Final Year Project** - Blockchain Verified Digital Evidence with AI Forensics.

## Overview
This project upgrades the standard Corda Template into a full-stack decentralized application (dApp). It combines **Enterprise Blockchain (R3 Corda)** with **Artificial Intelligence (Python)** and **Modern Web UI (React)** to create a tamper-proof evidence management system.

## Key Features
-   **✨ Modern Dashboard**: A beautiful React + Tailwind Interface.
-   **🧠 AI Forensics**: Auto-detects weapons/contraband and checks for image tampering before upload.
-   **📦 Decentralized Storage**: Simulates IPFS pinning for large file storage.
-   **🔗 Immutable Ledger**: Anchors evidence metadata (Hash, Owner, Timestamp) on the Corda Blockchain.

## Architecture
1.  **Frontend**: React (Vite)
2.  **Middleware**: Python Flask (AI Engine)
3.  **Blockchain API**: Java Spring Boot
4.  **Ledger**: R3 Corda Nodes (PartyA, PartyB, Notary)

## Quick Start 🚀

### Prerequisites
-   Java 8 (JDK 1.8)
-   Python 3.x
-   Node.js & npm

### One-Click Launch
We have provided a master script to run everything:

```bash
chmod +x run_demo.sh
./run_demo.sh
```

This will:
1.  Deploy and start the Corda Nodes.
2.  Start the Spring Boot Server (API).
3.  Start the AI Service.
4.  Launch the React Dashboard at `http://localhost:5173`.

## Usage Guide
1.  **Upload**: Drag & Drop a crime scene photo.
2.  **Analyze**: Watch the AI detect objects and check for editing.
3.  **Secure**: Click "Confirm & Secure" to issue the evidence on the Blockchain.
4.  **Audit**: Switch to the Audit tab to view the live immutable record.
