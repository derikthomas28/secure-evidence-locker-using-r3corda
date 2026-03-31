import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus, FileText, Upload, CheckCircle, AlertTriangle,
    Activity, Search, MapPin, Calendar, User, Hash, FolderOpen, Lock
} from 'lucide-react';

const API_AI_URL = "http://127.0.0.1:5000";

const INCIDENT_TYPES = [
    { value: 'robbery', label: 'Robbery / Snatching' },
    { value: 'theft', label: 'Theft / Burglary' },
    { value: 'assault', label: 'Physical Assault' },
    { value: 'murder', label: 'Murder / Homicide' },
    { value: 'cheating', label: 'Cheating / Fraud' },
    { value: 'stalking', label: 'Stalking / Harassment' },
    { value: 'drug', label: 'Narcotics / Drugs' },
    { value: 'domestic', label: 'Domestic Violence' },
    { value: 'property', label: 'Property / Land Dispute' },
    { value: 'cybercrime', label: 'Cyber Crime' },
    { value: 'other', label: 'Other' },
];

const STATUS_COLORS = {
    registered: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    investigation: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};
function statusClass(status = '') {
    if (status.toLowerCase().includes('fir') || status.toLowerCase().includes('register'))
        return STATUS_COLORS.registered;
    return STATUS_COLORS.investigation;
}

// ── Step 1: Search & pick a case ────────────────────────────────────────────
function CaseSearch({ cases, onSelect }) {
    const [q, setQ] = useState('');
    const filtered = cases.filter(c =>
        c.case_number.toLowerCase().includes(q.toLowerCase()) ||
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        (c.fir_number || '').toLowerCase().includes(q.toLowerCase())
    );
    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Search by case number, title, or FIR..."
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/40"
                    autoFocus
                />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filtered.length === 0 ? (
                    <p className="text-center text-slate-600 text-xs font-bold uppercase tracking-widest py-8">No cases found</p>
                ) : filtered.map(c => (
                    <button key={c.case_number} onClick={() => onSelect(c.case_number)}
                        className="w-full text-left p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-blue-500/30 hover:bg-slate-900/70 transition-all">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{c.case_number}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${statusClass(c.status)}`}>{c.status}</span>
                        </div>
                        <p className="text-xs font-bold text-white leading-tight">{c.title}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-bold mt-1">
                            {c.fir_number} · {c.evidence_count} evidence item(s)
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ── Step 2: Upload evidence for the selected case ────────────────────────────
function EvidenceUpload({ caseDetail, authHeaders, handleLogout, onDone }) {
    const [file, setFile] = useState(null);
    const [desc, setDesc] = useState('');
    const [evType, setEvType] = useState('document');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const submit = async () => {
        setError(''); setSuccess('');
        if (!file) { setError('Please select a file.'); return; }
        if (!desc.trim()) { setError('Please enter a description for this evidence.'); return; }

        setIsSubmitting(true);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('description', desc);
        fd.append('evidence_type', evType);
        try {
            await axios.post(`${API_AI_URL}/api/cases/${caseDetail.case_number}/evidence`, fd, {
                headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() }
            });
            setSuccess(`Evidence attached to ${caseDetail.case_number} successfully!`);
            setFile(null); setDesc('');
            document.getElementById('evFileInput').value = '';
            setTimeout(onDone, 1500);
        } catch (err) {
            if (err.response?.status === 401) { handleLogout(); return; }
            setError(err.response?.data?.error || err.message);
        } finally { setIsSubmitting(false); }
    };

    return (
        <div className="space-y-5">
            {/* Locked case header */}
            <div className="flex items-center space-x-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <FolderOpen className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Uploading to</p>
                    <p className="text-sm font-black text-white truncate">{caseDetail.case_number} — {caseDetail.title}</p>
                    <p className="text-[9px] text-slate-500 font-bold">{caseDetail.fir_number}</p>
                </div>
                <Lock className="w-4 h-4 text-slate-600 flex-shrink-0" />
            </div>

            {/* Evidence type toggle */}
            <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Evidence Type</label>
                <div className="flex space-x-3">
                    {[{ v: 'photo', l: '📷 Crime Scene Photo' }, { v: 'document', l: '📄 Document / Report' }].map(t => (
                        <button key={t.v} onClick={() => setEvType(t.v)}
                            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${evType === t.v ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-slate-900 border border-white/10 text-slate-500 hover:text-white'}`}>
                            {t.l}
                        </button>
                    ))}
                </div>
            </div>

            {/* File picker */}
            <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Evidence File *</label>
                <div onClick={() => document.getElementById('evFileInput').click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${file ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 hover:border-purple-500/30'}`}>
                    <input type="file" id="evFileInput" className="hidden"
                        onChange={e => { setFile(e.target.files[0]); setError(''); }} />
                    <Upload className={`w-8 h-8 mx-auto mb-2 ${file ? 'text-purple-400' : 'text-slate-600'}`} />
                    <p className="text-sm font-bold text-white">{file ? file.name : 'Click to Select File'}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Images, PDFs, Docs accepted</p>
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Description *</label>
                <input value={desc} onChange={e => { setDesc(e.target.value); setError(''); }}
                    placeholder="e.g., CCTV grab showing accused at Gate 3, Witness statement by Mr. Verma..."
                    className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-purple-500/50" />
            </div>

            {/* Feedback */}
            {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {success}
                </div>
            )}

            <button onClick={submit} disabled={isSubmitting}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-purple-500/20">
                {isSubmitting ? <Activity className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                <span>{isSubmitting ? 'Running AI Analysis & Attaching...' : 'Attach Evidence to Case'}</span>
            </button>

            <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest flex items-center justify-center space-x-2">
                <Lock className="w-3 h-3" />
                <span>Evidence is immutable once attached. No deletion or modification permitted.</span>
            </p>
        </div>
    );
}

// ── FIR Filing Form ──────────────────────────────────────────────────────────
function FIRForm({ authHeaders, handleLogout, onCreated }) {
    const [form, setForm] = useState({
        title: '', incident_type: 'robbery', description: '',
        location: '', incident_date: new Date().toISOString().split('T')[0],
        complainant: '', accused: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const submit = async () => {
        setError(''); setSuccess('');
        const required = ['title', 'description', 'location', 'incident_date', 'complainant'];
        for (const f of required) {
            if (!form[f]?.trim()) { setError(`'${f.replace('_', ' ')}' is required.`); return; }
        }
        setIsSubmitting(true);
        try {
            const res = await axios.post(`${API_AI_URL}/api/cases/create`, form, { headers: authHeaders() });
            setSuccess(`FIR Registered! Case Number: ${res.data.case.case_number}`);
            setForm({ title: '', incident_type: 'robbery', description: '', location: '', incident_date: new Date().toISOString().split('T')[0], complainant: '', accused: '' });
            setTimeout(onCreated, 1500);
        } catch (err) {
            if (err.response?.status === 401) { handleLogout(); return; }
            setError(err.response?.data?.error || err.message);
        } finally { setIsSubmitting(false); }
    };

    const Field = ({ label, children }) => (
        <div>
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</label>
            {children}
        </div>
    );
    const inputCls = "w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50";

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
                <Field label="Case Title *">
                    <input value={form.title} onChange={e => { set('title', e.target.value); setError(''); }}
                        placeholder="e.g., Armed Robbery at City Mall" className={`${inputCls} col-span-2`} />
                </Field>
                <Field label="Incident Type *">
                    <select value={form.incident_type} onChange={e => set('incident_type', e.target.value)}
                        className={inputCls}>
                        {INCIDENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                </Field>
                <Field label="Incident Date *">
                    <input type="date" value={form.incident_date} onChange={e => set('incident_date', e.target.value)}
                        className={inputCls} />
                </Field>
                <Field label="Complainant *">
                    <input value={form.complainant} onChange={e => { set('complainant', e.target.value); setError(''); }}
                        placeholder="Full name" className={inputCls} />
                </Field>
                <Field label="Accused (if known)">
                    <input value={form.accused} onChange={e => set('accused', e.target.value)}
                        placeholder="Name or description" className={inputCls} />
                </Field>
            </div>
            <Field label="Location *">
                <input value={form.location} onChange={e => { set('location', e.target.value); setError(''); }}
                    placeholder="Exact location of incident" className={inputCls} />
            </Field>
            <Field label="Incident Description *">
                <textarea value={form.description} onChange={e => { set('description', e.target.value); setError(''); }}
                    rows={4} placeholder="Describe the incident in detail..."
                    className={`${inputCls} resize-none`} />
            </Field>

            {error && (
                <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
                </div>
            )}
            {success && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {success}
                </div>
            )}

            <button onClick={submit} disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20">
                {isSubmitting ? <Activity className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
                <span>{isSubmitting ? 'Registering FIR...' : 'Register FIR & Create Case'}</span>
            </button>
        </div>
    );
}

// ── Main CaseFiling component ────────────────────────────────────────────────
export default function CaseFiling({ authHeaders, handleLogout, role }) {
    // view: 'list' | 'fir' | 'search' | 'upload'
    const [view, setView] = useState('list');
    const [cases, setCases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCase, setSelectedCase] = useState(null);

    useEffect(() => { fetchCases(); }, []);

    const fetchCases = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_AI_URL}/api/cases`, { headers: authHeaders() });
            setCases(res.data);
        } catch (err) {
            if (err.response?.status === 401) handleLogout();
        } finally { setIsLoading(false); }
    };

    const handleCaseSelect = async (caseNum) => {
        try {
            const res = await axios.get(`${API_AI_URL}/api/cases/${caseNum}`, { headers: authHeaders() });
            setSelectedCase(res.data);
            setView('upload');
        } catch (err) {
            if (err.response?.status === 401) handleLogout();
        }
    };

    const goBack = () => { setSelectedCase(null); setView('list'); fetchCases(); };

    // ── Navigation bar ──
    const NavBar = () => (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-[1000] text-white tracking-tighter uppercase">
                    Case <span className="text-blue-500">Registry</span>
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    {role === 'officer' ? 'File FIR & Attach Field Evidence' : 'Attach Forensic Evidence to Cases'}
                </p>
            </div>
            <div className="flex space-x-3">
                {(view === 'search' || view === 'upload' || view === 'fir') && (
                    <button onClick={goBack}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl transition-all">
                        ← Back
                    </button>
                )}
                {view === 'list' && role === 'officer' && (
                    <button onClick={() => setView('fir')}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-blue-500/20">
                        <Plus className="w-4 h-4" /><span>File FIR</span>
                    </button>
                )}
                {view === 'list' && (
                    <button onClick={() => setView('search')}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-purple-500/20">
                        <Upload className="w-4 h-4" /><span>Upload Evidence</span>
                    </button>
                )}
            </div>
        </div>
    );

    // ── Case list view ──
    const CaseList = () => (
        <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Cases ({cases.length})</p>
            {isLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-slate-900/40 rounded-xl animate-pulse" />)
            ) : cases.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center border-white/5">
                    <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm font-bold uppercase">No cases filed yet.</p>
                    {role === 'officer' && <p className="text-slate-600 text-xs mt-1">Click "File FIR" to begin.</p>}
                </div>
            ) : cases.map(c => (
                <div key={c.case_number}
                    className="glass-card rounded-2xl p-5 border-white/5 flex items-center justify-between hover:border-blue-500/10 transition-all">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <span className="text-[10px] font-black text-blue-400">{c.case_number}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${statusClass(c.status)}`}>{c.status}</span>
                        </div>
                        <p className="text-sm font-bold text-white">{c.title}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-bold mt-1">{c.fir_number} · {c.evidence_count} evidence item(s)</p>
                    </div>
                    <button onClick={() => handleCaseSelect(c.case_number)}
                        className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-600/40 transition-all flex items-center space-x-1.5">
                        <Upload className="w-3 h-3" /><span>Attach Evidence</span>
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <NavBar />

            {/* FIR Form */}
            {view === 'fir' && (
                <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                    <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center">
                        <FileText className="w-4 h-4 mr-2" /> New FIR Registration
                    </h2>
                    <FIRForm authHeaders={authHeaders} handleLogout={handleLogout} onCreated={goBack} />
                </div>
            )}

            {/* Step 1: Search case */}
            {view === 'search' && (
                <div className="glass-card rounded-3xl p-8 border-purple-500/10">
                    <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-6 flex items-center">
                        <Search className="w-4 h-4 mr-2" /> Step 1 — Search &amp; Select Case
                    </h2>
                    <CaseSearch cases={cases} onSelect={handleCaseSelect} />
                </div>
            )}

            {/* Step 2: Upload evidence */}
            {view === 'upload' && selectedCase && (
                <div className="glass-card rounded-3xl p-8 border-purple-500/10">
                    <h2 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-6 flex items-center">
                        <Upload className="w-4 h-4 mr-2" /> Step 2 — Attach Evidence
                    </h2>
                    <EvidenceUpload
                        caseDetail={selectedCase}
                        authHeaders={authHeaders}
                        handleLogout={handleLogout}
                        onDone={goBack}
                    />
                </div>
            )}

            {/* Case list */}
            {view === 'list' && <CaseList />}
        </div>
    );
}
