import React, { useState } from 'react';
import { Shield, Lock, User, Key, AlertTriangle, Terminal, Eye, EyeOff } from 'lucide-react';

const API_AI_URL = "http://localhost:5000";

const ROLE_INFO = {
    officer_vault: { label: 'OFFICER', color: 'blue', desc: 'Field Operations & Evidence Upload' },
    forensic_lab: { label: 'FORENSIC', color: 'purple', desc: 'Lab Analysis & Forensic Data' },
    honorable_justice: { label: 'JUDGE', color: 'amber', desc: 'Full Judicial Read Access' },
    citizen_view: { label: 'PUBLIC', color: 'emerald', desc: 'Case Diary & Legal Navigator' },
    dev_support: { label: 'DEVELOPER', color: 'cyan', desc: 'System Health Metrics Only' },
};

export default function LoginScreen({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Both fields are required.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_AI_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password: password.trim() })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Authentication failed.');
                setIsLoading(false);
                return;
            }
            onLogin(data);
        } catch (err) {
            setError('AI Auth Engine offline. Check backend connection.');
            setIsLoading(false);
        }
    };

    const quickLogin = async (user) => {
        setUsername(user);
        setPassword('secure2026');
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_AI_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: 'secure2026' })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Authentication failed.');
                setIsLoading(false);
                return;
            }
            onLogin(data);
        } catch (err) {
            setError('AI Auth Engine offline.');
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-[#050a14] relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,242,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Glow blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[180px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[180px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 w-full max-w-lg px-6">
                {/* Logo */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600/20 rounded-2xl border border-blue-500/30 mb-6"
                        style={{ boxShadow: '0 0 40px rgba(37,99,235,0.3), inset 0 0 20px rgba(37,99,235,0.1)' }}>
                        <Shield className="w-12 h-12 text-blue-400" />
                    </div>
                    <h1 className="text-5xl font-[1000] text-white tracking-tighter uppercase">
                        SECURE<span className="text-blue-500">LOCK</span>
                    </h1>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2">
                        Cryptographic Evidence Vault // RBAC Auth Gate
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="bg-slate-950/80 backdrop-blur-2xl border border-blue-500/20 rounded-2xl p-8 space-y-6"
                    style={{ boxShadow: '0 0 60px rgba(59,130,246,0.08)' }}>

                    <div className="flex items-center space-x-3 mb-2">
                        <Terminal className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Identity Verification Protocol</span>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                                placeholder="Username"
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white font-bold placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                                autoComplete="username"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                placeholder="Password"
                                className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-12 pr-12 py-4 text-sm text-white font-bold placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all"
                                autoComplete="current-password"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-3 p-3 bg-red-950/40 border border-red-500/30 rounded-xl">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">{error}</span>
                        </div>
                    )}

                    <button type="submit" disabled={isLoading}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center"
                        style={{ boxShadow: '0 0 20px rgba(37,99,235,0.4)' }}>
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <><Key className="w-4 h-4 mr-3" /> Authenticate</>
                        )}
                    </button>
                </form>

                {/* Quick Access Cards */}
                <div className="mt-8">
                    <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] text-center mb-4">
                        Demo Quick Access
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {Object.entries(ROLE_INFO).map(([user, info]) => (
                            <button
                                key={user}
                                onClick={() => quickLogin(user)}
                                disabled={isLoading}
                                className="group p-3 bg-slate-900/60 border border-white/5 rounded-xl hover:border-blue-500/30 transition-all text-center disabled:opacity-50"
                            >
                                <div className={`text-[8px] font-black text-${info.color}-400 uppercase tracking-widest mb-1`}>
                                    {info.label}
                                </div>
                                <div className="text-[7px] text-slate-600 font-bold leading-tight uppercase tracking-wider">
                                    {info.desc}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
