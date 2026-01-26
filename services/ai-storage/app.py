from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import ai_engine
import time

app = Flask(__name__)
# Enable CORS for all routes to allow React frontend to connect
CORS(app) 

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "AI & Storage Service"})

@app.route('/analyze', methods=['POST'])
def analyze_evidence():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        # Save file temporarily
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        try:
            # 1. Run AI Tamper Check & Object Detection
            ai_report = ai_engine.analyze_image(filepath)
            
            # 2. Upload to IPFS (Simulated for Demo)
            ipfs_hash = ai_engine.upload_to_ipfs(filepath)
            
            # 3. Compute SHA256 for Blockchain anchoring
            file_hash = ai_engine.compute_sha256(filepath)

            return jsonify({
                "filename": file.filename,
                "ai_analysis": ai_report,
                "ipfs_hash": ipfs_hash,
                "sha256": file_hash,
                "timestamp": int(time.time())
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            # Cleanup - optional, keeping it for now might be useful for manual inspection
            # os.remove(filepath) 
            pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
