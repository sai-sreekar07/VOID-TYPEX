import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Send, 
  CheckCircle2
} from 'lucide-react';
import { CreativeBrief, EngagementProposal, AuthenticatedUser } from '../types';
import directorImg from '../assets/images/director_portrait_1_1791626812610.jpg';

interface BriefDetailsModalProps {
  brief: CreativeBrief | null;
  proposals: EngagementProposal[];
  onClose: () => void;
  onSubmitProposal: (newProposal: EngagementProposal) => void;
  persona: 'brand' | 'creator';
  currentUser?: AuthenticatedUser | null;
}

export const BriefDetailsModal: React.FC<BriefDetailsModalProps> = ({
  brief,
  proposals,
  onClose,
  onSubmitProposal,
  currentUser,
}) => {
  if (!brief) return null;

  const relevantProposals = proposals.filter((p) => p.briefId === brief.id);

  const [showProposalForm, setShowProposalForm] = useState(false);
  const [bidAmount, setBidAmount] = useState<number>(brief.budgetMin + 1500);
  const [estimatedDays, setEstimatedDays] = useState<number>(7);
  const [proposalPitch, setProposalPitch] = useState<string>('');
  const [pipelineSteps, setPipelineSteps] = useState<string>(
    '1. Character/Asset LoRA consistency training -> 2. Runway Gen-3 Motion synthesis with depth rails -> 3. Topaz 4K ProRes upscale'
  );
  const [selectedTools] = useState<string[]>(brief.requiredTools);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalPitch.trim()) return;

    const newProp: EngagementProposal = {
      id: `prop-${Date.now()}`,
      briefId: brief.id,
      creatorId: currentUser?.id || 'creator-paul-trillo',
      creatorName: currentUser ? `${currentUser.name} (${currentUser.organizationOrHandle})` : 'Paul Trillo (@paultrillo)',
      creatorAvatar: currentUser?.avatar || directorImg,
      bidAmount,
      estimatedDays,
      proposalPitch,
      proposedPipeline: pipelineSteps.split('->').map((s) => s.trim()),
      proposedModels: selectedTools,
      status: 'Pending',
      sampleSeed: Math.floor(Math.random() * 89999999) + 10000000,
      submittedDate: 'Just now',
    };

    onSubmitProposal(newProp);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowProposalForm(false);
    }, 1800);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={brief.title}
    >
      <div className="relative w-full max-w-4xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl shadow-hard-lg overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-3">
            <img
              src={brief.brandLogo}
              alt={brief.brandName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover border border-[var(--border-subtle)]"
            />
            <div className="text-xs font-mono">
              <span className="font-bold text-[var(--accent-primary)]">
                {brief.brandName}
              </span>
              <span className="text-[var(--text-muted)] ml-2">
                · Due {brief.deadline}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                Creative Production Brief · {brief.status}
              </span>
              <h2 className="text-2xl font-bold font-display text-[var(--text-main)] mt-1">
                {brief.title}
              </h2>
            </div>

            <div className="text-left sm:text-right font-mono tabular-nums shrink-0">
              <span className="text-xs text-[var(--text-muted)] block">Escrow Budget Range</span>
              <span className="text-xl font-bold text-emerald-400">
                ${brief.budgetMin.toLocaleString()} – ${brief.budgetMax.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Concept Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono text-[var(--text-muted)] font-semibold">
              Campaign Objective & Creative Vision
            </h3>
            <p className="text-sm text-[var(--text-main)] leading-relaxed bg-[var(--bg-tertiary)] p-4 rounded-xl border border-[var(--border-subtle)]">
              {brief.conceptOverview}
            </p>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
              <h4 className="text-[var(--accent-primary)] font-semibold">
                Visual Style & Aesthetics
              </h4>
              <p className="text-[var(--text-main)] leading-relaxed font-sans">
                {brief.styleAesthetic}
              </p>
              <div className="text-[var(--text-muted)] pt-1">
                Tags: {brief.styleTags.join(' · ')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
              <h4 className="text-[var(--accent-primary)] font-semibold">
                Deliverable Formats & Ratios
              </h4>
              <div className="space-y-1 text-[var(--text-main)]">
                <div>Content Type: <span className="font-semibold">{brief.contentType}</span></div>
                <div>Aspect Ratios: <span className="font-semibold">{brief.formatAspectRatio.join(', ')}</span></div>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[var(--text-muted)] pt-1 font-sans">
                {brief.technicalDeliverables.map((td, i) => (
                  <li key={i}>{td}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Commercial Rights */}
          <div className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-[var(--text-main)] font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Commercial Rights Tier: {brief.commercialUseRequirements.tier}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[var(--text-muted)] pt-1">
              <div>
                <span className="block text-[11px]">Territory</span>
                <span className="text-[var(--text-main)]">{brief.commercialUseRequirements.territories}</span>
              </div>
              <div>
                <span className="block text-[11px]">Duration</span>
                <span className="text-[var(--text-main)]">{brief.commercialUseRequirements.duration}</span>
              </div>
              <div>
                <span className="block text-[11px]">AI Model IP Protection</span>
                <span className="text-emerald-400 font-semibold">
                  {brief.commercialUseRequirements.modelTrainingIpExclusion ? 'Excluded from Training' : 'Standard'}
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Escrow Schedule */}
          <div className="space-y-2 font-mono tabular-nums">
            <h3 className="text-xs text-[var(--text-muted)] font-semibold">
              Milestone Escrow Payment Schedule
            </h3>
            <div className="space-y-2">
              {brief.deliverableCheckpoints.map((cp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="text-[var(--text-main)] font-bold">
                      {cp.name} ({cp.pct}%)
                    </div>
                    <div className="text-[var(--text-muted)] font-sans mt-0.5">{cp.deliverable}</div>
                  </div>
                  <div className="text-emerald-400 font-bold shrink-0 ml-4">
                    ${Math.round((brief.budgetMin * cp.pct) / 100).toLocaleString()} – ${Math.round((brief.budgetMax * cp.pct) / 100).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proposals Section */}
          <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono text-[var(--text-muted)] font-semibold">
                Creator Proposals Received ({relevantProposals.length})
              </h3>
              {!showProposalForm && (
                <button
                  onClick={() => setShowProposalForm(true)}
                  className="btn-tactile px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Pitch Proposal</span>
                </button>
              )}
            </div>

            {showProposalForm && (
              <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--accent-primary)] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <h4 className="text-sm font-bold text-[var(--text-main)] font-display">
                    Submit Verified AI Production Proposal
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowProposalForm(false)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="text-[var(--text-muted)] block mb-1">Total Bid Amount ($ USD):</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>

                  <div>
                    <label className="text-[var(--text-muted)] block mb-1">Estimated Turnaround (Days):</label>
                    <input
                      type="number"
                      value={estimatedDays}
                      onChange={(e) => setEstimatedDays(Number(e.target.value))}
                      className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-main)] font-bold text-sm focus:outline-none focus:border-[var(--accent-primary)]"
                    />
                  </div>
                </div>

                <div className="font-mono text-xs">
                  <label className="text-[var(--text-muted)] block mb-1">Production Pitch & Consistency Approach:</label>
                  <textarea
                    rows={3}
                    value={proposalPitch}
                    onChange={(e) => setProposalPitch(e.target.value)}
                    placeholder="Describe how your custom LoRAs, depth rails, or ComfyUI node graphs guarantee consistency..."
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl p-3 text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)] leading-relaxed font-sans"
                    required
                  />
                </div>

                <div className="font-mono text-xs">
                  <label className="text-[var(--text-muted)] block mb-1">Proposed Pipeline Stages:</label>
                  <input
                    type="text"
                    value={pipelineSteps}
                    onChange={(e) => setPipelineSteps(e.target.value)}
                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-main)] text-xs focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submittedSuccess}
                    className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-2 cursor-pointer"
                  >
                    {submittedSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Proposal Submitted</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Proposal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {relevantProposals.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={prop.creatorAvatar}
                        alt={prop.creatorName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-lg object-cover border border-[var(--border-subtle)]"
                      />
                      <div>
                        <div className="font-bold text-[var(--text-main)]">
                          {prop.creatorName} · <span className="font-mono font-normal text-[var(--accent-primary)]">{prop.status}</span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] font-mono tabular-nums">
                          Bid: <span className="text-emerald-400 font-bold">${prop.bidAmount.toLocaleString()}</span> · {prop.estimatedDays} Days Turnaround
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono tabular-nums text-[var(--text-muted)]">
                      Seed {prop.sampleSeed}
                    </div>
                  </div>

                  <p className="text-[var(--text-main)] leading-relaxed pt-1">
                    "{prop.proposalPitch}"
                  </p>

                  <div className="text-[11px] font-mono text-[var(--text-muted)] pt-1">
                    Proposed Stack: {prop.proposedModels.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-subtle)] flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Escrow Protected by SYNTHETIX Commercial Guarantee
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--bg-tertiary)] text-[var(--text-main)] text-xs font-medium border border-[var(--border-subtle)] cursor-pointer"
          >
            Close Brief
          </button>
        </div>
      </div>
    </div>
  );
};
