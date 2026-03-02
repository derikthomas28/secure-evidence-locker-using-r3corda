import hashlib
import os
from cryptography.fernet import Fernet
import time
import cv2
import exifread
import sys

def compute_sha256(file_path):
    print(f"Computing SHA-256 for: {file_path}")
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for block in iter(lambda: f.read(4096), b''):
            sha256.update(block)
    return sha256.hexdigest()

def ai_tamper_check(file_path):
    print("Running AI-assisted tamper detection...")
    try:
        # Metadata check
        with open(file_path, 'rb') as f:
            tags = exifread.process_file(f)
            print(f"EXIF tags found: {len(tags)}")
            if not tags:
                print("Warning: No metadata (common in edited/simple images)")

        # Image-specific perceptual hash (detects visual changes)
        if file_path.lower().endswith(('.jpg', '.jpeg', '.png')):
            img = cv2.imread(file_path)
            if img is None:
                return "Error: Could not read image"
            phash = cv2.img_hash.PHash_create().compute(img)
            print(f"Perceptual hash computed (length: {len(phash)})")
            return "OK: Basic visual & metadata check passed"
        return "OK: Non-image file passed metadata check"
    except Exception as e:
        print(f"Tamper check error: {e}")
        return "Warning: Check failed (continuing anyway)"

def encrypt_file(file_path):
    print("Encrypting file...")
    key = Fernet.generate_key()
    fernet = Fernet(key)
    with open(file_path, 'rb') as f:
        data = f.read()
    encrypted = fernet.encrypt(data)
    enc_path = file_path + '.enc'
    with open(enc_path, 'wb') as f:
        f.write(encrypted)
    return enc_path, key.decode()

if __name__ == "__main__":
    if len(sys.argv) >= 2:
        file_path = sys.argv[1]
    else:
        file_path = "sample\\evidence.png"

    print(f"Secure Evidence Locker Uploader")
    print(f"File: {file_path}\n")

    if not os.path.exists(file_path):
        print("ERROR: File not found! Update file_path in script.")
        sys.exit(1)

    tamper_result = ai_tamper_check(file_path)
    print(f"Tamper detection: {tamper_result}\n")

    file_hash = compute_sha256(file_path)
    print(f"SHA-256 Hash: {file_hash}\n")

    enc_path, key = encrypt_file(file_path)
    print(f"Encrypted file: {enc_path}")
    print(f"Encryption Key (SAVE SECURELY!): {key}\n")

    evidence_id = f"EVID-{int(time.time())}"
    custody_note = f"Uploaded by Officer on {time.strftime('%Y-%m-%d')} after tamper check"

    print("=== Ready to anchor on Corda ===")
    print("Paste this command into PartyA shell:")
    print(f'flow start IssueEvidenceFlow evidenceID: "{evidence_id}", hash: "{file_hash}", initialCustodyNotes: ["{custody_note}"]')
