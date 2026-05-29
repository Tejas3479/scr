'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import SpatialTwinCanvas from '@/components/SpatialTwinCanvas'
import { playSound } from '@/services/sound'
import { ArrowLeft, Monitor, RefreshCw, Compass, ShieldAlert, Cpu } from 'lucide-react'

export default function TwinPage() {
  const [activeLayer, setActiveLayer] = useState<'all' | 'thermal' | 'irrigation' | 'pests'>('all')
  const [telemetryState, setTelemetryState] = useState({
    droneSpeed: '12 km/h',
    altitude: '4.2m',
    gps: '12°41\'55"N, 77°35\'12"E',
    status: 'ACTIVE PATH SYNCING'
  })

  const handleLayerChange = (layer: 'all' | 'thermal' | 'irrigation' | 'pests') => {
    playSound.tick()
    setActiveLayer(layer)
  }

  const handleFlightOverride = () => {
    playSound.alarm()
    setTelemetryState({
      droneSpeed: '18 km/h',
      altitude: '6.5m',
      gps: '12°41\'58"N, 77°35\'15"E',
      status: 'INCIDENT AUTO-OVERRIDE ENGAGED'
    })
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white relative overflow-hidden selection:bg-neon-cyan selection:text-[#050810]">
      {/* Cyber Grid & Scanline Background Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:100%_30px] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:30px_100%] z-0" />

      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] bg-neon-cyan/4 rounded-full filter blur-[120px] animate-blob" />
          <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-neon-green/4 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
        </div>

        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            onMouseEnter={playSound.hover}
            onClick={playSound.tick}
            className="tech-mono text-xs text-neon-cyan hover:text-neon-green transition-all flex items-center gap-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
            ◀ BACK TO COMMAND DECK
          </Link>
        </div>

        {/* Title */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent tracking-wider">
              🌐 WebXR Spatial Digital Twin
            </h1>
            <p className="text-neon-cyan/60 tech-mono text-xs mt-2">
              REAL-TIME THREE.JS TOPOGRAPHICAL FIELD PLOT & TELEMETRY HUB
            </p>
          </div>
          
          {/* Layer Selector */}
          <div className="flex gap-2 bg-[#050810]/80 border border-white/15 rounded-xl p-1.5 backdrop-blur-md">
            {(['all', 'thermal', 'irrigation', 'pests'] as const).map((l) => (
              <button
                key={l}
                onMouseEnter={playSound.hover}
                onClick={() => handleLayerChange(l)}
                className={`px-4 py-2 text-xs tech-mono rounded-lg transition-all capitalize ${
                  activeLayer === l
                    ? 'bg-neon-cyan text-cyber-darker font-black shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Page Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* WebGL Canvas Viewport */}
          <div className="xl:col-span-3">
            <div className="border border-neon-cyan/20 rounded-2xl overflow-hidden glass-panel relative">
              <div className="absolute top-3 left-4 flex items-center gap-2 text-[10px] tech-mono text-neon-cyan z-20">
                <Monitor className="w-4 h-4 text-neon-cyan animate-pulse" />
                ACTIVE THREEGL SHADER VIEWPORT
              </div>
              <SpatialTwinCanvas />
            </div>
            
            {/* Viewport Instructions */}
            <div className="mt-4 bg-[#050810]/50 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center text-[10px] tech-mono text-white/40 gap-2">
              <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-neon-cyan" /> 🖱 CLICK & DRAG TO ROTATE DECK</span>
              <span>🔍 SCROLL TO ZOOM PLOT</span>
              <span>📍 SELECT SENSOR SPHERES TO EXPOSING DATAREADOUTS</span>
            </div>
          </div>

          {/* Environmental Telemetry Panel */}
          <div className="flex flex-col gap-6">
            {/* Live Environmental Feeds */}
            <div className="glass-hud p-6 border-neon-cyan/30 rounded-2xl relative shadow-glow-sm">
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neon-cyan" />
              
              <h2 className="tech-mono text-xs font-bold text-neon-cyan mb-4 uppercase tracking-widest border-b border-neon-cyan/20 pb-2">
                PLOT BIO-TELEMETRY
              </h2>
              
              <div className="divide-y divide-white/5 text-xs tech-mono space-y-4">
                <div className="pt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-white/50">Soil Moisture Avg</span>
                    <span className="text-neon-cyan font-bold">42.5%</span>
                  </div>
                  <div className="w-full bg-[#050810] h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-neon-cyan h-2 rounded-full" style={{ width: '42.5%' }} />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white/50">Ambient pH Level</span>
                    <span className="text-neon-purple font-bold">6.8 pH</span>
                  </div>
                  <div className="w-full bg-[#050810] h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-neon-purple h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white/50">Nitrogen Absorption</span>
                    <span className="text-neon-green font-bold">92 ppm</span>
                  </div>
                  <div className="w-full bg-[#050810] h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-neon-green h-2 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-white/50">Bio-Electrophysiology</span>
                    <span className="text-neon-orange font-bold">OPTIMAL</span>
                  </div>
                  <div className="w-full bg-[#050810] h-2 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-neon-orange h-2 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Coordinates Override Card */}
            <div className="glass-hud p-6 border-neon-purple/30 rounded-2xl relative overflow-hidden shadow-glow-sm">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-purple" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-purple" />
              
              <h2 className="tech-mono text-xs font-bold text-neon-purple mb-4 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-neon-purple animate-pulse" />
                DRONE FLEET OVERRIDE
              </h2>
              
              <div className="space-y-3.5 text-xs tech-mono">
                <div className="flex justify-between">
                  <span className="text-white/40">Drone Sector:</span>
                  <span className="text-white/90">Plot Alpha 4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Cruise Speed:</span>
                  <span className="text-neon-cyan font-bold">{telemetryState.droneSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Flight Altitude:</span>
                  <span className="text-neon-purple font-bold">{telemetryState.altitude}</span>
                </div>
                
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-white/40">GPS Coordinates Mesh:</span>
                  <span className="text-white/80 text-[10px] leading-none bg-[#050810]/80 p-2.5 rounded border border-white/10 mt-1 select-all truncate">
                    {telemetryState.gps}
                  </span>
                </div>
                
                <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
                  <button
                    onMouseEnter={playSound.hover}
                    onClick={handleFlightOverride}
                    className="w-full bg-[#050810] border border-neon-purple hover:bg-neon-purple/20 hover:border-neon-purple hover:shadow-[0_0_15px_rgba(255,0,255,0.25)] text-neon-purple font-black font-tech py-2.5 rounded-xl transition-all text-[10px] uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98]"
                  >
                    ⚡ LAUNCH FLEET OVERRIDE
                  </button>
                  
                  <div className={`text-[9px] text-center font-bold mt-1 uppercase tracking-widest animate-pulse ${
                    telemetryState.status.includes('OVERRIDE') ? 'text-neon-pink' : 'text-emerald-300/50'
                  }`}>
                    STATUS: {telemetryState.status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
