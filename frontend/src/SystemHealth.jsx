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
            <span className="text-xs font-black text-cyan-500 uppercase tracking-[0.2em]">Cluster Core // v{health.version} // {health.environment}</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Control</span></h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">System Uptime</div>
            <div className="text-xl font-black text-white font-mono mt-1">
              {Math.floor(health.uptime_seconds / 3600)}h {Math.floor((health.uptime_seconds % 3600) / 60)}m {health.uptime_seconds % 60}s
            </div>
          </div>
          <button onClick={fetchData} className={`p-4 bg-slate-900 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all text-cyan-400 ${loading && 'animate-spin'}`}>
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Span: Process & Storage (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 border-cyan-500/10 bg-slate-950/40">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center">
              <Server className="w-3 h-3 mr-3 text-cyan-400" /> Runtime Context
            </h4>
            <div className="space-y-6">
              <ProcessItem label="PID" value={health.process?.pid} />
              <ProcessItem label="OS" value={health.process?.os} />
              <ProcessItem label="Memory" value={`${health.process?.memory_usage_mb} MB`} />
              <ProcessItem label="Threads" value={health.process?.cpu_threads} />
              <ProcessItem label="Python" value={health.process?.python_version} />
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-8 border-emerald-500/10 bg-slate-950/40">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center">
              <HardDrive className="w-3 h-3 mr-3 text-emerald-400" /> Storage Intel
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Vault Payload</div>
                <div className="text-xl font-black text-white">{health.stats?.vault_size_kb} KB</div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Cases In Buffer</div>
                <div className="text-xl font-black text-white">{health.stats?.total_cases}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Live Traffic & Logs (6 cols) */}
        <div className="lg:col-span-6 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <StatBox label="Requests/min" value={health.throughput?.requests_per_min} color="text-blue-400" />
            <StatBox label="Latency" value={`${health.throughput?.avg_latency_ms}ms`} color="text-amber-400" />
            <StatBox label="Neural Tokens" value={health.throughput?.neural_token_usage} color="text-purple-400" />
          </div>

          <div className="glass-card rounded-[3rem] p-1 border-white/5 bg-slate-950 shadow-2xl relative overflow-hidden h-[500px]">
            <div className="absolute top-0 left-0 w-full h-10 bg-slate-900/80 border-b border-white/5 flex items-center px-8 justify-between z-10">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4 italic">System_Stream_v4.log</span>
              </div>
              <Terminal className="w-3 h-3 text-slate-700" />
            </div>
            <div className="pt-14 p-8 overflow-auto h-full font-mono text-[11px] space-y-2 custom-scrollbar scroll-smooth">
              {!health.logs || health.logs.length === 0 ? (
                <div className="text-slate-700 italic animate-pulse">Awaiting kernel signals...</div>
              ) : health.logs.map((log, i) => (
                <div key={i} className="group border-b border-white/5 pb-1 last:border-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-[8px] text-slate-600 font-black">{log.time}</span>
                    <span className={`px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase ${log.level === 'CRITICAL' || log.level === 'ERROR' ? 'bg-red-500/20 text-red-500' :
                      log.level === 'WARN' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-cyan-500/10 text-cyan-500'
                      }`}>{log.level}</span>
                    <span className="text-[8px] text-slate-500 font-bold tracking-tighter">[{log.module}]</span>
                  </div>
                  <p className={`mt-1 text-[10px] leading-relaxed transition-colors ${log.level === 'CRITICAL' || log.level === 'ERROR' ? 'text-red-400 font-black' : 'text-slate-300 group-hover:text-white'
                    }`}>
                    {log.event}
                  </p>
                </div>
              ))}
              <div className="text-blue-400 animate-pulse pt-4">_ Developer shell active. No interruptions detected.</div>
            </div>
          </div>
        </div>

        {/* Right: Service Status & Actions (3 cols) */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-8 border-cyan-500/10 bg-slate-950/40">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center">
              <Wifi className="w-3 h-3 mr-3 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" /> Node Health
            </h4>
            <div className="space-y-3">
              {Object.entries(health.services || {}).map(([svc, status]) => (
                <div key={svc} className="flex items-center justify-between p-4 bg-slate-900/60 rounded-2xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest truncate">{svc.replace(/_/g, ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[7px] font-black uppercase ${status === 'active' || status === 'healthy' || status === 'connected' ? 'text-emerald-500' : 'text-amber-500'}`}>{status}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'active' || status === 'healthy' || status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <MaintenanceButton label="Prune Orphan Buffers" action="clear_temp" icon={HardDrive} API_AI_URL={API_AI_URL} authHeaders={authHeaders} refresh={fetchData} />
            <MaintenanceButton label="Full Database Sync" action="db_verify" icon={Database} API_AI_URL={API_AI_URL} authHeaders={authHeaders} refresh={fetchData} />
            <MaintenanceButton label="Mitigate Threat Alerts" action="mitigate_threats" icon={ShieldCheck} API_AI_URL={API_AI_URL} authHeaders={authHeaders} refresh={fetchData} highlight />
          </div>
        </div>

      </div>
    </div>
  );
}

function ProcessItem({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-bold text-slate-300">{value}</span>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="glass-card rounded-3xl p-6 border-white/5 text-center flex flex-col items-center justify-center bg-slate-950/60">
      <div className={`text-2xl font-black ${color} tracking-tighter`}>{value}</div>
      <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function MaintenanceButton({ icon: Icon, label, action, API_AI_URL, authHeaders, refresh, highlight }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleAction = async () => {
    setLoading(true);
    setMsg('EXECUTING...');
    try {
      await axios.post(`${API_AI_URL}/api/system/maintenance`, { action }, { headers: authHeaders() });
      setMsg('COMPLETED');
      setTimeout(() => setMsg(''), 3000);
      if (refresh) refresh();
    } catch (err) {
      setMsg('FAILED');
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAction}
      disabled={loading}
      className={`w-full flex items-center justify-between p-5 rounded-[2rem] border transition-all group ${highlight ? 'bg-cyan-600 border-cyan-500 text-white shadow-2xl shadow-cyan-500/30' : 'bg-slate-900 border-white/5 hover:border-cyan-500/30 text-slate-400'}`}
    >
      <div className="flex items-center space-x-4">
        <Icon className={`w-4 h-4 ${loading && 'animate-spin'}`} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[8px] font-black uppercase text-cyan-400 group-hover:text-white transition-colors">{msg || 'RUN'}</span>
    </button>
  );
}

