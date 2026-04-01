import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Activity, Cpu, HardDrive, Database, Users, Terminal, Wifi, 
  RefreshCw, Server, AlertCircle, MessageSquare, ShieldAlert, 
  Eye, Zap, ShieldCheck
} from 'lucide-react';

export default function SystemHealth({ authHeaders, API_AI_URL, handleLogout }) {
  const [health, setHealth] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [healthRes, fbRes, evRes] = await Promise.all([
        axios.get(`${API_AI_URL}/api/system/health`, { headers: authHeaders() }),
        axios.get(`${API_AI_URL}/api/system/feedback`, { headers: authHeaders() }),
        axios.get(`${API_AI_URL}/api/system/events`, { headers: authHeaders() })
      ]);
      
      setHealth(healthRes.data);
      setFeedbacks(fbRes.data);
      setEvents(evRes.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) { handleLogout(); return; }
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="glass-card rounded-[3rem] p-20 text-center border-red-500/20">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-8 animate-pulse" />
        <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Connection Failed</h3>
        <p className="text-slate-400 mb-10 font-medium">{error}</p>
        <button onClick={fetchData} className="px-12 py-4 bg-red-600/20 border border-red-500/30 text-red-400 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
          Retry Handshake
        </button>
      </div>
    );
  }

  if (!health && loading) {
    return (
      <div className="glass-card rounded-[3rem] p-24 text-center border-dashed border-white/5 flex flex-col items-center justify-center h-[500px]">
        <RefreshCw className="w-16 h-16 text-cyan-400 mb-8 animate-spin" />
        <h3 className="text-2xl font-black text-slate-300 mb-4 uppercase tracking-tighter">Initializing Infra Scan</h3>
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-lg bg-slate-900/50">Establishing Secure Gateway...</span>
      </div>
    );
  }

  if (!health) return null;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-cyan-500 animate-pulse rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
            <span className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em]">Maintenance Mode // DEV_ROOT</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic">Infra <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Command</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={fetchData} className={`p-4 bg-slate-900 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all text-cyan-400 ${loading && 'animate-spin'}`}>
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Global Feedback Feed */}
        <div className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-[2.5rem] p-8 border-cyan-500/10 h-full flex flex-col bg-slate-950/40">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center justify-between underline decoration-purple-500/30">
                    <div className="flex items-center"><MessageSquare className="w-3 h-3 mr-3 text-purple-400" /> Intelligence Feed</div>
                    <span className="text-purple-500/50">{feedbacks.length} SIGNALS</span>
                </h4>
                
                <div className="flex-1 space-y-4 overflow-auto max-h-[700px] custom-scrollbar pr-4">
                    {feedbacks.map((fb) => (
                        <div key={fb.id} className={`p-6 bg-slate-900 rounded-3xl border transition-all group ${
                            fb.text.toLowerCase().includes('threat') || fb.text.toLowerCase().includes('malfunction') 
                            ? 'border-red-500/30 hover:border-red-500' : 'border-white/5 hover:border-purple-500/30'
                        }`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className={`text-[8px] font-black uppercase px-2 py-1 rounded ${
                                        fb.role === 'judge' ? 'bg-amber-500/10 text-amber-500' : 
                                        fb.role === 'anonymous' ? 'bg-slate-700 text-slate-400 border border-white/10' :
                                        'bg-blue-500/10 text-blue-500'
                                    }`}>
                                        {fb.role === 'anonymous' ? <span className="flex items-center gap-1"><Eye className="w-2 h-2" /> Citizen</span> : fb.role}
                                    </span>
                                    <span className="text-[10px] font-black text-slate-400 truncate">{fb.user || 'Unknown Node'}</span>
                                </div>
                                <span className={`text-[8px] font-mono italic ${fb.text.toLowerCase().includes('threat') ? 'text-red-500' : 'text-slate-600'}`}>
                                    {fb.text.toLowerCase().includes('threat') ? '⚠️ THREAT_REPORT' : `#${fb.id}`}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{fb.text}"</p>
                            <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase text-slate-500 hover:text-white">Acknowledge</button>
                                <button className="px-2 py-1 bg-white/5 rounded text-[8px] font-black uppercase text-slate-500 hover:text-white">Escalate</button>
                            </div>
                        </div>
                    ))}
                    {feedbacks.length === 0 && (
                        <div className="p-12 text-center text-slate-700 uppercase font-black text-xs tracking-widest opacity-20 italic">No sentiment data available.</div>
                    )}
                </div>
            </div>
        </div>

        {/* Center: Infrastructure Metrics & Events */}
        <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-2 gap-4">
                <MetricCard icon={Cpu} label="Compute" value={`${health.system?.cpu_percent || 0}%`} color="text-cyan-400" bgColor="group-hover:bg-cyan-500/5" border="border-cyan-500/10" />
                <MetricCard icon={Users} label="Auth Sockets" value={health.stats?.active_sessions || 0} color="text-emerald-400" bgColor="group-hover:bg-emerald-500/5" border="border-cyan-500/10" />
            </div>

            <div className="glass-card rounded-[2.5rem] p-8 border-red-500/10 bg-slate-950/20">
                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6 flex items-center justify-between">
                    <div className="flex items-center"><ShieldAlert className="w-3 h-3 mr-3 animate-pulse" /> Neural Infrastructure Events</div>
                    <span className="text-red-500/50">LIVE ALERTS</span>
                </h4>
                <div className="space-y-3 overflow-auto max-h-[500px] pr-2 custom-scrollbar">
                    {events.map((ev) => (
                        <div key={ev.id} className={`p-4 rounded-2xl border ${ev.level === 'Critical' ? 'bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-slate-900 border-white/5'} flex items-start space-x-4`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ev.level === 'Critical' ? 'bg-red-500/10' : 'bg-slate-800'}`}>
                                <Zap className={`w-4 h-4 ${ev.level === 'Critical' ? 'text-red-500 animate-bounce' : 'text-slate-500'}`} />
                            </div>
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <span className={`text-[9px] font-black uppercase ${ev.level === 'Critical' ? 'text-red-500' : 'text-slate-500'}`}>{ev.type}</span>
                                    <span className="text-[7px] font-mono text-slate-700 italic">{ev.id}</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium">{ev.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right: Health Matrix & Controls */}
        <div className="lg:col-span-3 space-y-8">
            <div className="glass-card rounded-[2rem] p-8 border-cyan-500/10 h-full flex flex-col">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center">
                    <Wifi className="w-3 h-3 mr-3 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" /> Node Health
                </h4>
                <div className="space-y-4 mb-10">
                    {Object.entries(health.services || {}).map(([svc, status]) => (
                        <div key={svc} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{svc.replace(/_/g, ' ')}</span>
                            <div className={`w-1.5 h-1.5 rounded-full shadow-lg ${status === 'online' || status === 'active' || status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto space-y-3">
                    <MaintenanceButton label="Sanitize Orphans" action="clear_temp" icon={HardDrive} API_AI_URL={API_AI_URL} authHeaders={authHeaders} refresh={fetchData} />
                    <MaintenanceButton label="Verify DB State" action="db_verify" icon={Database} API_AI_URL={API_AI_URL} authHeaders={authHeaders} refresh={fetchData} />
                    <MaintenanceButton label="Mitigate Integrity Alerts" action="mitigate_threats" icon={ShieldCheck} API_AI_URL={API_AI_URL} authHeaders={authHeaders} refresh={fetchData} highlight />
                    
                    <button 
                        onClick={async () => {
                            await axios.post(`${API_AI_URL}/api/system/simulate_threat`, {}, { headers: authHeaders() });
                            fetchData();
                        }}
                        className="w-full p-4 bg-slate-900 border border-white/5 rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 text-[9px] font-black text-slate-600 hover:text-red-500 uppercase tracking-widest transition-all"
                    >
                        Simulate Malfunction
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

function MaintenanceButton({ icon: Icon, label, action, API_AI_URL, authHeaders, refresh, highlight }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleAction = async () => {
    setLoading(true);
    setMsg('RUNNING...');
    try {
      const res = await axios.post(`${API_AI_URL}/api/system/maintenance`, 
        { action },
        { headers: authHeaders() }
      );
      setMsg(res.data.status === 'success' ? 'SUCCESS' : 'FAILED');
      setTimeout(() => setMsg(''), 3000);
      if (refresh) refresh();
    } catch (err) {
      setMsg('ERROR');
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAction}
      disabled={loading}
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${highlight ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-slate-400'}`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`w-4 h-4 ${loading ? 'animate-spin' : highlight ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'}`} />
        <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{label}</span>
      </div>
      <span className={`text-[8px] font-bold font-mono ${msg === 'SUCCESS' ? 'text-white' : msg === 'ERROR' ? 'text-red-500' : highlight ? 'text-emerald-200' : 'text-slate-700'}`}>
        {msg || (highlight ? 'FIX' : 'RUN')}
      </span>
    </button>
  );
}

function MetricCard({ icon: Icon, label, value, color, bgColor, border }) {
  return (
    <div className={`glass-card rounded-[2rem] p-6 ${border} text-center group transition-all ${bgColor}`}>
      <Icon className={`w-6 h-6 ${color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
      <div className="text-xl font-[1000] text-white tracking-widest">{value}</div>
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}
