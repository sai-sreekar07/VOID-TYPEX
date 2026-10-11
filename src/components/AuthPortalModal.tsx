import React, { useState, useEffect } from 'react';
import {
  X,
  Film,
  Briefcase,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { AuthenticatedUser } from '../types';
import { AuthenticPlatformLogo } from './CreatorSuccessRoadmap';
import authStageBackdrop from '../assets/images/auth_portal_cinema_backdrop_1791628813947.jpg';
import creatorDocumentaryImg from '../assets/images/creator_studio_documentary_1791638060877.jpg';
import brandCampaignImg from '../assets/images/banner_brand_collaboration_1791642236145.jpg';
import paulPortraitImg from '../assets/images/creator_portrait_paul_1791638006658.jpg';
import directorImg from '../assets/images/director_portrait_1_1791626812610.jpg';

interface AuthPortalModalProps {
  isOpen: boolean;
  onClose?: () => void;
  standalone?: boolean;
  initialRole?: 'creator' | 'brand';
  onAuthenticate: (user: AuthenticatedUser) => void;
  onOpenEntranceRoadmap?: () => void;
}

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  isOpen,
  onClose,
  standalone = false,
  initialRole,
  onAuthenticate,
  onOpenEntranceRoadmap,
}) => {
  // Step 1: Role Selection ('choose') -> Step 2: Dedicated Creator Login ('creator') or Brand Login ('brand')
  const [selectedPortal, setSelectedPortal] = useState<'choose' | 'creator' | 'brand'>(
    standalone ? 'choose' : initialRole || 'choose'
  );

  useEffect(() => {
    if (!standalone && initialRole) {
      setSelectedPortal(initialRole);
    }
  }, [initialRole, standalone]);

  // Content Creator Auth State
  const [creatorMode, setCreatorMode] = useState<'signup' | 'signin'>('signup');
  const [creatorName, setCreatorName] = useState<string>('');
  const [creatorEmail, setCreatorEmail] = useState<string>('');
  const [creatorPassword, setCreatorPassword] = useState<string>('');
  const [creatorSkills, setCreatorSkills] = useState<string>(
    'Stable Diffusion, Runway, Midjourney, Kling 2.1, Google Nano Banana'
  );
  const [creatorRemember, setCreatorRemember] = useState<boolean>(true);
  const [creatorError, setCreatorError] = useState<string | null>(null);
  const [creatorLoading, setCreatorLoading] = useState<boolean>(false);

  // Brand / Company Auth State
  const [brandMode, setBrandMode] = useState<'signup' | 'signin'>('signup');
  const [brandName, setBrandName] = useState<string>('');
  const [brandCompany, setBrandCompany] = useState<string>('');
  const [brandEmail, setBrandEmail] = useState<string>('');
  const [brandPassword, setBrandPassword] = useState<string>('');
  const [brandRemember, setBrandRemember] = useState<boolean>(true);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [brandLoading, setBrandLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const syncUserToFirestore = async (
    uid: string,
    name: string,
    email: string,
    role: 'creator' | 'brand',
    organizationOrHandle: string,
    primarySpecialtyOrIndustry: string,
    avatar: string,
    rememberMe: boolean
  ) => {
    if (!auth.currentUser || auth.currentUser.uid !== uid) return;
    const publicPath = `users/${uid}`;
    const privatePath = `users/${uid}/private/info`;
    try {
      await setDoc(doc(db, 'users', uid), {
        uid: uid.slice(0, 128),
        name: name.slice(0, 100),
        role,
        organizationOrHandle: organizationOrHandle.slice(0, 100),
        primarySpecialtyOrIndustry: primarySpecialtyOrIndustry.slice(0, 120),
        avatar: avatar.slice(0, 500),
        rememberMe,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, 'users', uid, 'private', 'info'), {
        uid: uid.slice(0, 128),
        email: email.slice(0, 150),
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, publicPath || privatePath);
    }
  };

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatorError(null);
    setCreatorLoading(true);

    if (creatorMode === 'signup' && !creatorName.trim()) {
      setCreatorError('Content Creator Full Name is required.');
      setCreatorLoading(false);
      return;
    }

    try {
      const endpoint = creatorMode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: creatorName.trim() || creatorEmail.split('@')[0],
          email: creatorEmail,
          password: creatorPassword,
          role: 'creator',
          organizationOrHandle: `@${(creatorName.trim() || creatorEmail.split('@')[0])
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')}`,
          primarySpecialtyOrIndustry: creatorSkills,
          avatar: paulPortraitImg,
          rememberMe: creatorRemember,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      const authUser: AuthenticatedUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'creator',
        organizationOrHandle: data.user.organizationOrHandle,
        primarySpecialtyOrIndustry: data.user.primarySpecialtyOrIndustry,
        avatar: data.user.avatar || paulPortraitImg,
      };

      onAuthenticate(authUser);
      onClose?.();
    } catch (err: any) {
      setCreatorError(err?.message || 'Unable to authenticate creator account');
    } finally {
      setCreatorLoading(false);
    }
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBrandError(null);
    setBrandLoading(true);

    try {
      const endpoint = brandMode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brandName.trim() || brandEmail.split('@')[0],
          email: brandEmail,
          password: brandPassword,
          role: 'brand',
          organizationOrHandle: brandCompany.trim() || 'Enterprise Brand Studio',
          primarySpecialtyOrIndustry: 'Brand & Agency Production',
          avatar: directorImg,
          rememberMe: brandRemember,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      const authUser: AuthenticatedUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'brand',
        organizationOrHandle: data.user.organizationOrHandle,
        primarySpecialtyOrIndustry: data.user.primarySpecialtyOrIndustry,
        avatar: data.user.avatar || directorImg,
      };

      onAuthenticate(authUser);
      onClose?.();
    } catch (err: any) {
      setBrandError(err?.message || 'Unable to authenticate brand account');
    } finally {
      setBrandLoading(false);
    }
  };

  const handleGoogleSignIn = async (role: 'creator' | 'brand', rememberMe: boolean) => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const resolvedName = fbUser.displayName || (role === 'creator' ? 'Dhruv Bahri' : 'Elena Vance');
      const resolvedEmail = fbUser.email || 'user@synthetix.ai';
      const resolvedOrg =
        role === 'creator'
          ? `@${resolvedName.toLowerCase().replace(/[^a-z0-9]/g, '')}`
          : `${resolvedName.split(' ')[0]} Brand Studio`;
      const resolvedSpecialty =
        role === 'creator'
          ? 'Stable Diffusion, Runway, Midjourney, Kling 2.1'
          : 'Commercial Brand Campaigns';
      const resolvedAvatar = fbUser.photoURL || (role === 'creator' ? paulPortraitImg : directorImg);

      await syncUserToFirestore(
        fbUser.uid,
        resolvedName,
        resolvedEmail,
        role,
        resolvedOrg,
        resolvedSpecialty,
        resolvedAvatar,
        rememberMe
      );

      onAuthenticate({
        id: fbUser.uid,
        name: resolvedName,
        email: resolvedEmail,
        role,
        organizationOrHandle: resolvedOrg,
        primarySpecialtyOrIndustry: resolvedSpecialty,
        avatar: resolvedAvatar,
      });
      onClose?.();
    } catch (err: any) {
      if (role === 'creator') {
        setCreatorError(err?.message || 'Google Sign-In failed');
      } else {
        setBrandError(err?.message || 'Google Sign-In failed');
      }
    }
  };

  const activeBackgroundImg =
    selectedPortal === 'creator'
      ? creatorDocumentaryImg
      : selectedPortal === 'brand'
      ? brandCampaignImg
      : authStageBackdrop;

  return (
    <div
      className={
        standalone
          ? 'min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 relative z-20 overflow-x-hidden'
          : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto'
      }
      role="dialog"
      aria-modal="true"
      aria-label="Creator and Brand Authentication Portal"
    >
      {/* Dynamic Contextual Studio Background + Animated Floating Social Media Logos (Matching Starting Page) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <img
          src={activeBackgroundImg}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-[var(--bg-primary)]/85 to-[var(--bg-primary)]" />
        {[
          { id: 'youtube', top: '8%', left: '3%', rotate: -12, delay: 0 },
          { id: 'instagram', top: '12%', right: '4%', rotate: 14, delay: 0.5 },
          { id: 'tiktok', bottom: '14%', left: '4%', rotate: 10, delay: 1.1 },
          { id: 'linkedin', bottom: '10%', right: '5%', rotate: -10, delay: 0.8 },
          { id: 'facebook', top: '46%', left: '2%', rotate: -8, delay: 1.4 },
          { id: 'pinterest', top: '52%', right: '2.5%', rotate: 12, delay: 1.2 },
          { id: 'canva', bottom: '28%', left: '45%', rotate: -6, delay: 0.4 },
          { id: 'runway', top: '26%', right: '2%', rotate: 9, delay: 1.7 },
        ].map((bgLogo) => (
          <motion.div
            key={bgLogo.id}
            style={{
              top: bgLogo.top,
              bottom: bgLogo.bottom,
              left: bgLogo.left,
              right: bgLogo.right,
            }}
            animate={{
              y: [0, -12, 0],
              rotate: [bgLogo.rotate, bgLogo.rotate + 6, bgLogo.rotate],
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: bgLogo.delay,
            }}
            className="absolute p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md opacity-30 shadow-xl"
          >
            <AuthenticPlatformLogo platformId={bgLogo.id} className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>
        ))}
      </div>

      {/* ================================================================= */}
      {/* STEP 1: CHOOSE ROLE (CONTENT CREATOR OR BRAND / COMPANY)          */}
      {/* ================================================================= */}
      {selectedPortal === 'choose' && (
        <div className="relative z-10 w-full max-w-5xl rounded-3xl border border-white/[0.09] bg-[#0A0D14]/90 backdrop-blur-2xl shadow-hard-lg overflow-hidden my-auto">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 sm:px-8 py-4 border-b border-white/[0.08] bg-[#07090E]/90">
            <div className="flex items-center gap-2.5">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--text-main)]">
                SYNTHETIX
              </span>
              <span className="text-xs font-mono text-[var(--accent-primary)]">
                · AI Creative Production Network
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onOpenEntranceRoadmap && (
                <button
                  type="button"
                  onClick={onOpenEntranceRoadmap}
                  className="btn-tactile px-3.5 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400 hover:text-black border border-amber-400/50 text-amber-300 font-sans text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>? Start Freelancing Roadmap 🚩</span>
                </button>
              )}

              {!standalone && onClose && (
                <button
                  onClick={onClose}
                  aria-label="Close portal"
                  className="p-1.5 rounded-lg border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 space-y-7">
            <div className="text-left max-w-2xl space-y-2">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--accent-primary)]">
                Step 1 of 2 · Choose Your Portal
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold font-display text-[var(--text-main)] tracking-[-0.03em]">
                How Would You Like to Continue?
              </h1>
              <p className="text-sm text-[var(--text-muted)] font-sans leading-relaxed">
                Select one of the two options below to open your dedicated Sign In or Create Account page.
              </p>
            </div>

            {/* Clean Two-Column Role Cards (No 3D Note Beside Sign-In Options) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* OPTION 1: CONTENT CREATOR */}
              <div
                onClick={() => setSelectedPortal('creator')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedPortal('creator');
                }}
                className="group relative rounded-2xl border border-white/[0.1] hover:border-amber-400/70 bg-[#0D111A] overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[340px] shadow-hard"
              >
                <img
                  src={creatorDocumentaryImg}
                  alt="Content Creator Studio"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/75 to-black/25" />

                <div className="relative z-10 p-6 flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-300 font-medium flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>01. Content Creator</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-300">
                    Filmmakers · AI Artists
                  </span>
                </div>

                <div className="relative z-10 p-6 space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-display tracking-[-0.025em] text-white group-hover:text-amber-200 transition-colors">
                      Continue as a Content Creator
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                      Showcase your AI skills, tools, and project portfolio. View brand invitations, accept hiring offers, and chat directly to lock in deals.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPortal('creator');
                    }}
                    className="btn-tactile w-full py-3.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-sans font-semibold text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span>Go to Creator Sign In / Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* OPTION 2: BRAND / COMPANY */}
              <div
                onClick={() => setSelectedPortal('brand')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedPortal('brand');
                }}
                className="group relative rounded-2xl border border-white/[0.1] hover:border-emerald-400/70 bg-[#0D111A] overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[340px] shadow-hard"
              >
                <img
                  src={brandCampaignImg}
                  alt="Brand & Agency Campaign Studio"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/75 to-black/25" />

                <div className="relative z-10 p-6 flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-300 font-medium flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>02. Brand / Company</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-300">
                    Brands · Agencies
                  </span>
                </div>

                <div className="relative z-10 p-6 space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-display tracking-[-0.025em] text-white group-hover:text-emerald-200 transition-colors">
                      Continue as a Brand / Company
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                      Explore verified AI content creators (Dhruv Bahri, Phil Langer, YZA Voku), send direct hire invitations, chat in real time, and make deals.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPortal('brand');
                    }}
                    className="btn-tactile w-full py-3.5 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-sans font-semibold text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span>Go to Brand Sign In / Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STEP 2A: DEDICATED CONTENT CREATOR SIGN IN / CREATE ACCOUNT PAGE   */}
      {/* ================================================================= */}
      {selectedPortal === 'creator' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl rounded-2xl border border-white/[0.09] bg-[#0E121B]/95 backdrop-blur-xl shadow-hard-lg overflow-hidden my-auto"
        >
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0A0D14]">
            <button
              type="button"
              onClick={() => setSelectedPortal('choose')}
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Back to Role Selection (Creator / Brand)</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[var(--accent-primary)] font-semibold">
                Creator Studio Portal
              </span>
              {!standalone && onClose && (
                <button
                  onClick={onClose}
                  aria-label="Close portal"
                  className="p-1.5 rounded-lg border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Visual Showcase Column with Creator Studio Image */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-zinc-950 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
              <img
                src={creatorDocumentaryImg}
                alt="AI Content Creator Studio"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/35" />

              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/75 border border-white/15 text-xs font-mono text-[var(--accent-primary)] font-semibold">
                  <Film className="w-3.5 h-3.5" />
                  <span>CONTENT CREATOR PORTAL</span>
                </div>
              </div>

              <div className="relative z-10 space-y-3 text-white">
                <h3 className="text-xl sm:text-2xl font-bold font-display leading-snug">
                  AI Filmmakers, Visual Artists & Storytellers
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Receive direct brand invitations, accept project offers, chat in real time with brands, and lock in production deals.
                </p>
                <div className="pt-2 border-t border-white/15 text-[11px] font-mono text-amber-300">
                  Tools: Stable Diffusion · Runway · Kling 2.1 · Midjourney · Suno
                </div>
              </div>
            </div>

            {/* Right Creator Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold font-display tracking-tight text-[var(--text-main)]">
                    {creatorMode === 'signup'
                      ? 'Create Content Creator Account'
                      : 'Sign In as Content Creator'}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                    Enter your email and password to access your Creator Studio and Brand Invitations.
                  </p>
                </div>

                <div className="inline-flex items-center bg-[var(--bg-tertiary)] p-1 rounded-lg border border-white/10 text-xs font-sans font-semibold shrink-0">
                  <button
                    type="button"
                    onClick={() => setCreatorMode('signup')}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      creatorMode === 'signup'
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreatorMode('signin')}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      creatorMode === 'signin'
                        ? 'bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {creatorError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2 font-sans font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{creatorError}</span>
                </div>
              )}

              <form onSubmit={handleCreatorSubmit} className="space-y-4 text-xs font-sans">
                {creatorMode === 'signup' && (
                  <div>
                    <label className="font-sans font-medium text-[var(--text-muted)] block mb-1.5">
                      Content Creator Full Name <span className="text-[var(--accent-primary)]">(Required)</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        placeholder="Enter full creator name (e.g. Dhruv Bahri or Phil Langer)"
                        minLength={2}
                        maxLength={120}
                        className="w-full bg-[var(--bg-tertiary)] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-sans font-medium text-[var(--text-muted)] block mb-1.5">
                    Creator Email Address <span className="text-[var(--accent-primary)]">(Required)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={creatorEmail}
                      onChange={(e) => setCreatorEmail(e.target.value)}
                      placeholder="creator@studio.ai"
                      className="w-full bg-[var(--bg-tertiary)] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans font-medium text-[var(--text-muted)] block mb-1.5">
                    {creatorMode === 'signup' ? 'Create Password' : 'Password'} <span className="text-[var(--accent-primary)]">(Required)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={creatorPassword}
                      onChange={(e) => setCreatorPassword(e.target.value)}
                      placeholder="••••••••••••"
                      minLength={6}
                      className="w-full bg-[var(--bg-tertiary)] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                      required
                    />
                  </div>
                </div>

                {creatorMode === 'signup' && (
                  <div>
                    <label className="font-sans font-medium text-[var(--text-muted)] block mb-1.5">
                      AI Tools & Skills Used
                    </label>
                    <input
                      type="text"
                      value={creatorSkills}
                      onChange={(e) => setCreatorSkills(e.target.value)}
                      placeholder="Stable Diffusion, Runway, Midjourney, Kling 2.1"
                      className="w-full bg-[var(--bg-tertiary)] border border-white/10 rounded-lg px-3.5 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[var(--text-muted)] hover:text-[var(--text-main)] select-none">
                    <input
                      type="checkbox"
                      checked={creatorRemember}
                      onChange={(e) => setCreatorRemember(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-[var(--bg-tertiary)] cursor-pointer accent-amber-500"
                    />
                    <span>Remember me and store in database</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={creatorLoading}
                  className="btn-tactile w-full py-3 rounded-lg font-sans font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--accent-text)',
                  }}
                >
                  <span>
                    {creatorLoading
                      ? 'Authenticating Creator...'
                      : creatorMode === 'signup'
                      ? 'Create Creator Account & Enter Studio'
                      : 'Sign In as Content Creator'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('creator', creatorRemember)}
                  className="w-full py-2.5 px-4 rounded-lg border border-white/10 bg-[var(--bg-tertiary)] hover:border-[var(--accent-primary)] text-[var(--text-main)] text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Continue with Google (Creator Account)</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================================================================= */}
      {/* STEP 2B: DEDICATED BRAND / COMPANY SIGN IN / CREATE ACCOUNT PAGE   */}
      {/* ================================================================= */}
      {selectedPortal === 'brand' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl rounded-2xl border border-white/[0.09] bg-[#0E121B]/95 backdrop-blur-xl shadow-hard-lg overflow-hidden my-auto"
        >
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0A0D14]">
            <button
              type="button"
              onClick={() => setSelectedPortal('choose')}
              className="text-xs font-sans font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Role Selection (Creator / Brand)</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Brand & Company Portal
              </span>
              {!standalone && onClose && (
                <button
                  onClick={onClose}
                  aria-label="Close portal"
                  className="p-1.5 rounded-lg border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Visual Showcase Column with Brand Campaign Image */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-zinc-950 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
              <img
                src={brandCampaignImg}
                alt="Brand Campaign Production"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/35" />

              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/75 border border-white/15 text-xs font-mono text-emerald-400 font-semibold">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>BRAND & AGENCY PORTAL</span>
                </div>
              </div>

              <div className="relative z-10 space-y-3 text-white">
                <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight leading-snug">
                  Hire Verified AI Content Creators
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Explore organized creator portfolios, send direct hire invitations, chat with creators in real time, and finalize production deals.
                </p>
                <div className="pt-2 border-t border-white/15 text-[11px] font-mono text-emerald-300">
                  Direct Creator Invitations · Real-Time Chat · Deal Desk
                </div>
              </div>
            </div>

            {/* Right Brand Form Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold font-display tracking-tight text-[var(--text-main)]">
                    {brandMode === 'signup'
                      ? 'Create Brand / Company Account'
                      : 'Sign In as Brand / Company'}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                    Enter your work email and password to discover and hire AI content creators.
                  </p>
                </div>

                <div className="inline-flex items-center bg-[var(--bg-tertiary)] p-1 rounded-lg border border-white/10 text-xs font-sans font-semibold shrink-0">
                  <button
                    type="button"
                    onClick={() => setBrandMode('signup')}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      brandMode === 'signup'
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrandMode('signin')}
                    className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                      brandMode === 'signin'
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {brandError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2 font-sans font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{brandError}</span>
                </div>
              )}

              <form onSubmit={handleBrandSubmit} className="space-y-4 text-xs font-sans">
                {brandMode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-sans font-medium text-[var(--text-muted)] block mb-1.5">
                        Your Full Name <span className="text-emerald-400">(Required)</span>
                      </label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="e.g. Elena Vance"
                          className="w-full bg-[var(--bg-tertiary)] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-emerald-400 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-sans font-medium text-[var(--text-muted)] block mb-1.5">
                        Brand / Company Name <span className="text-emerald-400">(Required)</span>
                      </label>
                      <input
                        type="text"
                        value={brandCompany}
                        onChange={(e) => setBrandCompany(e.target.value)}
                        placeholder="e.g. Maison Aethel Studio"
                        className="w-full bg-[var(--bg-tertiary)] border border-white/10 rounded-lg px-3.5 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-emerald-400 transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-sans font-medium text-[var(--text-muted)] block mb-1.5">
                    Work Email Address <span className="text-emerald-400">(Required)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={brandEmail}
                      onChange={(e) => setBrandEmail(e.target.value)}
                      placeholder="producer@company.com"
                      className="w-full bg-[var(--bg-tertiary)] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-emerald-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans font-medium text-[var(--text-muted)] block mb-1.5">
                    {brandMode === 'signup' ? 'Create Password' : 'Password'} <span className="text-emerald-400">(Required)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={brandPassword}
                      onChange={(e) => setBrandPassword(e.target.value)}
                      placeholder="••••••••••••"
                      minLength={6}
                      className="w-full bg-[var(--bg-tertiary)] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-emerald-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[var(--text-muted)] hover:text-[var(--text-main)] select-none">
                    <input
                      type="checkbox"
                      checked={brandRemember}
                      onChange={(e) => setBrandRemember(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-[var(--bg-tertiary)] cursor-pointer accent-emerald-500"
                    />
                    <span>Remember me and store in database</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={brandLoading}
                  className="btn-tactile w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#06110C] font-sans font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>
                    {brandLoading
                      ? 'Authenticating Brand...'
                      : brandMode === 'signup'
                      ? 'Create Brand Account & Explore Creators'
                      : 'Sign In as Brand / Company'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('brand', brandRemember)}
                  className="w-full py-2.5 px-4 rounded-lg border border-white/10 bg-[var(--bg-tertiary)] hover:border-emerald-400 text-[var(--text-main)] text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Continue with Google (Brand Account)</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
