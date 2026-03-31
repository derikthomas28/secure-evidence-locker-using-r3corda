import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Activity, Cpu, HardDrive, Database, Users, Terminal, Wifi, 
  RefreshCw, Server, AlertCircle 
} from 'lucide-react';

export default function SystemHealth({ authHeaders, API_AI_URL }) {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_AI_URL}/api/system/health`, {
        headers: authHeaders()
      });
      setHealth(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error("System Health Fetch Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
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
      <div className="glass-card rounded-[3rem] p-24 text-center border-dashed border-white/5 flex flex-col items-center justify-center">
        <RefreshCw className="w-16 h-16 text-cyan-400 mb-8 animate-spin" />
        <h3 className="text-2xl font-black text-slate-300 mb-4 uppercase tracking-tighter">Initializing Infra Scan</h3>
        <p className="text-sm text-slate-500 font-medium">Establishing secure gateway to Regional Storage Node...</p>
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
          <h1 className="text-5xl font-black text-white tracking-tighter">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">Infrastructure</span></h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Current Version</div>
            <div className="text-xs font-mono font-bold text-cyan-400">{health.version}</div>
          </div>
          <button onClick={fetchData} className={`p-4 bg-slate-900 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all text-cyan-400 ${loading && 'animate-spin'}`}>
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Metrics & Logs */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon={Cpu} label="CPU Compute" value={`${health.system?.cpu_percent || 0}%`} color="text-cyan-400" bgColor="group-hover:bg-cyan-500/5" border="border-cyan-500/10" />
            <MetricCard icon={HardDrive} label="Memory Cluster" value={`${health.system?.memory_percent || 0}%`} color="text-purple-400" bgColor="group-hover:bg-purple-500/5" border="border-cyan-500/10" />
            <MetricCard icon={Users} label="Live Sockets" value={health.stats?.active_sessions || health.active_sessions || 0} color="text-emerald-400" bgColor="group-hover:bg-emerald-500/5" border="border-cyan-500/10" />
            <MetricCard icon={Database} label="Object Store" value={health.stats?.total_cases || 0} color="text-blue-400" bgColor="group-hover:bg-blue-500/5" border="border-cyan-500/10" />
          </div>

          <div className="glass-card rounded-[2rem] p-8 border-cyan-500/10 bg-slate-950/40">
            <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <Terminal className="w-3 h-3 mr-2" /> Live System Logs
              </div>
              <span className="text-slate-700 font-mono">STDOUT // STREAM</span>
            </h4>
            <div className="bg-slate-950 rounded-2xl p-6 border border-white/5 font-mono text-[11px] h-[300px] overflow-auto space-y-3 custom-scrollbar shadow-inner">
              {health.logs?.map((log, i) => (
                <div key={i} className="flex space-x-4 border-b border-white/5 pb-2 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <span className="text-slate-600 whitespace-nowrap">[{log.time}]</span>
                  <span className={`font-black whitespace-nowrap min-w-[50px] ${log.level === 'ERROR' ? 'text-red-500' : log.level === 'WARN' ? 'text-amber-500' : 'text-blue-500'}`}>{log.level}</span>
                  <span className="text-cyan-600 font-bold whitespace-nowrap">{log.module}</span>
                  <span className="text-slate-400 break-all">{log.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Service Status Matrix */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card rounded-[2rem] p-8 border-cyan-500/10 h-full">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center">
              <Wifi className="w-3 h-3 mr-3 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" /> Node Health Matrix
            </h4>
            <div className="space-y-4">
              {Object.entries(health.services || {}).map(([svc, status]) => (
                <div key={svc} className="flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{svc.replace(/_/g, ' ')}</span>
                  <div className="flex items-center">
                    <div className={`w-1.5 h-1.5 rounded-full mr-3 animate-pulse shadow-lg ${status === 'online' || status === 'active' || status === 'healthy' || status === 'connected' ? 'bg-emerald-500 shadow-emerald-500/50' :
                      status === 'standby' || status === 'sealed' ? 'bg-amber-500 shadow-amber-500/50' :
                        'bg-slate-500'
                      }`}></div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'online' || status === 'active' || status === 'healthy' || status === 'connected' ? 'text-emerald-400' :
                      status === 'standby' || status === 'sealed' ? 'text-amber-400' :
                        'text-slate-500'
                      }`}>{status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-cyan-600/5 border border-cyan-500/10 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Network Analytics</span>
              </div>
              <div className="space-y-6">
                <AnalyticsRow label="Avg Latency" value={`${health.stats?.avg_latency_ms || 0}ms`} percent={15} color="bg-cyan-500" />
                <AnalyticsRow label="Throughput" value={`${health.stats?.api_calls_processed || 0} req/min`} percent={65} color="bg-blue-500" />
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-slate-950/40 rounded-2xl border border-white/5">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-loose">
                ⚠ Root access active. Developer role has zero access to private case data or evidence contents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, bgColor, border }) {
  return (
    <div className={`glass-card rounded-2xl p-6 ${border} text-center group transition-all ${bgColor}`}>
      <Icon className={`w-6 h-6 ${color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</div>
    </div>
  );
}

function AnalyticsRow({ label, value, percent, color }) {
  return (
    <div>
      <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase mb-2">
        <span>{label}</span>
        <span className="text-slate-300 font-mono italic">{value}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden p-[1px]">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
