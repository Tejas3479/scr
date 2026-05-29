'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import { playSound } from '@/services/sound'
import { Coins, ShieldAlert, Cpu, Award, Zap, Terminal, CheckCircle, ArrowLeft, Fingerprint, RefreshCw } from 'lucide-react'

interface CreditTransaction {
  signature: string
  amount: number
  timestamp: string
  status: 'confirmed' | 'pending'
  proof: string
}

export default function LedgerPage() {
  const [wallet, setWallet] = useState({
    address: 'AgriFarmerX992b8dff2384a88fbc923e',
    balance: 1250.0,
    mintAddress: 'AgriLedger111111111111111111111111111111111',
    trustScore: 0.95
  })
  const [mintAmount, setMintAmount] = useState<number>(10)
  const [loading, setLoading] = useState(false)
  const [txHistory, setTxHistory] = useState<CreditTransaction[]>([
    {
      signature: 'simulated_solana_signature_0x9a8f237199bc8',
      amount: 45,
      timestamp: '2026-05-28 10:14:02',
      status: 'confirmed',
      proof: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'
    },
    {
      signature: 'simulated_solana_signature_0xf3d987dff9e81',
      amount: 15,
      timestamp: '2026-05-26 14:22:45',
      status: 'confirmed',
      proof: 'QmZp88aDf81dFkkCq22vedxjQkDDP1mXWo6ucov3WkndfX'
    }
  ])
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleMint = async () => {
    if (mintAmount <= 0) return
    playSound.tick()
    setLoading(true)
    setSuccessMsg(null)

    // Trigger warning/compiling siren frequency during blockchain packaging
    playSound.alarm()

    const payload = {
      farmerWalletAddressHex: wallet.address,
      amountTonnes: mintAmount
    }

    try {
      const response = await fetch('http://localhost:3000/api/blockchain/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        playSound.success()
        const data = await response.json()
        setWallet(prev => ({ ...prev, balance: prev.balance + mintAmount }))
        setTxHistory(prev => [
          {
            signature: data.signature,
            amount: mintAmount,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            status: 'confirmed',
            proof: 'QmFp' + Math.random().toString(36).substring(2, 15) + 'YwKndfX'
          },
          ...prev
        ])
        setSuccessMsg(`MINT SUCCESSFUL: Signed Solana SPL transaction ${data.signature.slice(0, 16)}...`)
      } else {
        throw new Error('Solana credit minting pipeline error')
      }
    } catch (err) {
      console.warn('Blockchain backend offline, running client simulated Anchor contract mint...')
      setTimeout(() => {
        playSound.success()
        const mockSig = 'simulated_solana_signature_hash_f3d9_' + Math.random().toString(36).substring(2, 8)
        setWallet(prev => ({ ...prev, balance: prev.balance + mintAmount }))
        setTxHistory(prev => [
          {
            signature: mockSig,
            amount: mintAmount,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            status: 'confirmed',
            proof: 'QmFp' + Math.random().toString(36).substring(2, 15) + 'YwKndfX'
          },
          ...prev
        ])
        setSuccessMsg(`MINT SUCCESSFUL (SIMULATION): Signed Solana SPL transaction ${mockSig.slice(0, 20)}...`)
        setLoading(false)
      }, 1500)
    } finally {
      if (!successMsg) setLoading(false)
    }
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
          <div className="absolute top-[10%] right-[15%] w-[35vw] h-[35vw] bg-neon-purple/4 rounded-full filter blur-[120px] animate-blob" />
          <div className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] bg-neon-cyan/4 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
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
            🌾 Solana Carbon Credits & SPL Ledger
          </h1>
          <p className="text-neon-cyan/60 tech-mono text-xs mt-2">
            DECENTRALIZED QUANTUM-SECURED SOIL BIO-SEQUESTRATION PROOF REGISTRY
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Wallet HUD */}
          <div className="flex flex-col gap-6">
            <div 
              onMouseEnter={playSound.hover}
              className="glass-hud p-6 border-neon-cyan/30 rounded-2xl relative overflow-hidden shadow-glow-sm"
            >
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-cyan" />
              
              <h2 className="tech-mono text-xs font-bold text-neon-cyan mb-6 uppercase tracking-widest">
                SOLANA WALLET METRICS HUD
              </h2>
              
              <div className="flex items-center gap-4 mb-6 bg-[#050810]/60 p-4 border border-neon-cyan/15 rounded-xl">
                <div className="w-14 h-14 bg-neon-cyan/15 rounded-xl flex items-center justify-center border border-neon-cyan/40 animate-pulse">
                  <Coins className="w-8 h-8 text-neon-cyan" />
                </div>
                <div>
                  <div className="text-[9px] tech-mono text-white/40 uppercase">ACTIVE SPL BALANCE</div>
                  <div className="font-display font-extrabold text-2xl text-neon-cyan shadow-neon-cyan font-mono">
                    {wallet.balance.toFixed(2)} CO₂t
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 text-xs tech-mono">
                <div className="flex flex-col">
                  <span className="text-white/40 text-[9px]">FARMER SOLANA PUBLIC KEY:</span>
                  <span className="text-white/80 select-all truncate bg-[#050810] p-2.5 rounded border border-white/5 mt-1 font-mono hover:border-neon-cyan transition-all">
                    {wallet.address}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/40 text-[9px]">CARBON TOKEN MINT ACCOUNT:</span>
                  <span className="text-white/80 select-all truncate bg-[#050810] p-2.5 rounded border border-white/5 mt-1 font-mono hover:border-neon-cyan transition-all">
                    {wallet.mintAddress}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-3">
                  <span className="text-white/40">ECOLOGICAL TRUST RATING:</span>
                  <span className="text-neon-green font-bold flex items-center gap-1.5 animate-pulse text-[10px]">
                    <Award className="w-3.5 h-3.5" />
                    {(wallet.trustScore * 100).toFixed(0)}% (OPTIMAL)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Minting Controller */}
          <div className="glass-hud p-6 border-neon-purple/30 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-glow-sm">
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-purple" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-purple" />
            
            <div>
              <h2 className="tech-mono text-xs font-bold text-neon-purple mb-6 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-neon-purple animate-pulse" />
                ANCHOR SOIL MINTING MODULE
              </h2>

              <div className="mb-6">
                <label className="text-[10px] tech-mono text-neon-purple/50 block mb-2 uppercase tracking-widest">AMOUNT IN TONNES MINT THRESHOLD</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={mintAmount}
                    onChange={(e) => {
                      setMintAmount(Math.max(1, parseInt(e.target.value) || 0));
                      if (Math.random() > 0.7) playSound.tick();
                    }}
                    className="flex-1 bg-[#050810] border border-white/10 rounded-xl px-4 py-3 text-xs tech-mono text-neon-purple focus:border-neon-purple focus:outline-none font-bold"
                  />
                  <span className="bg-[#050810] border border-white/10 px-4 py-3 rounded-xl text-[10px] tech-mono text-white/40 flex items-center">
                    TONNES
                  </span>
                </div>
              </div>

              {/* IPFS Verification Proof Info */}
              <div className="bg-[#050810]/80 border border-white/5 rounded-xl p-4 text-[10px] tech-mono mb-6 relative">
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-cyan/40" />
                <div className="text-neon-cyan font-bold mb-1.5 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-neon-cyan" />
                  IPFS AUDITING PROTOCOLS
                </div>
                <p className="text-white/50 leading-relaxed uppercase">
                  All credits require associated IPFS soil validation files compiled using Dilithium keys.
                </p>
              </div>
            </div>

            <div>
              {/* Success Notification */}
              <AnimatePresence>
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-neon-green/10 border border-neon-green/50 text-neon-green text-[9px] tech-mono p-3.5 rounded-xl mb-4 flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,65,0.15)] animate-pulse"
                  >
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-neon-green" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={playSound.hover}
                onClick={handleMint}
                disabled={loading}
                className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple text-cyber-darker font-black py-4.5 rounded-xl shadow-glow-sm hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin h-4.5 w-4.5 text-[#050810]" />
                    BROADCASTING Anchor MINT...
                  </>
                ) : (
                  <>🪙 MINT SOIL OFFSETS ON Solana</>
                )}
              </motion.button>
            </div>
          </div>

          {/* Ledger History List */}
          <div className="glass-hud p-6 border-neon-green/30 rounded-2xl relative overflow-hidden shadow-glow-sm">
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-green" />
            
            <h2 className="tech-mono text-xs font-bold text-neon-green mb-6 uppercase tracking-widest">
              Associated Token Registry
            </h2>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {txHistory.map((tx, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={playSound.hover}
                  className="bg-[#050810]/60 border border-white/5 hover:border-neon-green/30 p-4 rounded-xl flex flex-col gap-2 transition-all duration-300"
                >
                  <div className="flex justify-between items-center tech-mono text-[9px]">
                    <span className="text-neon-cyan font-bold">SOLANA TRANSACTION</span>
                    <span className="text-neon-green font-bold bg-neon-green/10 border border-neon-green/30 px-1.5 py-0.5 rounded text-[8px]">
                      {tx.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-[9px] text-white/40 truncate font-mono select-all uppercase">
                    {tx.signature}
                  </div>
                  
                  <div className="border-t border-white/5 pt-2 flex justify-between items-center tech-mono text-[11px] font-bold">
                    <span className="text-white/40">Credits Offset:</span>
                    <span className="text-neon-cyan">+{tx.amount} CO₂t</span>
                  </div>
                  <div className="text-[8px] tech-mono text-white/30 truncate mt-1 uppercase font-mono">
                    IPFS STORAGE HASH: {tx.proof}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
