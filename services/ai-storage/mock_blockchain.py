from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
# Enable CORS for frontend communication
CORS(app, resources={r"/*": {"origins": "*"}})

# In-memory storage for evidence (lost on restart, perfect for demo)
evidence_store = [
    {
        "evidenceID": "XFR-A92B4CD1",
        "hash": "7d5d718a280e227d812ae967812bc8f422789123891238912389123891238912",
        "custodyNote": "GENESIS_DEPOSIT: AI Cluster: Weapon, Fingerprint. IPFS: ipfs://QmXoyp..."
    }
]

@app.before_request
def log_request_info():
    print(f"[{time.strftime('%H:%M:%S')}] {request.method} {request.path}")

@app.route('/api/evidence/issue', methods=['OPTIONS'])
def options_evidence_issue():
    return '', 204

@app.route('/api/evidence', methods=['GET'])
def get_evidence():
    print(f"[{time.strftime('%H:%M:%S')}] GET /api/evidence - Returning {len(evidence_store)} records")
    return jsonify(evidence_store)

@app.route('/api/evidence/issue', methods=['POST'])
def issue_evidence():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    new_evidence = {
        "evidenceID": data.get('evidenceID'),
        "hash": data.get('hash'),
        "custodyNote": data.get('custodyNote')
    }
    
    evidence_store.append(new_evidence)
    print(f"[{time.strftime('%H:%M:%S')}] POST /api/evidence/issue - Anchored {new_evidence['evidenceID']}")
    return jsonify({"status": "Created", "evidence": new_evidence}), 201

if __name__ == '__main__':
    print("\n  === SECURE LOCK // MOCK BLOCKCHAIN ENGINE ===")
    print("  Port: 10050")
    print("  Status: EMULATING CORDA LEDGER")
    print("  =============================================\n")
    app.run(host='0.0.0.0', port=10050, debug=False)
