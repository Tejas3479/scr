'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { playSound } from '@/services/sound';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  Zap, 
  Shield, 
  Cpu, 
  RefreshCw, 
  Layers, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Music, 
  Square, 
  Settings2, 
  Activity, 
  Wifi, 
  Coins, 
  ChevronRight, 
  Play, 
  Info,
  Database,
  Lock,
  ArrowRight,
  TrendingUp,
  Heart
} from 'lucide-react';

const biomeParams = {
  algae: { 
    title: 'Algae Bio-Reactor', 
    color: '#00FF41', 
    colorRGB: 'rgba(0, 255, 65, __ALPHA__)',
    glowClass: 'neon-glow-green',
    borderClass: 'border-neon-green/30',
    textClass: 'text-[#00FF41]',
    bgGlowClass: 'bg-[#00FF41]/10',
    tag: 'ACTIVE CO2 SEQUESTRATION: +14.2% OFFSET',
    desc: 'Biomicroscopic reactors generating high-yield bio-mesh organic compounds and micro-algae cells.'
  },
  hydro: { 
    title: 'Hydroponic Deck', 
    color: '#00F0FF', 
    colorRGB: 'rgba(0, 240, 255, __ALPHA__)',
    glowClass: 'neon-glow-cyan',
    borderClass: 'border-neon-cyan/30',
    textClass: 'text-[#00F0FF]',
    bgGlowClass: 'bg-[#00F0FF]/10',
    tag: 'IRRIGATION RE-CIRCULATION FLOW: 98.6%',
    desc: 'Automated agricultural space bays monitoring water flows, ambient temperature, and dynamic nutrient mixes.'
  },
  crispr: { 
    title: 'CRISPR Biotech Dome', 
    color: '#FF006B', 
    colorRGB: 'rgba(255, 0, 107, __ALPHA__)',
    glowClass: 'neon-glow-purple',
    borderClass: 'border-neon-pink/30',
    textClass: 'text-[#FF006B]',
    bgGlowClass: 'bg-[#FF006B]/10',
    tag: 'MUTATIVE PCR ALIGNMENTS: SECURE',
    desc: 'Bioinformatics diagnostic DNA probes performing sequence alignments against real-world pathogen databases.'
  },
  ledger: { 
    title: 'Decentralized Carbon Ledger', 
    color: '#FF00FF', 
    colorRGB: 'rgba(255, 0, 255, __ALPHA__)',
    glowClass: 'neon-glow-purple',
    borderClass: 'border-neon-purple/30',
    textClass: 'text-[#FF00FF]',
    bgGlowClass: 'bg-[#FF00FF]/10',
    tag: 'Anchor SPL TOKEN RECEIPT METRICS: STABLE',
    desc: 'Decentralized Solana contracts securing organic practices, carbon offsets, and transaction ledgers.'
  }
};

const biomeFreqs = {
  algae: [110, 165, 220, 330],   // A minor / organic detune
  hydro: [147, 220, 294, 440],   // D Major / spacious airiness
  crispr: [130, 195, 260, 390],  // C minor-ish / clinical precision
  ledger: [165, 247, 330, 495]   // E Major / digital crisp arpeggios
};

const channelParams = {
  alpha: { freq1: 0.03, freq2: 0.01, amp1: 20, amp2: 10, title: 'Alpha Relaxed Focus' },
  beta: { freq1: 0.08, freq2: 0.04, amp1: 15, amp2: 6, title: 'Beta Active Focus' },
  gamma: { freq1: 0.15, freq2: 0.08, amp1: 8, amp2: 4, title: 'Gamma High Cognition' },
  theta: { freq1: 0.015, freq2: 0.005, amp1: 30, amp2: 15, title: 'Theta Deep Processing' }
};

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const rppgCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // 1. Theme and Biome Selection
  const [activeBiome, setActiveBiome] = useState<'algae' | 'hydro' | 'crispr' | 'ledger'>('algae');

  // 2. Interactive Synthesizer States
  const [frequency, setFrequency] = useState(440);
  const [waveform, setWaveform] = useState<'sine' | 'triangle' | 'sawtooth' | 'square'>('triangle');
  const [volume, setVolume] = useState(0.15);
  const [isDroneActive, setIsDroneActive] = useState(false);
  const [visualizerPhase, setVisualizerPhase] = useState(0);
  const [audioPromptVisible, setAudioPromptVisible] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<{ oscillators: OscillatorNode[]; biquadFilter: BiquadFilterNode; gainNode: GainNode } | null>(null);
  const requestRef = useRef<number | null>(null);

  // Get AudioContext Client-Side
  const getContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const startDrone = (biome: 'algae' | 'hydro' | 'crispr' | 'ledger' = activeBiome) => {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    stopDrone();

    const gainNode = ctx.createGain();
    const biquadFilter = ctx.createBiquadFilter();

    biquadFilter.type = 'lowpass';
    biquadFilter.frequency.setValueAtTime(150, ctx.currentTime);
    biquadFilter.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 3);
    biquadFilter.Q.setValueAtTime(4, ctx.currentTime);

    const baseFreqs = biomeFreqs[biome];
    const oscillators = baseFreqs.map((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      // Slight detune for lush chorusing feel
      osc.frequency.setValueAtTime(freq + (idx - 1.5) * 1.5, ctx.currentTime);
      return osc;
    });

    oscillators.forEach(osc => osc.connect(biquadFilter));
    biquadFilter.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.18, ctx.currentTime + 1.5);

    oscillators.forEach(osc => osc.start());

    // Slow sweep LFO to simulate wind/organic breathing
    const sweepLFO = ctx.createOscillator();
    const sweepLFOGain = ctx.createGain();
    sweepLFO.frequency.setValueAtTime(0.08, ctx.currentTime);
    sweepLFOGain.gain.setValueAtTime(400, ctx.currentTime);

    sweepLFO.connect(sweepLFOGain);
    sweepLFOGain.connect(biquadFilter.frequency);
    
    sweepLFO.start();

    droneNodesRef.current = {
      oscillators: [...oscillators, sweepLFO],
      biquadFilter,
      gainNode
    };
    setIsDroneActive(true);
    setAudioPromptVisible(false);
  };

  const stopDrone = () => {
    if (droneNodesRef.current) {
      const { oscillators } = droneNodesRef.current;
      try {
        oscillators.forEach(osc => osc.stop());
      } catch (e) {}
      setIsDroneActive(false);
      droneNodesRef.current = null;
    }
  };

  const toggleDrone = () => {
    playSound.tick();
    if (isDroneActive) {
      stopDrone();
    } else {
      startDrone();
    }
  };

  const playCustomBlip = () => {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency / 3, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.17);
    setAudioPromptVisible(false);
  };

  // Adjust drone volume dynamically
  useEffect(() => {
    if (droneNodesRef.current?.gainNode) {
      droneNodesRef.current.gainNode.gain.linearRampToValueAtTime(
        volume * 0.18,
        audioCtxRef.current?.currentTime || 0
      );
    }
  }, [volume]);

  // Handle Biome Selector shifts
  const handleBiomeSelect = (biome: 'algae' | 'hydro' | 'crispr' | 'ledger') => {
    playSound.tick();
    setActiveBiome(biome);
    
    if (isDroneActive) {
      startDrone(biome);
    }

    typeConsoleOutput(`>> SHIFTING COGNITIVE SUB-MATRIX...
>> NEW CORE BIOME MOUNTED: ${biome.toUpperCase()} (${biomeParams[biome].title.toUpperCase()})
>> DILITHIUM SECURITY MATRIX ADJUSTED. OSCILLOSCOPE MODULATION SYNC COMPLETE.
>> SYSTEM TELEMETRY DAMPERS: OPTIMAL.`);
  };

  // 3. Interactive Terminal Prompt Parser
  const INITIAL_TERMINAL_OUTPUT = `FARMQUEST COGNITIVE OS v3.0 [BOOT SEQUENCE SECURE]
------------------------------------------------------------
>> NEURAL CHIP-SET ALLOCATIONS VERIFIED (SPIRE mTLS 1.3 ACTIVE)
>> FOUR ECOSYSTEM BIOME HUDS MOUNTED TO COMMAND DECK
------------------------------------------------------------
TYPE /help IN THE SYSTEM PROMPT BELOW FOR CORE PROTOCOLS.`;

  const [consoleOutput, setConsoleOutput] = useState(INITIAL_TERMINAL_OUTPUT);
  const [terminalInput, setTerminalInput] = useState('');
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    playSound.tick();
    const cmd = terminalInput.trim();
    setTerminalInput('');
    
    let response = `\n[SYSTEM@FARMQUEST] > ${cmd}\n`;
    
    const args = cmd.split(' ');
    const primaryCmd = args[0].toLowerCase();

    if (primaryCmd === '/help') {
      response += `>> AVAILABLE PROTOCOLS & CORE EXECUTIVE MACROS:
------------------------------------------------------------
  /help            - EXPOSE ALL ACTIVE CLI ACTIONS
  /scan            - INITIATE CRISPR PATHOGEN PCR DIAGNOSTICS
  /status          - RENDER ENCLAVE METRICS & SOLANA LEDGER
  /biome <name>    - SHIFT COGNITIVE BIOME (algae, hydro, crispr, ledger)
  /audio           - TOGGLE AMB-DRONE SYNTH COBALT ENGINE
  /solana          - SECURITIZE CARBON DEED & MINT SPL TOKEN
  /clear           - PURGE DECK TERMINAL HISTORIES
------------------------------------------------------------`;
      typeConsoleOutput(response);
    } else if (primaryCmd === '/clear') {
      setConsoleOutput('>> CONSOLE PURGE COMPLETED. READY FOR INSTRUCTIONS.');
    } else if (primaryCmd === '/scan') {
      setActiveCommand('SCAN');
      playSound.alarm();
      typeConsoleOutput(response + `>> INITIATING BIOPHOTOIC DNA PATHOGEN SCAN...\n>> ALIGNING CAS12 ENZYMATIC TARGET MATRIX...`);
      
      setTimeout(() => {
        playSound.success();
        typeConsoleOutput(response + `>> SCAN COMPLETED. 0 MUTATIONS IDENTIFIED.\n>> ALGAE BIO-REACTORS: 99.8% HEALTHY\n>> PCR SEED SEQUENCE GAP INDEX: 0.00% (STABLE)\n>> BIOME COMPLIANCE STATUS: RATED AA+`);
        setActiveCommand(null);
      }, 1500);
    } else if (primaryCmd === '/status') {
      typeConsoleOutput(response + `>> ECO SYSTEM OS HEALTH REPORT:
------------------------------------------------------------
  BCI BLUETOOTH FEED : SYNCED (ATTENTION: 84%)
  rPPG HEART MONITOR : ACTIVE (PULSE: 72 BPM)
  SOLANA ENCLAVE     : AgriFarmerX992b8dff2384a88fbc923e
  MUTUAL TLS 1.3     : VERIFIED (SPIRE ISSUED CERTIFICATE)
  LOCAL STORAGE MET  : POSTGRESQL STABLE (PORT 5433)
  NEO4J GRAPHRAG     : SEEDED WITH 1,422 PATHOGEN RELATIONSHIPS
------------------------------------------------------------`);
    } else if (primaryCmd === '/biome') {
      const targetBiome = args[1]?.toLowerCase();
      if (targetBiome === 'algae' || targetBiome === 'hydro' || targetBiome === 'crispr' || targetBiome === 'ledger') {
        handleBiomeSelect(targetBiome as any);
      } else {
        typeConsoleOutput(response + `>> ERROR: INVALID BIOME NAME. SELECT algae, hydro, crispr, or ledger.\n>> EXAMPLE: /biome hydro`);
      }
    } else if (primaryCmd === '/audio') {
      toggleDrone();
      typeConsoleOutput(response + `>> SYNTH ENGINE STATE MODIFIED.\n>> COBALT DRONE DRIVERS SET TO: ${!isDroneActive ? 'ENABLED' : 'DISABLED'}`);
    } else if (primaryCmd === '/solana') {
      setActiveCommand('SOLANA');
      playSound.alarm();
      typeConsoleOutput(response + `>> COMPILING GREEN Practices TRANSACTION PACKETS...\n>> SEALING CRYPTOGRAPHIC RECEIPT DILITHIUM KEYS...`);
      
      setTimeout(() => {
        playSound.success();
        typeConsoleOutput(response + `>> TRANSACTION SECURED ON SOLANA BLOCKCHAIN.\n>> Anchor CERTIFICATE SIGNATURE: AgriLedgerSignature0xf3d9_a8f2\n>> CARBON SPL CREDIT TOKEN MINTED TO WALLET ADDRESS:\n   AgriFarmerX992b... (+14.00 Carbon Credits)`);
        setActiveCommand(null);
      }, 1500);
    } else {
      typeConsoleOutput(response + `>> ERROR: PROTOCOL NOT FOUND.\n>> TYPE /help TO EXPOSE ACTIVE OS COMMANDS.`);
    }
  };

  // Typewriter Character Printing Effect
  const typeConsoleOutput = (fullText: string) => {
    let currentText = '';
    let index = 0;
    const interval = setInterval(() => {
      currentText += fullText[index];
      setConsoleOutput(currentText);
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
      if (Math.random() > 0.82) playSound.tick(); // soft keyboard typewriter clicks
    }, 10);
  };

  // 4. Simulated Microservices Latency Metrics
  const [latencyMetrics, setLatencyMetrics] = useState({
    apiGateway: 12,
    mcpServer: 18,
    bioinformatics: 28,
    agentsGraph: 52
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyMetrics({
        apiGateway: Math.floor(8 + Math.random() * 8),
        mcpServer: Math.floor(12 + Math.random() * 10),
        bioinformatics: Math.floor(22 + Math.random() * 15),
        agentsGraph: Math.floor(45 + Math.random() * 20)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 5. Brainwave EEG Feeds
  const [activeChannel, setActiveChannel] = useState<'alpha' | 'beta' | 'gamma' | 'theta'>('alpha');

  const handleChannelSelect = (chan: 'alpha' | 'beta' | 'gamma' | 'theta') => {
    playSound.tick();
    setActiveChannel(chan);
    typeConsoleOutput(`>> CHANNEL SYNC CONGESTED: ${channelParams[chan].title.toUpperCase()}\n>> ADJUSTING EEG OSCILLOSCOPE AMPLITUDE PROFILE FOR OPTIMAL BIO-SYNAPSING...`);
  };

  // 6. Canvas Oscilloscope & Particles Animation Loops
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

      // Draw Grid Matrix (Oscilloscope lines)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.02)';
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

      const activeParams = channelParams[activeChannel];
      const themeColor = biomeParams[activeBiome].color;

      // Draw Wave 1: Primary Harmonics
      ctx.beginPath();
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = themeColor;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
          Math.sin(x * activeParams.freq1 + time) * activeParams.amp1 + 
          Math.cos(x * activeParams.freq2 + time * 1.5) * activeParams.amp2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Wave 2: Outer Harmonics
      ctx.beginPath();
      ctx.strokeStyle = themeColor + '55'; // 33% opacity
      ctx.lineWidth = 1.2;
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + 
          Math.cos(x * (activeParams.freq1 * 1.6) - time * 1.2) * (activeParams.amp1 * 0.7) + 
          Math.sin(x * (activeParams.freq2 * 0.8) - time * 0.8) * (activeParams.amp2 * 0.7);
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
  }, [activeChannel, activeBiome]);

  // Full screen particle flows
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 32000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeParams = biomeParams[activeBiome];
      ctx.fillStyle = activeParams.color + '44'; // slightly transparent fill

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        if (mouseX !== -1000 && mouseY !== -1000) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            p.x += (dx / dist) * 0.15;
            p.y += (dy / dist) * 0.15;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.06;
            ctx.strokeStyle = activeParams.colorRGB.replace('__ALPHA__', alpha.toString());
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeBiome]);

  // 7. Simulated rPPG Cardiac Wave Animation
  useEffect(() => {
    const canvas = rppgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;
    const drawHeartbeat = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#FF006B';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#FF006B';

      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        // Generate simulated electrocardiogram wave shape
        let y = canvas.height / 2;
        const normX = (x + offset) % 60;
        if (normX > 15 && normX < 18) {
          y -= 12; // P wave
        } else if (normX >= 18 && normX < 20) {
          y += 4;
        } else if (normX >= 20 && normX < 22) {
          y -= 30; // QRS peak
        } else if (normX >= 22 && normX < 24) {
          y += 15;
        } else if (normX >= 24 && normX < 28) {
          y -= 4;
        } else if (normX >= 32 && normX < 38) {
          y -= 8; // T wave
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      offset += 1.5;

      animationFrameId = requestAnimationFrame(drawHeartbeat);
    };

    drawHeartbeat();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const activeParams = biomeParams[activeBiome];

  // Helper for generating custom wave strings
  const generateWavePath = () => {
    let points = [];
    const width = 280;
    const height = 60;
    const amplitude = isDroneActive ? 18 : 6;
    const numPoints = 60;

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width;
      const ratio = i / numPoints;
      const envelope = Math.sin(ratio * Math.PI); // smooth edges
      
      let y = height / 2;
      const phase = (ratio * (frequency / 70) + visualizerPhase);
      if (waveform === 'sine') {
        y += Math.sin(phase) * amplitude * envelope;
      } else if (waveform === 'triangle') {
        const trig = Math.abs(((phase % (Math.PI * 2)) / Math.PI) - 1) * 2 - 1;
        y += trig * amplitude * envelope;
      } else if (waveform === 'sawtooth') {
        const saw = ((phase % (Math.PI * 2)) / (Math.PI * 2)) * 2 - 1;
        y += saw * amplitude * envelope;
      } else if (waveform === 'square') {
        const sq = Math.sin(phase) >= 0 ? 1 : -1;
        y += sq * amplitude * envelope;
      }
      
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  // Phase update for audio visualizer
  useEffect(() => {
    const animate = () => {
      setVisualizerPhase(prev => (prev + 0.18) % (Math.PI * 2));
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Cleanup synthesizer drone on unmount
  useEffect(() => {
    return () => {
      stopDrone();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050810] text-[#ecf0f1] font-sans antialiased overflow-x-hidden relative selection:bg-[#00F0FF] selection:text-[#050810]">
      
      {/* Full-Screen Organic Connected Matrix Canvas */}
      <canvas ref={particlesCanvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 block" />

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:100%_30px] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:30px_100%] z-0" />

      {/* Dynamic Biome Color Blob Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute top-[8%] left-[5%] w-[45vw] h-[45vw] rounded-full filter blur-[150px] animate-blob transition-all duration-[2000ms]" 
          style={{ 
            background: `radial-gradient(circle, ${activeParams.color}15 0%, transparent 70%)`
          }}
        />
        <div 
          className="absolute bottom-[10%] right-[3%] w-[50vw] h-[50vw] rounded-full filter blur-[150px] animate-blob animation-delay-2000 transition-all duration-[2000ms]" 
          style={{ 
            background: `radial-gradient(circle, ${activeParams.color}10 0%, transparent 70%)`
          }}
        />
      </div>

      {/* Dynamic Sound Action Overlay Alert */}
      <AnimatePresence>
        {audioPromptVisible && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="glass-hud border-neon-cyan/40 p-4 rounded-xl shadow-[0_8px_30px_rgba(0,240,255,0.2)] flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-mono uppercase tracking-wide">
                <Info className="w-4 h-4 text-neon-cyan animate-pulse" />
                <span>SOUND ENGINE DORMANT</span>
              </div>
              <button 
                onClick={() => { playSound.success(); startDrone(); }}
                className="bg-neon-cyan/20 border border-neon-cyan/50 hover:bg-neon-cyan text-neon-cyan hover:text-cyber-darker px-3 py-1.5 rounded-lg tech-mono text-[9px] font-bold uppercase transition-all"
              >
                ACTIVATE OS AUDIO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center bg-[#050810]/85 backdrop-blur-[15px] z-50 border-b border-[#00F0FF]/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="logo flex items-center gap-3 font-display font-extrabold text-[1.4rem] tracking-wider relative group select-none">
          <span className="text-[#00FF41] animate-pulse group-hover:scale-110 transition-transform">🌾</span> 
          <span className="text-white">FARMQUEST</span>
          <span className="text-[#00FF41] tech-mono text-xs border border-[#00FF41]/40 px-1.5 py-0.5 rounded ml-1 bg-[#00FF41]/10">OS v3.0</span>
        </div>
        <nav className="hidden md:flex gap-8 list-none">
          <li>
            <a href="#features" onMouseEnter={playSound.hover} onClick={playSound.tick} className="text-[#ecf0f1]/70 hover:text-[#00F0FF] font-mono text-[10px] tracking-wider transition-all hover:glow-cyan relative uppercase">
              Operational Subsystems
            </a>
          </li>
          <li>
            <a href="#quantum" onMouseEnter={playSound.hover} onClick={playSound.tick} className="text-[#ecf0f1]/70 hover:text-[#00F0FF] font-mono text-[10px] tracking-wider transition-all hover:glow-cyan relative uppercase">
              Command Deck
            </a>
          </li>
          <li>
            <Link href="/dashboard" onMouseEnter={playSound.hover} onClick={playSound.tick} className="text-[#ecf0f1]/70 hover:text-[#00F0FF] font-mono text-[10px] tracking-wider transition-all hover:glow-cyan relative uppercase">
              Enter Dashboard
            </Link>
          </li>
        </nav>
        <button 
          onMouseEnter={playSound.hover} 
          onClick={() => { playSound.tick(); router.push('/auth/login'); }} 
          className="bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 hover:border-neon-cyan px-6 py-2.5 rounded-xl font-bold font-mono text-[10px] uppercase tracking-wider cursor-pointer transition-all hover:bg-neon-cyan hover:text-[#050810] shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:scale-[1.03] active:scale-95"
        >
          ENGAGE OS GATEWAY
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col xl:flex-row items-center justify-between px-[6%] lg:px-[8%] pt-32 xl:pt-0 relative gap-12 z-10">
        
        {/* Left Side: System Introduction & Biome Selection */}
        <div className="max-w-[700px] text-center xl:text-left flex flex-col items-center xl:items-start">
          
          <div className="inline-flex items-center gap-2 bg-[#00FF41]/10 border border-[#00FF41]/35 text-[#00FF41] px-4 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider mb-6">
            <span className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-ping" />
            SYSTEM CORE STATUS: INTEGRATED & ALIVE
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.05] mb-6 tracking-wide select-none">
            NEXT-GEN COGNITIVE <br className="hidden sm:block" />
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r transition-all duration-[1000ms]"
              style={{
                backgroundImage: `linear-gradient(to right, ${activeParams.color}, #00F0FF, #FF00FF)`,
                textShadow: `0 0 40px ${activeParams.color}22`
              }}
            >
              SOLARPUNK AGRI OS
            </span>
          </h1>

          <p className="text-sm text-[#ecf0f1]/70 mb-8 leading-relaxed max-w-[620px] font-mono uppercase tracking-wide">
            Overhaul your farming universe with dynamic Web Audio synthetics, Real-Time EEG brain-computer channels, camera-captured rPPG heart rate metrics, and secure CRISPR alignments minted directly to the Solana ledger.
          </p>

          {/* Interactive Biomes Selection Dock */}
          <div className="w-full mb-8">
            <label className="text-[10px] tech-mono text-white/50 block mb-3 uppercase tracking-widest text-center xl:text-left">
              SELECT ACTIVE AGRICULTURAL COGNITIVE BIOME:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['algae', 'hydro', 'crispr', 'ledger'] as const).map(b => (
                <button
                  key={b}
                  onMouseEnter={playSound.hover}
                  onClick={() => handleBiomeSelect(b)}
                  className={`border p-3.5 rounded-xl text-left transition-all relative overflow-hidden group cursor-pointer ${
                    activeBiome === b
                      ? `bg-gradient-to-br from-cyber-dark to-cyber-darker text-white shadow-[0_0_20px_rgba(0,0,0,0.8)]`
                      : 'border-white/5 bg-[#050810]/40 text-white/50 hover:border-white/20 hover:text-white'
                  }`}
                  style={{
                    borderColor: activeBiome === b ? biomeParams[b].color : undefined,
                    boxShadow: activeBiome === b ? `inset 0 0 10px ${biomeParams[b].color}22, 0 0 20px ${biomeParams[b].color}22` : undefined
                  }}
                >
                  {/* Decorative tiny corner line */}
                  <div 
                    className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l transition-opacity" 
                    style={{ 
                      borderColor: biomeParams[b].color,
                      opacity: activeBiome === b ? 1 : 0.2
                    }}
                  />
                  <div className="text-[11px] font-bold uppercase tracking-wider tech-mono mb-1 flex items-center gap-1.5">
                    <span style={{ color: biomeParams[b].color }}>
                      {b === 'algae' ? '🌿' : b === 'hydro' ? '💧' : b === 'crispr' ? '🧬' : '🪙'}
                    </span>
                    {b}
                  </div>
                  <div className="text-[8px] opacity-60 font-sans tracking-wide leading-tight uppercase">
                    {biomeParams[b].title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start w-full">
            <button 
              onMouseEnter={playSound.hover}
              onClick={() => { playSound.success(); router.push('/auth/login'); }}
              className="bg-[#00F0FF] text-[#050810] font-black font-mono px-8 py-4 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 shadow-[0_0_25px_rgba(0,240,255,0.35)] hover:scale-[1.03] active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              ENGAGE DECK SYSTEM
              <ChevronRight className="w-4 h-4 text-cyber-darker" />
            </button>
            <a 
              href="#quantum" 
              onMouseEnter={playSound.hover}
              onClick={playSound.tick}
              className="inline-flex justify-center items-center bg-[#050810] text-[#00FF41] border border-[#00FF41]/40 font-black font-mono px-8 py-4 rounded-xl cursor-pointer transition-all hover:bg-[#00FF41]/10 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:scale-[1.03] active:scale-95 text-xs uppercase tracking-widest gap-2"
            >
              OS CORE TERMINAL
              <TerminalIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Side: Dual-Mode Interactive Synth & EEG Scope HUD Widget */}
        <div className="w-full max-w-[480px]">
          <div className="glass-hud border-neon-cyan/20 rounded-[28px] p-6 shadow-[0_12px_45px_rgba(0,0,0,0.6)] relative overflow-hidden">
            
            {/* HUD Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: activeParams.color }} />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: activeParams.color }} />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: activeParams.color }} />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: activeParams.color }} />
            
            {/* Header Readout */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3.5 mb-4 font-mono text-[9px] uppercase tracking-wider">
              <span className="flex items-center gap-2" style={{ color: activeParams.color }}>
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: activeParams.color }} />
                OS COGNITIVE DIAGNOSTICS & RACK
              </span>
              <span className="text-[#00FF41]">MATRIX LINKED</span>
            </div>

            {/* Widget tab deck switcher */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button 
                onClick={() => handleChannelSelect('alpha')}
                className={`py-2 rounded-lg border text-[9px] font-bold tech-mono uppercase transition-all ${
                  activeChannel !== 'theta' 
                    ? 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.1)]' 
                    : 'border-white/5 bg-[#050810]/60 text-white/40 hover:text-white'
                }`}
              >
                EEG OSCILLOSCOPE
              </button>
              <button 
                onClick={() => { playSound.tick(); handleChannelSelect('theta'); }}
                className={`py-2 rounded-lg border text-[9px] font-bold tech-mono uppercase transition-all ${
                  activeChannel === 'theta' 
                    ? 'border-neon-purple/40 bg-neon-purple/10 text-neon-purple shadow-[0_0_10px_rgba(255,0,255,0.1)]' 
                    : 'border-white/5 bg-[#050810]/60 text-white/40 hover:text-white'
                }`}
              >
                AUDIO SYNTH CORE
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeChannel !== 'theta' ? (
                /* EEG Feed Tab Content */
                <motion.div
                  key="eeg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <canvas ref={canvasRef} className="w-full h-[160px] bg-[#050810]/80 rounded-2xl border border-white/5 block" width="400" height="160" />
                    <div className="absolute top-2.5 left-3 text-[7.5px] font-mono tracking-widest uppercase opacity-40">
                      LIVE BRAINWAVE SIMULATION CHANNEL
                    </div>
                  </div>

                  {/* Channel selectors */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['alpha', 'beta', 'gamma', 'theta'] as const).map(chan => (
                      <button
                        key={chan}
                        onMouseEnter={playSound.hover}
                        onClick={() => handleChannelSelect(chan)}
                        className={`text-[8px] tech-mono font-bold py-2 rounded-lg border uppercase transition-all ${
                          activeChannel === chan
                            ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                            : 'border-white/5 bg-[#050810]/60 text-white/40 hover:text-white hover:border-white/10'
                        }`}
                      >
                        {chan}
                      </button>
                    ))}
                  </div>

                  {/* Diagnostic stats inside BCI frame */}
                  <div className="bg-[#050810]/60 border border-white/5 rounded-xl p-3.5 flex justify-between items-center text-[10px] font-mono uppercase tracking-wide">
                    <div>
                      <span className="opacity-40 block text-[8px]">CHANNEL SELECTOR</span>
                      <span className="text-white font-bold">{channelParams[activeChannel].title}</span>
                    </div>
                    <div className="text-right">
                      <span className="opacity-40 block text-[8px]">COGNITIVE LOAD</span>
                      <span className="text-[#00FF41] font-bold">84% STABLE</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Interactive Synth Engine Tab Content */
                <motion.div
                  key="synth"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-4"
                >
                  <div className="bg-[#050810]/80 border border-white/5 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden h-[160px]">
                    <div className="absolute top-2.5 left-3 text-[7.5px] font-mono tracking-widest uppercase opacity-40">
                      AUDIO OSCILLOSCOPE MONITOR
                    </div>

                    <svg width="280" height="60" className="w-full max-w-[280px] mt-4">
                      <path
                        d={generateWavePath()}
                        fill="none"
                        stroke={activeParams.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="transition-all"
                        filter="drop-shadow(0px 0px 8px currentColor)"
                      />
                    </svg>

                    <span className="text-[8px] tech-mono text-white/50 mt-3 uppercase tracking-wide">
                      WAVE ARCHITECTURE: <span style={{ color: activeParams.color }} className="font-bold">{waveform}</span> @ {frequency}Hz
                    </span>
                  </div>

                  {/* Sliders */}
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-[8px] tech-mono text-white/50 mb-1 uppercase">
                        <span>SYNTH OSCILLATION FREQUENCY</span>
                        <span style={{ color: activeParams.color }} className="font-bold">{frequency} Hz</span>
                      </div>
                      <input
                        type="range"
                        min="220"
                        max="1200"
                        step="10"
                        value={frequency}
                        onChange={(e) => {
                          setFrequency(parseInt(e.target.value));
                          if (Math.random() > 0.8) playSound.tick();
                        }}
                        className="w-full accent-neon-cyan cursor-pointer bg-white/5 h-1 rounded-lg"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[8px] tech-mono text-white/50 mb-1 uppercase">
                        <span>SYNTH GAIN AMPLITUDE</span>
                        <span style={{ color: activeParams.color }} className="font-bold">{(volume * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {volume === 0 ? <VolumeX className="w-4 h-4 text-white/30" /> : <Volume2 className="w-4 h-4 text-neon-cyan animate-pulse" />}
                        <input
                          type="range"
                          min="0.0"
                          max="0.8"
                          step="0.05"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-full accent-neon-cyan cursor-pointer bg-white/5 h-1 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wave selector row */}
                  <div className="grid grid-cols-4 gap-1">
                    {(['sine', 'triangle', 'sawtooth', 'square'] as const).map(w => (
                      <button
                        key={w}
                        onClick={() => { playSound.tick(); setWaveform(w); }}
                        className={`text-[8px] tech-mono font-bold py-1.5 rounded-lg border uppercase transition-all ${
                          waveform === w
                            ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan'
                            : 'border-white/5 bg-[#050810]/60 text-white/40 hover:text-white'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>

                  {/* Play custom pulses & Drone buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={playCustomBlip}
                      className="flex items-center justify-center gap-2 py-2.5 bg-[#050810]/70 border border-white/10 hover:border-neon-cyan text-white text-[9px] font-bold tech-mono uppercase rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
                      TEST PULSE
                    </button>

                    <button
                      onClick={toggleDrone}
                      className={`flex items-center justify-center gap-2 py-2.5 border text-[9px] font-bold tech-mono uppercase rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        isDroneActive
                          ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(255,0,255,0.2)]'
                          : 'bg-[#050810]/70 border-white/10 hover:border-neon-purple text-white/80'
                      }`}
                    >
                      {isDroneActive ? <Square className="w-3 h-3 text-neon-purple" /> : <Music className="w-3.5 h-3.5 text-neon-purple" />}
                      {isDroneActive ? 'STOP DRONE' : 'AMB-DRONE'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CORE SUBSYSTEMS FEATURE GRID */}
      <section id="features" className="py-24 px-[6%] lg:px-[8%] relative z-10 border-t border-white/5 bg-[#050810]/50 backdrop-blur-[5px]">
        
        {/* Subtle decorative grid borders */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/15 to-transparent" />
        
        <div className="text-center mb-20">
          <h2 
            className="font-display text-3xl sm:text-[2.8rem] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#00FF41] via-[#00F0FF] to-[#FF00FF] tracking-widest font-bold transition-all"
            style={{ textShadow: `0 0 20px rgba(0, 240, 255, 0.1)` }}
          >
            HYPER-DIMENSIONAL DEEP OS TECHNOLOGY
          </h2>
          <p className="text-[#ecf0f1]/40 font-mono text-[9px] mt-3.5 uppercase tracking-widest max-w-[650px] mx-auto leading-relaxed">
            {'>>'} decoupling traditional agricultural constraints from premium solarpunk digital twin optimization models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Spatial twin */}
          <div 
            onMouseEnter={playSound.hover}
            className="group glass-hud border-white/5 rounded-[22px] p-8 transition-all hover:-translate-y-2 hover:border-[#00F0FF] hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan/40" />
            <div className="feature-icon w-[52px] h-[52px] bg-[#00F0FF]/10 rounded-2xl flex items-center justify-center text-xl text-[#00F0FF] mb-6 border border-neon-cyan/25 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              📦
            </div>
            <h3 className="font-display text-[1rem] font-black text-white mb-3.5 uppercase tracking-wider tech-mono">3D Spatial Twins</h3>
            <p className="text-white/60 leading-relaxed text-xs">
              Topographical Three.js rendering maps microclimatic field layouts. Custom fragment GLSL shaders visualize real-time glowing soil moisture, pH, and nitrogen matrices.
            </p>
          </div>

          {/* BCI */}
          <div 
            onMouseEnter={playSound.hover}
            className="group glass-hud border-white/5 rounded-[22px] p-8 transition-all hover:-translate-y-2 hover:border-[#00FF41] hover:shadow-[0_8px_30px_rgba(0,255,65,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00FF41]/40" />
            <div className="feature-icon w-[52px] h-[52px] bg-[#00FF41]/10 rounded-2xl flex items-center justify-center text-xl text-[#00FF41] mb-6 border border-[#00FF41]/25 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
              🧠
            </div>
            <h3 className="font-display text-[1rem] font-black text-white mb-3.5 uppercase tracking-wider tech-mono">Passive BCI EEG Feeds</h3>
            <p className="text-white/60 leading-relaxed text-xs">
              Hands-free drone overrides integrating raw electroencephalography. Custom GATT Web Bluetooth services map attention and eye confirm blinks directly to robotics.
            </p>
          </div>

          {/* rPPG */}
          <div 
            onMouseEnter={playSound.hover}
            className="group glass-hud border-white/5 rounded-[22px] p-8 transition-all hover:-translate-y-2 hover:border-[#FF006B] hover:shadow-[0_8px_30px_rgba(255,0,107,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-pink/40" />
            <div className="feature-icon w-[52px] h-[52px] bg-neon-pink/10 rounded-2xl flex items-center justify-center text-xl text-neon-pink mb-6 border border-neon-pink/25 shadow-[0_0_15px_rgba(255,0,107,0.1)]">
              ❤️
            </div>
            <h3 className="font-display text-[1rem] font-black text-white mb-3.5 uppercase tracking-wider tech-mono">rPPG Video Pulse</h3>
            <p className="text-white/60 leading-relaxed text-xs">
              Cardiovascular photoplethysmography tracks subtle skin color variances on camera-captured absorption channels. Dynamic HRV indexing triggers autopilot safeguards.
            </p>
          </div>

          {/* CRISPR PCR DNA */}
          <div 
            onMouseEnter={playSound.hover}
            className="group glass-hud border-white/5 rounded-[22px] p-8 transition-all hover:-translate-y-2 hover:border-[#FF00FF] hover:shadow-[0_8px_30px_rgba(255,0,255,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-purple/40" />
            <div className="feature-icon w-[52px] h-[52px] bg-neon-purple/10 rounded-2xl flex items-center justify-center text-xl text-neon-purple mb-6 border border-neon-purple/25 shadow-[0_0_15px_rgba(255,0,255,0.1)]">
              🧬
            </div>
            <h3 className="font-display text-[1rem] font-black text-white mb-3.5 uppercase tracking-wider tech-mono">CRISPR & PCR Diagnostics</h3>
            <p className="text-white/60 leading-relaxed text-xs">
              Bioinformatics engine aligning field DNA bioprobes against pathogen databases using Needleman-Wunsch alignments. Integrates Cas12/Cas13 collateral cleavage diagnostics.
            </p>
          </div>

          {/* Carbon Credit Ledger */}
          <div 
            onMouseEnter={playSound.hover}
            className="group glass-hud border-white/5 rounded-[22px] p-8 transition-all hover:-translate-y-2 hover:border-[#FF6B00] hover:shadow-[0_8px_30px_rgba(255,107,0,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-orange/40" />
            <div className="feature-icon w-[52px] h-[52px] bg-neon-orange/10 rounded-2xl flex items-center justify-center text-xl text-neon-orange mb-6 border border-neon-orange/25 shadow-[0_0_15px_rgba(255,107,0,0.1)]">
              🪙
            </div>
            <h3 className="font-display text-[1rem] font-black text-white mb-3.5 uppercase tracking-wider tech-mono">Solana Carbon Credits</h3>
            <p className="text-white/60 leading-relaxed text-xs">
              Tamper-proof certifications locking soil sequestration logs on Solana carbon contracts, automatically minting SPL tokens with quantum-safe Dilithium keys.
            </p>
          </div>

          {/* Zero Trust security */}
          <div 
            onMouseEnter={playSound.hover}
            className="group glass-hud border-white/5 rounded-[22px] p-8 transition-all hover:-translate-y-2 hover:border-[#00FF41] hover:shadow-[0_8px_30px_rgba(0,255,65,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00FF41]/40" />
            <div className="feature-icon w-[52px] h-[52px] bg-[#00FF41]/10 rounded-2xl flex items-center justify-center text-xl text-[#00FF41] mb-6 border border-[#00FF41]/25 shadow-[0_0_15px_rgba(0,255,65,0.1)]">
              🛡️
            </div>
            <h3 className="font-display text-[1rem] font-black text-white mb-3.5 uppercase tracking-wider tech-mono">Unbreachable WebAuthn</h3>
            <p className="text-white/60 leading-relaxed text-xs">
              FIDO2 WebAuthn biometric passkeys verify identities at the gateway. SPIRE-managed mutual TLS 1.3 certificates enforce strict microservice enclave isolation.
            </p>
          </div>
        </div>
      </section>

      {/* CORE DIAGNOSTICS & TELEMETRY LAB SIMULATION */}
      <section className="py-24 px-[6%] lg:px-[8%] relative z-10 border-t border-white/5 bg-[#050810]/30 backdrop-blur-[5px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl sm:text-[2.2rem] font-black uppercase text-white tracking-widest tech-mono">
              LIVE COGNITIVE LAB DIALS
            </h2>
            <p className="text-white/40 font-mono text-[9px] mt-2.5 uppercase tracking-widest">
              {'>>'} MONITORING BIOPHYSICAL READOUTS & BIOMETRICS FEEDSTREAM TELEMETRY
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Cardiovascular rPPG Heart telemetry frame */}
            <div className="glass-hud border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-pink" />
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold tech-mono text-neon-pink flex items-center gap-2 uppercase tracking-wider">
                  <Heart className="w-4 h-4 text-neon-pink animate-pulse" />
                  rPPG OPTICAL VASCULAR FEEDS
                </span>
                <span className="text-[8px] tech-mono text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/20">
                  CAMERA ANALYZING
                </span>
              </div>

              <div className="relative bg-[#050810]/70 border border-white/5 rounded-2xl p-4 mb-4 h-[120px] flex items-center justify-center">
                <canvas ref={rppgCanvasRef} className="w-full h-full max-h-[80px]" width="400" height="80" />
                <div className="absolute bottom-2 left-3 text-[7.5px] tech-mono opacity-40">
                  PHOTOPLETHYSMOGRAM DETECTING SKIN ABSORPTION MATRIX
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#050810]/60 border border-white/5 rounded-xl p-3 text-center">
                  <span className="text-[8px] opacity-40 block font-mono">PULSE RATE</span>
                  <span className="text-xl font-bold text-white tech-mono">72 <span className="text-[10px] opacity-50">BPM</span></span>
                </div>
                <div className="bg-[#050810]/60 border border-white/5 rounded-xl p-3 text-center">
                  <span className="text-[8px] opacity-40 block font-mono">HRV INDEX</span>
                  <span className="text-xl font-bold text-white tech-mono">68 <span className="text-[10px] opacity-50">ms</span></span>
                </div>
                <div className="bg-[#050810]/60 border border-white/5 rounded-xl p-3 text-center">
                  <span className="text-[8px] opacity-40 block font-mono">HR CONFIDENCE</span>
                  <span className="text-xl font-bold text-[#00FF41] tech-mono">99.4%</span>
                </div>
              </div>
            </div>

            {/* Neural BCI brainwaves diagnostics frame */}
            <div className="glass-hud border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-cyan" />
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold tech-mono text-neon-cyan flex items-center gap-2 uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-neon-cyan animate-pulse" />
                  BCI ATTENTION GAUGES
                </span>
                <span className="text-[8px] tech-mono text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
                  BLUETOOTH LINKED
                </span>
              </div>

              {/* Progress bars representing Alpha Beta Theta Gamma focus metrics */}
              <div className="space-y-3.5 bg-[#050810]/70 border border-white/5 rounded-2xl p-4.5 mb-4">
                <div>
                  <div className="flex justify-between text-[8px] tech-mono mb-1">
                    <span className="text-white/60">ALPHA (RELAXATION)</span>
                    <span className="text-neon-cyan">84%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-neon-cyan h-full rounded-full w-[84%] shadow-[0_0_8px_#00F0FF]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[8px] tech-mono mb-1">
                    <span className="text-white/60">BETA (ACTIVE FOCUS)</span>
                    <span className="text-[#00FF41]">65%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00FF41] h-full rounded-full w-[65%] shadow-[0_0_8px_#00FF41]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[8px] tech-mono mb-1">
                    <span className="text-white/60">GAMMA (HIGH COGNITION)</span>
                    <span className="text-neon-purple">42%</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-neon-purple h-full rounded-full w-[42%] shadow-[0_0_8px_#FF00FF]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#050810]/60 border border-white/5 rounded-xl p-3 text-center flex justify-between items-center px-4">
                  <div>
                    <span className="text-[8px] opacity-40 block font-mono text-left">EYE BLINK OVERRIDE</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider text-left block">READY TO DETECT</span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-[#00FF41] rounded-full animate-pulse shadow-[0_0_8px_#00FF41]" />
                </div>

                <div className="bg-[#050810]/60 border border-white/5 rounded-xl p-3 text-center flex justify-between items-center px-4">
                  <div>
                    <span className="text-[8px] opacity-40 block font-mono text-left">AUTOPILOT COGNITIVE SAFE</span>
                    <span className="text-[10px] font-bold text-[#00FF41] uppercase tracking-wider text-left block">ENGAGED</span>
                  </div>
                  <Shield className="w-4 h-4 text-[#00FF41] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CONSOLE COMMAND DECK & MICROSERVICES MATRIX */}
      <section id="quantum" className="py-24 px-[6%] lg:px-[8%] bg-[#050810] border-y border-white/5 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-[2.8rem] font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#00FF41] to-[#00F0FF] tracking-widest font-bold">
            OS COMMAND DECK TERMINAL
          </h2>
          <p className="text-[#ecf0f1]/40 font-mono text-[9px] mt-3 uppercase tracking-widest">
            {'>>'} CHALLENGE AND EXPOSE COGNITIVE CHANNELS DIRECTLY OVER LOCAL Microservices
          </p>
        </div>

        <div className="max-w-[950px] mx-auto glass-hud border-[#00F0FF]/30 rounded-[28px] p-6 sm:p-10 shadow-[0_10px_45px_rgba(0,240,255,0.06)] relative">
          
          {/* HUD Corner Accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-neon-cyan" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-neon-cyan" />

          <div className="font-mono text-left">
            
            {/* Terminal Screen box */}
            <div className="text-neon-cyan mb-6 text-[11px] leading-relaxed h-[240px] bg-[#050810] p-5 rounded-2xl border border-white/5 font-mono relative overflow-y-auto select-all whitespace-pre-wrap">
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.012)_50%,transparent_50%)] bg-[length:100%_15px] z-10" />
              {consoleOutput}
              {activeCommand && (
                <span className="inline-block w-2 h-3 bg-neon-cyan ml-1 animate-pulse" />
              )}
            </div>
            
            {/* Interactive Terminal Command CLI Form */}
            <form onSubmit={handleTerminalSubmit} className="flex gap-3 mb-8">
              <div className="bg-[#050810] border border-white/10 focus-within:border-neon-cyan rounded-xl px-4 py-3.5 flex items-center gap-2 flex-grow transition-all">
                <span className="text-[10px] tech-mono text-neon-cyan">[SYSTEM@FARMQUEST] &gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="type /help or commands like /scan, /status, /solana, /audio..."
                  className="bg-transparent border-none outline-none text-[#ecf0f1] font-mono text-[11px] flex-grow placeholder-white/20 uppercase"
                  disabled={activeCommand !== null}
                />
              </div>
              <button
                type="submit"
                disabled={activeCommand !== null}
                className="bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] hover:bg-neon-cyan hover:text-cyber-darker px-6 rounded-xl tech-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                COMPILE
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Macro Buttons Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-10">
              <button 
                onMouseEnter={playSound.hover}
                onClick={() => handleTerminalSubmit({ preventDefault: () => {} } as any)} 
                className="bg-[#050810] border border-white/5 hover:border-[#00FF41]/40 rounded-xl p-3.5 text-[#00FF41] font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all hover:bg-[#00FF41]/5 hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                🌿 OPTIMIZE BIO-ALGAE
              </button>
              <button 
                onMouseEnter={playSound.hover}
                onClick={() => { setTerminalInput('/scan'); }} 
                className="bg-[#050810] border border-white/5 hover:border-neon-pink/40 rounded-xl p-3.5 text-neon-pink font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all hover:bg-neon-pink/5 hover:shadow-[0_0_15px_rgba(255,0,107,0.15)] hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                🔬 INITIATE PCR SCAN
              </button>
              <button 
                onMouseEnter={playSound.hover}
                onClick={() => { setTerminalInput('/solana'); }} 
                className="bg-[#050810] border border-white/5 hover:border-[#00F0FF]/40 rounded-xl p-3.5 text-[#00F0FF] font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all hover:bg-[#00F0FF]/5 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                🪙 Solana CREDITS MINT
              </button>
              <button 
                onMouseEnter={playSound.hover}
                onClick={() => { setTerminalInput('/status'); }} 
                className="bg-[#050810] border border-white/5 hover:border-neon-purple/40 rounded-xl p-3.5 text-neon-purple font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all hover:bg-neon-purple/5 hover:shadow-[0_0_15px_rgba(255,0,255,0.15)] hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                🧬 EXPOSE SECURITY NODES
              </button>
            </div>

            {/* Active Microservices Port Latency Matrix */}
            <div className="border-t border-white/10 pt-8">
              <label className="text-[10px] tech-mono text-white/40 block mb-4 uppercase tracking-widest">
                ACTIVE MICROSERVICES NODE RACK MATRIX:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Node 1 */}
                <div className="bg-[#050810]/70 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-[34px] h-[34px] bg-[#00FF41]/10 rounded-xl border border-[#00FF41]/20 flex items-center justify-center text-xs">
                      ⚡
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white block uppercase tracking-wide">API GATEWAY</span>
                      <span className="text-[8px] tech-mono text-white/40 block uppercase">PORT 3000 / REST</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full inline-block animate-pulse shadow-[0_0_6px_#00FF41] mr-1.5" />
                    <span className="text-[11px] tech-mono text-[#00FF41] font-bold">{latencyMetrics.apiGateway}ms</span>
                  </div>
                </div>

                {/* Node 2 */}
                <div className="bg-[#050810]/70 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-[34px] h-[34px] bg-neon-cyan/10 rounded-xl border border-neon-cyan/20 flex items-center justify-center text-xs">
                      📡
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white block uppercase tracking-wide">WEBMCP HUB</span>
                      <span className="text-[8px] tech-mono text-white/40 block uppercase">PORT 3001 / MCP</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full inline-block animate-pulse shadow-[0_0_6px_#00F0FF] mr-1.5" />
                    <span className="text-[11px] tech-mono text-neon-cyan font-bold">{latencyMetrics.mcpServer}ms</span>
                  </div>
                </div>

                {/* Node 3 */}
                <div className="bg-[#050810]/70 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-[34px] h-[34px] bg-neon-pink/10 rounded-xl border border-neon-pink/20 flex items-center justify-center text-xs">
                      🧬
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white block uppercase tracking-wide">BIOINF PCR</span>
                      <span className="text-[8px] tech-mono text-white/40 block uppercase">PORT 3008 / PY</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="w-1.5 h-1.5 bg-[#00FF41] rounded-full inline-block animate-pulse shadow-[0_0_6px_#00FF41] mr-1.5" />
                    <span className="text-[11px] tech-mono text-neon-pink font-bold">{latencyMetrics.bioinformatics}ms</span>
                  </div>
                </div>

                {/* Node 4 */}
                <div className="bg-[#050810]/70 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-[34px] h-[34px] bg-neon-purple/10 rounded-xl border border-neon-purple/20 flex items-center justify-center text-xs">
                      🧠
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-white block uppercase tracking-wide">LANGGRAPH RAG</span>
                      <span className="text-[8px] tech-mono text-white/40 block uppercase">PORT 8000 / PY</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full inline-block animate-pulse shadow-[0_0_6px_#00F0FF] mr-1.5" />
                    <span className="text-[11px] tech-mono text-neon-purple font-bold">{latencyMetrics.agentsGraph}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIOMETRIC CALL TO ACTION GATEWAY */}
      <section className="py-28 px-[6%] lg:px-[8%] text-center relative z-10">
        <div className="max-w-[850px] mx-auto bg-gradient-to-br from-cyber-dark to-cyber-darker border border-white/10 rounded-[32px] p-10 sm:p-16 backdrop-blur-[15px] shadow-[0_12px_45px_rgba(0,0,0,0.6)] relative overflow-hidden">
          
          {/* Grid decorative lines inside card */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.01)_50%,transparent_50%)] bg-[length:100%_10px]" />
          
          {/* Subtle glowing light inside card */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-neon-cyan/10 rounded-full filter blur-3xl" />
          
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-neon-cyan" />
          
          <h2 className="font-display text-4xl sm:text-[3.2rem] font-black mb-5 bg-gradient-to-r from-neon-cyan via-white to-[#00FF41] bg-clip-text text-transparent tracking-wide font-bold uppercase">
            ENGAGE NEURAL SECURITY PASSPORT
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-[650px] mx-auto mb-10 uppercase tracking-wider font-mono">
            Access the integrated operations gateway dashboard, calibrate crop biomes, compile organic sequestration proofs on decentralized ledgers, and enter the solarpunk revolution.
          </p>
          <button 
            onMouseEnter={playSound.hover}
            onClick={() => { playSound.success(); router.push('/auth/login'); }}
            className="bg-[#00F0FF] text-[#050810] font-black font-mono px-10 py-4.5 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-[1.03] active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 mx-auto"
          >
            VERIFY SECURITY BIOMETRICS
            <Lock className="w-4 h-4 text-cyber-darker" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050810] border-t border-white/5 px-[6%] lg:px-[8%] py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-12 text-left">
          <div>
            <div className="logo text-white font-display font-extrabold text-[1.3rem] tracking-wider mb-5 flex items-center gap-2">
              <span className="text-[#00FF41]">🌾</span> 
              <span>FARMQUEST</span>
            </div>
            <p className="text-[9.5px] tech-mono text-white/40 leading-relaxed max-w-[320px] uppercase">
              Deep-tech agricultural operational system command platform mapping biometrics, 3D terrains, zero-trust enclaves, and decentralized green carbon token registries.
            </p>
          </div>
          <div>
            <h4 className="font-display text-[9.5px] text-white uppercase tracking-widest font-black mb-5">ACTIVE ENCLAVE ROUTING MATRIX</h4>
            <ul className="text-[9.5px] tech-mono text-neon-cyan space-y-3">
              <li>&gt; <span className="text-white/50">api-gateway-service</span> (port 3000)</li>
              <li>&gt; <span className="text-white/50">webmcp-server-hub</span> (port 3001)</li>
              <li>&gt; <span className="text-white/50">bioinformatics-pcr</span> (port 3008)</li>
              <li>&gt; <span className="text-white/50">agents-graph-service</span> (port 8000)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-[9.5px] text-white uppercase tracking-widest font-black mb-5">ACADEMIC DIAGNOSTICS REFERENCE LOGS</h4>
            <ul className="text-[9px] tech-mono space-y-3 uppercase text-white/60">
              <li>&gt; <a href="#" className="hover:text-neon-cyan transition-all">Gootenberg et al. (CRISPR Pathogens)</a></li>
              <li>&gt; <a href="#" className="hover:text-neon-cyan transition-all">Lotte et al. (Active EEG Passives)</a></li>
              <li>&gt; <a href="#" className="hover:text-neon-cyan transition-all">NIST FIPS 204 (Crystals-Dilithium)</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="copyright font-mono text-[9px] tech-mono text-white/30 uppercase">
            &copy; 2026 FARMQUEST NEXUS. ALL PROTOCOLS SECURED UNDER CRYPTOGRAPHIC DILITHIUM ENCLAVE SIGNATURE RACKS.
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-[40px] h-[40px] bg-white/3 border border-white/5 rounded-xl flex items-center justify-center text-[#ecf0f1]/60 hover:bg-[#00F0FF] hover:text-[#050810] hover:glow-cyan hover:-translate-y-0.5 transition-all"><i className="fa-brands fa-github text-sm" /></a>
            <a href="#" className="w-[40px] h-[40px] bg-white/3 border border-white/5 rounded-xl flex items-center justify-center text-[#ecf0f1]/60 hover:bg-[#00F0FF] hover:text-[#050810] hover:glow-cyan hover:-translate-y-0.5 transition-all"><i className="fa-brands fa-discord text-sm" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
