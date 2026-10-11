import React, { useState } from 'react';
import { X, MessageSquare, ArrowRight, Star, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { CreatorProfile, PortfolioItem } from '../types';

interface CreatorProfileModalProps {
  creator: CreatorProfile | null;
  creatorNumber?: number;
  onClose: () => void;
  onEngage: (creator: CreatorProfile) => void;
  onOpenChat: (creator: CreatorProfile) => void;
}

export const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
  creator,
  creatorNumber = 1,
  onClose,
  onEngage,
  onOpenChat,
}) => {
  if (!creator) return null;

  const validPortfolio = creator.portfolio.filter(Boolean);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem>(
    validPortfolio[0] || creator.featuredProject
  );

  const completedProjectsCount = creator.stats?.completedProjects ?? 42;
  const satisfactionRating = (creator.stats?.clientRating ?? 4.98).toFixed(2);
  const avgTurnaround = creator.stats?.averageTurnaround ?? '6 Days';
  const enterpriseClientCount = creator.verificationSignals?.enterpriseClientCount ?? 24;
  const formattedRank = String(creatorNumber).padStart(2, '0');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${creator.name} Organized Profile`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl bg-[#0A0D14] border border-white/[0.1] rounded-2xl shadow-hard-lg overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Top Specular Hairline */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400/70 to-transparent shrink-0" />

        {/* Clean Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#07090E] shrink-0">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
            Creator #{formattedRank} · Verification → Creator Profiles & AI Portfolios
          </span>
          <button
            onClick={onClose}
            aria-label="Close profile modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Organized 5-Section Body + Brand Trust Metrics */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Creator Name, Brief Definition & Brand Trust Metrics */}
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-[var(--border-subtle)]"
                  />
                  <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded bg-black/90 border border-amber-400/50 font-mono text-[10px] font-bold text-amber-300">
                    #{formattedRank}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-[var(--accent-primary)] font-bold uppercase">
                    Creator #{formattedRank} · {creator.role}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--text-main)] break-words">
                    {creator.name}
                  </h2>
                  <p className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed max-w-xl">
                    {creator.bio}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    onClose();
                    onOpenChat(creator);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-sky-400 text-[var(--text-main)] font-semibold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>Chat</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEngage(creator);
                  }}
                  className="btn-tactile px-3.5 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Hire / Invite</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Verified Trust Metrics Row for Brands */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3.5 border-t border-[var(--border-subtle)] font-mono tabular-nums">
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-0.5">
                <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Completed Projects</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400">
                  {completedProjectsCount} Delivered
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-0.5">
                <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  <span>Avg Satisfaction</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400">
                  {satisfactionRating} / 5.00
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-0.5">
                <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                  <span>Avg Turnaround</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-sky-400">
                  {avgTurnaround}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-0.5">
                <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Brand Partners</span>
                </div>
                <div className="text-sm sm:text-base font-extrabold text-[var(--text-main)]">
                  {enterpriseClientCount} Brands
                </div>
              </div>
            </div>
          </div>

          {/* Skills & AI Tools Used */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--accent-primary)]">
                Core Creative Skills
              </div>
              <ul className="space-y-1 text-xs sm:text-[13px] text-[var(--text-main)]">
                {creator.skills.map((skill) => (
                  <li key={skill} className="leading-relaxed">
                    • {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wide text-sky-400">
                AI Tools Used
              </div>
              <ul className="space-y-1 text-xs sm:text-[13px] text-[var(--text-main)]">
                {creator.tools.map((tool) => (
                  <li key={tool} className="leading-relaxed">
                    • {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Previous Projects */}
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-emerald-400">
              Previous Projects ({validPortfolio.length})
            </div>
            <div className="space-y-2.5">
              {validPortfolio.map((proj, index) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-colors space-y-1 ${
                    selectedProject.id === proj.id
                      ? 'bg-[var(--bg-tertiary)] border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                      {index + 1}. {proj.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-[var(--accent-primary)]">
                      {proj.clientName} ({proj.year})
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Portfolio Showcase */}
          <div className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[var(--accent-primary)]">
              AI Portfolio Showcase
            </div>

            <div className="rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-6 bg-black overflow-hidden">
                <img
                  src={selectedProject.thumbnail}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="md:col-span-6 p-4 flex flex-col justify-between space-y-2.5">
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm text-[var(--text-main)]">
                    {selectedProject.title}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>
                <div className="text-[11px] text-[var(--accent-primary)] font-semibold pt-2 border-t border-[var(--border-subtle)]">
                  Tools: {[selectedProject.aiTelemetry.primaryModel, ...selectedProject.aiTelemetry.secondaryModels].join(' · ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
