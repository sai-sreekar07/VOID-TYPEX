import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck, 
  Cpu, 
  Check
} from 'lucide-react';
import { ActiveEngagement } from '../types';
import { ConsistencyChart } from './ConsistencyChart';
import arjunFilmImg from '../assets/images/project_arjun_epic_film_1791638969645.jpg';
import pavilionImg from '../assets/images/portfolio_architectural_pavilion_1791626799250.jpg';

interface EngagementsViewProps {
  engagements: ActiveEngagement[];
}

export const EngagementsView: React.FC<EngagementsViewProps> = ({ engagements }) => {
  const [selectedEngId, setSelectedEngId] = useState<string>(engagements[0]?.id || '');
  const selectedEng = engagements.find((e) => e.id === selectedEngId) || engagements[0];
  const [activeIterationTab, setActiveIterationTab] = useState<'pass1' | 'pass2'>('pass2');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [copiedCertHash, setCopiedCertHash] = useState<boolean>(false);

  const iterationPasses = {
    pass1: {
      seed: 20250108,
      cfg: 6.0,
      steps: 32,
      notes: 'Initial Stable Diffusion previsualization board. Adjusted volumetric golden-hour sunlight and character armor consistency.',
      thumbnail: pavilionImg,
      status: 'Reviewed with Feedback'
    },
    pass2: {
      seed: 20250112,
      cfg: 4.5,
      steps: 40,
      notes: 'Final locked master using custom character LoRAs and Runway/Hailuo continuous camera motion. 4K ProRes 422 HQ ready.',
      thumbnail: arjunFilmImg,
      status: 'Approved for Final IP Release'
    }
  };

  const currentPass = iterationPasses[activeIterationTab];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 lg:p-8 transition-colors space-y-4">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Production Workbench · Deterministic Seed Revisions
          </p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] font-display">
            Active Engagements & Seed Iteration Pipeline
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            In generative production, client revisions are managed via deterministic seeds, depth constraints, and LoRA weight tuning. Track escrow milestones and verify C2PA commercial IP release provenance.
          </p>
        </div>

        {engagements.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-[11px] font-mono text-[var(--text-muted)]">Select Contract:</span>
            {engagements.map((eng) => (
              <button
                key={eng.id}
                onClick={() => setSelectedEngId(eng.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono cursor-pointer transition-colors ${
                  selectedEng.id === eng.id
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
                }`}
              >
                #{eng.id} · {eng.briefTitle}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Engagement Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Engagement Overview & Milestones */}
        <div className="lg:col-span-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] p-5 lg:p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs tabular-nums">
            <span className="text-[var(--accent-primary)] font-bold">
              Contract #{selectedEng.id}
            </span>
            <span className="text-emerald-400 font-semibold">
              Escrow Secured: ${selectedEng.contractValue.toLocaleString()}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold font-display text-[var(--text-main)]">
              {selectedEng.briefTitle}
            </h3>
            <div className="text-xs text-[var(--text-muted)] font-mono mt-1">
              <span>Brand: <strong className="text-[var(--text-main)]">{selectedEng.brandName}</strong></span>
              <span aria-hidden="true"> · </span>
              <span>Creator: <strong className="text-[var(--accent-primary)]">{selectedEng.creatorName}</strong></span>
            </div>
          </div>

          {/* Current Stage & Progress Bar */}
          <div className="space-y-2.5 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono tabular-nums">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)]">Current Phase:</span>
              <span className="text-[var(--text-main)] font-bold">{selectedEng.currentStage}</span>
            </div>

            <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2.5 overflow-hidden border border-[var(--border-subtle)]">
              <div 
                className="h-2.5 rounded-full transition-transform duration-500 origin-left" 
                style={{ 
                  width: `${selectedEng.progressPct}%`,
                  background: 'linear-gradient(to right, var(--accent-primary), #10B981)' 
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1">
              <span>Progress: {selectedEng.progressPct}%</span>
              <span>Target Delivery: {selectedEng.deadline}</span>
            </div>
          </div>

          {/* Escrow Milestone Releases */}
          <div className="space-y-2 font-mono tabular-nums">
            <h4 className="text-xs text-[var(--text-muted)] font-semibold">
              Milestone Escrow Checkpoints
            </h4>
            <div className="space-y-2">
              {selectedEng.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    m.completed
                      ? 'bg-[var(--bg-tertiary)] border-emerald-500/40 text-emerald-400'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {m.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                    )}
                    <span>{m.name}</span>
                  </div>
                  <div className="font-bold">
                    ${m.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowCertificate(true)}
              className="w-full py-2.5 rounded-xl bg-[var(--bg-tertiary)] hover:border-[var(--accent-primary)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-mono font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Inspect Commercial IP Release Certificate</span>
            </button>
          </div>
        </div>

        {/* Right: AI Iteration & Seed Inspector */}
        <div className="lg:col-span-7 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] p-5 lg:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Generation Revision Pass ({selectedEng.iterationsCount} Iterations Logged)</span>
            </h3>

            <div className="flex items-center bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-subtle)] text-xs font-mono shrink-0">
              <button
                onClick={() => setActiveIterationTab('pass1')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeIterationTab === 'pass1'
                    ? 'bg-[var(--bg-card)] text-[var(--text-main)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Pass 1 (Prev-viz)
              </button>
              <button
                onClick={() => setActiveIterationTab('pass2')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeIterationTab === 'pass2'
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Pass 2 (Locked Master)
              </button>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="relative rounded-xl overflow-hidden border border-[var(--border-subtle)] h-64 bg-black">
            <img
              src={currentPass.thumbnail}
              alt="Generation iteration pass"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono tabular-nums text-zinc-200">
              <span>Seed {currentPass.seed} · CFG {currentPass.cfg} · {currentPass.steps} Steps</span>
              <span className="text-emerald-400 font-semibold">4K ProRes 422 HQ</span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-xs font-mono text-white">
              Status: <span className="font-semibold text-amber-300">{currentPass.status}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span>Director Feedback & Parameter Overrides</span>
              <span className="tabular-nums">Seed Determinism: 99.8%</span>
            </div>
            <p className="text-[var(--text-main)] leading-relaxed font-sans">
              "{currentPass.notes}"
            </p>
          </div>

          <ConsistencyChart creatorName={selectedEng.creatorName} />

          <div className="flex items-center justify-between pt-2 gap-4">
            <div className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Provenance Hash: {selectedEng.verifiableProvenance}</span>
            </div>

            <button
              onClick={() => setShowCertificate(true)}
              className="btn-tactile px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Verify & Finalize Release</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Commercial IP Release Certificate Modal */}
      {showCertificate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Verified Commercial IP Release Certificate"
        >
          <div className="relative w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--accent-primary)] rounded-2xl p-6 lg:p-8 space-y-6 shadow-hard-lg">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="font-display font-bold text-lg text-[var(--text-main)]">
                  Verified Commercial IP Release Certificate
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Cryptographic Chain of Title · C2PA Standard
                </p>
              </div>

              <button
                onClick={() => setShowCertificate(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-mono cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[var(--text-main)]">
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Grantor (Creator)</span>
                  <span className="font-bold">{selectedEng.creatorName} ({selectedEng.creatorHandle})</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Grantee (Brand)</span>
                  <span className="font-bold">{selectedEng.brandName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Licensing Tier</span>
                  <span className="text-[var(--accent-primary)] font-bold">Enterprise Broadcast & AI Indemnified</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-muted)] block">Master Delivery Token</span>
                  <span className="text-emerald-400 font-bold">4K ProRes 422 HQ (Pass 2 Locked)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[11px] text-[var(--text-muted)] block mb-1">Cryptographic Provenance Hash:</span>
                <div className="p-2.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-emerald-400 break-all flex items-center justify-between gap-2">
                  <span>{selectedEng.verifiableProvenance}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedEng.verifiableProvenance);
                      setCopiedCertHash(true);
                      setTimeout(() => setCopiedCertHash(false), 2000);
                    }}
                    className="text-[var(--text-muted)] hover:text-[var(--text-main)] shrink-0 cursor-pointer"
                  >
                    {copiedCertHash ? <Check className="w-4 h-4 text-emerald-400" /> : 'Copy'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-sans">
                By executing this certificate, Creator transfers exclusive worldwide commercial broadcast and digital rights in perpetuity. All model weights and LoRA checkpoints are certified free of unauthorized copyrighted training material.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Status: Cryptographically Signed</span>
              </div>

              <button
                onClick={() => setShowCertificate(false)}
                className="btn-tactile px-5 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
