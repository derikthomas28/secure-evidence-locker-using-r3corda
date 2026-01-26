import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Upload, Shield, FileText, CheckCircle, AlertTriangle, Eye, Server, Activity,
  Lock, Key, Navigation, Globe, Cpu, Hash, Clock, User, Download, FileCheck, ArrowRight
} from 'lucide-react';

const API_AI_URL = "http://localhost:5000";
const API_BLOCKCHAIN_URL = "http://localhost:10050";

// --- UI Components ---

const TrustScore = ({ score }) => {
  const color = score > 80 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="relative flex flex-col items-center">
      <svg className="w-32 h-32 transform -rotate-90">
        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
        <circle
          cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
          strokeDasharray={364}
          strokeDashoffset={364 - (364 * score) / 100}
          className={`${color} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className={`text-3xl font-black ${color}`}>{score}%</span>
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Trust Index</span>
      </div>
    </div>
  );
};

const TimelineItem = ({ title, date, active, completed, icon: Icon }) => (
  <div className="flex group">
    <div className="flex flex-col items-center mr-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 scale-110 shadow-lg ${completed ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20' :
        active ? 'bg-slate-900 border-blue-500 text-blue-400 animate-pulse-glow shadow-blue-500/20' :
          'bg-slate-900 border-slate-700 text-slate-600'
        }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`w-0.5 grow mt-2 mb-2 transition-colors duration-500 ${completed ? 'bg-blue-600' : 'bg-slate-800'}`}></div>
    </div>
    <div className="pb-8">
      <h4 className={`font-black uppercase tracking-widest text-xs mb-1 transition-colors ${active || completed ? 'text-blue-400' : 'text-slate-600'}`}>
        {title}
      </h4>
      <p className="text-[10px] font-mono text-slate-500">{date || 'Awaiting Action...'}</p>
    </div>
  </div>
);

// --- Main App ---

function App() {
  const [role, setRole] = useState('officer');
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [signingStep, setSigningStep] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const [verifyFile, setVerifyFile] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCert, setShowCert] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);

  useEffect(() => {
    fetchEvidence();
    if (role === 'judge') setActiveTab('verify');
    else if (role === 'officer' && activeTab === 'verify') setActiveTab('upload');
  }, [role]);

  const fetchEvidence = async () => {
    try {
      const res = await axios.get(`${API_BLOCKCHAIN_URL}/api/evidence`);
      setEvidenceList(res.data);
    } catch (err) {
      console.error("Failed to fetch evidence", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
      setSuccessMsg('');
      setSigningStep(false);
      setIsSigned(false);
    }
  };

  const handleVerifyFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVerifyFile(e.target.files[0]);
      setVerifyResult(null);
    }
  };

  const analyzeEvidence = async () => {
    console.log("Analyze clicked", file);
    if (!file) {
      alert("No file selected!");
      return;
    }

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    console.log("Sending request to:", `${API_AI_URL}/analyze`);
    try {
      const res = await axios.post(`${API_AI_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error("Analysis failed", err);
      alert("AI Forensic Cluster Offline or Error: " + (err.response?.data?.error || err.message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const signEvidence = () => {
    setSigningStep(true);
    setTimeout(() => {
      setIsSigned(true);
      setSigningStep(false);
    }, 2000);
  };

  const submitToBlockchain = async () => {
    if (!analysis || !isSigned) return;
    setIsSubmitting(true);

    const payload = {
      evidenceID: "XFR-" + Math.floor(Math.random() * 10000000).toString(16).toUpperCase(),
      hash: analysis.sha256,
      custodyNote: `GENESIS_DEPOSIT: AI Cluster: ${analysis.ai_analysis.detected_objects.join(', ') || 'N/A'}. IPFS: ipfs://${analysis.ipfs_hash}.`
    };

    try {
      await axios.post(`${API_BLOCKCHAIN_URL}/api/evidence/issue`, payload);
      setSuccessMsg(payload.evidenceID);
      setFile(null);
      setAnalysis(null);
      setIsSigned(false);
      fetchEvidence();
    } catch (err) {
      console.error("Blockchain error", err);
      alert("Ledger Connection Failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const runCourtVerification = async () => {
    if (!verifyFile) return;
    setIsVerifying(true);
    const formData = new FormData();
    formData.append('file', verifyFile);

    try {
      const res = await axios.post(`${API_AI_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileHash = res.data.sha256;
      const searchRes = await axios.get(`${API_BLOCKCHAIN_URL}/api/evidence`);
      const match = searchRes.data.find(e => e.hash.toLowerCase() === fileHash.toLowerCase());
      setVerifyResult(match ? { status: 'authentic', data: match } : { status: 'tampered' });
    } catch (err) {
      console.error("Verification error", err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">

      {/* --- Sidebar --- */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-3xl border-r border-white/5 flex flex-col z-30 shadow-[40px_0_100px_-40px_rgba(0,0,0,0.5)]">
        <div className="p-8 border-b border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] animate-shimmer opacity-50"></div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter">SECURE<span className="text-blue-500">LOCK</span></h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Corda Forensic Node</p>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-1 flex border border-white/5">
            <button
              onClick={() => setRole('officer')}
              className={`flex-1 py-2 px-3 text-[10px] font-black rounded-xl transition-all flex items-center justify-center space-x-2 ${role === 'officer' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <User className="w-3 h-3" />
              <span>OFFICER</span>
            </button>
            <button
              onClick={() => setRole('judge')}
              className={`flex-1 py-2 px-3 text-[10px] font-black rounded-xl transition-all flex items-center justify-center space-x-2 ${role === 'judge' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <FileCheck className="w-3 h-3" />
              <span>JUDGE</span>
            </button>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {role === 'officer' ? (
            <>
              <button onClick={() => setActiveTab('upload')} className={`nav-btn ${activeTab === 'upload' && 'active'}`}>
                <Upload className={`w-5 h-5 ${activeTab === 'upload' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>Deposit Case</span>
              </button>
              <button onClick={() => setActiveTab('list')} className={`nav-btn ${activeTab === 'list' && 'active'}`}>
                <Activity className={`w-5 h-5 ${activeTab === 'list' ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>Forensic Log</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('verify')} className={`nav-btn ${activeTab === 'verify' && 'active'}`}>
                <Eye className={`w-5 h-5 ${activeTab === 'verify' ? 'text-purple-400' : 'text-slate-500'}`} />
                <span>Court Verification</span>
              </button>
              <button onClick={() => setActiveTab('list')} className={`nav-btn ${activeTab === 'list' && 'active'}`}>
                <Globe className={`w-5 h-5 ${activeTab === 'list' ? 'text-purple-400' : 'text-slate-500'}`} />
                <span>Master Docket</span>
              </button>
            </>
          )}
        </nav>

        <div className="p-8 space-y-6">
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10"><Cpu className="w-12 h-12" /></div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">System Health</h4>
            <div className="space-y-4">
              <StatusIndicator label="Corda Consensus" status="Healthy" />
              <StatusIndicator label="AI Service" status="Online" />
              <StatusIndicator label="IPFS Gateway" status="Active" color="text-cyan-400" />
            </div>
          </div>
          <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] text-center">
            Protocol v2.4.0-Forensic
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-auto relative bg-slate-950">

        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[150px] animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] animate-float [animation-delay:2s]"></div>
        </div>

        <div className="p-12 max-w-7xl mx-auto relative z-10">

          {activeTab === 'upload' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <header className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 animate-pulse rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                    <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Forensic Deposition Initialized</span>
                  </div>
                  <h1 className="text-5xl font-black text-white tracking-tighter">Secure Asset <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Anchoring</span></h1>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Left: Upload Workflow */}
                <div className="lg:col-span-8 space-y-10">

                  {/* Step 1: Upload */}
                  <div className="glass-card rounded-[2.5rem] p-12 border-white/5 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700"></div>
                    <div className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center text-center transition-all duration-700 cursor-pointer ${file ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/40 hover:bg-slate-900/50'}`}
                      onClick={() => document.getElementById('fileInput').click()}>
                      <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />

                      {!file ? (
                        <>
                          <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-inner ring-1 ring-white/5 group-hover:scale-110 transition-transform duration-500">
                            <Upload className="w-10 h-10 text-blue-400" />
                          </div>
                          <h3 className="text-2xl font-black mb-4">Ingest Primary Evidence</h3>
                          <p className="text-slate-400 max-w-xs font-medium text-sm leading-relaxed">Drag and drop the source file. System will automatically initiate forensic clustering.</p>
                        </>
                      ) : (
                        <div className="animate-in zoom-in duration-500">
                          <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-600/40 ring-1 ring-blue-400">
                            <FileCheck className="w-10 h-10 text-white" />
                          </div>
                          <h3 className="text-2xl font-black mb-2">{file.name}</h3>
                          <p className="text-blue-400 font-mono text-xs uppercase tracking-widest font-bold">SHA-Candidate Ready</p>
                        </div>
                      )}
                    </div>

                    {file && !analysis && (
                      <div className="mt-10 flex justify-center">
                        <button
                          onClick={(e) => {
                            console.log("Button DOM Clicked");
                            e.stopPropagation();
                            analyzeEvidence();
                          }}
                          disabled={isAnalyzing}
                          className="primary-glow-btn flex items-center justify-center min-w-[300px]"
                          style={{ zIndex: 100, position: 'relative' }}
                        >
                          {isAnalyzing ? <Activity className="animate-spin mr-3" /> : <Navigation className="mr-3" />}
                          {isAnalyzing ? "Processing AI Clusters..." : "Launch Forensic Pipeline"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 2: Analysis Results Viewport */}
                  {analysis && !successMsg && (
                    <div className="animate-in slide-in-from-bottom-12 duration-700 space-y-10">
                      {/* Trust Metrics Overlay */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                        <div className="glass-card rounded-[2rem] p-8 border-white/5 flex flex-col items-center justify-center space-y-6">
                          <TrustScore score={analysis.ai_analysis.tamper_score < 0.5 ? 98 : 34} />
                          <div className="text-center">
                            <div className="px-4 py-1.5 bg-slate-950 text-cyan-400 rounded-full text-[10px] font-black border border-cyan-500/20 uppercase tracking-widest inline-block mb-3">Forensic Grade Asset</div>
                            <p className="text-slate-500 text-xs font-medium max-w-[180px]">Based on PRNU sensor noise and pixel consistency data.</p>
                          </div>
                        </div>

                        <div className="glass-card rounded-[2rem] p-8 border-white/5 flex flex-col">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                            <Cpu className="w-3 h-3 mr-2 text-blue-500" /> AI Vision Output
                          </h4>
                          <div className="flex-1 flex flex-wrap gap-3 content-start">
                            {analysis.ai_analysis.detected_objects.map((obj, i) => (
                              <div key={i} className="px-5 py-2.5 bg-blue-600/10 border border-blue-500/30 rounded-xl text-xs font-black text-blue-300 uppercase tracking-widest flex items-center">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                                {obj}
                              </div>
                            ))}
                            {analysis.ai_analysis.detected_objects.length === 0 && <span className="text-slate-600 italic text-sm">No critical objects identified.</span>}
                          </div>
                          <div className="mt-8 p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                              <span className="text-slate-500">Metadata Scan</span>
                              <span className="text-blue-400">{analysis.ai_analysis.metadata_status}</span>
                            </div>
                            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className="w-[100%] h-full bg-blue-500 animate-shimmer"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Anchor Actions */}
                      <div className="glass-card rounded-[2rem] p-10 border-white/5 flex items-center justify-between shadow-[0_0_40px_-5px_rgba(59,130,246,0.1)]">
                        <div className="flex items-center space-x-8">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-700 ${isSigned ? 'bg-green-600 border-green-400 animate-bounce' : 'bg-slate-950 border-white/10 animate-pulse'}`}>
                            {isSigned ? <CheckCircle className="w-8 h-8 text-white" /> : <Lock className="w-7 h-7 text-blue-400" />}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black leading-none mb-1">{isSigned ? 'Officer Signature Verified' : 'Cryptographic Endorsement Required'}</h3>
                            <p className="text-slate-500 font-medium text-sm italic">{isSigned ? 'Witness ID: OFCR-UNIT-2940' : 'Awaiting Officer biometric key signature...'}</p>
                          </div>
                        </div>

                        {!isSigned ? (
                          <button onClick={signEvidence} disabled={signingStep} className="px-8 py-4 bg-white text-slate-950 hover:bg-blue-50 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center">
                            {signingStep ? <Activity className="animate-spin mr-3" /> : <Key className="mr-3 w-4 h-4" />}
                            {signingStep ? 'Simulating Biometric Handshake...' : 'Sign Evidence'}
                          </button>
                        ) : (
                          <button onClick={submitToBlockchain} disabled={isSubmitting} className="primary-glow-btn px-10">
                            {isSubmitting ? <Activity className="animate-spin mr-3" /> : <Shield className="mr-3 w-4 h-4" />}
                            {isSubmitting ? 'Anchoring Transaction...' : 'Commit to Corda Ledger'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {successMsg && (
                    <div className="animate-in zoom-in duration-500 glass-card rounded-[3rem] p-12 text-center border-green-500/30 space-y-8 shadow-[0_0_100px_rgba(34,197,94,0.1)]">
                      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                        <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-4xl font-extrabold tracking-tighter">Blockchain Anchor <span className="text-green-400 underline decoration-2 underline-offset-8 decoration-green-500/50">Successful</span></h2>
                        <p className="text-slate-400 font-medium text-lg">Global Consensus reached. Ledger update confirmed by Notary.</p>
                      </div>
                      <div className="inline-flex flex-col p-6 bg-slate-950/80 rounded-2xl border border-white/5 space-y-3 mx-auto">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-600">Generated Asset ID</span>
                        <div className="flex items-center space-x-3 text-cyan-400 font-mono text-xl">
                          <Shield className="w-5 h-5 opacity-50" />
                          <span>{successMsg}</span>
                        </div>
                      </div>
                      <div className="pt-4">
                        <button onClick={() => setSuccessMsg('')} className="text-blue-400 font-black text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center mx-auto">
                          Initialize Next Deposit <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Asset Lifecycle Visualization */}
                <div className="lg:col-span-4 space-y-10">
                  <div className="glass-card rounded-[2.5rem] p-10 border-white/5">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-12 flex items-center">
                      <Clock className="w-4 h-4 mr-3 text-blue-500" /> Evidence Lifecycle
                    </h3>

                    <div className="space-y-0 translate-x-2">
                      <TimelineItem title="Initial Deposition" icon={Upload} completed={!!file} date={file ? 'Today, 2:44 PM' : null} />
                      <TimelineItem title="AI Forensic Cluster" icon={Cpu} completed={!!analysis} active={!!file && !analysis} date={analysis ? 'Processing Complete' : null} />
                      <TimelineItem title="Officer Signature" icon={Key} completed={isSigned} active={!!analysis && !isSigned} date={isSigned ? 'OFCR-9204 Verified' : null} />
                      <TimelineItem title="Corda Ledger Anchor" icon={Shield} completed={!!successMsg} active={isSigned && !successMsg} date={successMsg ? 'Transaction Finalized' : null} />
                      <TimelineItem title="Judicial Custody" icon={Eye} />
                    </div>

                    <div className="mt-6 pt-10 border-t border-white/5 text-center">
                      <div className="bg-slate-950/80 rounded-3xl p-6 border border-white/5 group hover:border-blue-500/30 transition-all duration-700">
                        <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">∞</div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-400">Ledger Immutability Guaranteed</h4>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <QuickStat icon={Hash} label="Pending TX" value="0.04s" color="text-green-400" />
                    <QuickStat icon={Navigation} label="DApp Nodes" value="4 Active" color="text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verify' && role === 'judge' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <header className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-purple-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-purple-500/30">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-black text-white tracking-tighter">Legal <span className="text-purple-400 underline decoration-purple-600/30 decoration-8 underline-offset-4">Admissibility</span> Node</h1>
                  <p className="text-slate-400 mt-2 text-lg font-medium">Verify forensic integrity via real-time R3 Corda database lookup.</p>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="glass-card rounded-[3rem] p-12 border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-purple-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
                  <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center">
                    <Download className="w-4 h-4 mr-3 text-purple-400" /> Deposition Ingest
                  </h2>

                  <div className={`border-3 border-dashed rounded-[2.5rem] p-16 text-center transition-all duration-700 cursor-pointer ${verifyFile ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/10 hover:border-purple-500/30 hover:bg-slate-900/50'}`}
                    onClick={() => document.getElementById('verifyInput').click()}>
                    <input type="file" id="verifyInput" className="hidden" onChange={handleVerifyFileChange} />

                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-all duration-700 ${verifyFile ? 'bg-purple-600 shadow-2xl shadow-purple-500/40' : 'bg-slate-950 ring-1 ring-white/10'}`}>
                      <Eye className={`w-10 h-10 ${verifyFile ? 'text-white' : 'text-slate-600'}`} />
                    </div>

                    <h3 className="text-2xl font-black text-slate-200 mb-4">{verifyFile ? verifyFile.name : 'Ingest Presentation File'}</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">System will perform real-time SHA-256 collision detection against the Corda master ledger.</p>
                  </div>

                  {verifyFile && (
                    <button onClick={runCourtVerification} disabled={isVerifying} className="w-full mt-12 py-6 bg-white text-slate-950 hover:bg-purple-50 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center">
                      {isVerifying ? <Activity className="animate-spin mr-3" /> : <Shield className="mr-3 w-4 h-4" />}
                      {isVerifying ? "Mining Forensic Comparison..." : "Validate Admissibility"}
                    </button>
                  )}
                </div>

                <div className="flex flex-col justify-center min-h-[500px]">
                  {!verifyResult && !isVerifying && (
                    <div className="glass-card rounded-[3rem] p-16 text-center border-dashed group border-white/5">
                      <Activity className="w-16 h-16 text-slate-800 mx-auto mb-8 animate-pulse" />
                      <h3 className="text-2xl font-black text-slate-600 mb-4">Awaiting Signal</h3>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">Verification engine requires a presented asset for cryptographic authentication.</p>
                    </div>
                  )}

                  {isVerifying && (
                    <div className="space-y-8">
                      <div className="h-32 bg-slate-900/50 backdrop-blur-md rounded-3xl animate-pulse ring-1 ring-white/5"></div>
                      <div className="h-80 bg-slate-900/50 backdrop-blur-md rounded-[3rem] animate-pulse ring-1 ring-white/5"></div>
                    </div>
                  )}

                  {verifyResult && (
                    <div className={`p-12 glass-card rounded-[3.5rem] border-2 animate-in slide-in-from-right duration-700 ${verifyResult.status === 'authentic' ? 'border-green-500/30' : 'border-red-500/30'}`}>
                      <div className="text-center space-y-10">
                        {verifyResult.status === 'authentic' ? (
                          <>
                            <div className="relative inline-block">
                              <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
                              <div className="relative w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                                <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h2 className="text-6xl font-black text-white tracking-tighter">AUTHENTIC</h2>
                              <p className="text-green-500 font-black uppercase tracking-[0.4em] text-xs">Ledger Consistency Confirmed</p>
                            </div>

                            <div className="p-8 bg-slate-950/80 rounded-[2rem] border border-white/5 text-left space-y-6 shadow-3xl">
                              <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hash Match</span>
                                <span className="text-cyan-400 font-mono text-xs select-all bg-slate-900 px-3 py-1 rounded-lg border border-white/5">{verifyResult.data.hash.substring(0, 24)}...</span>
                              </div>
                              <div className="flex justify-between items-center border-t border-white/5 pt-6">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Genesis Author</span>
                                <span className="text-white font-bold text-sm tracking-tight">POLICE_FORENSIC_NODE</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setShowCert(verifyResult.data)}
                              className="w-full py-5 border-2 border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all text-xs"
                            >
                              Generate Admissibility Certificate
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="relative inline-block">
                              <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 scale-150 animate-pulse"></div>
                              <div className="relative w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/40">
                                <AlertTriangle className="w-16 h-16 text-white" strokeWidth={3} />
                              </div>
                            </div>
                            <h2 className="text-6xl font-black text-white tracking-tighter">INVALID</h2>
                            <p className="text-red-500 font-black uppercase tracking-[0.4em] text-xs">Security Protocol Violation</p>
                            <div className="mt-6 p-8 bg-red-950/20 border border-red-500/20 rounded-[2rem] text-red-100 text-sm leading-relaxed font-medium">
                              The presented asset has NO matching record on the R3 Corda network.
                              Admitting this file into evidence would violate cryptographic chain-of-custody rules.
                            </div>
                            <button onClick={() => setVerifyResult(null)} className="mt-8 text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest">
                              Re-Scan Presented Asset
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-1000 space-y-12">
              <header className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Regional Storage Node #01</span>
                  </div>
                  <h1 className="text-5xl font-black text-white tracking-tighter">Master <span className="text-blue-500 italic">Audit</span> Docket</h1>
                </div>
                <button onClick={fetchEvidence} className="p-4 bg-slate-900 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all text-blue-400">
                  <Activity className="w-6 h-6" />
                </button>
              </header>

              <div className="grid grid-cols-1 gap-4">
                {evidenceList.map((item, i) => (
                  <div key={i} className="glass-card rounded-[2rem] p-8 border-white/5 flex items-center justify-between hover:border-blue-500/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 transition-all opacity-0 group-hover:opacity-100"></div>
                    <div className="flex items-center space-x-10 flex-1">
                      <div className="bg-slate-950 p-5 rounded-2xl ring-1 ring-white/10 group-hover:bg-blue-600 group-hover:ring-blue-400 transition-all duration-500">
                        <FileText className="w-7 h-7 text-slate-500 group-hover:text-white" />
                      </div>
                      <div className="min-w-[120px]">
                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1.5">Asset Ref</div>
                        <div className="text-lg font-black text-white truncate">{item.evidenceID}</div>
                      </div>
                      <div className="hidden lg:block flex-1 max-w-sm">
                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1.5">Consensus Hash</div>
                        <div className="text-[11px] font-mono text-cyan-400 group-hover:text-white transition-colors truncate">{item.hash}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-12">
                      <div className="hidden sm:block text-right">
                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1.5">Timestamp</div>
                        <div className="text-xs font-bold text-slate-300">JAN 25, 2026 - 18:44</div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                          <Shield className="w-4 h-4 text-green-500" />
                        </div>
                        <button onClick={() => setShowCert(item)} className="px-6 py-3 bg-slate-950 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-950 hover:border-white rounded-xl transition-all active:scale-95">
                          Auditor View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {evidenceList.length === 0 && (
                  <div className="glass-card rounded-[3.5rem] border-white/5 p-32 text-center group">
                    <div className="relative inline-block mb-10">
                      <div className="absolute inset-0 bg-slate-800 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <Server className="w-20 h-20 text-slate-800 relative z-10 mx-auto" strokeWidth={1} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-600 tracking-tight">Ledger Synchronized (Empty)</h3>
                    <p className="text-slate-700 mt-4 max-w-sm mx-auto font-medium">No forensic records have been committed to this region of the Corda network yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- Certificate Modal (The Legal Asset) --- */}
        {showCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500">
            <div className="bg-white rounded-[4rem] w-full max-w-3xl overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.3)] text-slate-950 relative border-[1px] border-white/20">
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none p-20 flex items-center justify-center overflow-hidden">
                <Shield className="w-[1200px] h-[1200px] rotate-[15deg] stroke-[0.5]" />
              </div>

              <div className="p-16 relative z-10 flex flex-col min-h-[700px]">
                <div className="flex justify-between items-start mb-16">
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-950 p-3 rounded-2xl shadow-2xl">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-black text-2xl tracking-[ -0.05em] uppercase">FORENSIC<span className="text-blue-600 italic">CERT</span></span>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Authenticity Signature</div>
                    <div className="text-sm font-mono font-bold bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100 select-all">SIG-C-{showCert.hash.substring(0, 12).toUpperCase()}-V4</div>
                  </div>
                </div>

                <div className="text-center mb-16 space-y-3">
                  <h1 className="text-5xl font-[1000] tracking-tighter text-slate-950 uppercase leading-none">Blockchain Proof</h1>
                  <p className="text-slate-500 font-semibold uppercase tracking-widest text-[11px]">Admissibility Certificate of Digital Forensic Ingest</p>
                </div>

                <div className="flex-1 space-y-12">
                  <div className="grid grid-cols-2 gap-12">
                    <div>
                      <label className="cert-label">Evidence ID</label>
                      <div className="cert-value truncate">{showCert.evidenceID}</div>
                    </div>
                    <div>
                      <label className="cert-label">Anchor Timestamp</label>
                      <div className="cert-value">2026-01-25 18:44:02 UTC</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col space-y-6">
                    <div>
                      <label className="cert-label mb-3 inline-block">Cryptographic Fingerprint (SHA-256)</label>
                      <div className="text-[15px] font-mono font-bold text-slate-700 break-all leading-relaxed bg-white border border-slate-200 p-6 rounded-2xl shadow-inner select-all">
                        {showCert.hash}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200">
                      <CertMini label="IPFS Root" value="Pinned (Qm9...)" />
                      <CertMini label="Consensus" value="R3 Validated" />
                      <CertMini label="Compliance" value="ISO-27037" />
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] border border-slate-200 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight max-w-[200px] tracking-tight">
                      This digital record is legally enforceable on the Corda peer-to-peer network.
                    </p>
                  </div>
                  <button onClick={() => setShowCert(null)} className="px-14 py-6 bg-slate-950 text-white hover:bg-blue-700 rounded-[2rem] font-black uppercase tracking-[0.25em] text-xs shadow-3xl transition-all active:scale-95">
                    Close Verification View
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Helper UI Components ---

function StatusIndicator({ label, status, color = 'text-blue-400' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
      <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{status}</span>
    </div>
  );
}

function QuickStat({ label, value, icon: Icon, color }) {
  return (
    <div className="glass-card rounded-[1.5rem] p-5 border-white/5 space-y-2">
      <Icon className={`w-4 h-4 ${color}`} />
      <div>
        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">{label}</div>
        <div className="text-sm font-black text-white">{value}</div>
      </div>
    </div>
  );
}

function CertMini({ label, value }) {
  return (
    <div>
      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-[11px] font-black text-slate-800">{value}</div>
    </div>
  );
}

export default App;
