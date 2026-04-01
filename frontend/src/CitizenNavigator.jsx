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

            {/* Results */}
            {isSearching && (
                <div className="space-y-6">
                    <div className="h-20 bg-slate-900/40 rounded-2xl animate-pulse ring-1 ring-blue-500/10"></div>
                    <div className="h-64 bg-slate-900/40 rounded-3xl animate-pulse ring-1 ring-blue-500/10"></div>
                </div>
            )}

            {result && result.status === 'match_found' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-12 duration-700">

                    {/* Primary Match */}
                    <div className="glass-card rounded-3xl p-10 border-blue-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Scale className="w-48 h-48" /></div>

                        <div className="flex items-center space-x-6 mb-8">
                            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-[1000] text-white tracking-tighter uppercase">{result.primary_match.title}</h3>
                                <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">{result.query_understood_as}</p>
                            </div>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed mb-10 font-medium">{result.primary_match.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="bg-slate-950/60 p-6 rounded-2xl border border-blue-500/10 group hover:border-blue-500/30 transition-all">
                                <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center">
                                    <Terminal className="w-3 h-3 mr-2" /> BNS Ledger
                                </div>
                                <div className="text-xl font-black text-white">{result.primary_match.bns_section}</div>
                            </div>
                            <div className="bg-slate-950/60 p-6 rounded-2xl border border-white/5">
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Legacy IPC</div>
                                <div className="text-xl font-black text-slate-400">{result.primary_match.ipc_section}</div>
                            </div>
                            <div className="bg-slate-950/60 p-6 rounded-2xl border border-red-500/10">
                                <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-3">Sanction / Punishment</div>
                                <div className="text-xs font-black text-slate-300 leading-relaxed uppercase tracking-wider">{result.primary_match.punishment}</div>
                            </div>
                        </div>

                        {/* Related Sections */}
                        {result.related_sections.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest self-center mr-2">Auxiliary Data:</span>
                                {result.related_sections.map((rs, i) => (
                                    <span key={i} className="px-4 py-2 bg-slate-950/60 border border-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {rs.title} // {rs.bns_section}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Defenses & Rights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {result.available_defenses?.length > 0 && (
                            <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center">
                                    <Shield className="w-3 h-3 mr-2 text-blue-500" /> Defense Vector Analysis
                                </h4>
                                <ul className="space-y-4">
                                    {result.available_defenses.map((def, i) => (
                                        <li key={i} className="flex items-start text-sm text-slate-300">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-4 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                            {def}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.procedural_guidelines?.length > 0 && (
                            <div className="glass-card rounded-3xl p-8 border-emerald-500/10">
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center">
                                    <BookOpen className="w-3 h-3 mr-2 text-emerald-500" /> Procedural Guidelines
                                </h4>
                                <ul className="space-y-4">
                                    {result.procedural_guidelines.map((proc, i) => (
                                        <li key={i} className="flex items-start text-sm text-slate-300">
                                            <div className="w-5 h-5 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center justify-center mr-4 mt-0.5 text-[8px] font-black text-emerald-500">{i+1}</div>
                                            {proc}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Citizen Rights Accordion */}
                    <div className="glass-card rounded-3xl border-white/5 overflow-hidden">
                        <button onClick={() => setShowRights(!showRights)}
                            className="w-full p-8 flex items-center justify-between text-left hover:bg-blue-500/5 transition-all">
                            <div className="flex items-center space-x-4">
                                <Info className="w-5 h-5 text-blue-400" />
                                <div>
                                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Your Legal Rights</h4>
                                    <p className="text-[10px] text-slate-500 mt-1 font-medium">Constitutional protections applicable to this situation</p>
                                </div>
                            </div>
                            {showRights ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                        </button>
                        {showRights && (
                            <div className="px-8 pb-8 space-y-3 border-t border-white/5 pt-6">
                                {(result?.citizen_rights || []).length > 0 ? (
                                    result.citizen_rights.map((right, i) => (
                                        <div key={i} className="flex items-start p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                            <CheckCircle className="w-4 h-4 text-blue-400 mr-4 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-300 font-medium">{right}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center space-x-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                                        <Info className="w-4 h-4 text-slate-600" />
                                        <span className="text-xs text-slate-500 uppercase font-black">No specific constitutional rights indexed for this section.</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Disclaimer */}
                    <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center">
                            ⚠ This AI-powered legal navigator provides general guidance only. For specific legal advice, consult a qualified advocate.
                        </p>
                    </div>
                </div>
            )}

            {result && result.status === 'no_match' && (
                <div className="glass-card rounded-3xl p-16 text-center border-white/5 animate-in fade-in">
                    <AlertTriangle className="w-16 h-16 text-slate-700 mx-auto mb-8" />
                    <h3 className="text-2xl font-black text-slate-500 mb-4">No Direct Match Found</h3>
                    <p className="text-slate-600 max-w-md mx-auto font-medium">Try rephrasing your query with more specific details about the incident.</p>
                </div>
            )}
        </div>
    );
}
