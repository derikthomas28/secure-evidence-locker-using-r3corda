from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
import os
import ai_engine
import time
import hashlib
import secrets
import psutil
import random

from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
# Secure database configuration (PostgreSQL for production / SQLite for local)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///vault.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Explicitly allow the custom X-Auth-Token header and all origins
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization", "X-Auth-Token"])

# ============================================================
# PRODUCTION MODELS
# ============================================================
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    display_name = db.Column(db.String(100))
    badge = db.Column(db.String(50))
    clearance = db.Column(db.String(100))
    permissions_json = db.Column(db.Text)  # Stores JSON string of permissions

    def get_permissions(self):
        return json.loads(self.permissions_json) if self.permissions_json else {}

# Create DB tables inside the app context
with app.app_context():
    db.create_all()

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ============================================================
# CASE MANAGEMENT STORE (In-memory, demo)
# ============================================================
# Stores FIRs and linked evidence by case number
CASE_STORE = {
    "CR-2026-001": {
        "case_number": "CR-2026-001",
        "title": "State vs. Unknown (Mall Robbery)",
        "incident_type": "Robbery",
        "description": "Armed robbery at mall gate. Suspect used a knife to snatch cash. Two witnesses present.",
        "location": "Ryme City Mall, Gate 3, Sector 14",
        "incident_date": "2026-03-15",
        "complainant": "Rajesh Sharma",
        "accused": "Unknown (Male, 5'8\")",
        "investigating_officer": "Officer Arjun Mehta (OFC-4821)",
        "fir_number": "FIR/2026/RC/0421",
        "status": "Investigation Underway",
        "created_at": int(time.time()) - 86400,
        "created_by": "officer_vault",
        "evidence_list": [
            {
                "evidence_id": "EV-001",
                "type": "photo",
                "description": "CCTV grab of accused at Gate 3",
                "submitted_by": "officer_vault",
                "submitted_at": int(time.time()) - 82000,
                "sha256": "sh8291...331",
                "forensic_result": {"scene_classification": "Weapon Recovery Scene", "severity": "Critical", "detected_elements": ["Weapon / Dangerous Object"], "applicable_sections": ["BNS 309 (Robbery)", "BNS 115 (Hurt)"]}
            }
        ]
    },
    "CR-2026-002": {
        "case_number": "CR-2026-002",
        "title": "Cyber Fraud (Phishing)",
        "incident_type": "Cheating",
        "description": "Complainant duped of 50,000 INR through a deceptive website link for job offer.",
        "location": "Online / Cyber Cell",
        "incident_date": "2026-03-20",
        "complainant": "Sneha Roy",
        "accused": "Unknown Domain (Phish-Job-Portal.tk)",
        "investigating_officer": "Officer Arjun Mehta (OFC-4821)",
        "fir_number": "FIR/2026/CYB/1102",
        "status": "FIR Registered",
        "created_at": int(time.time()) - 3600 * 24,
        "created_by": "officer_vault",
        "evidence_list": [
            {
                "evidence_id": "EV-002",
                "type": "document",
                "description": "Deceptive Email Screenshot",
                "submitted_by": "officer_vault",
                "submitted_at": int(time.time()) - 3600,
                "sha256": "df0921...882",
                "forensic_result": {"trust_label": "Valid", "metadata_status": "Integrity Check Pass", "applicable_sections": ["BNS 318 (Cheating)", "IT Act 66D"]}
            }
        ]
    },
    "CR-2026-003": {
        "case_number": "CR-2026-003",
        "title": "Domestic Conflict (Assault)",
        "incident_type": "Assault",
        "description": "Physical altercation resulting in minor injuries. Evidence includes medical report.",
        "location": "Residency Park, Apartment 4B",
        "incident_date": "2026-03-25",
        "complainant": "Vikas Gupta",
        "accused": "Rohit Verma",
        "investigating_officer": "Officer Arjun Mehta (OFC-4821)",
        "fir_number": "FIR/2026/RC/0551",
        "status": "Under Investigation",
        "created_at": int(time.time()) - 3600 * 12,
        "created_by": "officer_vault",
        "case_diary": [
            {"date": "2026-03-25", "time": "10:00", "location": "Apartment 4B", "findings": "Initial response. Complainant was visibly distressed. Collected medical first-aid kit.", "officer": "Arjun Mehta"}
        ],
        "final_judgment": None,
        "evidence_list": []
    }
}

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
            "can_navigate": True,
        }
    },
    "forensic_lab": {
        "password_hash": hash_pw("secure2026"),
        "role": "forensic",
        "display_name": "Dr. Priya Sharma",
        "badge": "FSL-0092",
        "clearance": "Level 4 — Forensic Sciences",
        "permissions": {
            "can_measure": True,
            "can_detail": True,
            "can_upload": True,
            "can_ocr": True,
            "can_view_evidence": True,
            "can_view_all": True,
            "can_judicial_ai": False,
            "can_system_health": False,
            "can_verify": True,
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
            "can_navigate": True,
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

# Create DB tables and bootstrap with demo users
def bootstrap_db():
    with app.app_context():
        db.create_all()
        if not User.query.first():
            print("⚓ Bootstrapping database with demo accounts...")
            for uname, udata in DEMO_USERS.items():
                new_user = User(
                    username=uname,
                    password_hash=udata['password_hash'],
                    role=udata['role'],
                    display_name=udata['display_name'],
                    badge=udata['badge'],
                    clearance=udata['clearance'],
                    permissions_json=json.dumps(udata['permissions'])
                )
                db.session.add(new_user)
            db.session.commit()
            print("✅ Database ready.")

bootstrap_db()

# In-memory session store (demo only - real world would use Redis/Signed JWTs)
ACTIVE_SESSIONS = {}

# In-memory stores for Feedback and System Events (Non-judicial metadata)
FEEDBACK_STORE = [
    {"id": "FB-001", "role": "judge", "user": "Banerjee", "text": "The summaries are excellent, can we add multi-case comparison?", "timestamp": int(time.time()) - 172800},
    {"id": "FB-002", "role": "citizen", "user": "Sneha", "text": "Very helpful for understanding FIR procedures.", "timestamp": int(time.time()) - 86400}
]

SYSTEM_EVENTS = [
    {"id": "TH-001", "level": "Warning", "type": "Traffic", "message": "Increased latency in IPFS gateway pinned nodes.", "timestamp": int(time.time()) - 10000},
    {"id": "TH-002", "level": "Info", "type": "Sync", "message": "Daily blockchain state-sync with Corda node 04 complete.", "timestamp": int(time.time()) - 5000}
]

def require_role(*allowed_roles):
    """Decorator to restrict endpoint access by role."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # Optional check if role is 'anonymous'
            if 'anonymous' in allowed_roles:
                return f(*args, **kwargs)
                
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

    # 1. Try modern SQL Database User first
    user_db = User.query.filter_by(username=username).first()
    
    if user_db and user_db.password_hash == hash_pw(password):
        user_role = user_db.role
        display_name = user_db.display_name
        badge = user_db.badge
        clearance = user_db.clearance
        permissions = user_db.get_permissions()
    # 2. Fallback to static DEMO_USERS for legacy support
    elif username in DEMO_USERS and DEMO_USERS[username]['password_hash'] == hash_pw(password):
        u = DEMO_USERS[username]
        user_role = u['role']
        display_name = u['display_name']
        badge = u['badge']
        clearance = u['clearance']
        permissions = u['permissions']
    else:
        return jsonify({"error": "Invalid credentials. Identity verification failure."}), 401

    token = secrets.token_hex(32)
    session_data = {
        "username": username,
        "role": user_role,
        "display_name": display_name,
        "badge": badge,
        "clearance": clearance,
        "permissions": permissions,
        "login_time": int(time.time()),
        "auth_engine": "SQL-Vault" if user_db else "Legacy-Static"
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

# Simulate system logs for the developer
SYSTEM_LOGS = [
    {"time": "14:22:01", "level": "INFO", "module": "AUTH", "event": "Session established for user: honorable_justice"},
    {"time": "14:25:34", "level": "WARN", "module": "OCR", "event": "Tesseract latency exceeds 2.5s on high-res PDF"},
    {"time": "14:30:12", "level": "INFO", "module": "AI-ENG", "event": "Neural clustering completed for Case CR-2026-004"},
    {"time": "14:35:45", "level": "INFO", "module": "CORDA", "event": "FinalityFlow initiated for Asset XFR-66FB9A"},
    {"time": "14:40:22", "level": "ERROR", "module": "STORAGE", "event": "IO Wait timeout on Regional Node #04"},
    {"time": "14:45:11", "level": "INFO", "module": "CORE", "event": "Garbage collection reclaimed 142MB heap space"}
]

@app.route('/api/system/health', methods=['GET'])
@require_role('developer')
def system_health():
    cpu = psutil.cpu_percent(interval=0.5)
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage('/')
    
    # Calculate case store stats
    total_cases = len(CASE_STORE)
    total_evidence = sum(len(c.get('evidence_list', [])) for c in CASE_STORE.values())
    
    return jsonify({
        "system": {
            "cpu_percent": cpu,
            "memory_total_gb": round(mem.total / (1024**3), 2),
            "memory_used_gb": round(mem.used / (1024**3), 2),
            "memory_percent": mem.percent,
            "disk_total_gb": round(disk.total / (1024**3), 2),
            "disk_used_gb": round(disk.used / (1024**3), 2),
            "disk_percent": disk.percent,
            "os": os.name,
            "platform": psutil.Process().name()
        },
        "services": {
            "ai_engine": "online",
            "ocr_cluster": "active",
            "blockchain_bridge": "healthy",
            "p2p_gossip": "12 nodes",
            "vault_service": "sealed",
            "notary_p2p": "connected"
        },
        "stats": {
            "total_cases": total_cases,
            "total_evidence": total_evidence,
            "active_sessions": len(ACTIVE_SESSIONS),
            "api_calls_processed": 542,
            "avg_latency_ms": 124
        },
        "logs": SYSTEM_LOGS,
        "uptime_seconds": int(time.time()),
        "version": "v2.4-stable-prod"
    })

# ============================================================
# MODULE C: FORENSIC EVIDENCE ANALYSIS (Officer + Forensic)
# ============================================================

@app.route('/analyze', methods=['POST'])
@require_role('officer', 'forensic', 'judge')
def analyze_evidence():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    evidence_type = request.form.get('evidence_type', 'document')  # 'photo' or 'document'

    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        try:
            # Route to appropriate analysis pipeline
            if evidence_type == 'photo':
                ai_report = ai_engine.analyze_photo_evidence(filepath)
            else:
                ai_report = ai_engine.analyze_image(filepath)
            
            ipfs_hash = ai_engine.upload_to_ipfs(filepath)
            file_hash = ai_engine.compute_sha256(filepath)

            return jsonify({
                "filename": file.filename,
                "evidence_id": f"EV-{secrets.token_hex(4).upper()}",
                "evidence_type": evidence_type,
                "ai_analysis": ai_report,
                "ipfs_hash": ipfs_hash,
                "sha256": file_hash,
                "measurements": request.form.get('measurements'),
                "physical_objects": request.form.get('physical_objects'),
                "branch_of": request.form.get('branch_of'), # Linked to a previous evidence_id if correction
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
@require_role('public', 'judge', 'officer', 'forensic', 'developer')
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


# ============================================================
# CASE MANAGEMENT ENDPOINTS
# ============================================================

@app.route('/api/cases', methods=['GET'])
@require_role('officer', 'forensic', 'judge', 'developer')
def get_all_cases():
    """Return a summary list of all cases."""
    cases = []
    for cn, c in CASE_STORE.items():
        cases.append({
            "case_number": c['case_number'],
            "title": c['title'],
            "incident_type": c['incident_type'],
            "status": c['status'],
            "fir_number": c['fir_number'],
            "created_at": c['created_at'],
            "evidence_count": len(c.get('evidence_list', []))
        })
    # Sort newest first
    cases.sort(key=lambda x: x['created_at'], reverse=True)
    return jsonify(cases)


@app.route('/api/cases/create', methods=['POST'])
@require_role('officer')
def create_case():
    """Officer creates a new FIR / Case."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body required."}), 400
    
    required = ['title', 'incident_type', 'description', 'location', 'incident_date', 'complainant']
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required."}), 400
    
    # Generate unique case number
    year = time.strftime('%Y')
    count = len([k for k in CASE_STORE if k.startswith(f'CR-{year}')]) + 1
    case_number = f"CR-{year}-{str(count).zfill(3)}"
    
    case = {
        "case_number": case_number,
        "title": data['title'],
        "incident_type": data['incident_type'],
        "description": data['description'],
        "location": data['location'],
        "incident_date": data['incident_date'],
        "complainant": data['complainant'],
        "accused": data.get('accused', 'Unknown'),
        "fir_number": f"FIR/{year}/RC/{str(random.randint(1000,9999))}",
        "investigating_officer": request.current_user['display_name'] + ' (' + request.current_user['badge'] + ')',
        "status": "FIR Registered",
        "created_at": int(time.time()),
        "created_by": request.current_user['username'],
        "evidence_list": [],
        "case_diary": []
    }
    CASE_STORE[case_number] = case
    print(f"[CASE] Created {case_number} by {request.current_user['username']}")
    return jsonify({"status": "created", "case": case}), 201


@app.route('/api/cases/<case_number>', methods=['GET'])
@require_role('officer', 'forensic', 'judge', 'developer')
def get_case(case_number):
    """Get full case details by case number."""
    case = CASE_STORE.get(case_number)
    if not case:
        return jsonify({"error": f"Case '{case_number}' not found."}), 404
    return jsonify(case)


@app.route('/api/cases/<case_number>/evidence', methods=['POST'])
@require_role('officer', 'forensic')
def attach_case_evidence(case_number):
    """Officer or Forensic analyst attaches evidence (with file) to an existing case."""
    case = CASE_STORE.get(case_number)
    if not case:
        return jsonify({"error": f"Case '{case_number}' not found."}), 404
    
    description = request.form.get('description', 'Evidence item')
    evidence_type = request.form.get('evidence_type', 'document')
    
    if 'file' not in request.files:
        return jsonify({"error": "No file provided."}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400
    
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    
    try:
        if evidence_type == 'photo':
            forensic_result = ai_engine.analyze_photo_evidence(filepath)
        else:
            forensic_result = ai_engine.analyze_image(filepath)
        
        sha256 = ai_engine.compute_sha256(filepath)
        ipfs_hash = ai_engine.upload_to_ipfs(filepath)
        
        ev_count = len(case['evidence_list']) + 1
        evidence_item = {
            "evidence_id": f"EV-{str(ev_count).zfill(3)}",
            "filename": file.filename,
            "type": evidence_type,
            "description": description,
            "submitted_by": request.current_user['username'],
            "submitted_by_name": request.current_user['display_name'],
            "submitted_at": int(time.time()),
            "sha256": sha256,
            "ipfs_hash": ipfs_hash,
            "forensic_result": forensic_result,
            "measurements": request.form.get('measurements'),
            "physical_objects": request.form.get('physical_objects'),
            "branch_of": request.form.get('branch_of')
        }
        case['evidence_list'].append(evidence_item)
        case['status'] = 'Under Investigation'
        print(f"[CASE] Evidence {evidence_item['evidence_id']} attached to {case_number}")
        return jsonify({"status": "attached", "evidence": evidence_item}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/cases/<case_number>/analyze', methods=['GET'])
@require_role('judge')
def judicial_case_analysis(case_number):
    """Judge requests full AI case intelligence report for a case number."""
    case = CASE_STORE.get(case_number)
    if not case:
        return jsonify({"error": f"Case '{case_number}' not found."}), 404
    
    evidence_list = case.get('evidence_list', [])
    
    # --- Collect all forensic sections and severities ---
    all_sections = []
    all_elements = []
    severity_scores = []
    severity_map_num = {"Critical": 4, "High": 3, "Moderate": 2, "Standard": 1, "Unknown": 0}
    
    for ev in evidence_list:
        fr = ev.get('forensic_result', {})
        # Photo evidence
        sections = fr.get('applicable_sections', [])
        elements = fr.get('detected_elements', [])
        severity = fr.get('severity', 'Unknown')
        # Document evidence trust
        id_score = fr.get('identity_verification', {}).get('identity_score_pct', 0) if isinstance(fr.get('identity_verification'), dict) else 0
        
        all_sections.extend(sections)
        all_elements.extend(elements)
        if severity in severity_map_num:
            severity_scores.append(severity_map_num[severity])
    
    # --- BNS/IPC section lookup from incident description ---
    full_text = f"""{case['title']} {case['description']} {case['incident_type']} {' '.join(all_elements)}"""
    try:
        nlp_result = ai_engine.navigate_legal_query(full_text)
    except Exception:
        nlp_result = {"status": "no_match"}
    
    # --- Crime probability based on evidence strength ---
    evidence_score = min(len(evidence_list) * 20, 60)  # Each piece adds 20%, cap at 60%
    section_score = min(len(set(all_sections)) * 5, 20)  # Each unique section adds 5%
    severity_avg = (sum(severity_scores) / len(severity_scores) / 4 * 20) if severity_scores else 0  # 20% from severity
    crime_probability = round(min(evidence_score + section_score + severity_avg, 97), 1)
    
    # --- Top BNS/IPC matches ---
    applicable_laws = []
    if nlp_result.get('status') == 'match_found':
        pm = nlp_result['primary_match']
        applicable_laws.append({
            "title": pm['title'],
            "bns_section": pm['bns_section'],
            "ipc_section": pm['ipc_section'],
            "punishment": pm['punishment'],
            "score": pm['relevance_score'],
            "type": "Primary Match"
        })
        for rs in nlp_result.get('related_sections', [])[:4]:
            applicable_laws.append({
                "title": rs['title'],
                "bns_section": rs['bns_section'],
                "ipc_section": rs['ipc_section'],
                "punishment": "As per court discretion",
                "score": 0,
                "type": "Related Section"
            })
    
    # Add forensic-detected sections
    forensic_laws_seen = set()
    for s in set(all_sections):
        if s not in forensic_laws_seen:
            applicable_laws.append({"title": s, "bns_section": s, "ipc_section": "—", "punishment": "As determined by court", "score": 0, "type": "Forensic Evidence"})
            forensic_laws_seen.add(s)
    
    # De-duplicate by keeping unique titles
    seen_titles = set()
    unique_laws = []
    for law in applicable_laws:
        if law['title'] not in seen_titles:
            unique_laws.append(law)
            seen_titles.add(law['title'])
    
    # --- Probability label ---
    if crime_probability >= 80:
        prob_label = "Very High"
        prob_color = "red"
        recommendation = "The evidence strongly supports a prima facie case. The court may consider framing formal charges."
    elif crime_probability >= 60:
        prob_label = "High"
        prob_color = "orange"
        recommendation = "Significant evidence exists. Further forensic corroboration recommended before framing charges."
    elif crime_probability >= 40:
        prob_label = "Moderate"
        prob_color = "yellow"
        recommendation = "Circumstantial evidence noted. Investigation should be deepened before judicial proceedings."
    else:
        prob_label = "Low"
        prob_color = "green"
        recommendation = "Insufficient evidence for charges at this stage. The matter requires further investigation."
    
    report = {
        "case_number": case_number,
        "case_details": case,
        "total_evidence": len(evidence_list),
        "crime_probability": crime_probability,
        "probability_label": prob_label,
        "probability_color": prob_color,
        "judicial_recommendation": recommendation,
        "applicable_laws": unique_laws[:10],
        "forensic_elements_detected": list(set(all_elements)),
        "ai_defenses": nlp_result.get('available_defenses', []),
        "ai_procedures": nlp_result.get('procedures', []),
        "generated_at": int(time.time()),
        "generated_by": request.current_user['display_name']
    }
    return jsonify(report)


# ============================================================
# SYSTEM MONITORING: FEEDBACK & EVENTS (Developer Only)
# ============================================================

@app.route('/api/feedback', methods=['POST'])
@require_role('officer', 'judge', 'citizen', 'developer', 'anonymous')
def submit_feedback():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Feedback text required."}), 400
    
    # Handle anonymous or logged in
    user_role = 'anonymous'
    username = 'Public User'
    if hasattr(request, 'current_user'):
        user_role = request.current_user['role']
        username = request.current_user['username']

    fb = {
        "id": f"FB-{str(len(FEEDBACK_STORE) + 1).zfill(3)}",
        "role": user_role,
        "user": username,
        "text": data['text'],
        "timestamp": int(time.time())
    }
    FEEDBACK_STORE.append(fb)
    return jsonify({"status": "success", "message": "Feedback submitted to developers.", "feedback": fb})

@app.route('/api/system/feedback', methods=['GET'])
@require_role('developer')
def get_feedbacks():
    return jsonify(FEEDBACK_STORE)

@app.route('/api/system/events', methods=['GET'])
@require_role('developer')
def get_system_events():
    return jsonify(SYSTEM_EVENTS)

@app.route('/api/system/simulate_threat', methods=['POST'])
@require_role('developer')
def simulate_threat():
    threat = {
        "id": f"TH-{str(len(SYSTEM_EVENTS) + 1).zfill(3)}",
        "level": "Critical",
        "type": "Integrity",
        "message": f"Simulated unauthorized access attempt detected from IP {request.remote_addr}",
        "timestamp": int(time.time())
    }
    SYSTEM_EVENTS.insert(0, threat)
    return jsonify({"status": "threat_simulated", "event": threat})


@app.route('/api/system/maintenance', methods=['POST'])
@require_role('developer')
def system_maintenance():
    """
    Developer Maintenance Interface.
    Allows low-level system hygiene without data access.
    """
    global SYSTEM_EVENTS, FEEDBACK_STORE
    data = request.get_json()
    action = data.get('action')
    
    # Simulate different maintenance operations
    if action == 'clear_temp':
        # Logic to clean /uploads folder of old temp files
        files = os.listdir(UPLOAD_FOLDER)
        # Check against CASE_STORE to find orphans
        active_hashes = []
        for case in CASE_STORE.values():
            for ev in case.get('evidence_list', []):
                active_hashes.append(ev.get('sha256'))
        
        # In a real app we'd delete orphans here. For demo we simulate:
        time.sleep(1)
        return jsonify({
            "status": "success",
            "message": f"Sanitization complete. Analyzed {len(files)} files. 0 orphan records found.",
            "timestamp": int(time.time())
        })
    
    elif action == 'db_verify':
        # Check SQLAlchemy database integrity
        try:
            with app.app_context():
                User.query.limit(1).all() # Simple ping
            return jsonify({
                "status": "success",
                "message": "Database integrity verified. SQLAlchemy 'vault.db' state is healthy.",
                "timestamp": int(time.time())
            })
        except Exception as e:
            return jsonify({"status": "error", "message": f"DB verification failed: {str(e)}"}), 500
            
    elif action == 'rotate_keys':
        # Logic to invalidate stale tokens
        return jsonify({
            "status": "success", 
            "message": "Session secret keys rotated. All active tokens remain valid for 24h.",
            "timestamp": int(time.time())
        })
    
    elif action == 'mitigate_threats':
        # Simulated mitigation
        count = len([e for e in SYSTEM_EVENTS if e['level'] == 'Critical'])
        # Clear critical threats in demo
        SYSTEM_EVENTS = [e for e in SYSTEM_EVENTS if e['level'] != 'Critical']
        return jsonify({
            "status": "success", 
            "message": f"Mitigation sequence complete. Neutralized {count} critical integrity alerts.",
            "timestamp": int(time.time())
        })
    
    return jsonify({"error": "Invalid maintenance action specified."}), 400


@app.route('/api/cases/<case_number>/diary', methods=['POST'])
@require_role('officer')
def add_diary_entry(case_number):
    if case_number not in CASE_STORE:
        return jsonify({"error": "Case not found"}), 404
    
    data = request.get_json()
    entry = {
        "date": data.get('date'),
        "time": data.get('time'),
        "location": data.get('location'),
        "findings": data.get('findings', ''),
        "officer": request.current_user['display_name'],
        "timestamp": int(time.time())
    }
    
    if 'case_diary' not in CASE_STORE[case_number]:
        CASE_STORE[case_number]['case_diary'] = []
    
    CASE_STORE[case_number]['case_diary'].append(entry)
    return jsonify({"status": "success", "entry": entry})


@app.route('/api/cases/<case_number>/judgment', methods=['POST'])
@require_role('judge')
def submit_judgment(case_number):
    if case_number not in CASE_STORE:
        return jsonify({"error": "Case not found"}), 404
    
    data = request.get_json()
    judgment_text = data.get('judgment')
    
    if not judgment_text:
        return jsonify({"error": "Judgment text is required."}), 400
        
    CASE_STORE[case_number]['final_judgment'] = {
        "text": judgment_text,
        "judge": request.current_user['display_name'],
        "timestamp": int(time.time())
    }
    CASE_STORE[case_number]['status'] = "Closed / Judgment Delivered"
    
    return jsonify({"status": "success", "message": "Final judgment recorded on ledger."})


if __name__ == '__main__':
    print("\n  === SECURE LEGAL VAULT // RBAC ENGINE ===")
    print("  Demo Credentials (all pw: secure2026):")
    print("    officer_vault   | forensic_lab")
    print("    honorable_justice | citizen_view | dev_support")
    print("  =========================================\n")
    # For local development outside of production gunicorn
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
