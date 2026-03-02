from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import os
import ai_engine
import time
import hashlib
import secrets
import psutil

app = Flask(__name__)
CORS(app, supports_credentials=True)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ============================================================
# RBAC: DEMO USER DATABASE & SESSION STORE
# ============================================================

def hash_pw(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

DEMO_USERS = {
    "officer_vault": {
        "password_hash": hash_pw("secure2026"),
        "role": "officer",
        "display_name": "Officer Arjun Mehta",
        "badge": "OFC-4821",
        "clearance": "Level 3 — Field Operations",
        "permissions": {
            "can_upload": True,
            "can_ocr": True,
            "can_view_evidence": True,
            "can_view_all": False,
            "can_judicial_ai": False,
            "can_system_health": False,
            "can_verify": False,
            "can_navigate": False,
        }
    },
    "forensic_lab": {
        "password_hash": hash_pw("secure2026"),
        "role": "forensic",
        "display_name": "Dr. Priya Sharma",
        "badge": "FSL-0092",
        "clearance": "Level 4 — Forensic Sciences",
        "permissions": {
            "can_upload": True,
            "can_ocr": True,
            "can_view_evidence": True,
            "can_view_all": False,
            "can_judicial_ai": False,
            "can_system_health": False,
            "can_verify": False,
            "can_navigate": False,
        }
    },
    "honorable_justice": {
        "password_hash": hash_pw("secure2026"),
        "role": "judge",
        "display_name": "Hon. Justice R.K. Banerjee",
        "badge": "HC-DEL-1147",
        "clearance": "Level 5 — Full Judicial Access",
        "permissions": {
            "can_upload": False,
            "can_ocr": False,
            "can_view_evidence": True,
            "can_view_all": True,
            "can_judicial_ai": True,
            "can_system_health": False,
            "can_verify": True,
            "can_navigate": False,
        }
    },
    "citizen_view": {
        "password_hash": hash_pw("secure2026"),
        "role": "public",
        "display_name": "Citizen Portal",
        "badge": "PUB-ACCESS",
        "clearance": "Level 1 — Public Read-Only",
        "permissions": {
            "can_upload": False,
            "can_ocr": False,
            "can_view_evidence": False,
            "can_view_all": False,
            "can_judicial_ai": False,
            "can_system_health": False,
            "can_verify": False,
            "can_navigate": True,
        }
    },
    "dev_support": {
        "password_hash": hash_pw("secure2026"),
        "role": "developer",
        "display_name": "SysAdmin // DevOps",
        "badge": "DEV-ROOT-01",
        "clearance": "Level 2 — System Maintenance",
        "permissions": {
            "can_upload": False,
            "can_ocr": False,
            "can_view_evidence": False,
            "can_view_all": False,
            "can_judicial_ai": False,
            "can_system_health": True,
            "can_verify": False,
            "can_navigate": False,
        }
    }
}

# In-memory session store (demo only)
ACTIVE_SESSIONS = {}

def require_role(*allowed_roles):
    """Decorator to restrict endpoint access by role."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('X-Auth-Token', '')
            if not token or token not in ACTIVE_SESSIONS:
                return jsonify({"error": "Authentication required. Please login."}), 401
            session = ACTIVE_SESSIONS[token]
            if session['role'] not in allowed_roles:
                return jsonify({"error": f"Access denied. Required role: {', '.join(allowed_roles)}. Your role: {session['role']}."}), 403
            request.current_user = session
            return f(*args, **kwargs)
        return decorated
    return decorator

# ============================================================
# AUTH ENDPOINTS
# ============================================================

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    user = DEMO_USERS.get(username)
    if not user or user['password_hash'] != hash_pw(password):
        return jsonify({"error": "Invalid credentials. Access denied."}), 401

    token = secrets.token_hex(32)
    session_data = {
        "username": username,
        "role": user['role'],
        "display_name": user['display_name'],
        "badge": user['badge'],
        "clearance": user['clearance'],
        "permissions": user['permissions'],
        "login_time": int(time.time())
    }
    ACTIVE_SESSIONS[token] = session_data

    return jsonify({
        "status": "authenticated",
        "token": token,
        **session_data
    })

@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    token = request.headers.get('X-Auth-Token', '')
    if not token or token not in ACTIVE_SESSIONS:
        return jsonify({"error": "Not authenticated"}), 401
    return jsonify(ACTIVE_SESSIONS[token])

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    token = request.headers.get('X-Auth-Token', '')
    if token in ACTIVE_SESSIONS:
        del ACTIVE_SESSIONS[token]
    return jsonify({"status": "logged_out"})

# ============================================================
# HEALTH CHECK (Public)
# ============================================================

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Legal-Tech AI Engine",
        "modules": {
            "forensic_analysis": "active",
            "judicial_assistant": "active",
            "citizen_navigator": "active",
            "auth_rbac": "active"
        }
    })

# ============================================================
# SYSTEM HEALTH (Developer Only)
# ============================================================

@app.route('/api/system/health', methods=['GET'])
@require_role('developer')
def system_health():
    cpu = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    return jsonify({
        "system": {
            "cpu_percent": cpu,
            "memory_total_gb": round(mem.total / (1024**3), 2),
            "memory_used_gb": round(mem.used / (1024**3), 2),
            "memory_percent": mem.percent,
            "disk_total_gb": round(disk.total / (1024**3), 2),
            "disk_used_gb": round(disk.used / (1024**3), 2),
            "disk_percent": disk.percent,
        },
        "services": {
            "ai_engine": "online",
            "ocr_cluster": "standby",
            "blockchain_bridge": "connecting",
            "auth_module": "active",
        },
        "active_sessions": len(ACTIVE_SESSIONS),
        "uptime_seconds": int(time.time()),
    })

# ============================================================
# MODULE C: FORENSIC EVIDENCE ANALYSIS (Officer + Forensic)
# ============================================================

@app.route('/analyze', methods=['POST'])
@require_role('officer', 'forensic')
def analyze_evidence():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        try:
            ai_report = ai_engine.analyze_image(filepath)
            ipfs_hash = ai_engine.upload_to_ipfs(filepath)
            file_hash = ai_engine.compute_sha256(filepath)

            return jsonify({
                "filename": file.filename,
                "ai_analysis": ai_report,
                "ipfs_hash": ipfs_hash,
                "sha256": file_hash,
                "timestamp": int(time.time()),
                "submitted_by": request.current_user['username']
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500

# ============================================================
# MODULE D: OCR SCAN (Officer + Forensic)
# ============================================================

@app.route('/api/officer/ocr-scan', methods=['POST'])
@require_role('officer', 'forensic')
def officer_ocr_scan():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    try:
        forensic_report = ai_engine.analyze_image(filepath)
        extracted_text, engine_info = ai_engine.perform_ocr(filepath)
        verification = ai_engine.verify_ocr_content(extracted_text)
        sha256 = ai_engine.compute_sha256(filepath)
        
        return jsonify({
            "filename": file.filename,
            "sha256": sha256,
            "ocr_engine": engine_info,
            "extracted_text": extracted_text,
            "verification": verification,
            "forensic_report": forensic_report,
            "timestamp": int(time.time()),
            "status": "success",
            "scanned_by": request.current_user['username']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================================
# MODULE A: JUDICIAL SUMMARIZER (Judge Only)
# ============================================================

@app.route('/api/judicial/summarize', methods=['POST'])
@require_role('judge')
def judicial_summarize():
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
            if not text.strip():
                return jsonify({"error": "The uploaded file is empty or unreadable."}), 400
            report = ai_engine.summarize_case(text, file.filename)
            return jsonify(report)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    elif request.is_json:
        data = request.get_json()
        text = data.get('text', '')
        filename = data.get('filename', 'Pasted Case Text')
        if not text.strip():
            return jsonify({"error": "No text provided for summarization."}), 400
        try:
            report = ai_engine.summarize_case(text, filename)
            return jsonify(report)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Please provide either a file upload or JSON body with 'text' field."}), 400

# ============================================================
# MODULE B: CITIZEN LEGAL NAVIGATOR (Public + Judge)
# ============================================================

@app.route('/api/citizen/navigate', methods=['POST'])
@require_role('public', 'judge')
def citizen_navigate():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON with a 'query' field."}), 400
    
    data = request.get_json()
    query = data.get('query', '')
    
    if not query.strip():
        return jsonify({"error": "Please describe your legal situation in the 'query' field."}), 400
    
    if len(query.strip()) < 5:
        return jsonify({"error": "Please provide a more detailed description (at least a few words)."}), 400
    
    try:
        result = ai_engine.navigate_legal_query(query)
        result["query_received"] = query
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("\n  === SECURE LEGAL VAULT // RBAC ENGINE ===")
    print("  Demo Credentials (all pw: secure2026):")
    print("    officer_vault   | forensic_lab")
    print("    honorable_justice | citizen_view | dev_support")
    print("  =========================================\n")
    app.run(host='0.0.0.0', port=5000, debug=True)
