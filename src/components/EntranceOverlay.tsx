import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Flag,
  CheckCircle2,
  X,
} from 'lucide-react';
import heroBg from '../assets/images/auth_portal_cinema_backdrop_1791628813947.jpg';
import { CreatorSuccessRoadmap, AuthenticPlatformLogo } from './CreatorSuccessRoadmap';
import { StartFreelancing3D } from './StartFreelancing3D';

interface EntranceOverlayProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const EntranceOverlay: React.FC<EntranceOverlayProps> = ({
  isVisible,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setSecondsLeft(10);
      setIsRoadmapOpen(false);
      return;
    }

    // Pause automatic completion while user is reading the Freelancing Roadmap
    if (isRoadmapOpen) {
      return;
    }

    const duration = 10000; // 10 seconds starting animation time
    const initialElapsed = (progress / 100) * duration;
    const startTime = performance.now() - initialElapsed;
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      const remSec = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setProgress(pct);
      setSecondsLeft(remSec);

      if (elapsed < duration) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isVisible, isRoadmapOpen, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="synthetix-entrance-curtain"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(12px)',
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[120] bg-[#05070B] flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto overflow-x-hidden select-none"
        >
          {/* High-Resolution Cinema Backdrop with 10s Ken Burns Zoom */}
          <motion.img
            src={heroBg}
            alt=""
            referrerPolicy="no-referrer"
            initial={{ scale: 1.18, opacity: 0 }}
            animate={{ scale: 1.0, opacity: 0.42 }}
            transition={{ duration: 10, ease: 'easeOut' }}
            className="fixed inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Animated Aurora Glows & Grid */}
          <div className="fixed inset-0 cinematic-grid opacity-60 pointer-events-none" />
          <div
            className="fixed -top-24 left-1/4 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-35 animate-ambient-mesh pointer-events-none"
            style={{ background: 'radial-gradient(circle, #F59E0B, transparent 65%)' }}
          />
          <div
            className="fixed -bottom-24 right-1/4 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-30 animate-ambient-mesh pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #10B981, transparent 65%)',
              animationDelay: '-3s',
            }}
          />
          <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-[#05070B]/65 to-[#05070B]/95 pointer-events-none" />

          {/* Decorative Social Media & Creator Platform Logos Floating in the Page Background */}
          <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
            {[
              { id: 'youtube', top: '12%', left: '5%', rotate: -12, delay: 0 },
              { id: 'instagram', top: '20%', right: '6%', rotate: 14, delay: 0.5 },
              { id: 'tiktok', bottom: '18%', left: '7%', rotate: 10, delay: 1.1 },
              { id: 'facebook', top: '14%', left: '44%', rotate: -8, delay: 1.5 },
              { id: 'linkedin', bottom: '14%', right: '8%', rotate: -10, delay: 0.8 },
              { id: 'pinterest', top: '48%', left: '3%', rotate: 12, delay: 1.3 },
              { id: 'canva', bottom: '24%', left: '42%', rotate: -6, delay: 0.4 },
              { id: 'runway', top: '34%', right: '3%', rotate: 9, delay: 1.7 },
            ].map((logo) => (
              <motion.div
                key={logo.id}
                style={{
                  top: logo.top,
                  bottom: logo.bottom,
                  left: logo.left,
                  right: logo.right,
                }}
                animate={{
                  y: [0, -12, 0],
                  rotate: [logo.rotate, logo.rotate + 6, logo.rotate],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: logo.delay,
                }}
                className="absolute p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md opacity-30 shadow-xl"
              >
                <AuthenticPlatformLogo platformId={logo.id} className="w-8 h-8 sm:w-10 sm:h-10" />
              </motion.div>
            ))}
          </div>

          {/* Top Bar: Timer Status (Skip Animation button removed as requested, keeping only the Skip button) */}
          <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 backdrop-blur-md text-xs font-mono text-amber-300 font-bold">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>AI CREATIVE PRODUCTION NETWORK · {isRoadmapOpen ? 'ROADMAP PAUSED' : `${secondsLeft}s INTRO`}</span>
            </div>
          </div>

          {/* Main Split Stage: Left Studio Intro + Right Highlighted Big Note "Start Freelancing" */}
          <div className="relative z-20 w-full max-w-7xl mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left 6 Columns: SYNTHETIX Intro & 10-Second Progress Bar */}
            <div className="lg:col-span-6 text-left space-y-6">
              <div className="space-y-3">
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-[-0.035em] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                >
                  SYNTHETIX
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="text-sm sm:text-base text-slate-300 font-sans font-medium tracking-normal leading-relaxed"
                >
                  Verification → Creator Profiles & AI Portfolios · Brief Builder → Brief Definition
                </motion.p>
              </div>

              {/* 10-Second Animated Progress Bar & Percentage Counter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.24 }}
                className="max-w-lg space-y-2.5 pt-2"
              >
                <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {isRoadmapOpen
                        ? 'Timer Paused — Exploring Your Roadmap to Creator Success'
                        : `Loading Creator Studios & AI Portfolios (${secondsLeft}s remaining)...`}
                    </span>
                  </span>
                  <span className="font-semibold text-emerald-400">{progress}%</span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-900/90 border border-white/15 overflow-hidden p-0.5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>

              {/* Immediate Enter / Skip Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className="pt-2 flex flex-wrap items-center gap-3"
              >
                <button
                  type="button"
                  onClick={onComplete}
                  className="btn-tactile px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs sm:text-sm font-sans font-bold tracking-tight inline-flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                >
                  <span>Skip ({secondsLeft}s) · Enter Studio Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </motion.div>
            </div>

            {/* Right 6 Columns: 3D "START FREELANCING" Sculptural Installation with Question Mark (?) & Flag Beside It */}
            <motion.div
              initial={{ opacity: 0, x: 28, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col items-center lg:items-end gap-3"
            >
              <div className="relative w-full max-w-xl">
                {/* Question Mark (?) and Flag Icons Placed Beside the 3D Note */}
                <div className="absolute -top-4 right-4 z-30 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsRoadmapOpen(true)}
                    title="How do I succeed in AI Freelancing?"
                    aria-label="Open Creator Success Roadmap Guide"
                    className="w-11 h-11 rounded-2xl bg-amber-400 text-black flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.8)] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <HelpCircle className="w-6 h-6 stroke-[2.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRoadmapOpen(true)}
                    title="Milestone Flag for Creator Success"
                    aria-label="View Creator Milestones"
                    className="w-11 h-11 rounded-2xl bg-emerald-400 text-black flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.8)] hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Flag className="w-6 h-6 stroke-[2.5]" />
                  </button>
                </div>

                <StartFreelancing3D
                  compact={true}
                  onActivate={() => setIsRoadmapOpen(true)}
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#949BA6]">
            <span>SYNTHETIX STUDIO · 10-SECOND STARTING SHOWCASE</span>
            <span>CLICK "START FREELANCING" ON THE RIGHT TO VIEW YOUR ROADMAP TO CREATOR SUCCESS</span>
          </div>

          {/* ================================================================= */}
          {/* INTERACTIVE MODAL: YOUR ROADMAP TO CREATOR SUCCESS                */}
          {/* ================================================================= */}
          <AnimatePresence>
            {isRoadmapOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[130] bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
                onClick={() => setIsRoadmapOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 12 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-6xl rounded-2xl bg-[#090D16] border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-left"
                >
                  {/* Modal Header */}
                  <div className="px-6 sm:px-8 py-4 border-b border-white/10 bg-[#0D121F] flex items-center justify-between gap-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#E59838]/15 border border-[#E59838]/40 flex items-center justify-center text-[#F3B35E]">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                        <Flag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-[#F3B35E] font-semibold">
                          Start Freelancing · Interactive Creator Journey
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold font-display text-[#F4F3EF]">
                          Your Roadmap to Creator Success
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsRoadmapOpen(false)}
                      className="p-2 rounded-lg border border-white/10 text-[#949BA6] hover:text-white hover:bg-white/5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body: Full Interactive Creator Success Roadmap */}
                  <div className="p-4 sm:p-6 overflow-y-auto">
                    <CreatorSuccessRoadmap
                      compactMode={true}
                      onExploreMarketplace={onComplete}
                    />
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 sm:px-8 py-4 border-t border-white/10 bg-[#0D121F] flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Core Pillars: Quality Content & Consistency</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsRoadmapOpen(false)}
                        className="px-4 py-2 rounded-lg border border-white/15 text-xs font-mono font-medium text-[#F4F3EF] hover:bg-white/5 cursor-pointer"
                      >
                        Back to Intro
                      </button>
                      <button
                        type="button"
                        onClick={onComplete}
                        className="btn-tactile px-5 py-2.5 rounded-lg bg-[#E59838] text-[#080A0F] font-mono text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                      >
                        <span>Continue to Portal Selection</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

