'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollState } from '@/lib/scrollState';
import CityScene from '@/components/CityScene';
import CockpitOverlay from '@/components/CockpitOverlay';
import { Shield, Activity, Target } from 'lucide-react';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!containerRef.current) return;

    // Reset scroll state on mount
    scrollState.progress = 0;
    scrollState.section = 0;

    const sections = gsap.utils.toArray('.scroll-section');

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        // Update the global scroll state which drives the 3D camera
        scrollState.progress = self.progress;
        
        // Determine which section we are in (0 to 3)
        const currentSection = Math.floor(self.progress * 3.99); // 4 sections
        if (scrollState.section !== currentSection) {
          scrollState.section = currentSection;
        }
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main ref={containerRef} className="relative w-full">
      {/* 3D Background - Fixed */}
      <CityScene />
      
      {/* HUD - Fixed */}
      <CockpitOverlay />

      {/* Cyberpunk Effects - Fixed */}
      <div className="scanline-overlay"></div>
      <div className="vignette"></div>

      {/* Scrollable Content Layers */}
      <div className="relative z-30">
        
        {/* Section 0: Hero */}
        <section className="scroll-section h-[100vh] flex flex-col items-center justify-center pt-20 px-8">
          <div className="max-w-4xl w-full text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 mb-8 border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 font-mono text-xs tracking-widest backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              OBSERVABILITY PLATFORM V.9
            </div>
            
            <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tighter text-white mb-6 uppercase text-glow-cyan">
              Master the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Digital Frontier</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 font-mono max-w-2xl">
              Immersive, autonomous infrastructure monitoring. 
              Visualize your entire stack in real-time within a living 3D command center.
            </p>
            
            <div className="mt-12 animate-bounce opacity-50">
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent mx-auto"></div>
              <div className="text-[10px] font-mono text-cyan-400 mt-2 tracking-widest">SCROLL TO INITIATE</div>
            </div>
          </div>
        </section>

        {/* Section 1: Infrastructure */}
        <section className="scroll-section h-[100vh] flex flex-col justify-center px-8 md:px-24">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-cyan-400 font-mono text-sm tracking-widest mb-4">
              <Activity size={18} />
              01 // DEEP VISIBILITY
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 uppercase text-glow-cyan">
              See the Unseen
            </h2>
            <p className="text-white/70 font-mono leading-relaxed mb-8">
              Transform abstract logs and metrics into a tangible, explorable cityscape. 
              Identify bottlenecks visually as traffic flows through your microservices infrastructure.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/10 bg-black/50 p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold text-cyan-400 mb-1 font-sans">100%</div>
                <div className="text-[10px] uppercase text-white/50 tracking-widest font-mono">Topology Mapping</div>
              </div>
              <div className="border border-white/10 bg-black/50 p-4 backdrop-blur-sm">
                <div className="text-3xl font-bold text-cyan-400 mb-1 font-sans">&lt;10ms</div>
                <div className="text-[10px] uppercase text-white/50 tracking-widest font-mono">Real-time Latency</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: AI Agents / Threat */}
        <section className="scroll-section h-[100vh] flex flex-col justify-center items-end px-8 md:px-24 text-right">
          <div className="max-w-xl">
            <div className="flex items-center justify-end gap-3 text-red-500 font-mono text-sm tracking-widest mb-4">
              02 // AUTONOMOUS DEFENSE
              <Shield size={18} />
            </div>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6 uppercase text-glow-red">
              AI Agents Take the Wheel
            </h2>
            <p className="text-white/70 font-mono leading-relaxed mb-8 text-right">
              Don't just alert—act. Our autonomous agents patrol the infrastructure graph, identifying anomalies and intercepting threats before they hit production.
            </p>
            <div className="flex justify-end">
              <div className="border border-red-500/30 bg-red-950/20 p-4 backdrop-blur-sm text-left max-w-sm border-l-4 border-l-red-500">
                <div className="text-xs font-mono text-red-400 mb-2">» AGENT LOG</div>
                <div className="text-sm font-sans text-white/90">
                  <span className="text-red-500">ERR_RATE_SPIKE</span> detected in Auth_Service. 
                  Deploying Agent_Bravo to route traffic to backup instances.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Call to action */}
        <section className="scroll-section h-[100vh] flex flex-col items-center justify-center px-8 text-center pb-32">
          <Target size={48} className="text-cyan-400 mb-8 opacity-50" />
          <h2 className="text-5xl md:text-7xl font-sans font-bold text-white mb-6 uppercase text-glow-cyan">
            Take Control
          </h2>
          <p className="text-white/70 font-mono leading-relaxed mb-10 max-w-xl mx-auto">
            Step into the cockpit. Experience the future of enterprise observability today.
          </p>
          <button className="group relative px-8 py-4 bg-cyan-500 text-black font-bold uppercase tracking-widest font-mono overflow-hidden transition-all hover:bg-cyan-400 hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]">
            <span className="relative z-10">Initialize Sequence</span>
            <div className="absolute inset-0 h-full w-0 bg-white transition-all duration-300 ease-out group-hover:w-full z-0 opacity-20"></div>
          </button>
        </section>
      </div>
    </main>
  );
}
