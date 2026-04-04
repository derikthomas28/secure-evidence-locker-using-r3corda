import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, Shield, FileText, AlertTriangle, CheckCircle, Activity,
    Hash, Clock, User, MapPin, Calendar, Scale, Gavel, Eye,
    ChevronDown, ChevronUp, Cpu, BarChart3, BookOpen, Terminal, Zap, Lock
} from 'lucide-react';

const API_AI_URL = "http://127.0.0.1:5000";

function ProbabilityMeter({ value, label, color }) {
    const colorMap = {
        red: { bar: 'bg-red-500', glow: 'shadow-red-500/50', text: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
        orange: { bar: 'bg-orange-500', glow: 'shadow-orange-500/50', text: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
        yellow: { bar: 'bg-yellow-500', glow: 'shadow-yellow-500/50', text: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10' },
        green: { bar: 'bg-emerald-500', glow: 'shadow-emerald-500/50', text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    };
    const c = colorMap[color] || colorMap.yellow;
    return (
        <div className={`rounded-2xl p-6 border ${c.border} ${c.bg}`}>
            <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crime Probability Index</span>
                <span className={`text-3xl font-[1000] ${c.text}`}>{value}%</span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
                <div className={`h-full ${c.bar} shadow-lg ${c.glow} rounded-full transition-all duration-1000 relative z-10`} style={{ width: `${value}%` }}>
                    <div className="absolute inset-0 bg-white/10 animate-shimmer bg-[length:200%_100%]"></div>
                </div>
                <div className="absolute inset-0 bg-slate-900/50 [background-image:linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.03)_25%,rgba(255,255,255,0.03)_26%,transparent_27%)] bg-[length:40px_100%]"></div>
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Insufficient</span>
                <span className={`text-[10px] font-black ${c.text} uppercase tracking-widest`}>{label}</span>
                <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Prima Facie</span>
            </div>
        </div>
    );
}

function EvidenceCard({ ev, index }) {
    const [open, setOpen] = useState(false);
    const fr = ev.forensic_result || {};
    const isPhoto = ev.type === 'photo';
    const severity = fr.severity || fr.trust_label || 'Standard';
    const sevColor = severity === 'Critical' ? 'text-red-400 bg-red-500/10 border-red-500/30'
        : severity === 'High' ? 'text-orange-400 bg-orange-500/10 border-orange-500/30'
        : severity === 'Good' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        : 'text-blue-400 bg-blue-500/10 border-blue-500/30';

    return (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full p-5 flex items-center justify-between hover:bg-white/3 transition-all text-left">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                        <span className="text-[10px] font-black text-blue-400">{ev.evidence_id || `EV-${String(index+1).padStart(3,'0')}`}</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{ev.description || ev.filename || 'Evidence Item'}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">
                            {isPhoto ? '📷 Photo Evidence' : '📄 Document'} · Submitted by {ev.submitted_by_name || ev.submitted_by}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${sevColor}`}>{severity}</span>
                    {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
            </button>
            {open && (
                <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4">
                    {ev.sha256 && (
                        <div className="flex items-center space-x-3 p-3 bg-slate-950/60 rounded-xl">
                            <Hash className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <div>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">SHA-256 Hash</p>
                                <p className="text-[10px] font-mono text-slate-400 break-all">{ev.sha256}</p>
                            </div>
                        </div>
                    )}
                    {ev.measurements && (
                        <div className="p-3 bg-slate-950/60 rounded-xl">
                            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">Scientific Measurements</p>
                            <p className="text-xs text-white font-bold">{ev.measurements}</p>
                        </div>
                    )}
                    {ev.physical_objects && (
                        <div className="p-3 bg-slate-950/60 rounded-xl">
                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Physical Evidence Count</p>
                            <p className="text-xs text-white font-bold">{ev.physical_objects}</p>
                        </div>
                    )}
                    {ev.branch_of && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                                <Activity className="w-3 h-3 text-amber-400" />
                                <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Corrective Branch</p>
                            </div>
                            <p className="text-[10px] text-amber-200/70 font-medium italic">
                                This entry corrects/updates previous evidence: <span className="font-mono text-amber-400">{ev.branch_of}</span>
                            </p>
                        </div>
                    )}
                    {isPhoto && fr.scene_classification && (
                        <div className="p-3 bg-slate-950/60 rounded-xl">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">AI Scene Classification</p>
                            <p className="text-sm text-white font-bold">{fr.scene_classification}</p>
                        </div>
                    )}
                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                        Submitted: {new Date(ev.submitted_at * 1000).toLocaleString()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CaseIntelligence({ authHeaders, handleLogout }) {
    const [cases, setCases] = useState([]);
    const [selectedCase, setSelectedCase] = useState(null);
    const [caseReport, setCaseReport] = useState(null);
    const [isLoadingCases, setIsLoadingCases] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [judgmentText, setJudgmentText] = useState('');
    const [isSubmittingJudgment, setIsSubmittingJudgment] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchCases(); }, []);

    const fetchCases = async () => {
        setIsLoadingCases(true);
        try {
            const res = await axios.get(`${API_AI_URL}/api/cases`, { headers: authHeaders() });
            setCases(res.data);
        } catch (err) {
            if (err.response?.status === 401) { handleLogout(); return; }
            setError('Failed to load cases');
        } finally { setIsLoadingCases(false); }
    };

    const openCase = async (caseNum) => {
        setError(''); setSuccess(''); setJudgmentText('');
        setCaseReport(null);
        setIsAnalyzing(true);
        try {
            const [caseRes, analysisRes] = await Promise.all([
                axios.get(`${API_AI_URL}/api/cases/${caseNum}`, { headers: authHeaders() }),
                axios.get(`${API_AI_URL}/api/cases/${caseNum}/analyze`, { headers: authHeaders() })
            ]);
            setSelectedCase(caseRes.data);
            setCaseReport(analysisRes.data);
            if (caseRes.data.final_judgment) setJudgmentText(caseRes.data.final_judgment);
        } catch (err) {
            if (err.response?.status === 401) { handleLogout(); return; }
            setError('Failed to fetch case data');
        } finally { setIsAnalyzing(false); }
    };

    const handleJudgmentSubmit = async () => {
        if (!judgmentText.trim()) return;
        setIsSubmittingJudgment(true);
        try {
            await axios.post(`${API_AI_URL}/api/cases/${selectedCase.case_number}/judgment`, 
                { judgment: judgmentText },
                { headers: authHeaders() }
            );
            setSuccess("Judgment Recorded. Case Sealed.");
            openCase(selectedCase.case_number);
        } catch (err) {
            setError("Judicial filing failed.");
        } finally { setIsSubmittingJudgment(false); }
    };

    const filteredCases = cases.filter(c =>
        c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fir_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusColor = (s) => s?.includes('Closed') ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' : 'text-blue-400 border-blue-500/20 bg-blue-500/10';

    return (
        <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-80 flex-shrink-0 flex flex-col space-y-4">
                <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase">Case <span className="text-blue-500">Intelligence</span></h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search case / FIR..." className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white" />
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {filteredCases.map(c => (
                        <button key={c.case_number} onClick={() => openCase(c.case_number)} className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCase?.case_number === c.case_number ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-slate-900/40 hover:border-blue-500/20'}`}>
                            <span className="text-[10px] font-black text-blue-400 uppercase">{c.case_number}</span>
                            <p className="text-xs font-bold text-white mt-1">{c.title}</p>
                            <span className={`mt-2 block w-max px-2 py-0.5 rounded text-[8px] font-black uppercase border ${statusColor(c.status)}`}>{c.status}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                {selectedCase && caseReport && (
                    <>
                        <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-[1000] text-white tracking-tighter">{selectedCase.title}</h2>
                                    <p className="text-blue-400 font-black text-[10px] uppercase mt-2 tracking-widest">{selectedCase.case_number} · FIR {selectedCase.fir_number}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl border font-black text-[9px] uppercase tracking-widest ${statusColor(selectedCase.status)}`}>{selectedCase.status}</div>
                            </div>
                        </div>

                        <ProbabilityMeter value={caseReport.crime_probability} label={caseReport.probability_label} color={caseReport.probability_color} />

                        <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center"><BookOpen className="w-3 h-3 mr-2" /> Field Investigation Diary</h3>
                            <div className="space-y-4">
                                {selectedCase.case_diary?.map((log, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center"><div className="w-2 h-2 rounded-full bg-blue-500" /><div className="w-0.5 flex-1 bg-white/5 my-1" /></div>
                                        <div className="pb-4">
                                            <p className="text-[9px] font-black text-slate-500 uppercase">{log.date} @ {log.time} · {log.location}</p>
                                            <p className="text-xs text-slate-300 font-medium">{log.findings}</p>
                                            <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">LOGGED BY OFFICER {log.officer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase flex items-center"><Terminal className="w-3 h-3 mr-2" /> Forensic Evidence Vault</h3>
                            <div className="space-y-3">
                                {selectedCase.evidence_list.map((ev, i) => <EvidenceCard key={i} ev={ev} index={i} />)}
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-8 border-amber-500/10 bg-amber-500/5">
                            <h3 className="text-[10px] font-black text-amber-400 uppercase mb-6 flex items-center tracking-widest"><Scale className="w-3 h-3 mr-2" /> Applicable Legal Framework (BNS/IPC)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {caseReport.applicable_laws?.map((law, i) => (
                                    <div key={i} className="p-4 bg-slate-950/60 rounded-xl border border-white/5 flex items-start space-x-3 group hover:border-amber-500/30 transition-all">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 font-black text-[9px] tracking-tighter min-w-[60px] text-center">
                                            {law.bns_section !== "—" ? `BNS ${law.bns_section}` : `IPC ${law.ipc_section}`}
                                        </div>
                                        <div>
                                            <p className="text-xs text-white font-bold mb-1">{law.title}</p>
                                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{law.punishment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-8 border-emerald-500/10 bg-emerald-500/5">
                            <h3 className="text-[10px] font-black text-emerald-400 uppercase mb-6 flex items-center tracking-widest"><Gavel className="w-4 h-4 mr-2" /> Final Judicial Verdict</h3>
                            {selectedCase.status?.includes('Closed') ? (
                                <div className="p-6 bg-slate-950/60 rounded-2xl border border-emerald-500/30">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Final Writ // Handed Down</p>
                                        <span className="text-[8px] font-mono text-slate-600">SIGNED BY JUSTICE {selectedCase.final_judgment?.judge}</span>
                                    </div>
                                    <p className="text-sm text-white font-serif leading-relaxed italic">"{selectedCase.final_judgment?.text}"</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <textarea value={judgmentText} onChange={e => setJudgmentText(e.target.value)} placeholder="Formulate the final judgment..." rows={5} className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 text-sm text-white placeholder-slate-800 focus:border-emerald-500/50" />
                                    <button onClick={handleJudgmentSubmit} disabled={isSubmittingJudgment} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2">
                                        {isSubmittingJudgment ? <Activity className="animate-spin w-4 h-4" /> : <Shield className="w-4 h-4" />} Finalize Verdict & Seal Ledger
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
