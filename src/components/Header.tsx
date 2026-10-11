import React, { useState, useEffect } from 'react';
import { AuthenticatedUser } from '../types';

export type NavTabId = 'creators' | 'invitations' | 'briefs' | 'brief-builder' | 'engagements';

export interface HeaderProps {
  currentTab: NavTabId;
  setCurrentTab: (tab: NavTabId) => void;
  currentUser: AuthenticatedUser | null;
  persona: 'creator' | 'brand';
  pendingInvitesCount?: number;
  onOpenAuthModal: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  persona,
  pendingInvitesCount = 0,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide main navigation bar when scrolling down past 70px, reveal on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 70) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Role-isolated navigation items:
  // A person logged in as a creator sees only Creator tabs (including Invitations);
  // A person logged in as a brand sees Brand tabs.
  const navItems: { id: NavTabId; label: string }[] =
    currentUser?.role === 'creator'
      ? [
          {
            id: 'invitations',
            label:
              pendingInvitesCount > 0
                ? `Invitations (${pendingInvitesCount})`
                : 'Invitations',
          },
          { id: 'creators', label: 'Creator Profiles & AI Portfolios' },
          { id: 'brief-builder', label: 'Brief Definition' },
          { id: 'briefs', label: 'Active Briefs' },
          { id: 'engagements', label: 'Active Engagements' },
        ]
      : currentUser?.role === 'brand'
      ? [
          { id: 'creators', label: 'Creator Profiles & AI Portfolios' },
          { id: 'brief-builder', label: 'Brief Definition' },
          { id: 'invitations', label: 'Sent Invitations & Deals' },
          { id: 'briefs', label: 'Active Briefs' },
          { id: 'engagements', label: 'Active Engagements' },
        ]
      : [
          { id: 'creators', label: 'Creator Profiles & AI Portfolios' },
          { id: 'brief-builder', label: 'Brief Definition' },
          {
            id: 'invitations',
            label:
              pendingInvitesCount > 0
                ? `Invitations (${pendingInvitesCount})`
                : 'Invitations',
          },
          { id: 'briefs', label: 'Active Briefs' },
          { id: 'engagements', label: 'Active Engagements' },
        ];

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-[#050609]/90 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3 transition-transform duration-200 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() =>
            setCurrentTab(currentUser?.role === 'creator' ? 'invitations' : 'creators')
          }
          className="text-base sm:text-lg font-extrabold tracking-tight text-white font-display whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
        >
          SYNTHETIX
        </button>

        {/* Zone 2: Navigation buttons with adjusted font size so every button is completely visible */}
        <nav
          aria-label="Primary Navigation"
          className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[11px] sm:text-xs font-medium"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? 'bg-amber-400 text-[#050609] font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Sign Out when authenticated) */}
        <div className="flex items-center shrink-0">
          {currentUser && onSignOut ? (
            <button
              onClick={onSignOut}
              className="btn-tactile px-3.5 sm:px-4 py-1.5 rounded-xl font-bold text-[11px] sm:text-xs whitespace-nowrap shrink-0 cursor-pointer bg-white/[0.06] hover:bg-rose-500/90 border border-white/[0.12] hover:border-rose-400 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              Sign Out ({currentUser.name.split(' ')[0]})
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="btn-tactile px-3.5 sm:px-4 py-1.5 rounded-xl font-bold text-[11px] sm:text-xs whitespace-nowrap shrink-0 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--accent-text)',
              }}
            >
              Sign In / Join
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
