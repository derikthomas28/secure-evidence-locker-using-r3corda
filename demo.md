# 🎥 Demo Walkthrough - TWO Complete Cases!

---

## Case 1: Theft of Mobile Phone & Laptop (Original)
## Step 1: Start the Services (ONE COMMAND!)
Just run the startup script:
```bash
chmod +x start.sh  # (only needed first time)
./start.sh
```
This script:
- Kills any existing processes on ports 5000, 10050, 5173
- Starts Mock Blockchain (:10050)
- Starts AI Backend (:5000)
- Starts Frontend (:5173)
- Cleans up all processes when you press Ctrl+C!

---

## (Alternative) Start Manually in 3 Terminals
If you want to start each service separately:
1. **Mock Blockchain**: `cd services/ai-storage && python3 mock_blockchain.py`
2. **AI Backend**: `cd services/ai-storage && python3 app.py`
3. **Frontend**: `cd frontend && npm run dev`

---

## Case 1: Theft of Mobile Phone & Laptop
## Stage 1: Officer Registers Case & Uploads Initial Evidence
1. **Login as Officer**:
   - Username: `officer_vault`
   - Password: `secure2026`
2. **Go to Case Registry → File New Case**:
   - **Case Title**: Theft of Mobile Phone & Laptop
   - **FIR Number**: 0142/2026
   - **Police Station**: Kochi City
   - **District**: Ernakulam
   - **Incident Date**: 11/05/2026
   - **Incident Time**: 22:30
   - **Location**: Near Edappally Metro Station, Kochi
   - **Complainant**: Arjun K. Nair
   - **Description**: The complainant reported a theft of a mobile device (Samsung A54) and a laptop bag containing legal documents while waiting for a cab. The accused fled on a black motorcycle toward Aluva.
3. **Save the Case**!
4. **Go to Case Registry again → Re-open your case**:
   - Click **Attach Evidence to Case** (this saves it to the database with hash and makes it verifiable!)
   - **Evidence Type**: Document / Record
   - **Description**: FIR Document - Theft of Mobile & Laptop
   - **Upload File**: Select `mock_data/fir.png` (save a copy to your desktop to use for verification later!)
   - Click **Certify & Anchor Evidence**!

---

## Stage 2: Forensic Lab Uploads CCTV Screenshot Evidence
1. **Logout from Officer → Login as Forensic Lab**:
   - Username: `forensic_lab`
   - Password: `secure2026`
2. **Go to Case Registry**:
   - Select the newly created case (CR-2026-003)
3. **Go to Deposit Evidence**:
   - Select **Photo Evidence**
   - Upload `mock_data/evidence_images/suspect_cctv.png` (or any CCTV-style photo)
   - Click **Launch Forensic Pipeline**
   - Sign the evidence
   - Click **Commit to Corda Ledger**!
4. **In Case Registry**:
   - Open the case again → Click **Attach Evidence to Case**
   - Enter evidence description: CCTV Screenshot of Suspect
   - Upload the same CCTV screenshot
   - Click **Certify & Anchor Evidence**!

---

## Stage 3: Judge Reviews Case, Verifies Evidence, and Passes Judgment
1. **Logout from Forensic Lab → Login as Judge**:
   - Username: `honorable_justice`
   - Password: `secure2026`
2. **Go to Case Intelligence**:
   - Select the case (CR-2026-003)
   - View Case Diary, AI Analysis, and Forensic Evidence Vault
   - In Forensic Evidence Vault:
     - Open each evidence card to view details, chain of custody, and verification option
3. **Go to Court Verify**:
   - **Step 1: Select Case**: Choose CR-2026-003
   - **Step 2: Select Evidence**: Choose the FIR document
   - **Step 3: Verify Evidence**:
     - ⚠️ **IMPORTANT**: Upload the EXACT SAME FIR file that you uploaded in Stage 1!
     - Click **Verify Evidence**
     - See ✅ "Evidence is Authentic!" (shows both stored and computed SHA-256 hashes)
   - Repeat for the CCTV screenshot - use the EXACT SAME file you uploaded in Stage 2!
4. **Back to Case Intelligence**:
   - Scroll to the **Final Judicial Verdict** section
   - Enter the judgment: "The accused is found guilty of theft under BNS 303. Sentenced to 3 years of rigorous imprisonment."
   - Click **Finalize Verdict & Seal Ledger**!

---

---

## 🎭 Case 2: Cyber Crime (Online Fraud) [NEW CASE!]
## Stage 1: Officer Registers Cyber Case & Uploads Screenshot
1. **Login as Officer**:
   - Username: `officer_vault`
   - Password: `secure2026`
2. **Go to Case Registry → File New Case**:
   - **Case Title**: Online Fraud - Fake Investment Scheme
   - **FIR Number**: 0201/2026
   - **Police Station**: Cyber Cell, Kochi
   - **District**: Ernakulam
   - **Incident Date**: 12/05/2026
   - **Incident Time**: 14:00
   - **Location**: Online (via WhatsApp)
   - **Complainant**: Maria John
   - **Description**: The complainant was lured into a fake investment scheme promising 50% returns in 7 days. She transferred ₹50,000 via UPI to a fraudulent account, after which the suspect blocked her on WhatsApp and calls.
3. **Save the Case**!
4. **Go to Deposit Evidence**:
   - Select **Photo Evidence**
   - Upload a screenshot of the WhatsApp chat (you can add this later to your uploads folder!)
   - Click **Launch Forensic Pipeline**
   - Sign the evidence (e.g., "Officer Arjun")
   - Click **Commit to Corda Ledger**!

---

## Stage 2: Forensic Lab Uploads Bank Statement PDF
1. **Logout from Officer → Login as Forensic Lab**:
   - Username: `forensic_lab`
   - Password: `secure2026`
2. **Go to Case Registry**:
   - Select the newly created case (CR-2026-004 or whatever number it's assigned!)
3. **Go to Deposit Evidence**:
   - Select **Document / Record**
   - Upload the bank statement PDF showing the UPI transaction (add later!)
   - Click **Launch Forensic Pipeline**
   - Sign the evidence (e.g., "Forensic Lab Cyber Cell")
   - Click **Commit to Corda Ledger**!
4. **In Case Registry**:
   - Open the case again → Click **Attach Evidence to Case**
   - Enter evidence description: Bank Statement - UPI Transaction
   - Upload the same bank statement PDF
   - Click **Certify & Anchor Evidence**!

---

## Stage 3: Judge Reviews Cyber Case, Verifies, and Closes
1. **Logout → Login as Judge**:
   - Username: `honorable_justice`
   - Password: `secure2026`
2. **Go to Case Intelligence**:
   - Select the cyber case (CR-2026-004)
   - View AI Analysis, Crime Probability, Evidence, etc.
3. **Go to Court Verify**:
   - Select the cyber case
   - Select WhatsApp chat screenshot
   - Upload the EXACT SAME screenshot file and verify!
   - Repeat for bank statement PDF!
4. **Pass Final Judgment**:
   - In Case Intelligence, scroll to Final Judicial Verdict
   - Enter judgment: "Accused found guilty of cheating and fraud under BNS 317 and 318. Sentenced to 5 years rigorous imprisonment and fine of ₹1,00,000."
   - Seal the ledger!

---

## 📋 Demo Checklist (for Both Cases)
- [ ] All 3 services are running
- [ ] Case 1: Officer created theft case
- [ ] Case 1: Officer uploaded FIR
- [ ] Case 1: Forensic uploaded CCTV
- [ ] Case 1: Forensic attached CCTV to case
- [ ] Case 1: Judge reviewed, verified, closed case
- [ ] Case 2: Officer created cyber case
- [ ] Case 2: Officer uploaded chat screenshot
- [ ] Case 2: Forensic uploaded bank statement
- [ ] Case 2: Forensic attached statement to case
- [ ] Case 2: Judge reviewed, verified, closed case
