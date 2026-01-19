import hashlib
import os
import sys


def compute_sha256(file_path):
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for block in iter(lambda: f.read(4096), b""):
            if not block:
                break
            sha256.update(block)
    return sha256.hexdigest()


def main():
    if len(sys.argv) != 3:
        print("Usage: python evidence_verifier.py <file_path> <expected_sha256_hash>")
        sys.exit(1)

    file_path = sys.argv[1]
    expected_hash = sys.argv[2].strip().lower()

    if not os.path.exists(file_path):
        print("ERROR: File not found")
        sys.exit(1)

    actual_hash = compute_sha256(file_path).lower()

    print("Computed SHA-256:", actual_hash)
    print("Expected SHA-256:", expected_hash)

    if actual_hash == expected_hash:
        print("RESULT: MATCH - file contents match the on-ledger hash")
        sys.exit(0)
    else:
        print("RESULT: MISMATCH - file has been altered or wrong evidence selected")
        sys.exit(2)


if __name__ == "__main__":
    main()

