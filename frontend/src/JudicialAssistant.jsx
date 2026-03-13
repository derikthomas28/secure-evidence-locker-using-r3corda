import React, { useState } from 'react';
import axios from 'axios';
import {
    FileText, Activity, Cpu, Shield, AlertTriangle, CheckCircle,
    Upload, BookOpen, Scale, Users, Hash, Clock, Layers, Terminal
} from 'lucide-react';

const API_AI_URL = "http://localhost:5000";

export default function JudicialAssistant({ authHeaders, handleLogout }) {
    const [file, setFile] = useState(null);
    const [pastedText, setPastedText] = useState('');
    const [inputMode, setInputMode] = useState('file'); // 'file' or 'text'
    const [report, setReport] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setReport(null);
            setError('');
        }
    };

    const submitForSummary = async () => {
        setIsProcessing(true);
        setError('');
        setReport(null);

        try {
            let res;
            if (inputMode === 'file' && file) {
                const formData = new FormData();
                formData.append('file', file);
                res = await axios.post(`${API_AI_URL}/api/judicial/summarize`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', ...authHeaders() }
                });
            } else if (inputMode === 'text' && pastedText.trim()) {
                res = await axios.post(`${API_AI_URL}/api/judicial/summarize`, {
                    text: pastedText,
                    filename: 'Pasted Case Document'
                }, {
                    headers: authHeaders()
                });
            } else {
                setError('Please provide a case document or paste case text.');
                setIsProcessing(false);
                return;
            }
            setReport(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
                alert("Session expired. Please log in again.");
                return;
            }
            setError('AI Judicial Engine Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] neon-border-blue">
                    <Scale className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                        Judicial <span className="text-blue-500 neon-text-blue">Bench</span> AI
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Neural summarization for accelerated judicial decision-making.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Input Panel */}
                <div className="glass-card rounded-3xl p-10 border-blue-500/10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>

                    <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center">
                        <Terminal className="w-4 h-4 mr-3 text-blue-500" /> Evidence Ingest // Buffer-01
                    </h2>

                    {/* Toggle: File vs Text */}
                    <div className="bg-slate-950/80 rounded-xl p-1 flex border border-white/5 mb-8">
                        <button onClick={() => setInputMode('file')}
                            className={`flex-1 py-2 px-3 text-[10px] font-black rounded-lg transition-all flex items-center justify-center space-x-2 ${inputMode === 'file' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            <Upload className="w-3 h-3" /><span>DOC UPLOAD</span>
                        </button>
                        <button onClick={() => setInputMode('text')}
                            className={`flex-1 py-2 px-3 text-[10px] font-black rounded-lg transition-all flex items-center justify-center space-x-2 ${inputMode === 'text' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            <FileText className="w-3 h-3" /><span>PASTE TEXT</span>
                        </button>
                    </div>

                    {inputMode === 'file' ? (
                        <div className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${file ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/30'}`}
                            onClick={() => document.getElementById('judicialFileInput').click()}>
                            <input type="file" id="judicialFileInput" className="hidden" accept=".txt,.doc,.docx,.pdf" onChange={handleFileChange} />
                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all ${file ? 'bg-blue-600 shadow-2xl shadow-blue-500/40' : 'bg-slate-950 ring-1 ring-white/10'}`}>
                                <FileText className={`w-8 h-8 ${file ? 'text-white' : 'text-slate-600'}`} />
                            </div>
                            <h3 className="text-xl font-black mb-2">{file ? file.name : 'Ingest Primary Case Data'}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">{file ? 'Neural Buffer Ready' : 'Supports FIR, Charge Sheet, Statements'}</p>
                        </div>
                    ) : (
                        <textarea
                            value={pastedText}
                            onChange={(e) => setPastedText(e.target.value)}
                            placeholder="Paste neural data for judicial processing..."
                            className="w-full h-64 bg-slate-950/80 border border-blue-500/10 rounded-2xl p-6 text-sm text-blue-300 font-mono resize-none focus:outline-none focus:border-blue-500/40 placeholder-slate-700"
                        />
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-3 flex-shrink-0" /> {error}
                        </div>
                    )}

                    <button onClick={submitForSummary} disabled={isProcessing}
                        className="primary-glow-btn w-full mt-8 flex items-center justify-center">
                        {isProcessing ? <Activity className="animate-spin mr-3" /> : <Cpu className="mr-3 w-4 h-4" />}
                        {isProcessing ? "Synthesizing Neural Summary..." : "Execute Bench Analysis"}
                    </button>
                </div>

                {/* Right: Results Panel */}
                <div className="flex flex-col justify-start min-h-[500px]">
                    {!report && !isProcessing && (
                        <div className="glass-card rounded-3xl p-16 text-center border-dashed border-white/5 h-full flex flex-col items-center justify-center">
                            <Terminal className="w-16 h-16 text-slate-800 mx-auto mb-8 animate-pulse" />
                            <h3 className="text-2xl font-black text-slate-600 mb-4 uppercase tracking-tighter">Awaiting Signal</h3>
                            <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium uppercase tracking-widest leading-relaxed">Neural engine idle. Ingest case data to proceed with bench summarization.</p>
                        </div>
                    )}

                    {isProcessing && (
                        <div className="space-y-6">
                            <div className="h-24 bg-slate-900/40 rounded-2xl animate-pulse ring-1 ring-blue-500/10"></div>
                            <div className="h-48 bg-slate-900/40 rounded-3xl animate-pulse ring-1 ring-blue-500/10"></div>
                            <div className="h-32 bg-slate-900/40 rounded-2xl animate-pulse ring-1 ring-blue-500/10"></div>
                        </div>
                    )}

                    {report && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-700">
                            {/* Stats Bar */}
                            <div className="grid grid-cols-4 gap-4">
                                <StatCard icon={FileText} label="Words" value={report.document_stats.word_count} color="text-blue-400" />
                                <StatCard icon={Layers} label="Pages" value={`~${report.document_stats.pages_estimated}`} color="text-purple-400" />
                                <StatCard icon={Hash} label="Nodes" value={report.sections_mentioned.length} color="text-cyan-400" />
                                <StatCard icon={Clock} label="Latency" value={`${report.processing_time_ms}ms`} color="text-emerald-400" />
                            </div>

                            {/* Executive Summary */}
                            <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center">
                                        <Shield className="w-3 h-3 mr-2" /> Neural Brief
                                    </h4>
                                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${report.document_stats.complexity_rating === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                                        report.document_stats.complexity_rating === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                        }`}>{report.document_stats.complexity_rating} Complexity</span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed font-medium">{report.executive_summary}</p>
                            </div>

                            {/* Prosecution vs Defense */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ArgumentBlock title="Prosecution Logic" items={report.prosecution_arguments} color="text-red-400" borderColor="border-red-500/20" />
                                <ArgumentBlock title="Defense Logic" items={report.defense_arguments} color="text-blue-400" borderColor="border-blue-500/20" />
                            </div>

                            {/* Applicable Laws */}
                            {report.applicable_laws.length > 0 && (
                                <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                                    <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center">
                                        <Terminal className="w-3 h-3 mr-2" /> BNS / IPC Cross-Reference
                                    </h4>
                                    <div className="space-y-2">
                                        {report.applicable_laws.map((law, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-all">
                                                <span className="text-sm font-bold text-slate-200">{law.title}</span>
                                                <div className="flex space-x-2">
                                                    <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">BNS {law.bns}</span>
                                                    <span className="text-[9px] font-black text-slate-500 bg-slate-800 px-3 py-1 rounded-lg">IPC {law.ipc}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* AI Recommendations */}
                            <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center">
                                    <Cpu className="w-3 h-3 mr-2" /> Bench Optimization Plan
                                </h4>
                                <ul className="space-y-3">
                                    {report.ai_recommendations.map((rec, i) => (
                                        <li key={i} className="text-sm text-slate-400 flex items-start">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-4 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="glass-card rounded-2xl p-4 border-blue-500/10 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500/20 group-hover:bg-blue-500 transition-all"></div>
            <Icon className={`w-4 h-4 ${color} mx-auto mb-2`} />
            <div className="text-lg font-black text-white">{value}</div>
            <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
        </div>
    );
}

function ArgumentBlock({ title, items, color, borderColor }) {
    return (
        <div className={`glass-card rounded-3xl p-6 border ${borderColor} relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-1 h-full bg-current ${color} opacity-40`}></div>
            <h4 className={`text-[10px] font-black ${color} uppercase tracking-[0.2em] mb-4`}>{title}</h4>
            <ul className="space-y-2">
                {items.slice(0, 5).map((item, i) => (
                    <li key={i} className="text-xs text-slate-400 leading-relaxed pl-4 border-l border-slate-800 italic">{typeof item === 'string' ? item.substring(0, 200) : item}</li>
                ))}
            </ul>
        </div>
    );
}

