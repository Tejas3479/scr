'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { playSound } from '@/services/sound';

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [consoleOutput, setConsoleOutput] = useState('SYSTEM STATUS: READY // SELECT OPERATIONAL ACTION VECTOR...');

  // 1. Interactive Console Commands
  const executeConsole = (commandType: string) => {
    playSound.tick();
    setConsoleOutput('>> INITIALIZING SYSTEM ACTION COMPUTE ARRAY...');
    setTimeout(() => {
      playSound.success();
      if (commandType === 'ALGAE_BIOMASS') {
        setConsoleOutput('>> ALGAE BIOMASS OPTIMIZATION SUCCESSFUL\n>> NUTRIENT DENSITY CORRELATIONS: 99.8%\n>> CO2 SEQUESTRATION FLOW: STABLE (+14.2%)');
      } else if (commandType === 'HAPTIC_OVERRIDE') {
        setConsoleOutput('>> HAPTIC OVERRIDE ENGAGED\n>> ROS2 FLEET COMMAND SENT TO DRONES\n>> DUST FLIGHT PATH SET IN DigitalTwin Mesh');
      } else if (commandType === 'LEDGER_AUDIT') {
        setConsoleOutput('>> GREEN LEDGER AUDIT COMPLETED\n>> practice SCORE ACCORDANCE: 100%\n>> Solana SPL MINT SIG GENERATED: AgriLedger...f3d9');
      }
    }, 800);
  };

  // 2. Oscilloscope Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw oscilloscope grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw Wave 1: Alpha Waves (Cyan)
      ctx.beginPath();
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.03 + time) * 20 + Math.cos(x * 0.01 + time * 1.5) * 10;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Wave 2: Beta Waves (Green)
      ctx.beginPath();
      ctx.strokeStyle = '#00FF41';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.cos(x * 0.05 - time * 1.8) * 15 + Math.sin(x * 0.02 - time * 0.8) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050810] text-[#ecf0f1] font-sans antialiased overflow-x-hidden relative selection:bg-[#00F0FF] selection:text-[#050810]">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] bg-radial-gradient from-[rgba(0,240,255,0.04)] to-transparent rounded-full filter blur-[100px]" />
        <div className="absolute bottom-[15%] right-[5%] w-[45vw] h-[45vw] bg-radial-gradient from-[rgba(0,255,65,0.04)] to-transparent rounded-full filter blur-[120px]" />
      </div>

      {/* Styles Injection */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        
        .font-display {
          font-family: 'Orbitron', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .glow-cyan {
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.6), 0 0 20px rgba(0, 240, 255, 0.3);
        }
        .glow-green {
          text-shadow: 0 0 10px rgba(0, 255, 65, 0.6), 0 0 20px rgba(0, 255, 65, 0.3);
        }
        .glow-btn:hover {
          box-shadow: 0 0 25px rgba(0, 240, 255, 0.55);
        }
        .glow-btn-green:hover {
          box-shadow: 0 0 25px rgba(0, 255, 65, 0.55);
        }
      `}</style>

      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-[#050810]/85 backdrop-blur-[15px] z-50 border-b border-[#00F0FF]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="logo flex items-center gap-3 font-display font-extrabold text-[1.4rem] text-[#00F0FF] tracking-wider">
          <span className="text-[#00FF41]">🌾</span> FARMQUEST<span className="text-[#00FF41]">.NEXUS</span>
        </div>
        <nav className="hidden md:flex gap-8 list-none">
          <li>
            <a href="#features" onMouseEnter={playSound.hover} onClick={playSound.tick} className="text-[#ecf0f1]/70 hover:text-[#00F0FF] font-mono text-sm transition-all hover:glow-cyan relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2px] after:bg-[#00F0FF] after:transition-all hover:after:w-full" style={{ paddingBottom: '4px' }}>
              FEATURES
            </a>
          </li>
          <li>
            <a href="#quantum" onMouseEnter={playSound.hover} onClick={playSound.tick} className="text-[#ecf0f1]/70 hover:text-[#00F0FF] font-mono text-sm transition-all hover:glow-cyan relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2px] after:bg-[#00F0FF] after:transition-all hover:after:w-full" style={{ paddingBottom: '4px' }}>
              CORE SYSTEM
            </a>
          </li>
          <li>
            <a href="/dashboard" onMouseEnter={playSound.hover} onClick={playSound.tick} className="text-[#ecf0f1]/70 hover:text-[#00F0FF] font-mono text-sm transition-all hover:glow-cyan relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:height-[2px] after:bg-[#00F0FF] after:transition-all hover:after:w-full" style={{ paddingBottom: '4px' }}>
              DASHBOARD
            </a>
          </li>
        </nav>
        <button onMouseEnter={playSound.hover} onClick={() => { playSound.tick(); router.push('/auth/login'); }} className="bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 px-6 py-2.5 rounded-xl font-bold font-mono text-xs cursor-pointer transition-all hover:bg-[#00F0FF] hover:text-[#050810] glow-btn">
          ENGAGE PORTAL
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-[6%] lg:px-[8%] pt-28 lg:pt-0 relative gap-10 z-10">
        <div className="max-w-[650px] text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-[#00FF41]/10 border border-[#00FF41]/30 text-[#00FF41] px-4 py-1.5 rounded-full font-mono text-xs font-bold mb-6">
            <div className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse" />
            SYSTEM STATUS: OPTIMAL (v3.0)
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.05] mb-6 bg-gradient-to-r from-[#00FF41] via-[#00F0FF] to-[#FF00FF] bg-clip-text text-transparent">
            NEXT-GEN SOLAR-PUNK COGNITIVE AGRI OS
          </h1>
          <p className="text-lg text-[#ecf0f1]/70 mb-10 leading-relaxed max-w-[600px] mx-auto lg:mx-0">
            Overhaul your farming universe with Three.js Spatial Twins, raw EEG Brain-Computer Interfaces, camera-based rPPG heart scans, and CRISPR pathogen diagnostics certified on the Solana blockchain.
          </p>
          <div className="flex gap-4 justify-center lg:justify-start">
            <button onClick={() => router.push('/auth/login')} className="bg-[#00F0FF] text-[#050810] font-bold font-mono px-8 py-3.5 rounded-xl cursor-pointer transition-all hover:-translate-y-1 glow-btn">
              ENGAGE PORTAL
            </button>
            <a href="#features" className="inline-block bg-transparent text-[#00FF41] border border-[#00FF41]/40 font-bold font-mono px-8 py-3.5 rounded-xl cursor-pointer transition-all hover:bg-[#00FF41]/10 hover:-translate-y-1 hover:glow-green">
              METRICS DECK
            </a>
          </div>
        </div>

        {/* Oscilloscope live feed render widget */}
        <div className="w-full max-w-[450px]">
          <div className="bg-[#0D1117]/45 backdrop-blur-[12px] border border-[#00F0FF]/25 rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden after:content-[''] after:absolute after:top-0 after:after:left-0 after:w-full after:height-full after:bg-[linear-gradient(rgba(13,17,23,0)_50%,rgba(0,240,255,0.03)_50%)] after:bg-[length:15px_15px] after:pointer-events-none">
            <div className="flex justify-between items-center border-b border-[#00F0FF]/15 pb-3 mb-4 font-mono text-[0.8rem]">
              <span className="text-[#00F0FF] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse" />
                EEG BRAIN FEED MONITOR
              </span>
              <span className="text-[#00FF41]">ACTIVE SYNCING</span>
            </div>
            <canvas ref={canvasRef} className="w-full h-[150px] bg-[#050810]/60 rounded-lg block" width="400" height="150" />
          </div>
        </div>
      </section>

      {/* FEATURES GRID SECTION */}
      <section id="features" className="py-24 px-[6%] lg:px-[8%] relative z-10 border-t border-[#00F0FF]/10">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-[2.8rem] font-black uppercase bg-gradient-to-r from-[#00FF41] to-[#00F0FF] bg-clip-text text-transparent">
            HYPER-DIMENSIONAL DEEP TECH
          </h2>
          <p className="text-[#ecf0f1]/50 font-mono text-sm mt-2">
            {'>>'} Decoupling standard agricultural practices from legacy constraints
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Spatial Twin */}
          <div className="group bg-[#0D1117]/45 backdrop-blur-[12px] border border-[#ecf0f1]/10 rounded-[20px] p-8 transition-all hover:-translate-y-2 hover:border-[#00F0FF] hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
            <div className="feature-icon w-[60px] h-[60px] bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-3xl text-[#00F0FF] mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              📦
            </div>
            <h3 className="font-display text-[1.3rem] font-bold text-white mb-3">3D WebXR Spatial Twins</h3>
            <p className="text-[#ecf0f1]/60 leading-relaxed text-[0.95rem]">
              Topographical Three.js rendering maps microclimatic field layers. Custom fragment GLSL shaders visualize real-time glowing soil moisture, pH, and nitrogen matrices.
            </p>
          </div>

          {/* BCI */}
          <div className="group bg-[#0D1117]/45 backdrop-blur-[12px] border border-[#ecf0f1]/10 rounded-[20px] p-8 transition-all hover:-translate-y-2 hover:border-[#00F0FF] hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
            <div className="feature-icon w-[60px] h-[60px] bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-3xl text-[#00F0FF] mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              🧠
            </div>
            <h3 className="font-display text-[1.3rem] font-bold text-white mb-3">Passive BCI EEG Controls</h3>
            <p className="text-[#ecf0f1]/60 leading-relaxed text-[0.95rem]">
              Hands-free robotic command deck integrating raw Electroencephalography. Custom GATT Web Bluetooth services map attention, stress, and eye confirm signals directly to machinery.
            </p>
          </div>

          {/* rPPG */}
          <div className="group bg-[#0D1117]/45 backdrop-blur-[12px] border border-[#ecf0f1]/10 rounded-[20px] p-8 transition-all hover:-translate-y-2 hover:border-[#00F0FF] hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
            <div className="feature-icon w-[60px] h-[60px] bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-3xl text-[#00F0FF] mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              ❤️
            </div>
            <h3 className="font-display text-[1.3rem] font-bold text-white mb-3">Optical rPPG Video Pulse</h3>
            <p className="text-[#ecf0f1]/60 leading-relaxed text-[0.95rem]">
              Cardiovascular photoplethysmography tracks subtle skin color variances on the green absorption channel. Dynamic HRV indexing triggers cognitive safety overrides.
            </p>
          </div>

          {/* CRISPR */}
          <div className="group bg-[#0D1117]/45 backdrop-blur-[12px] border border-[#ecf0f1]/10 rounded-[20px] p-8 transition-all hover:-translate-y-2 hover:border-[#00F0FF] hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
            <div className="feature-icon w-[60px] h-[60px] bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-3xl text-[#00F0FF] mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              🧬
            </div>
            <h3 className="font-display text-[1.3rem] font-bold text-white mb-3">CRISPR & Pathogen PCR</h3>
            <p className="text-[#ecf0f1]/60 leading-relaxed text-[0.95rem]">
              Bioinformatics engine aligning field DNA bioprobes against pathogen databases using Levenshtein distance vectors. Integrates Cas12/Cas13 collateral cleavage diagnostics.
            </p>
          </div>

          {/* Blockchain */}
          <div className="group bg-[#0D1117]/45 backdrop-blur-[12px] border border-[#ecf0f1]/10 rounded-[20px] p-8 transition-all hover:-translate-y-2 hover:border-[#00F0FF] hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
            <div className="feature-icon w-[60px] h-[60px] bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-3xl text-[#00F0FF] mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              🔗
            </div>
            <h3 className="font-display text-[1.3rem] font-bold text-white mb-3">Solana Carbon Credits</h3>
            <p className="text-[#ecf0f1]/60 leading-relaxed text-[0.95rem]">
              Tamper-proof certifications locking soil sequestration logs on Solana carbon contracts, automatically minting eco-friendly SPL tokens with custom metadata properties.
            </p>
          </div>

          {/* Zero Trust */}
          <div className="group bg-[#0D1117]/45 backdrop-blur-[12px] border border-[#ecf0f1]/10 rounded-[20px] p-8 transition-all hover:-translate-y-2 hover:border-[#00F0FF] hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] relative overflow-hidden">
            <div className="feature-icon w-[60px] h-[60px] bg-[#00F0FF]/10 rounded-xl flex items-center justify-center text-3xl text-[#00F0FF] mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              🛡️
            </div>
            <h3 className="font-display text-[1.3rem] font-bold text-white mb-3">Unbreachable WebAuthn</h3>
            <p className="text-[#ecf0f1]/60 leading-relaxed text-[0.95rem]">
              OAuth 2.1 WebAuthn biometric passkeys verify identities at the gateway. SPIRE-managed mutual TLS 1.3 certificates enforce strict microservice isolation.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CONSOLE DECK */}
      <section id="quantum" className="py-24 px-[6%] lg:px-[8%] bg-[#050810]/40 border-y border-[#00F0FF]/10 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-[2.8rem] font-black bg-gradient-to-r from-[#00FF41] to-[#00F0FF] bg-clip-text text-transparent">
            NEXUS COMMAND DECK
          </h2>
          <p className="text-[#ecf0f1]/50 font-mono text-sm mt-2">
            {'>>'} Interact directly with the local farm system node
          </p>
        </div>

        <div className="max-w-[900px] mx-auto bg-[#0D1117]/45 backdrop-blur-[15px] border border-[#00FF41]/25 rounded-[24px] p-10 shadow-[0_10px_40px_rgba(0,255,65,0.05)] relative">
          <div className="absolute top-[15px] left-[15px] w-5 h-5 border-t-2 border-l-2 border-[#00FF41]" />
          <div className="absolute top-[15px] right-[15px] w-5 h-5 border-t-2 border-r-2 border-[#00FF41]" />
          <div className="absolute bottom-[15px] left-[15px] w-5 h-5 border-b-2 border-l-2 border-[#00FF41]" />
          <div className="absolute bottom-[15px] right-[15px] w-5 h-5 border-b-2 border-r-2 border-[#00FF41]" />

          <div className="font-mono text-left">
            <div className="text-[#00FF41] mb-8 text-[0.95rem] leading-relaxed min-h-[70px] whitespace-pre-line bg-[#050810]/80 p-4 rounded-xl border border-[#00FF41]/10">
              {consoleOutput}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => executeConsole('ALGAE_BIOMASS')} className="bg-[#050810]/80 border border-[#00FF41]/35 rounded-xl p-4 text-[#00FF41] font-mono text-xs cursor-pointer transition-all hover:bg-[#00FF41]/15 hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:scale-[1.02]">
                🌿 OPTIMIZE ALGAE BIOMASS
              </button>
              <button onClick={() => executeConsole('HAPTIC_OVERRIDE')} className="bg-[#050810]/80 border border-[#00FF41]/35 rounded-xl p-4 text-[#00FF41] font-mono text-xs cursor-pointer transition-all hover:bg-[#00FF41]/15 hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:scale-[1.02]">
                🛸 DISPATCH DRONE FLEET
              </button>
              <button onClick={() => executeConsole('LEDGER_AUDIT')} className="bg-[#050810]/80 border border-[#00FF41]/35 rounded-xl p-4 text-[#00FF41] font-mono text-xs cursor-pointer transition-all hover:bg-[#00FF41]/15 hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:scale-[1.02]">
                🔗 AUDIT CARBON CREDITS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BIOMETRIC CTA */}
      <section className="py-28 px-[6%] lg:px-[8%] text-center relative z-10">
        <div className="max-w-[800px] mx-auto bg-gradient-to-br from-[#00F0FF]/5 to-[#FF00FF]/5 border border-[#00F0FF]/25 rounded-[30px] p-10 sm:p-14 backdrop-blur-[15px] shadow-[0_10px_45px_rgba(0,0,0,0.4)]">
          <h2 className="font-display text-4xl sm:text-[3rem] font-black mb-4 bg-gradient-to-r from-[#00F0FF] to-[#FF00FF] bg-clip-text text-transparent">
            ENGAGE NEURAL INTERFACE
          </h2>
          <p className="text-[#ecf0f1]/60 text-lg leading-relaxed max-w-[600px] mx-auto mb-8">
            Access the unified dashboard, launch spatial twins, and sync your BCI receiver profile. Join the Solarpunk agriculture revolution today.
          </p>
          <button onClick={() => router.push('/auth/login')} className="bg-[#00F0FF] text-[#050810] font-bold font-mono px-8 py-3.5 rounded-xl cursor-pointer transition-all hover:-translate-y-1 glow-btn">
            VERIFY SECURITY PASSKEY
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050810] border-t border-[#00F0FF]/10 px-[6%] lg:px-[8%] py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="logo text-white font-display font-extrabold text-[1.2rem] tracking-wider mb-4">
              <span>🌾</span> FARMQUEST
            </div>
            <p className="text-xs text-[#ecf0f1]/40 leading-relaxed max-w-[300px]">
              Deep-tech agricultural command platform mapping bio-metrics, digital twins, and decentralized ledgers.
            </p>
          </div>
          <div>
            <h4 className="font-display text-xs text-white uppercase tracking-wider mb-4">MICROSERVICES Grid</h4>
            <ul className="text-xs text-[#ecf0f1]/50 space-y-2.5">
              <li><span className="text-[#00F0FF] font-mono">user-service</span> (port 3000)</li>
              <li><span className="text-[#00F0FF] font-mono">mcp-server</span> (port 3001)</li>
              <li><span className="text-[#00F0FF] font-mono">bioinformatics-service</span> (port 3008)</li>
              <li><span className="text-[#00F0FF] font-mono">agents-service</span> (port 8000)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs text-white uppercase tracking-wider mb-4">ACADEMIC REFERENCES</h4>
            <ul className="text-xs space-y-2.5">
              <li><a href="#" className="text-[#ecf0f1]/50 hover:text-[#00F0FF] transition-all">Gootenberg et al. (CRISPR Diagnostics)</a></li>
              <li><a href="#" className="text-[#ecf0f1]/50 hover:text-[#00F0FF] transition-all">Lotte et al. (Passive BCIs)</a></li>
              <li><a href="#" className="text-[#ecf0f1]/50 hover:text-[#00F0FF] transition-all">NIST FIPS 204 (crystals-Dilithium)</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="copyright font-mono text-[0.75rem] text-[#ecf0f1]/40">
            &copy; 2026 FARMQUEST NEXUS. LOCKED UNDER CRYPTOGRAPHIC ECO-LICENSING.
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-[38px] h-[38px] bg-white/3 border border-white/5 rounded-xl flex items-center justify-center text-[#ecf0f1]/60 hover:bg-[#00F0FF] hover:text-[#050810] hover:glow-cyan hover:-translate-y-0.5 transition-all"><i className="fa-brands fa-github" /></a>
            <a href="#" className="w-[38px] h-[38px] bg-white/3 border border-white/5 rounded-xl flex items-center justify-center text-[#ecf0f1]/60 hover:bg-[#00F0FF] hover:text-[#050810] hover:glow-cyan hover:-translate-y-0.5 transition-all"><i className="fa-brands fa-discord" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
