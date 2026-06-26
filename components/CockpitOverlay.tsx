'use client';

import { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Cpu, Network, Database } from 'lucide-react';
import { scrollState } from '@/lib/scrollState';

export default function CockpitOverlay() {
  const [time, setTime] = useState('00:00:00');
  const [activeNodes, setActiveNodes] = useState(14024);
  const [section, setSection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toISOString().split('T')[1].replace('Z', '') + ' UTC');
      // Randomly fluctuate node count
      setActiveNodes(prev => prev + Math.floor((Math.random() - 0.5) * 10));
    }, 100);
    
    // Sync React state with scrollState section
    const sectionTimer = setInterval(() => {
      setSection(scrollState.section);
    }, 100);
    
    return () => {
      clearInterval(timer);
      clearInterval(sectionTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {/* HUD Frame Top */}
      <div className="absolute top-0 left-0 w-full h-16 flex items-start justify-between px-6 pt-4">
        <div className="flex gap-4 items-center">
          <div className="text-xs font-mono text-cyan-400 tracking-widest border border-cyan-900 bg-cyan-950/30 px-3 py-1">
            CYBER-OPS // SYS.VER.9.4.2
          </div>
          <div className="text-xs font-mono text-white/50">{time}</div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Cpu size={14} /> CORE TEMP: 34°C
          </div>
          <div className={`flex items-center gap-2 text-xs font-mono px-3 py-1 border ${section === 2 ? 'border-red-500 text-red-500 bg-red-950/50 animate-pulse' : 'border-cyan-900 text-cyan-400 bg-cyan-950/30'}`}>
            {section === 2 ? <ShieldAlert size={14} /> : <ShieldAlert size={14} />}
            {section === 2 ? 'THREAT DETECTED' : 'SYSTEM SECURE'}
          </div>
        </div>
      </div>

      {/* HUD Frame Left (Data Streams) */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <div className="hud-panel p-4 w-48 transition-all duration-500" style={{ opacity: section >= 1 ? 1 : 0.2 }}>
          <div className="text-[10px] uppercase text-cyan-500 tracking-widest mb-2 font-mono">Global Nodes</div>
          <div className="text-2xl font-sans font-bold text-white text-glow-cyan">{activeNodes.toLocaleString()}</div>
          <div className="text-xs text-cyan-400/70 font-mono mt-1">+14 online / -2 offline</div>
        </div>
        
        <div className="hud-panel p-4 w-48 transition-all duration-500 delay-100" style={{ opacity: section >= 1 ? 1 : 0.2 }}>
          <div className="text-[10px] uppercase text-cyan-500 tracking-widest mb-2 font-mono">Network Traffic</div>
          <div className="flex items-end gap-1 h-12">
            {[40, 70, 30, 90, 50, 20, 80, 60, 100, 40].map((h, i) => (
              <div key={i} className="w-full bg-cyan-900" style={{ height: '100%' }}>
                <div className="w-full bg-cyan-400" style={{ height: `${h}%` }}></div>
              </div>
            ))}
          </div>
          <div className="text-xs text-cyan-400/70 font-mono mt-2">14.2 PB/s</div>
        </div>
      </div>

      {/* HUD Frame Right (Alerts / Agents) */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <div className={`hud-panel ${section === 2 ? 'hud-panel-red' : ''} p-4 w-64 transition-all duration-500`} style={{ opacity: section >= 2 ? 1 : 0 }}>
          <div className={`text-[10px] uppercase tracking-widest mb-2 font-mono ${section === 2 ? 'text-red-500' : 'text-cyan-500'}`}>Active Autonomous Agents</div>
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/70">AGENT_ALPHA</span>
              <span className="text-cyan-400 bg-cyan-950/50 px-2 py-0.5">PATROLLING</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/70">AGENT_BRAVO</span>
              {section === 2 ? (
                <span className="text-red-500 bg-red-950/50 px-2 py-0.5 animate-pulse">INTERCEPTING</span>
              ) : (
                <span className="text-cyan-400 bg-cyan-950/50 px-2 py-0.5">IDLE</span>
              )}
            </div>
          </div>
        </div>
        
        {section === 2 && (
          <div className="hud-panel hud-panel-red p-4 w-64 animate-bounce shadow-[0_0_20px_rgba(255,42,42,0.4)]">
            <div className="text-[10px] uppercase text-red-500 tracking-widest mb-2 font-mono flex items-center gap-2">
              <Activity size={12} /> ANOMALY DETECTED
            </div>
            <div className="text-sm font-sans text-white">Sector 7G: Unusual API spikes detected. Agent_Bravo deployed for autonomous mitigation.</div>
          </div>
        )}
      </div>

      {/* Crosshairs / Center Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-cyan-500/20 rounded-full flex items-center justify-center transition-all duration-1000" style={{ opacity: section === 0 ? 1 : 0.3, transform: `translate(-50%, -50%) scale(${section === 0 ? 1 : 1.5})` }}>
        <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-cyan-500/50"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-cyan-500/50"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-cyan-500/50"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-cyan-500/50"></div>
      </div>

      {/* Bottom Data Tape */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-black/80 border-t border-cyan-900/50 flex items-center overflow-hidden">
        <div className="whitespace-nowrap text-[10px] font-mono text-cyan-500/50 tracking-widest flex gap-8 animate-[slide_20s_linear_infinite]">
          <span>» DATA STREAM OMEGA: STABLE</span>
          <span>» INGESTION RATE: 4.2M EVENTS/SEC</span>
          <span>» QUERY LATENCY: 12ms</span>
          <span>» MACHINE LEARNING MODELS: SYNCED</span>
          <span>» DATA STREAM OMEGA: STABLE</span>
          <span>» INGESTION RATE: 4.2M EVENTS/SEC</span>
          <span>» QUERY LATENCY: 12ms</span>
          <span>» MACHINE LEARNING MODELS: SYNCED</span>
        </div>
      </div>
    </div>
  );
}
