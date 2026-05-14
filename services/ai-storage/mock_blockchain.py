from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import hashlib
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

class Block:
    def __init__(self, index, timestamp, transactions, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()
    
    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()
    
    def mine_block(self, difficulty=2):
        while not self.hash.startswith('0' * difficulty):
            self.nonce += 1
            self.hash = self.calculate_hash()

class MockCordaBlockchain:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self.create_genesis_block()
    
    def create_genesis_block(self):
        genesis_block = Block(0, time.time(), [], "0")
        genesis_block.mine_block()
        self.chain.append(genesis_block)
    
    def get_last_block(self):
        return self.chain[-1]
    
    def add_transaction(self, transaction):
        self.pending_transactions.append(transaction)
    
    def mine_pending_transactions(self):
        if not self.pending_transactions:
            return None
        
        new_block = Block(
            len(self.chain),
            time.time(),
            self.pending_transactions.copy(),
            self.get_last_block().hash
        )
        new_block.mine_block()
        self.chain.append(new_block)
        self.pending_transactions = []
        return new_block
    
    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]
            
            if current_block.hash != current_block.calculate_hash():
                return False
            
            if current_block.previous_hash != previous_block.hash:
                return False
        
        return True

blockchain = MockCordaBlockchain()

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
    
    transaction = {
        "type": "ISSUE_EVIDENCE",
        "evidence_id": new_evidence["evidenceID"],
        "hash": new_evidence["hash"],
        "timestamp": time.time()
    }
    blockchain.add_transaction(transaction)
    mined_block = blockchain.mine_pending_transactions()
    
    print(f"[{time.strftime('%H:%M:%S')}] POST /api/evidence/issue - Anchored {new_evidence['evidenceID']} in Block #{mined_block.index}")
    return jsonify({
        "status": "Created",
        "evidence": new_evidence,
        "block": {
            "index": mined_block.index,
            "hash": mined_block.hash,
            "timestamp": mined_block.timestamp
        }
    }), 201

@app.route('/api/blockchain', methods=['GET'])
def get_blockchain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append({
            "index": block.index,
            "timestamp": block.timestamp,
            "transactions": block.transactions,
            "previous_hash": block.previous_hash,
            "hash": block.hash,
            "nonce": block.nonce
        })
    return jsonify({
        "chain": chain_data,
        "length": len(chain_data),
        "is_valid": blockchain.is_chain_valid()
    })

@app.route('/api/blockchain/last', methods=['GET'])
def get_last_block():
    last_block = blockchain.get_last_block()
    return jsonify({
        "index": last_block.index,
        "timestamp": last_block.timestamp,
        "transactions": last_block.transactions,
        "previous_hash": last_block.previous_hash,
        "hash": last_block.hash,
        "nonce": last_block.nonce
    })

if __name__ == '__main__':
    print("\n  === SECURE LOCK // MOCK BLOCKCHAIN ENGINE ===")
    print("  Port: 10050")
    print("  Status: EMULATING CORDA LEDGER")
    print("  Features: Blocks, Transactions, Proof of Work, Chain Validation")
    print("  =============================================\n")
    app.run(host='0.0.0.0', port=10050, debug=False)
