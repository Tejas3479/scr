'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import { playSound } from '@/services/sound'
import { Send, Terminal, HelpCircle, Database, GitMerge, RefreshCw, ArrowLeft } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  subgraph?: any[]
  passages?: string[]
}

const PRESET_PROMPTS = [
  'What pathogens target wheat crop rows?',
  'Rice blast treatment protocols',
  'Soil hydration vector optimization'
]

export default function KnowledgePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: 'SYSTEM ACTIVE: LangGraph & Neo4j Hybrid GraphRAG Aligned. Enter target crop query vector...'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeCypher, setActiveCypher] = useState<string>('MATCH (c:Crop)-[r:AFFECTED_BY]->(p:Pathogen) RETURN c, r, p LIMIT 5;')
  const [subgraph, setSubgraph] = useState<any[]>([
    { crop: 'Wheat', pathogen: 'Puccinia graminis (Stem Rust)' },
    { crop: 'Rice', pathogen: 'Magnaporthe oryzae (Rice Blast)' },
    { crop: 'Tomato', pathogen: 'Clavibacter (Canker)' }
  ])
  const [passages, setPassages] = useState<string[]>([
    'Stem Rust is caused by the fungus Puccinia graminis and affects cereal crops.',
    'Rice Blast represents one of the most devastating diseases in global agriculture.',
    'Copper hydroxide bio-suspension represents the principal defense against Clavibacter.'
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    playSound.tick()

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setLoading(true)

    // Trigger active compilation sound
    playSound.alarm()

    // Simulate LangGraph / GraphRAG fetch
    setTimeout(() => {
      playSound.success()
      let cypher = 'MATCH (c:Crop)-[r:AFFECTED_BY]->(p:Pathogen) RETURN c, r, p LIMIT 5;'
      let responseText = `Searching Neo4j for entities relating to "${text}"...\n\nI have successfully matched the crop vulnerability nodes in the Knowledge Graph. Recommended action: deploy Bacillus subtilis biological shields and maintain ambient moisture under 55%.`
      let sub: any[] = []
      let pass: string[] = []

      if (text.toLowerCase().includes('wheat') || text.toLowerCase().includes('pathogen')) {
        cypher = "MATCH (c:Crop {name: 'Wheat'})-[r:AFFECTED_BY]->(p:Pathogen) RETURN c.name, p.name;"
        sub = [{ crop: 'Wheat', pathogen: 'Puccinia graminis (Stem Rust)' }]
        pass = ['Stem Rust destroys healthy plant vascular structures rapidly under warm damp climates.']
      } else if (text.toLowerCase().includes('rice') || text.toLowerCase().includes('blast')) {
        cypher = "MATCH (c:Crop {name: 'Rice'})-[r:AFFECTED_BY]->(p:Pathogen) RETURN c.name, p.name;"
        sub = [{ crop: 'Rice', pathogen: 'Magnaporthe oryzae (Rice Blast)' }]
        pass = ['Rice Blast causes significant grain weight loss and leaf necrosis.']
      } else {
        sub = [{ crop: 'General Crop', pathogen: 'Common Spores' }]
        pass = ['Ensure optimal organic soil conditions to prevent fungal growth.']
      }

      setSubgraph(sub)
      setPassages(pass)
      setActiveCypher(cypher)

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: responseText,
          subgraph: sub,
          passages: pass
        }
      ])
      setLoading(false)
    }, 1500)
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
          <div className="absolute top-[15%] left-[10%] w-[35vw] h-[35vw] bg-neon-cyan/4 rounded-full filter blur-[120px] animate-blob" />
          <div className="absolute bottom-[15%] right-[5%] w-[30vw] h-[30vw] bg-neon-purple/4 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
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
        <div className="mb-10 pb-4 border-b border-white/10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent tracking-wider">
            🧠 LangGraph Multi-Agent Knowledge Engine
          </h1>
          <p className="text-neon-cyan/60 tech-mono text-xs mt-2">
            HYBRID QUERY INTERFACE OVER NEO4J CONGESTIVE RELATIONSHIPS & PGVECTOR EMBEDDINGS
          </p>
        </div>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Conversational Aligner Card */}
          <div className="xl:col-span-2 flex flex-col glass-hud border-neon-cyan/30 rounded-2xl min-h-[600px] shadow-glow-sm">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-cyan" />
            
            {/* HUD Header */}
            <div className="border-b border-white/10 p-4 flex justify-between items-center tech-mono text-xs text-neon-cyan/70">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 animate-pulse text-neon-cyan" />
                CONVERSATIONAL DIAGNOSTIC INPUT NODE
              </span>
              <span className="text-neon-green font-bold animate-pulse text-[9px] bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/30">MUTUAL TLS SECURED</span>
            </div>

            {/* Messages Output */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[420px]">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-4 rounded-xl tech-mono text-xs border relative overflow-hidden ${
                    m.type === 'user'
                      ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                      : 'bg-[#050810]/75 border-white/10 text-white/90'
                  }`}>
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-40" />
                    
                    {m.type === 'agent' && (
                      <div className="text-neon-green font-bold mb-1.5 uppercase tracking-widest text-[9px]">🤖 KNOWLEDGE_AGENT &gt;&gt;</div>
                    )}
                    <p className="leading-relaxed whitespace-pre-line">{m.content}</p>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-1.5 p-3.5 bg-[#050810]/80 border border-white/5 rounded-xl w-fit tech-mono text-[10px] text-neon-purple/80 justify-center items-center shadow-glow-sm">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-neon-purple" />
                  SEMANTIC HYBRID SUBGRAPH MATCHING IN PROGRESS...
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Prompt presets */}
            <div className="px-6 py-2.5 border-t border-white/5 flex gap-2 overflow-x-auto bg-[#050810]/40">
              {PRESET_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onMouseEnter={playSound.hover}
                  onClick={() => handleSend(prompt)}
                  className="bg-[#050810]/80 border border-white/10 hover:border-neon-cyan/50 px-3 py-2 rounded-lg text-[9px] tech-mono text-white/60 hover:text-neon-cyan transition-all whitespace-nowrap uppercase font-bold"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-white/10 flex gap-3 bg-[#050810]/80 rounded-b-2xl">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                placeholder="Expose crop pathogen relationship vectors..."
                className="flex-1 bg-[#050810] border border-white/10 rounded-xl px-4.5 py-3 text-xs tech-mono text-neon-cyan placeholder-white/35 focus:border-neon-cyan focus:outline-none"
              />
              <button
                onMouseEnter={playSound.hover}
                onClick={() => handleSend(inputValue)}
                className="bg-neon-cyan text-[#050810] hover:bg-neon-green w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,240,255,0.35)] hover:scale-[1.03] active:scale-95 border border-[#050810]"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Neo4j & pgvector HUD Panels */}
          <div className="flex flex-col gap-6">
            
            {/* Cypher Query Console */}
            <div 
              onMouseEnter={playSound.hover}
              className="glass-hud p-6 border-neon-green/30 rounded-2xl relative overflow-hidden shadow-glow-sm"
            >
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-green" />
              
              <h2 className="tech-mono text-xs font-bold text-neon-green mb-4 uppercase tracking-widest flex items-center gap-1.5">
                <Database className="w-4 h-4 text-neon-green animate-pulse" />
                NEO4J CYPHER COMPILER CONSOLE
              </h2>
              
              <div className="bg-[#050810]/80 p-3.5 rounded-xl border border-white/15 text-[9px] tech-mono text-neon-green leading-relaxed whitespace-pre-wrap select-all relative overflow-hidden font-mono">
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.015)_50%,transparent_50%)] bg-[length:100%_15px] animate-scan-line" />
                {activeCypher}
              </div>
              <div className="text-[9px] text-white/40 mt-2 tech-mono uppercase font-bold">
                Bolt query compiled dynamically over Neo4j relationships.
              </div>
            </div>

            {/* Subgraph Nodes Matches */}
            <div 
              onMouseEnter={playSound.hover}
              className="glass-hud p-6 border-neon-purple/30 rounded-2xl relative shadow-glow-sm"
            >
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-purple" />
              
              <h2 className="tech-mono text-xs font-bold text-neon-purple mb-4 uppercase tracking-widest flex items-center gap-1.5">
                <GitMerge className="w-4 h-4 text-neon-purple animate-pulse" />
                NEO4J SUBGRAPH LINK MATCHES
              </h2>

              <div className="space-y-3 tech-mono text-[10px]">
                {subgraph.map((item, idx) => (
                  <div key={idx} className="bg-[#050810] border border-white/5 p-3 rounded-lg flex flex-col gap-1 hover:border-neon-purple/40 transition-all">
                    <div className="flex justify-between">
                      <span className="text-white/40">CROP IDENTIFIER:</span>
                      <span className="text-neon-cyan font-bold">{item.crop}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1">
                      <span className="text-white/40">PATHOGEN CORRELATE:</span>
                      <span className="text-neon-pink font-bold">{item.pathogen}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vector Semantics Matches */}
            <div 
              onMouseEnter={playSound.hover}
              className="glass-hud p-6 border-neon-cyan/30 rounded-2xl relative shadow-glow-sm"
            >
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-cyan" />
              
              <h2 className="tech-mono text-xs font-bold text-neon-cyan mb-4 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-neon-cyan animate-pulse" />
                SEMANTIC PGVECTOR PASSAGES
              </h2>

              <div className="space-y-3 tech-mono text-[9px] text-white/60 leading-relaxed uppercase">
                {passages.map((p, idx) => (
                  <div key={idx} className="border-l-2 border-neon-cyan pl-3 py-1.5 bg-white/3 rounded-r-lg">
                    {p}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
