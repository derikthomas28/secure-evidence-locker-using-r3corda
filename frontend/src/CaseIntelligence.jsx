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
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full ${c.bar} shadow-lg ${c.glow} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
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
                    {isPhoto && fr.scene_classification && (
                        <div className="p-3 bg-slate-950/60 rounded-xl">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">AI Scene Classification</p>
                            <p className="text-sm text-white font-bold">{fr.scene_classification}</p>
                        </div>
                    )}
                    {fr.applicable_sections?.length > 0 && (
                        <div className="p-3 bg-slate-950/60 rounded-xl">
                            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">Sections Triggered by this Evidence</p>
                            <div className="flex flex-wrap gap-2">
                                {fr.applicable_sections.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-black text-amber-400">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {fr.detected_elements?.length > 0 && (
                        <div className="p-3 bg-slate-950/60 rounded-xl">
                            <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2">Detected Elements</p>
                            <div className="flex flex-wrap gap-2">
                                {fr.detected_elements.map((e, i) => (
                                    <span key={i} className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[10px] font-black text-purple-400">{e}</span>
                                ))}
                            </div>
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
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        setIsLoadingCases(true);
        try {
            const res = await axios.get(`${API_AI_URL}/api/cases`, { headers: authHeaders() });
            setCases(res.data);
        } catch (err) {
            if (err.response?.status === 401) { handleLogout(); return; }
            setError('Failed to load cases: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsLoadingCases(false);
        }
    };

    const openCase = async (caseNum) => {
        setError('');
        setCaseReport(null);
        setIsAnalyzing(true);
        try {
            const [caseRes, analysisRes] = await Promise.all([
                axios.get(`${API_AI_URL}/api/cases/${caseNum}`, { headers: authHeaders() }),
                axios.get(`${API_AI_URL}/api/cases/${caseNum}/analyze`, { headers: authHeaders() })
            ]);
            setSelectedCase(caseRes.data);
            setCaseReport(analysisRes.data);
        } catch (err) {
            if (err.response?.status === 401) { handleLogout(); return; }
            setError('Failed to load case intelligence: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const filteredCases = cases.filter(c =>
        c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fir_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusColor = (status) => {
        if (status?.includes('FIR')) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        if (status?.includes('Investigation')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        if (status?.includes('Closed')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        return 'text-slate-400 bg-slate-800 border-slate-700';
    };

    return (
        <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Left: Case List */}
            <div className="w-80 flex-shrink-0 flex flex-col space-y-4">
                <div>
                    <h1 className="text-3xl font-[1000] text-white tracking-tighter uppercase">
                        Case <span className="text-blue-500">Intelligence</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Judicial AI Docket</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search case / FIR..."
                        className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/40"
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    {isLoadingCases ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-20 bg-slate-900/40 rounded-xl animate-pulse" />
                        ))
                    ) : filteredCases.length === 0 ? (
                        <div className="text-center py-8 text-slate-600 text-xs font-bold uppercase tracking-widest">No cases found</div>
                    ) : filteredCases.map(c => (
                        <button key={c.case_number} onClick={() => openCase(c.case_number)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${selectedCase?.case_number === c.case_number ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5 bg-slate-900/40 hover:border-blue-500/20 hover:bg-slate-900/70'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{c.case_number}</span>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${statusColor(c.status)}`}>{c.status}</span>
                            </div>
                            <p className="text-xs font-bold text-white leading-tight mb-1">{c.title}</p>
                            <p className="text-[9px] text-slate-500 uppercase font-bold">{c.fir_number} · {c.evidence_count} Evidence</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Case Intelligence Report */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                {error && (
                    <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center mb-4">
                        <AlertTriangle className="w-4 h-4 mr-3" /> {error}
                    </div>
                )}

                {isAnalyzing && (
                    <div className="space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-24 bg-slate-900/40 rounded-2xl animate-pulse ring-1 ring-blue-500/10" />
                        ))}
                    </div>
                )}

                {!selectedCase && !isAnalyzing && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-24">
                        <div className="w-24 h-24 bg-slate-900/60 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                            <Gavel className="w-12 h-12 text-slate-700" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-600 uppercase tracking-tighter mb-2">Select a Case</h2>
                        <p className="text-xs text-slate-700 font-bold uppercase tracking-widest max-w-xs">Choose a case from the docket on the left to view the full AI Intelligence Report</p>
                    </div>
                )}

                {selectedCase && caseReport && !isAnalyzing && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-700">

                        {/* Header */}
                        <div className="glass-card rounded-3xl p-8 border-blue-500/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-5 p-6"><Scale className="w-40 h-40" /></div>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Judicial Intelligence Report</span>
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${statusColor(selectedCase.status)}`}>{selectedCase.status}</span>
                                    </div>
                                    <h2 className="text-3xl font-[1000] text-white tracking-tighter">{selectedCase.title}</h2>
                                    <p className="text-blue-400 font-black text-xs uppercase tracking-widest mt-1">{selectedCase.case_number} · {selectedCase.fir_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Generated by AI</p>
                                    <p className="text-[10px] text-slate-400 font-bold">{caseReport.generated_by}</p>
                                    <p className="text-[9px] text-slate-600 mt-1">{new Date(caseReport.generated_at * 1000).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Crime Probability Meter */}
                        <ProbabilityMeter
                            value={caseReport.crime_probability}
                            label={caseReport.probability_label}
                            color={caseReport.probability_color}
                        />

                        {/* Judicial Recommendation */}
                        <div className={`p-6 rounded-2xl border flex items-start space-x-4 ${
                            caseReport.probability_color === 'red' ? 'bg-red-950/20 border-red-500/30' :
                            caseReport.probability_color === 'orange' ? 'bg-orange-950/20 border-orange-500/30' :
                            'bg-blue-950/20 border-blue-500/30'
                        }`}>
                            <Gavel className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
                                caseReport.probability_color === 'red' ? 'text-red-400' :
                                caseReport.probability_color === 'orange' ? 'text-orange-400' : 'text-blue-400'
                            }`} />
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Judicial Recommendation</p>
                                <p className="text-sm text-white font-medium">{caseReport.judicial_recommendation}</p>
                            </div>
                        </div>

                        {/* Case Details Grid */}
                        <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center">
                                <FileText className="w-3 h-3 mr-2" /> FIR Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: User, label: 'Complainant', value: selectedCase.complainant },
                                    { icon: User, label: 'Accused', value: selectedCase.accused },
                                    { icon: MapPin, label: 'Location', value: selectedCase.location },
                                    { icon: Calendar, label: 'Incident Date', value: selectedCase.incident_date },
                                    { icon: Shield, label: 'Investigating Officer', value: selectedCase.investigating_officer },
                                    { icon: Hash, label: 'FIR Number', value: selectedCase.fir_number },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="p-4 bg-slate-950/60 rounded-xl border border-white/5">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <Icon className="w-3 h-3 text-slate-500" />
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
                                        </div>
                                        <p className="text-sm font-bold text-white">{value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-4 bg-slate-950/60 rounded-xl border border-white/5">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Incident Description</p>
                                <p className="text-sm text-slate-300 leading-relaxed">{selectedCase.description}</p>
                            </div>
                        </div>

                        {/* Applicable BNS/IPC Laws */}
                        <div className="glass-card rounded-3xl p-8 border-amber-500/10">
                            <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-6 flex items-center">
                                <Scale className="w-3 h-3 mr-2" /> Applicable BNS / IPC Sections & Punishments
                            </h3>
                            {caseReport.applicable_laws?.length > 0 ? (
                                <div className="space-y-3">
                                    {caseReport.applicable_laws.map((law, i) => (
                                        <div key={i} className="p-4 bg-slate-950/60 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        {law.type === 'Primary Match' && (
                                                            <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-black uppercase tracking-widest rounded">Primary</span>
                                                        )}
                                                        {law.type === 'Forensic Evidence' && (
                                                            <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-black uppercase tracking-widest rounded">Forensic</span>
                                                        )}
                                                        <p className="text-sm font-bold text-white">{law.title}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black rounded-lg">{law.bns_section}</span>
                                                        {law.ipc_section && law.ipc_section !== '—' && (
                                                            <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[9px] font-black rounded-lg">IPC: {law.ipc_section}</span>
                                                        )}
                                                    </div>
                                                    {law.punishment && law.punishment !== 'As determined by court' && (
                                                        <div className="flex items-start space-x-2">
                                                            <Lock className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />
                                                            <p className="text-[11px] text-red-300 font-bold">{law.punishment}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 text-sm text-center py-4">No specific sections identified. Add more evidence for a better analysis.</p>
                            )}
                        </div>

                        {/* Evidence Chain */}
                        <div className="glass-card rounded-3xl p-8 border-purple-500/10">
                            <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-6 flex items-center">
                                <Eye className="w-3 h-3 mr-2" /> Evidence Chain ({caseReport.total_evidence} Items)
                            </h3>
                            {selectedCase.evidence_list?.length > 0 ? (
                                <div className="space-y-3">
                                    {selectedCase.evidence_list.map((ev, i) => (
                                        <EvidenceCard key={ev.evidence_id || i} ev={ev} index={i} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-600 text-xs font-bold uppercase tracking-widest">
                                    No evidence submitted yet. Request the investigating officer to attach evidence.
                                </div>
                            )}
                        </div>

                        {/* Defenses & Procedures */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-card rounded-3xl p-6 border-blue-500/10">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center">
                                    <Shield className="w-3 h-3 mr-2" /> Potential Defense Arguments
                                </h4>
                                <ul className="space-y-3">
                                    {(caseReport.ai_defenses || []).map((d, i) => (
                                        <li key={i} className="flex items-start text-xs text-slate-300">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="glass-card rounded-3xl p-6 border-emerald-500/10">
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center">
                                    <BookOpen className="w-3 h-3 mr-2" /> Judicial Procedure Steps
                                </h4>
                                <ul className="space-y-3">
                                    {(caseReport.ai_procedures || []).map((p, i) => (
                                        <li key={i} className="flex items-start text-xs text-slate-300">
                                            <div className="w-5 h-5 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                                                <span className="text-[8px] font-black text-emerald-400">{i + 1}</span>
                                            </div>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 text-center">
                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                                ⚖️ This AI-generated judicial intelligence report is an analytical aid only. All legal decisions remain at the sole discretion of the presiding judge.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
