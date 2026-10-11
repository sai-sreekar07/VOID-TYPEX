import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import { CreativeBrief, EngagementProposal } from '../types';

interface BriefsExplorerProps {
  briefs: CreativeBrief[];
  proposals: EngagementProposal[];
  onSelectBrief: (brief: CreativeBrief) => void;
  onOpenBriefBuilder: () => void;
  persona: 'brand' | 'creator';
}

export const BriefsExplorer: React.FC<BriefsExplorerProps> = ({
  briefs,
  proposals,
  onSelectBrief,
  onOpenBriefBuilder,
  persona,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');

  const filteredBriefs = briefs.filter((brief) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      brief.title.toLowerCase().includes(q) ||
      brief.brandName.toLowerCase().includes(q) ||
      brief.contentType.toLowerCase().includes(q) ||
      brief.styleAesthetic.toLowerCase().includes(q) ||
      brief.styleTags.some((tag) => tag.toLowerCase().includes(q));

    const matchesFormat =
      selectedFormat === 'All' || brief.formatAspectRatio.includes(selectedFormat);

    return matchesSearch && matchesFormat;
  });

  return (
    <div className="space-y-6">
      {/* Briefs Header Banner */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
            Enterprise Production Briefs · Escrow Backed
          </p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-main)] font-display">
            Active Brand & Agency Production Briefs
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Every brief specifies target aspect ratios, model checkpoints, milestone escrow schedules, and commercial IP indemnification requirements.
          </p>
        </div>

        <button
          onClick={onOpenBriefBuilder}
          className="btn-tactile px-5 py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Brief</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 transition-colors">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search briefs by brand, aesthetic, format, or campaign goal..."
            className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl pl-10 pr-4 py-2 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs text-[var(--text-muted)] font-mono mr-1 shrink-0">Aspect Ratio:</span>
          {['All', '16:9', '9:16', '2.39:1'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedFormat === fmt
                  ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Briefs List */}
      <div className="space-y-4">
        {filteredBriefs.map((brief) => {
          const briefProposals = proposals.filter((p) => p.briefId === brief.id);

          return (
            <div
              key={brief.id}
              onClick={() => onSelectBrief(brief)}
              className="spotlight-card cursor-pointer group rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 lg:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <img
                    src={brief.brandLogo}
                    alt={brief.brandName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl object-cover border border-[var(--border-subtle)] shrink-0"
                  />
                  <div>
                    <div className="text-xs font-mono text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--accent-primary)]">{brief.brandName}</span>
                      <span aria-hidden="true"> · </span>
                      <span>Posted {brief.postedDate}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{brief.status}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-main)] font-display group-hover:text-[var(--accent-primary)] transition-colors">
                      {brief.title}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono tabular-nums shrink-0">
                  <div className="text-base font-bold text-emerald-400">
                    ${brief.budgetMin.toLocaleString()} – ${brief.budgetMax.toLocaleString()}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3 h-3" />
                    <span>Due {brief.deadline}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {brief.conceptOverview}
              </p>

              {/* Clean Unboxed Metadata Specifications */}
              <div className="text-xs font-mono text-[var(--text-muted)] flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[var(--text-main)] font-semibold">{brief.contentType}</span>
                <span aria-hidden="true">·</span>
                <span>Formats: {brief.formatAspectRatio.join(', ')}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{brief.commercialUseRequirements.tier}</span>
                </span>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="text-[var(--text-muted)]">
                  <span>Required Stack: </span>
                  <span className="text-[var(--text-main)]">{brief.requiredTools.join(' · ')}</span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[var(--text-muted)] tabular-nums">
                    {briefProposals.length} Proposals Submitted
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBrief(brief);
                    }}
                    className="btn-tactile px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-semibold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>{persona === 'creator' ? 'Submit Proposal' : 'Review Brief'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
