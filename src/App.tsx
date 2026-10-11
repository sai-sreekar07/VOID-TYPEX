import React, { useState, useEffect } from 'react';
import { Header, NavTabId } from './components/Header';
import { CreativeDiscoveryCanvas } from './components/CreativeDiscoveryCanvas';
import { CreatorProfileModal } from './components/CreatorProfileModal';
import { BriefsExplorer } from './components/BriefsExplorer';
import { BriefDetailsModal } from './components/BriefDetailsModal';
import { AiBriefBuilder } from './components/AiBriefBuilder';
import { EngagementsView } from './components/EngagementsView';
import { CreatorInvitationsView } from './components/CreatorInvitationsView';
import { ClaudeCursorAura } from './components/ClaudeCursorAura';
import { EntranceOverlay } from './components/EntranceOverlay';
import { AuthPortalModal } from './components/AuthPortalModal';
import { CreatorBrandChatDrawer } from './components/CreatorBrandChatDrawer';
import { AuthenticPlatformLogo } from './components/CreatorSuccessRoadmap';
import { 
  INITIAL_CREATORS, 
  INITIAL_BRIEFS, 
  INITIAL_PROPOSALS, 
  INITIAL_ENGAGEMENTS,
  INITIAL_INVITATIONS
} from './data/mockData';
import {
  CreatorProfile,
  CreativeBrief,
  EngagementProposal,
  AuthenticatedUser,
  BrandInvitation,
  ActiveEngagement
} from './types';
import { CheckCircle2, LogIn, UserPlus, LogOut, MessageSquare, MailCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

import bgAuthStage from './assets/images/bg_website_cinematic_aurora_1791642210932.jpg';
import bgCollabStudio from './assets/images/banner_brand_collaboration_1791642236145.jpg';

export default function App() {
  const [creators, setCreators] = useState<CreatorProfile[]>(INITIAL_CREATORS);
  const [briefs, setBriefs] = useState<CreativeBrief[]>(INITIAL_BRIEFS);
  const [proposals, setProposals] = useState<EngagementProposal[]>(INITIAL_PROPOSALS);
  const [engagements, setEngagements] = useState<ActiveEngagement[]>(INITIAL_ENGAGEMENTS);
  const [invitations, setInvitations] = useState<BrandInvitation[]>(INITIAL_INVITATIONS);

  // Authenticated User State: Always show the Sign-In / Create Account page first before opening the main workspace
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);

  // Strict Role-Locked View: A user logged in as a creator sees only as a creator, and vice-versa for a brand.
  const persona: 'creator' | 'brand' = currentUser ? currentUser.role : 'brand';

  const [currentTab, setCurrentTab] = useState<NavTabId>('creators');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<'creator' | 'brand'>('brand');
  const [activeChatCreator, setActiveChatCreator] = useState<CreatorProfile | null>(null);
  const [activeChatInvitation, setActiveChatInvitation] = useState<BrandInvitation | null>(null);
  const [showEntrance, setShowEntrance] = useState<boolean>(true);

  const [reducedMotion] = useState<boolean>(false);

  // Single Unified Palette ('dark' studio palette)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-reduced-motion', 'false');
  }, []);

  // Load persisted invitations from server database & listen via WebSocket
  useEffect(() => {
    fetch('/api/invitations')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.invitations) && data.invitations.length > 0) {
          setInvitations(data.invitations);
        }
      })
      .catch(() => {
        // Fallback to initial invitations
      });

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'invitation:updated' && Array.isArray(payload.invitations)) {
          setInvitations(payload.invitations);
        }
      } catch {
        // Ignore parse error
      }
    };

    return () => socket.close();
  }, []);

  // Listen to Firebase Auth state changes if user signed in via Google
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const snap = await getDoc(doc(db, 'users', fbUser.uid));
          if (snap.exists()) {
            const data = snap.data();
            const restored: AuthenticatedUser = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'User',
              email: fbUser.email || '',
              role: data.role === 'creator' ? 'creator' : 'brand',
              organizationOrHandle: data.organizationOrHandle || '',
              primarySpecialtyOrIndustry: data.primarySpecialtyOrIndustry || '',
              avatar: data.avatar || fbUser.photoURL || '',
            };
            setCurrentUser(restored);
            setCurrentTab(restored.role === 'creator' ? 'invitations' : 'creators');
            localStorage.setItem('synthetix_user', JSON.stringify(restored));
          }
        } catch {
          // Ignore if profile doc not yet created
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);
  const [selectedBrief, setSelectedBrief] = useState<CreativeBrief | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCreator(null);
        setSelectedBrief(null);
        setIsAuthModalOpen(false);
        setActiveChatCreator(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAuthenticate = (user: AuthenticatedUser) => {
    setCurrentUser(user);

    // If a new creator signs up with a custom name, also add them to the live creators directory if not present
    if (user.role === 'creator') {
      setCreators((prev) => {
        if (prev.some((c) => c.name.toLowerCase() === user.name.toLowerCase())) {
          return prev;
        }
        const customCreator: CreatorProfile = {
          ...prev[0],
          id: user.id,
          name: user.name,
          handle: user.organizationOrHandle || `@${user.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          role: 'Verified AI Content Creator & Director',
          avatar: user.avatar || prev[0].avatar,
          tools: user.primarySpecialtyOrIndustry
            ? user.primarySpecialtyOrIndustry.split(',').map((s) => s.trim()).filter(Boolean)
            : prev[0].tools,
        };
        return [customCreator, ...prev];
      });
      setCurrentTab('invitations');
    } else {
      setCurrentTab('creators');
    }

    try {
      localStorage.setItem('synthetix_user', JSON.stringify(user));
    } catch {
      // Ignore storage errors
    }
    triggerToast(
      `Welcome, ${user.name}! Viewing strictly as ${
        user.role === 'creator' ? 'Content Creator' : 'Brand / Company'
      }.`
    );
  };

  const handleSignOut = async () => {
    setCurrentUser(null);
    setCurrentTab('creators');
    try {
      localStorage.removeItem('synthetix_user');
      if (auth.currentUser) {
        await auth.signOut();
      }
    } catch {
      // Ignore
    }
    triggerToast('Signed out of SYNTHETIX workspace.');
  };

  const handlePublishBrief = (newBrief: CreativeBrief) => {
    setBriefs([newBrief, ...briefs]);
    triggerToast(`Creative Brief "${newBrief.title}" published!`);
    setCurrentTab('briefs');
  };

  const handleSubmitProposal = (newProposal: EngagementProposal) => {
    setProposals([newProposal, ...proposals]);
    triggerToast(`Proposal submitted to brand!`);
  };

  // When a Brand invites a Creator to a brief or hires them directly
  const handleInviteToBrief = async (creator: CreatorProfile) => {
    const brandName =
      currentUser?.role === 'brand'
        ? currentUser.organizationOrHandle || currentUser.name
        : 'Enterprise Brand Studio';

    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: currentUser?.id || 'brand-studio',
          brandName,
          brandAvatar: currentUser?.avatar || '',
          creatorId: creator.id,
          creatorName: creator.name,
          creatorHandle: creator.handle,
          creatorAvatar: creator.avatar,
          projectTitle: `${brandName} × ${creator.name}: Commercial AI Production`,
          briefDescription: `Direct invitation from ${brandName} to direct and synthesize our upcoming commercial campaign using ${creator.tools.slice(0, 3).join(', ')}.`,
          proposedBudget: creator.projectMinimum || 16000,
          deliverables: '4K 60fps Commercial Master + Custom Model Weights',
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.invitations)) {
        setInvitations(data.invitations);
      }
    } catch {
      // Optimistic fallback
    }

    triggerToast(`Sent direct hire invitation to ${creator.name}!`);
    setCurrentTab('invitations');
  };

  const handleCreateCustomInvitation = async (newInvite: {
    creatorId: string;
    projectTitle: string;
    briefDescription: string;
    proposedBudget: number;
    deliverables: string;
  }) => {
    const targetCreator = creators.find((c) => c.id === newInvite.creatorId) || creators[0];
    const brandName =
      currentUser?.role === 'brand'
        ? currentUser.organizationOrHandle || currentUser.name
        : 'Enterprise Brand Partner';

    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandId: currentUser?.id || 'brand-studio',
          brandName,
          brandAvatar: currentUser?.avatar || '',
          creatorId: targetCreator.id,
          creatorName: targetCreator.name,
          creatorHandle: targetCreator.handle,
          creatorAvatar: targetCreator.avatar,
          projectTitle: newInvite.projectTitle,
          briefDescription: newInvite.briefDescription,
          proposedBudget: newInvite.proposedBudget,
          deliverables: newInvite.deliverables,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.invitations)) {
        setInvitations(data.invitations);
      }
      triggerToast(`Hire invitation sent to ${targetCreator.name}!`);
    } catch {
      triggerToast(`Hire invitation sent to ${targetCreator.name}!`);
    }
  };

  // Creator accepts an invitation from a brand -> opens chat so they can chat & make a deal
  const handleAcceptInvitation = async (invitation: BrandInvitation) => {
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/accept`, {
        method: 'PATCH',
      });
      const data = await res.json();
      if (Array.isArray(data.invitations)) {
        setInvitations(data.invitations);
      }
      if (data.invitation) {
        setActiveChatInvitation(data.invitation);
      }
    } catch {
      setInvitations((prev) =>
        prev.map((i) => (i.id === invitation.id ? { ...i, status: 'Accepted' } : i))
      );
    }

    const matchedCreator =
      creators.find((c) => c.id === invitation.creatorId) || creators[0];
    setActiveChatCreator(matchedCreator);
    triggerToast(
      `Invitation from ${invitation.brandName} accepted! Direct chat is now open to make a deal.`
    );
  };

  // Creator and Brand finalize a deal
  const handleMakeDeal = async (
    invitation: BrandInvitation,
    dealAmount: number,
    dealDeliverables: string
  ) => {
    try {
      const res = await fetch(`/api/invitations/${invitation.id}/deal`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealAmount,
          dealDeliverables,
          senderName: currentUser?.name || invitation.creatorName,
          senderRole: persona,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data.invitations)) {
        setInvitations(data.invitations);
      }
      if (data.invitation) {
        setActiveChatInvitation(data.invitation);
      }
    } catch {
      setInvitations((prev) =>
        prev.map((i) =>
          i.id === invitation.id
            ? { ...i, status: 'Deal Locked', dealAmount, dealDeliverables }
            : i
        )
      );
    }

    // Also add to Active Engagements so both parties see the hired deal in production
    const newEngagement: ActiveEngagement = {
      id: `DEAL-${Date.now().toString().slice(-4)}`,
      briefTitle: invitation.projectTitle,
      brandName: invitation.brandName,
      creatorName: invitation.creatorName,
      creatorHandle: invitation.creatorHandle,
      contractValue: dealAmount,
      currentStage: 'Deal Locked · Production Kickoff',
      progressPct: 25,
      deadline: 'In 10 Days',
      iterationsCount: 1,
      verifiableProvenance: '0x94f8a2b1c8e7d3f6a5b2c1d9e8f7a6b5c4d3e2f1',
      milestones: [
        {
          name: '1. Styleframe & Workflow Conditioning',
          amount: Math.round(dealAmount * 0.3),
          completed: true,
        },
        {
          name: '2. Motion Cut & Brand Review',
          amount: Math.round(dealAmount * 0.4),
          completed: false,
        },
        {
          name: `3. Final Delivery (${dealDeliverables})`,
          amount: dealAmount - Math.round(dealAmount * 0.7),
          completed: false,
        },
      ],
    };
    setEngagements((prev) => [newEngagement, ...prev]);

    triggerToast(
      `Deal locked with ${invitation.brandName} for $${dealAmount.toLocaleString()}!`
    );
  };

  const pendingInvitesCount = invitations.filter((i) => i.status === 'Pending').length;

  // Show the Sign-In / Create Account Page FIRST before opening the main workspace
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex flex-col selection:bg-amber-400 selection:text-black relative overflow-hidden">
        <EntranceOverlay
          isVisible={showEntrance}
          onComplete={() => setShowEntrance(false)}
        />
        <ClaudeCursorAura reducedMotion={false} />

        {/* High-Impact Animated Cinema Background for the Sign-In Page */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <img
            src={bgAuthStage}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 animate-ken-burns"
          />
          <div className="absolute inset-0 cinematic-grid opacity-55" />
          <div
            className="absolute -top-36 left-1/4 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-30 animate-ambient-mesh"
            style={{ background: 'radial-gradient(circle, #F59E0B, transparent 65%)' }}
          />
          <div
            className="absolute top-1/3 -right-28 w-[34rem] h-[34rem] rounded-full blur-3xl opacity-25 animate-ambient-mesh"
            style={{
              background: 'radial-gradient(circle, #38BDF8, transparent 65%)',
              animationDelay: '-3s',
            }}
          />
          <div
            className="absolute -bottom-32 left-1/3 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25 animate-ambient-mesh"
            style={{
              background: 'radial-gradient(circle, #10B981, transparent 65%)',
              animationDelay: '-6s',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/50 via-[var(--bg-primary)]/75 to-[var(--bg-primary)]/95" />
        </div>

        <AuthPortalModal
          isOpen={true}
          standalone={true}
          onAuthenticate={handleAuthenticate}
          onOpenEntranceRoadmap={() => setShowEntrance(true)}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex flex-col selection:bg-amber-400 selection:text-black transition-colors duration-200 relative"
    >
      <EntranceOverlay
        isVisible={showEntrance}
        onComplete={() => setShowEntrance(false)}
      />
      <ClaudeCursorAura reducedMotion={false} />

      {/* Dynamic Contextual Studio Background, Readability Scrims & Floating Social Media Platform Logos (Matching Starting Page) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <img
          src={currentTab === 'invitations' || currentTab === 'briefs' ? bgCollabStudio : bgAuthStage}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 animate-ken-burns transition-opacity duration-700"
        />
        <div className="absolute inset-0 cinematic-grid opacity-50" />
        <div
          className="absolute -top-32 left-1/4 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25 animate-ambient-mesh"
          style={{ background: 'radial-gradient(circle, #F59E0B, transparent 65%)' }}
        />
        <div
          className="absolute top-1/2 -right-32 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-20 animate-ambient-mesh"
          style={{
            background: 'radial-gradient(circle, #10B981, transparent 65%)',
            animationDelay: '-4s',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/65 via-[var(--bg-primary)]/85 to-[var(--bg-primary)]" />

        {/* Floating Social Media & Creator Platform Logos on the Background After Sign-In (Just Like the Starting Page) */}
        {[
          { id: 'youtube', top: '10%', left: '2.5%', rotate: -12, delay: 0 },
          { id: 'instagram', top: '16%', right: '3%', rotate: 14, delay: 0.5 },
          { id: 'tiktok', bottom: '18%', left: '3%', rotate: 10, delay: 1.1 },
          { id: 'facebook', top: '38%', left: '1.8%', rotate: -8, delay: 1.5 },
          { id: 'linkedin', bottom: '14%', right: '3.5%', rotate: -10, delay: 0.8 },
          { id: 'pinterest', top: '58%', left: '2.2%', rotate: 12, delay: 1.3 },
          { id: 'canva', bottom: '34%', right: '2.2%', rotate: -6, delay: 0.4 },
          { id: 'runway', top: '42%', right: '2%', rotate: 9, delay: 1.7 },
          { id: 'premiere', top: '74%', left: '2.5%', rotate: -9, delay: 0.9 },
          { id: 'capcut', top: '26%', left: '48%', rotate: 8, delay: 1.4 },
          { id: 'figma', bottom: '8%', left: '46%', rotate: -7, delay: 0.6 },
          { id: 'gemini', top: '66%', right: '2.8%', rotate: 11, delay: 1.2 },
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
              duration: 5.2,
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className="p-4 rounded-xl font-sans text-xs font-semibold tracking-tight shadow-hard-lg flex items-center gap-2.5 border border-black/20"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--accent-text)',
            }}
          >
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Auto-Hiding Solid Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        persona={persona}
        pendingInvitesCount={pendingInvitesCount}
        onSignOut={handleSignOut}
        onOpenAuthModal={() => {
          setAuthModalInitialRole(persona);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Secondary Workspace Bar (Manual Brand/Creator View Toggle Buttons Removed; Role Determined Strictly by Login) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-20 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {currentUser ? (
            <div className="flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[var(--bg-secondary)]/90 backdrop-blur-md border border-[var(--border-subtle)] font-sans shadow-hard">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-amber-400 shrink-0"
              />
              <span className="text-[var(--text-main)] font-semibold break-words">
                {currentUser.name}
              </span>
              <span className="text-[var(--accent-primary)] font-mono text-[11px] font-medium">
                · {currentUser.role === 'creator' ? 'Creator Portal Only' : 'Brand Portal Only'}
              </span>
              <button
                onClick={handleSignOut}
                className="btn-tactile ml-1 px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-semibold flex items-center gap-1 cursor-pointer shadow-sm whitespace-nowrap text-[11px]"
                title="Sign Out of Account"
              >
                <LogOut className="w-3 h-3 stroke-[2.5]" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalInitialRole('creator');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-primary)] text-[var(--text-main)] font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap text-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Creator Login / Sign Up</span>
              </button>

              <button
                onClick={() => {
                  setAuthModalInitialRole('brand');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-emerald-400 text-[var(--text-main)] font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap text-xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Brand Login / Sign Up</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Controls: Start Freelancing Roadmap, Invitations Shortcut & Direct Brand-Creator Chat Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowEntrance(true)}
            className="px-3.5 py-1.5 rounded-xl border border-amber-400/60 bg-amber-500/15 hover:bg-amber-400 hover:text-black text-amber-300 text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <span>? Start Freelancing Roadmap 🚩</span>
          </button>

          <button
            onClick={() => setCurrentTab('invitations')}
            className="px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/90 backdrop-blur-md hover:border-[var(--accent-primary)] text-[var(--text-main)] text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <MailCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {persona === 'creator'
                ? `Brand Invitations (${invitations.length})`
                : `Sent Invites & Deals (${invitations.length})`}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveChatInvitation(invitations[0] || null);
              setActiveChatCreator(creators[0]);
            }}
            className="px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/90 backdrop-blur-md hover:border-[var(--accent-primary)] text-[var(--text-main)] text-xs font-sans font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Brand–Creator Chat</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {currentTab === 'creators' && (
              <div id="discovery-canvas-section">
                <CreativeDiscoveryCanvas
                  creators={creators}
                  onSelectCreator={(c) => setSelectedCreator(c)}
                  onInviteToBrief={handleInviteToBrief}
                  onOpenBriefBuilder={() => setCurrentTab('brief-builder')}
                  onOpenChat={(c) => {
                    const relatedInvite =
                      invitations.find((inv) => inv.creatorId === c.id) || null;
                    setActiveChatInvitation(relatedInvite);
                    setActiveChatCreator(c);
                  }}
                />
              </div>
            )}

            {currentTab === 'invitations' && (
              <CreatorInvitationsView
                invitations={invitations}
                creators={creators}
                currentUser={currentUser}
                persona={persona}
                onAcceptInvitation={handleAcceptInvitation}
                onMakeDeal={handleMakeDeal}
                onOpenChat={(creator, inv) => {
                  setActiveChatInvitation(inv);
                  setActiveChatCreator(creator);
                }}
                onCreateInvitation={handleCreateCustomInvitation}
              />
            )}

            {currentTab === 'briefs' && (
              <BriefsExplorer
                briefs={briefs}
                proposals={proposals}
                onSelectBrief={(b) => setSelectedBrief(b)}
                onOpenBriefBuilder={() =>
                  setCurrentTab(persona === 'creator' ? 'invitations' : 'brief-builder')
                }
                persona={persona}
              />
            )}

            {currentTab === 'brief-builder' && (
              <AiBriefBuilder onPublishBrief={handlePublishBrief} />
            )}

            {currentTab === 'engagements' && (
              <EngagementsView engagements={engagements} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/90 backdrop-blur-md px-6 py-8 text-xs text-[var(--text-muted)] mt-12 transition-colors relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-sm text-[var(--text-main)]">SYNTHETIX</span>
            <span aria-hidden="true">·</span>
            <span>Verification → Creator Profiles & AI Portfolios</span>
            <span aria-hidden="true">·</span>
            <span>Brief Builder → Brief Definition</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setCurrentTab('creators')}
              className="hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              Creator Profiles & AI Portfolios
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('brief-builder')}
              className="hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              Brief Definition
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('invitations')}
              className="hover:text-[var(--text-main)] transition-colors cursor-pointer"
            >
              Creator Invitations
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedCreator && (
        <CreatorProfileModal
          creator={selectedCreator}
          creatorNumber={Math.max(1, creators.findIndex((c) => c.id === selectedCreator.id) + 1)}
          onClose={() => setSelectedCreator(null)}
          onEngage={handleInviteToBrief}
          onOpenChat={(c) => {
            const relatedInvite = invitations.find((inv) => inv.creatorId === c.id) || null;
            setActiveChatInvitation(relatedInvite);
            setActiveChatCreator(c);
          }}
        />
      )}

      {selectedBrief && (
        <BriefDetailsModal
          brief={selectedBrief}
          proposals={proposals}
          onClose={() => setSelectedBrief(null)}
          onSubmitProposal={handleSubmitProposal}
          persona={persona}
          currentUser={currentUser}
        />
      )}

      <AuthPortalModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalInitialRole}
        onAuthenticate={handleAuthenticate}
      />

      <CreatorBrandChatDrawer
        creator={activeChatCreator}
        activeInvitation={activeChatInvitation}
        currentUser={currentUser}
        persona={persona}
        onClose={() => setActiveChatCreator(null)}
        onAcceptInvitation={handleAcceptInvitation}
        onMakeDeal={handleMakeDeal}
      />
    </motion.div>
  );
}
