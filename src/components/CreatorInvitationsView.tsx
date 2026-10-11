import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  Handshake,
  DollarSign,
  Briefcase,
  Sparkles,
  Check,
  Send
} from 'lucide-react';
import { BrandInvitation, CreatorProfile, AuthenticatedUser } from '../types';

interface CreatorInvitationsViewProps {
  invitations: BrandInvitation[];
  creators: CreatorProfile[];
  currentUser: AuthenticatedUser | null;
  persona: 'creator' | 'brand';
  onAcceptInvitation: (invitation: BrandInvitation) => void;
  onMakeDeal: (invitation: BrandInvitation, dealAmount: number, dealDeliverables: string) => void;
  onOpenChat: (creator: CreatorProfile, invitation: BrandInvitation) => void;
  onCreateInvitation: (newInvite: {
    creatorId: string;
    projectTitle: string;
    briefDescription: string;
    proposedBudget: number;
    deliverables: string;
  }) => void;
}

export const CreatorInvitationsView: React.FC<CreatorInvitationsViewProps> = ({
  invitations,
  creators,
  currentUser,
  persona,
  onAcceptInvitation,
  onMakeDeal,
  onOpenChat,
  onCreateInvitation,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Accepted' | 'Deal Locked'>('All');
  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [dealAmountInput, setDealAmountInput] = useState<string>('');
  const [dealDeliverablesInput, setDealDeliverablesInput] = useState<string>('');

  // Brand Direct Hire Form state
  const [showSendForm, setShowSendForm] = useState<boolean>(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>(creators[0]?.id || '');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [briefDescription, setBriefDescription] = useState<string>('');
  const [proposedBudget, setProposedBudget] = useState<string>('18000');
  const [deliverables, setDeliverables] = useState<string>('4K 60fps Commercial Master + Project Stems');

  // If logged in as a specific creator, prioritize showing invitations matching their name or show all creator invitations
  const visibleInvitations = invitations.filter((inv) => {
    if (filterStatus !== 'All' && inv.status !== filterStatus) return false;
    return true;
  });

  const handleOpenDealForm = (inv: BrandInvitation) => {
    setActiveDealId(inv.id);
    setDealAmountInput(String(inv.dealAmount || inv.proposedBudget));
    setDealDeliverablesInput(inv.dealDeliverables || inv.deliverables);
  };

  const handleConfirmDeal = (e: React.FormEvent, inv: BrandInvitation) => {
    e.preventDefault();
    const numericAmount = Number(dealAmountInput) || inv.proposedBudget;
    onMakeDeal(inv, numericAmount, dealDeliverablesInput || inv.deliverables);
    setActiveDealId(null);
  };

  const handleBrandSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !selectedCreatorId) return;
    onCreateInvitation({
      creatorId: selectedCreatorId,
      projectTitle: projectTitle.trim(),
      briefDescription: briefDescription.trim() || 'Direct campaign production hire invitation.',
      proposedBudget: Number(proposedBudget) || 15000,
      deliverables: deliverables.trim() || '4K Master + Deliverables Package',
    });
    setProjectTitle('');
    setBriefDescription('');
    setShowSendForm(false);
  };

  const resolveCreatorForInvite = (inv: BrandInvitation): CreatorProfile => {
    return (
      creators.find(
        (c) =>
          c.id === inv.creatorId ||
          c.name.toLowerCase() === inv.creatorName.toLowerCase()
      ) || creators[0]
    );
  };

  const pendingCount = invitations.filter((i) => i.status === 'Pending').length;
  const acceptedCount = invitations.filter((i) => i.status === 'Accepted').length;
  const lockedDealsCount = invitations.filter((i) => i.status === 'Deal Locked').length;

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
              {persona === 'creator'
                ? 'Creator Studio Portal · Direct Brand Hiring & Deal Desk'
                : 'Brand Hiring Desk · Sent Invitations & Creator Deals'}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-main)] font-display tracking-tight">
              {persona === 'creator'
                ? 'Brand Invitations & Hiring Offers'
                : 'Sent Creator Invitations & Active Deals'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {persona === 'creator'
                ? 'See every brand that has invited or hired you for content creation. Accept any invitation to unlock direct brand–creator chat and finalize your production deal.'
                : 'Invite verified AI creators directly to your campaign, chat in real time once accepted, and lock in production deal terms.'}
            </p>
          </div>

          {persona === 'brand' && (
            <button
              onClick={() => setShowSendForm((prev) => !prev)}
              className="btn-tactile px-5 py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{showSendForm ? 'Close Hire Form' : 'Hire / Invite a Creator'}</span>
            </button>
          )}
        </div>

        {/* Summary Counters & Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)]">New Invites: </span>
              <span className="text-amber-400 font-bold">{pendingCount}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)]">Accepted & Chatting: </span>
              <span className="text-emerald-400 font-bold">{acceptedCount}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)]">Hired / Deals Locked: </span>
              <span className="text-[var(--accent-primary)] font-bold">{lockedDealsCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['All', 'Pending', 'Accepted', 'Deal Locked'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Direct Hire Form */}
        {persona === 'brand' && showSendForm && (
          <form
            onSubmit={handleBrandSendSubmit}
            className="p-5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--accent-primary)]/50 space-y-4 text-xs font-sans"
          >
            <div className="font-display font-bold text-sm text-[var(--accent-primary)] flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Send Direct Content Creation Invite to Creator</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-sans font-medium text-[var(--text-muted)] block mb-1">
                  Select Content Creator (Required)
                </label>
                <select
                  value={selectedCreatorId}
                  onChange={(e) => setSelectedCreatorId(e.target.value)}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)]"
                  required
                >
                  {creators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.handle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-sans font-medium text-[var(--text-muted)] block mb-1">
                  Campaign / Project Title (Required)
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Global Product Launch 16:9 Film"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)]"
                  required
                />
              </div>

              <div>
                <label className="font-sans font-medium text-[var(--text-muted)] block mb-1">
                  Proposed Budget (USD)
                </label>
                <input
                  type="number"
                  value={proposedBudget}
                  onChange={(e) => setProposedBudget(e.target.value)}
                  min={1000}
                  step={500}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-[var(--text-main)] font-mono tabular-nums focus:outline-none focus:border-[var(--accent-primary)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-sans font-medium text-[var(--text-muted)] block mb-1">
                  Brief Description
                </label>
                <input
                  type="text"
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  placeholder="Describe aesthetic, target AI workflow, and timeline..."
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)]"
                  required
                />
              </div>

              <div>
                <label className="font-sans font-medium text-[var(--text-muted)] block mb-1">
                  Required Deliverables
                </label>
                <input
                  type="text"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="4K 60fps Master + Custom LoRA Weights"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-tactile px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-sans font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Hire Invitation to Creator</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Invitations Cards List */}
      <div className="space-y-4">
        {visibleInvitations.map((inv) => {
          const targetCreator = resolveCreatorForInvite(inv);
          const isEditingDeal = activeDealId === inv.id;

          return (
            <div
              key={inv.id}
              className="spotlight-card rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 space-y-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-[var(--accent-primary)] font-bold">
                      Brand: {inv.brandName}
                    </span>
                    <span aria-hidden="true" className="text-[var(--text-muted)]">→</span>
                    <span className="text-[var(--text-main)] font-semibold break-words">
                      Creator: {inv.creatorName} ({inv.creatorHandle})
                    </span>
                    <span aria-hidden="true" className="text-[var(--text-muted)]">·</span>
                    <span
                      className={`font-bold ${
                        inv.status === 'Pending'
                          ? 'text-amber-400'
                          : inv.status === 'Accepted'
                          ? 'text-emerald-400'
                          : 'text-[var(--accent-primary)]'
                      }`}
                    >
                      {inv.status === 'Pending'
                        ? 'Invitation Pending Acceptance'
                        : inv.status === 'Accepted'
                        ? 'Invitation Accepted · Ready to Chat & Deal'
                        : 'Hired · Deal Locked'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-display text-[var(--text-main)] break-words">
                    {inv.projectTitle}
                  </h3>
                </div>

                <div className="text-left lg:text-right font-mono shrink-0">
                  <div className="text-lg font-extrabold text-emerald-400">
                    ${(inv.dealAmount || inv.proposedBudget).toLocaleString()}
                    {inv.status === 'Deal Locked' ? ' (Final Deal)' : ' (Proposed Offer)'}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 lg:justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sent {typeof inv.createdAt === 'string' && inv.createdAt.includes('T') ? new Date(inv.createdAt).toLocaleDateString() : inv.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Brief & Deliverables */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
                <div className="lg:col-span-7 space-y-1">
                  <span className="font-mono text-[var(--text-muted)] block">
                    Brand Campaign Brief
                  </span>
                  <p className="text-[var(--text-main)] leading-relaxed">
                    {inv.briefDescription}
                  </p>
                </div>

                <div className="lg:col-span-5 p-3.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-1 font-mono">
                  <span className="text-[var(--accent-primary)] font-semibold block">
                    {inv.status === 'Deal Locked' ? 'Locked Deal Deliverables' : 'Requested Deliverables'}
                  </span>
                  <p className="text-[var(--text-main)] leading-relaxed">
                    {inv.dealDeliverables || inv.deliverables}
                  </p>
                </div>
              </div>

              {/* Deal Builder Form (When creator or brand clicks "Make a Deal") */}
              {isEditingDeal && (
                <form
                  onSubmit={(e) => handleConfirmDeal(e, inv)}
                  className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-emerald-500/40 space-y-4 text-xs"
                >
                  <div className="font-mono font-bold text-emerald-400 flex items-center gap-2">
                    <Handshake className="w-4 h-4" />
                    <span>Finalize & Lock Content Creation Deal between {inv.brandName} & {inv.creatorName}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[var(--text-muted)] block mb-1">
                        Agreed Deal Amount (USD)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          value={dealAmountInput}
                          onChange={(e) => setDealAmountInput(e.target.value)}
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl pl-8 pr-3 py-2 text-[var(--text-main)] font-mono focus:outline-none focus:border-emerald-400"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-mono text-[var(--text-muted)] block mb-1">
                        Final Agreed Deliverables
                      </label>
                      <input
                        type="text"
                        value={dealDeliverablesInput}
                        onChange={(e) => setDealDeliverablesInput(e.target.value)}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[var(--text-main)] font-mono focus:outline-none focus:border-emerald-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveDealId(null)}
                      className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-tactile px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm & Lock Deal</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Action Footer: Creator can Accept Invite -> Chat -> Make a Deal */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-[var(--text-muted)]">
                  {inv.status === 'Pending' ? (
                    <span>
                      Accept this brand invite to open direct chat and negotiate your deal.
                    </span>
                  ) : inv.status === 'Accepted' ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Invite accepted! You can now chat directly and lock in a deal.</span>
                    </span>
                  ) : (
                    <span className="text-[var(--accent-primary)] flex items-center gap-1.5 font-semibold">
                      <Handshake className="w-4 h-4" />
                      <span>Official Deal Locked at ${(inv.dealAmount || inv.proposedBudget).toLocaleString()}</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {inv.status === 'Pending' && persona === 'creator' && (
                    <button
                      onClick={() => onAcceptInvitation(inv)}
                      className="btn-tactile px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Brand Invite</span>
                    </button>
                  )}

                  {inv.status !== 'Pending' && (
                    <>
                      <button
                        onClick={() => onOpenChat(targetCreator, inv)}
                        className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] hover:border-[var(--accent-primary)] text-[var(--text-main)] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        <span>
                          {persona === 'creator'
                            ? `Chat with ${inv.brandName}`
                            : `Chat with ${inv.creatorName}`}
                        </span>
                      </button>

                      {inv.status === 'Accepted' && !isEditingDeal && (
                        <button
                          onClick={() => handleOpenDealForm(inv)}
                          className="btn-tactile px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>Make a Deal</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
