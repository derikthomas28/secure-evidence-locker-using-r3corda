import React, { useState } from 'react';
import axios from 'axios';
import {
    MessageCircle, Send, Activity, Shield, AlertTriangle, CheckCircle,
    Scale, BookOpen, Users, ArrowRight, Info, ChevronDown, ChevronUp, Terminal
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

            {/* Search Bar */}
            <div className="glass-card rounded-3xl p-10 border-blue-500/10 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-20 group-hover:opacity-100 transition-opacity"></div>

                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-3 text-blue-500" /> Neural Situational Analysis
                </h2>

                <div className="flex space-x-4">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitQuery(); } }}
                        placeholder="Describe the incident in plain language (e.g., Someone snatched my jewelry near the red fort)..."
                        className="flex-1 bg-slate-950/80 border border-blue-500/10 rounded-2xl p-6 text-sm text-blue-300 font-medium resize-none focus:outline-none focus:border-blue-500/40 placeholder-slate-700 h-24"
                    />
                    <button onClick={() => submitQuery()} disabled={isSearching || !query.trim()}
                        className="px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center shadow-lg">
                        {isSearching ? <Activity className="animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> DISPATCH</>}
                    </button>
                </div>

                {/* Example Queries */}
                <div className="mt-8 flex flex-wrap gap-2">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-2 self-center">Presets:</span>
                    {exampleQueries.map((eq, i) => (
                        <button key={i} onClick={() => handleExampleClick(eq)}
                            className="px-4 py-2 bg-slate-950/60 border border-white/5 rounded-lg text-[9px] text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all font-black uppercase tracking-wider">
                            {eq}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-3 flex-shrink-0" /> {error}
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
                        <div className="glass-card rounded-3xl p-8 border-blue-500/10">
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center">
                                <Shield className="w-3 h-3 mr-2 text-blue-500" /> Defense Vector Analysis
                            </h4>
                            <ul className="space-y-4">
                                {result?.available_defenses?.map((def, i) => (
                                     <li key={i} className="flex items-start text-sm text-slate-300">
                                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-4 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                         {def}
                                     </li>
                                 ))}
                            </ul>
                        </div>

                        <div className="glass-card rounded-3xl p-8 border-emerald-500/10">
                            <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center">
                                <BookOpen className="w-3 h-3 mr-2 text-emerald-500" /> Procedural Guidelines
                            </h4>
                            <ul className="space-y-4">
                                {(result?.procedures || []).map((proc, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-300">
                                        <div className="w-6 h-6 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                                            <span className="text-[9px] font-black text-emerald-400">{i + 1}</span>
                                        </div>
                                        {proc}
                                    </li>
                                ))}
                            </ul>
                        </div>
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
