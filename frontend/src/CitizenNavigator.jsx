import React, { useState } from 'react';
import axios from 'axios';
import {
    MessageCircle, Send, Activity, Shield, AlertTriangle, CheckCircle,
    Scale, BookOpen, Users, ArrowRight, Info, ChevronDown, ChevronUp, Terminal,
    Zap, Cpu
} from 'lucide-react';

const API_AI_URL = "http://127.0.0.1:5000";

export default function CitizenNavigator({ authHeaders, handleLogout }) {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [showRights, setShowRights] = useState(false);

    const exampleQueries = [
        "Someone stole my phone from my bag",
        "My neighbor threatened to kill me",
        "I was physically assaulted by a stranger",
        "I was cheated in an online transaction",
        "Someone is blackmailing me with my photos",
        "My house was broken into at night"
    ];

    const submitQuery = async (q) => {
        const queryText = q || query;
        if (!queryText.trim()) return;

        setIsSearching(true);
        setError('');
        setResult(null);

        try {
            const res = await axios.post(`${API_AI_URL}/api/citizen/navigate`,
                { query: queryText },
                { headers: authHeaders() }
            );
            setResult(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
                alert("Session expired. Please log in again.");
                return;
            }
            setError('Legal Navigator Error: ' + (err.response?.data?.error || err.message));
        } finally {
            setIsSearching(false);
        }
    };

    const handleExampleClick = (example) => {
        setQuery(example);
        submitQuery(example);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] neon-border-blue">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                        Citizen <span className="text-blue-500 neon-text-blue">Navigator</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Access BNS/IPC knowledge instantly. Understand the proceedings in plain language.</p>
                </div>
            </header>

            {/* Search Bar - Premium Deep AI Interface */}
            <div className="glass-card rounded-[3.5rem] p-12 border-blue-500/10 relative group overflow-hidden bg-slate-900/40 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(37,99,235,0.1)]">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-80 transition-opacity animate-shimmer bg-[length:200%_100%]"></div>
                <div className="absolute -inset-24 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-600/10 transition-colors"></div>

                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center">
                        <Terminal className="w-4 h-4 mr-4 text-blue-500" /> Neural Context Engine v2.4
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">BNS Core: Online</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuery(); } }}
                        placeholder="Describe your situation in natural language (e.g., 'My bike was stolen from the parking lot last night')..."
                        className="w-full bg-slate-950/90 border border-white/5 rounded-[2.5rem] p-10 pb-32 text-xl text-blue-50 text-center font-medium resize-none focus:outline-none focus:border-blue-500/30 placeholder-slate-800 h-64 shadow-2xl transition-all hover:bg-slate-950"
                    />

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-6">
                        <button onClick={() => submitQuery()} disabled={isSearching || !query.trim()}
                            className="group/btn relative overflow-hidden px-20 py-7 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all disabled:opacity-30 disabled:grayscale shadow-[0_20px_60px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_70px_rgba(59,130,246,0.6)] active:scale-95 flex items-center">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                            {isSearching ? <Activity className="animate-spin w-5 h-5" /> : <><Send className="w-4 h-4 mr-4 group-hover/btn:rotate-12 transition-transform" /> Analyze Incident</>}
                        </button>
                    </div>
                </div>

                {/* Example Queries - Premium Chips */}
                <div className="mt-14 flex flex-wrap gap-3 justify-center">
                    {exampleQueries.map((eq, i) => (
                        <button key={i} onClick={() => handleExampleClick(eq)}
                            className="px-6 py-3.5 bg-slate-950/80 border border-white/5 rounded-2xl text-[9px] text-slate-500 hover:text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all font-black uppercase tracking-widest flex items-center group">
                            <Zap className="w-3 h-3 mr-3 opacity-20 group-hover:opacity-100 text-amber-500 transition-opacity" />
                            {eq}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mt-10 p-6 bg-red-950/40 border border-red-500/30 rounded-3xl text-red-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center animate-in shake h-20 shadow-3xl">
                        <AlertTriangle className="w-5 h-5 mr-5 animate-pulse" /> {error}
                    </div>
                )}
            </div>

            {/* Results - Consultancy Report Style */}
            {isSearching && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="h-48 bg-slate-900/40 rounded-3xl animate-pulse ring-1 ring-blue-500/10 flex items-center justify-center">
                        <div className="text-center">
                            <Cpu className="w-10 h-10 text-blue-500/30 mx-auto mb-4 animate-spin" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Synthesizing Legal Intelligence...</p>
                        </div>
                    </div>
                </div>
            )}

            {result && result.status === 'match_found' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-12 duration-1000">

                    {/* The Consultancy Report Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">
                            Official AI Legal Consultation Report
                        </div>
                        <h2 className="text-4xl font-black text-white italic">CONSULTATION:// <span className="text-blue-500">SUMMARY</span></h2>
                        <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Summary & Action Plan (7 cols) */}
                        <div className="lg:col-span-12 space-y-10">

                            {/* Summary Card */}
                            <div className="glass-card rounded-[3rem] p-12 border-blue-500/10 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-start space-x-8">
                                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                                        <Scale className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consultant's Assessment</h4>
                                        <p className="text-2xl font-bold text-slate-200 leading-snug">
                                            {result.consultancy_summary}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Plan (The Next Steps) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="glass-card rounded-[3rem] p-12 border-emerald-500/10 relative bg-emerald-500/5">
                                    <h4 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-10 flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-4" /> Recommended Action Plan
                                    </h4>
                                    <div className="space-y-6">
                                        {result.action_plan.map((step, i) => (
                                            <div key={i} className="flex items-start group">
                                                <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-xs font-black mr-6 mt-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                                                    {i + 1}
                                                </div>
                                                <p className="text-slate-300 text-sm font-bold leading-relaxed">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Rights Bulletin */}
                                <div className="glass-card rounded-[3rem] p-12 border-blue-500/10 relative bg-blue-500/5">
                                    <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-10 flex items-center">
                                        <Shield className="w-4 h-4 mr-4" /> Protected Legal Rights
                                    </h4>
                                    <div className="space-y-6">
                                        {result.rights_bulletin.map((right, i) => (
                                            <div key={i} className="flex items-start">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-6 mt-2 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                                                <p className="text-slate-300 text-sm font-bold leading-relaxed italic">"{right}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Law Reference Footer */}
                            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-slate-950/80 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center space-x-6">
                                    <div className="px-5 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest">
                                        Law: {result.primary_law.title}
                                    </div>
                                    <div className="px-5 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-xs font-black text-blue-400 uppercase tracking-widest">
                                        Provision: {result.primary_law.section}
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center">
                                    <Cpu className="w-4 h-4 mr-3" /> Processed by {result.engine}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="max-w-2xl mx-auto p-10 bg-slate-950/40 rounded-[2rem] border border-white/5 text-center text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                        Notice: This report is generated by an Artificial Intelligence engine as a preliminary legal consultation. It does not replace professional legal representation. Consult an advocate for court filings.
                    </div>
                </div>
            )}

            {result && result.status === 'no_match' && (
                <div className="glass-card rounded-[3rem] p-24 text-center border-white/5 animate-in fade-in zoom-in duration-700">
                    <AlertTriangle className="w-20 h-20 text-slate-800 mx-auto mb-10" />
                    <h3 className="text-3xl font-black text-slate-500 mb-6 uppercase tracking-tighter">Inconclusive Signal</h3>
                    <p className="text-slate-600 max-w-sm mx-auto font-bold uppercase tracking-widest leading-relaxed text-xs">The consultancy engine requires more specific details about the incident to generate a valid action plan.</p>
                </div>
            )}
        </div>
    );
}
