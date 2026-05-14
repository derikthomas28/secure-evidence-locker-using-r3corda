# 🎭 Step-by-Step Demo Script for Presentation

## Before You Start
First, start all services with ONE command!
```bash
chmod +x start.sh  # (only needed first time)
./start.sh
```
This will start everything for you!

---

## (Alternative) Start Manually in 3 Terminals
If you want to start each service separately:
- **Terminal 1**: Mock Blockchain → `cd services/ai-storage && python3 mock_blockchain.py`
- **Terminal 2**: AI Backend → `cd services/ai-storage && python3 app.py`
- **Terminal 3**: Frontend → `cd frontend && npm run dev` (open http://localhost:5173 or http://localhost:5176)

---

## 📝 Demo Case: Theft of Mobile Phone & Laptop
We'll go through 3 stages:
- Stage 1: Officer Registers Case
- Stage 2: Forensic Lab Uploads Evidence
- Stage 3: Judge Reviews, Verifies, and Closes Case

---

## 🎤 Presentation Script (What to Say)
### 1. Introduction
> "Good morning/afternoon, respected teachers and friends. Today, I’m presenting my final year project: **Secure Evidence Locker using R3 Corda**. It’s a professional-grade, blockchain-integrated platform designed to ensure investigative integrity, AI-powered forensic analysis, and complete chain of custody."

---

## Stage 1: Officer Registers Case
### What to Say
> "Let’s start with **Stage 1: Field Officer registers a new case**. This is where the investigation begins. First, we’ll log in as the officer."

### Step-by-Step Actions
1. **Login as Officer**:
   - Username: `officer_vault`
   - Password: `secure2026`
   - Click Log In!
2. **Go to Case Registry**:
   - Click **File New Case** button
3. **Enter Case Details**:
   - **Case Title**: Theft of Mobile Phone & Laptop
   - **FIR Number**: 0142/2026
   - **Police Station**: Kochi City
   - **District**: Ernakulam
   - **Incident Date**: 11/05/2026
   - **Incident Time**: 22:30
   - **Location**: Near Edappally Metro Station, Kochi
   - **Complainant**: Arjun K. Nair
   - **Description**: The complainant reported a theft of a mobile device (Samsung A54) and a laptop bag containing legal documents while waiting for a cab. The accused fled on a black motorcycle toward Aluva.
4. **Save Case**:
   - Click **Save Case**
   - See "✅ Case Registered!" message!
5. **Go to Deposit Evidence**:
   - Select **Document / Record** as evidence type
   - Upload the FIR file (use `uploads/fir.png` or `mock_data/cases/CR-2026-003_Domestic.txt`)
   - Click **Launch Forensic Pipeline**
   - Wait for AI analysis to complete!
   - Sign the evidence: type your name (e.g., "Officer Arjun")
   - Click **Commit to Corda Ledger**!

---

## Stage 2: Forensic Lab Uploads Evidence
### What to Say
> "Now, **Stage 2: Forensic Lab takes over!** They’ll upload a CCTV screenshot from the metro station showing the suspect and attach it to the case."

### Step-by-Step Actions
1. **Logout**:
   - Click Logout button in sidebar
2. **Login as Forensic Lab**:
   - Username: `forensic_lab`
   - Password: `secure2026`
3. **Go to Case Registry**:
   - Select the newly created case (CR-2026-003)
   - Click **View Case**
4. **Go to Deposit Evidence**:
   - Select **Photo Evidence** as type
   - Upload a CCTV screenshot (use `mock_data/evidence_images/suspect_cctv.png` or any CCTV-style photo you have)
   - Click **Launch Forensic Pipeline**
   - Wait for AI analysis!
   - Sign the evidence (e.g., "Forensic Lab")
   - Click **Commit to Corda Ledger**!
5. **Attach Evidence to Case**:
   - Go back to Case Registry, reopen CR-2026-003
   - Click **Attach Evidence to Case**
   - Enter Evidence Description: "CCTV Screenshot of Suspect"
   - Upload the same CCTV screenshot
   - Click **Certify & Anchor Evidence**!

---

## Stage 3: Judge Reviews Case, Verifies Evidence, and Closes It
### What to Say
> "Now, **Stage 3: Hon'ble Judge steps in!** They’ll review the case, verify the evidence authenticity using SHA-256 hashing, and pass the final judgment!"

### Step-by-Step Actions
1. **Logout from Forensic Lab**:
2. **Login as Judge**:
   - Username: `honorable_justice`
   - Password: `secure2026`
3. **Go to Case Intelligence**:
   - Select the case (CR-2026-003)
   - Show:
     - Case Diary (field investigation logs)
     - Crime Probability Index (AI-calculated)
     - Forensic Evidence Vault
     - Open one evidence card to show details, relevance score, and chain of custody!
4. **Go to Court Verify**:
   - This is the new evidence verification UI!
   - **Step 1: Select Case**: Choose CR-2026-003
   - **Step 2: Select Evidence**: Choose the first evidence (FIR document)
   - **Step 3: Verify Evidence**:
     - ⚠️ **IMPORTANT**: Upload the EXACT SAME FIR file that you uploaded in Stage 1! (Same file = same hash)
     - Click **Verify Evidence**
     - Show the ✅ "Evidence is Authentic!" message (and both stored/computed hashes)!
   - Repeat for the CCTV screenshot - use the EXACT SAME file you uploaded in Stage 2!
5. **Pass Final Judgment**:
   - Go back to Case Intelligence
   - Scroll down to **Final Judicial Verdict**
   - Enter the judgment: "The accused is found guilty of theft under BNS 303. Sentenced to 3 years of rigorous imprisonment."
   - Click **Finalize Verdict & Seal Ledger**!
   - Show that the case is now closed!

---

## Optional Extra: Show Mission Control
### What to Say
> "To wrap up, let's also quickly check the **Mission Control** dashboard for our DevOps team, which monitors the system health, audit logs, and services!"

### Step-by-Step Actions
1. Logout → Login as `dev_support` (password `secure2026`)
2. Go to System Health
3. Show the real-time metrics, audit log stream, and service matrix!

---

## 📋 Final Checklist for Presentation
Before presenting, double-check that:
- [ ] All services are running!
- [ ] You have the demo files ready!
- [ ] You've practiced this flow a few times!
- [ ] You know the possible questions (check presentation.md for Q&A)!

---

## 🎉 Good Luck!
You've got this! Just stay calm, follow the steps, and explain each feature clearly!
