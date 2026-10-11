import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  FolderOpen,
  MessageSquare,
  ArrowRight,
  X,
  Star,
  CheckCircle2,
  Clock,
  Film,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreatorProfile, PortfolioItem } from '../types';
import heroShowcaseImg from '../assets/images/hero_ai_creator_showcase_1791642225400.jpg';
import collabBannerImg from '../assets/images/banner_brand_collaboration_1791642236145.jpg';
import arjunFilmImg from '../assets/images/project_arjun_epic_film_1791638969645.jpg';
import quietManImg from '../assets/images/project_the_quiet_man_1791638983912.jpg';
import lonelinessFilmImg from '../assets/images/project_experimental_loneliness_1791638995705.jpg';
import hybridsPortraitImg from '../assets/images/project_the_hybrids_portrait_1791639018072.jpg';
import desertPerfumeImg from '../assets/images/project_desert_perfume_ad_1791639031179.jpg';
import cyberGridBgImg from '../assets/images/bg_midnight_cyber_grid_1791627284928.jpg';
import mechaAnimeImg from '../assets/images/portfolio_cyber_mecha_anime_1791628925473.jpg';
import auroraBgImg from '../assets/images/bg_website_cinematic_aurora_1791642210932.jpg';
import hypercarTokyoImg from '../assets/images/portfolio_hypercar_tokyo_1791626757257.jpg';
import scifiOdysseyImg from '../assets/images/portfolio_scifi_odyssey_1791628870692.jpg';
import terracottaBgImg from '../assets/images/bg_studio_terracotta_dark_1791628842697.jpg';
import biophilicForestImg from '../assets/images/bg_nature_biophilic_forest_1791627302545.jpg';
import fashionCoutureImg from '../assets/images/portfolio_fashion_couture_1791626774002.jpg';
import cinemaBackdropImg from '../assets/images/auth_portal_cinema_backdrop_1791628813947.jpg';
import pavilionImg from '../assets/images/portfolio_architectural_pavilion_1791626799250.jpg';
import futuristicDarkBgImg from '../assets/images/bg_ai_futuristic_dark_1791627267429.jpg';
import botanicalSerumImg from '../assets/images/portfolio_botanical_serum_1791626788198.jpg';
import { CreatorSuccessRoadmap, AuthenticPlatformLogo } from './CreatorSuccessRoadmap';
import { StartFreelancing3D } from './StartFreelancing3D';

/**
 * Decorative social media & creator platform logos positioned across the
 * background of the Creators page, matching the Creator Success Roadmap aesthetic.
 */
const CREATORS_PAGE_BACKGROUND_LOGOS: ReadonlyArray<{
  id: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: string;
  rotate: number;
}> = [
  { id: 'youtube', top: '2%', left: '1.5%', size: 'w-12 h-12', rotate: -12 },
  { id: 'instagram', top: '6%', right: '2%', size: 'w-14 h-14', rotate: 14 },
  { id: 'tiktok', top: '16%', left: '2.5%', size: 'w-12 h-12', rotate: 10 },
  { id: 'linkedin', top: '24%', right: '1.8%', size: 'w-11 h-11', rotate: -10 },
  { id: 'facebook', top: '34%', left: '1.2%', size: 'w-11 h-11', rotate: -8 },
  { id: 'pinterest', top: '44%', right: '2.2%', size: 'w-12 h-12', rotate: 12 },
  { id: 'canva', top: '54%', left: '2%', size: 'w-11 h-11', rotate: -6 },
  { id: 'premiere', top: '63%', right: '1.5%', size: 'w-12 h-12', rotate: 8 },
  { id: 'aftereffects', top: '72%', left: '1.8%', size: 'w-12 h-12', rotate: -11 },
  { id: 'capcut', top: '80%', right: '2.4%', size: 'w-10 h-10', rotate: 9 },
  { id: 'figma', top: '86%', left: '2.2%', size: 'w-11 h-11', rotate: -7 },
  { id: 'chatgpt', top: '91%', right: '1.8%', size: 'w-12 h-12', rotate: 11 },
  { id: 'gemini', bottom: '4%', left: '3%', size: 'w-12 h-12', rotate: -9 },
  { id: 'runway', bottom: '2%', right: '3%', size: 'w-11 h-11', rotate: 7 },
];

/**
 * Clamps a numeric value safely within [min, max], guarding against NaN or Infinity.
 * Time Complexity: O(1) | Space Complexity: O(1)
 */
function clampSafeNumber(value: number | undefined | null, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * Checks whether a single CreatorProfile matches the normalized search query, tool filter,
 * and content type filter. Extracted to keep cyclomatic complexity low for SonarQube compliance.
 * Time Complexity: O(S + T + P) where S=skills, T=tools, P=portfolio items per creator.
 */
function matchesCreatorCriteria(
  creator: CreatorProfile | null | undefined,
  normalizedQuery: string,
  selectedToolLower: string,
  selectedContentTypeLower: string
): boolean {
  if (!creator || typeof creator.name !== 'string') {
    return false;
  }

  const safeSkills = Array.isArray(creator.skills) ? creator.skills : [];
  const safeTools = Array.isArray(creator.tools) ? creator.tools : [];
  const safePortfolio = Array.isArray(creator.portfolio) ? creator.portfolio.filter(Boolean) : [];

  const matchesTool =
    selectedToolLower === 'all' ||
    safeTools.some((tool) => typeof tool === 'string' && tool.toLowerCase().includes(selectedToolLower));

  if (!matchesTool) {
    return false;
  }

  const matchesContentType =
    selectedContentTypeLower === 'all' ||
    safePortfolio.some(
      (item) => typeof item.category === 'string' && item.category.toLowerCase() === selectedContentTypeLower
    );

  if (!matchesContentType) {
    return false;
  }

  if (!normalizedQuery) {
    return true;
  }

  const matchesPrimaryText =
    creator.name.toLowerCase().includes(normalizedQuery) ||
    (typeof creator.role === 'string' && creator.role.toLowerCase().includes(normalizedQuery)) ||
    (typeof creator.bio === 'string' && creator.bio.toLowerCase().includes(normalizedQuery));

  if (matchesPrimaryText) {
    return true;
  }

  const matchesSkillOrTool =
    safeSkills.some((s) => typeof s === 'string' && s.toLowerCase().includes(normalizedQuery)) ||
    safeTools.some((t) => typeof t === 'string' && t.toLowerCase().includes(normalizedQuery));

  if (matchesSkillOrTool) {
    return true;
  }

  return safePortfolio.some(
    (p) =>
      (typeof p.title === 'string' && p.title.toLowerCase().includes(normalizedQuery)) ||
      (typeof p.description === 'string' && p.description.toLowerCase().includes(normalizedQuery)) ||
      (typeof p.category === 'string' && p.category.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * Safely computes the total completed projects across all creators, guarding against
 * null/empty arrays, negative values, or integer overflow.
 * Time Complexity: O(N) | Space Complexity: O(1)
 */
function computeTotalCompletedProjects(creators: ReadonlyArray<CreatorProfile> | null | undefined): number {
  if (!Array.isArray(creators) || creators.length === 0) {
    return 0;
  }
  return creators.reduce((sum, creator) => {
    const count = clampSafeNumber(creator?.stats?.completedProjects, 0, 1_000_000, 0);
    return sum + Math.floor(count);
  }, 0);
}

/**
 * Safely computes the network average satisfaction rating formatted to 2 decimal places.
 * Time Complexity: O(N) | Space Complexity: O(1)
 */
function computeNetworkAverageSatisfaction(creators: ReadonlyArray<CreatorProfile> | null | undefined): string {
  if (!Array.isArray(creators) || creators.length === 0) {
    return '4.98';
  }
  const totalRating = creators.reduce((sum, creator) => {
    const rating = clampSafeNumber(creator?.stats?.clientRating, 0, 5, 4.98);
    return sum + rating;
  }, 0);
  const avg = totalRating / creators.length;
  return (Math.round(avg * 100) / 100).toFixed(2);
}

const AnimatedNumber: React.FC<{ value: number; duration?: number; decimals?: number }> = ({
  value,
  duration = 1100,
  decimals = 0,
}) => {
  const safeTarget = clampSafeNumber(value, 0, Number.MAX_SAFE_INTEGER, 0);
  const safeDuration = clampSafeNumber(duration, 1, 60_000, 1100);
  const safeDecimals = Math.floor(clampSafeNumber(decimals, 0, 6, 0));
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min(Math.max((timestamp - startTime) / safeDuration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(safeTarget * eased);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [safeTarget, safeDuration]);

  return <>{displayVal.toFixed(safeDecimals)}</>;
};

interface CreativeDiscoveryCanvasProps {
  creators: CreatorProfile[];
  onSelectCreator: (creator: CreatorProfile) => void;
  onInviteToBrief: (creator: CreatorProfile) => void;
  onOpenChat: (creator: CreatorProfile) => void;
  onOpenBriefBuilder?: () => void;
}

const CREATOR_ACCENT_THEMES = [
  {
    name: 'Ancient Golden Epic',
    backdropImg: arjunFilmImg,
    topBar: 'from-amber-400 via-orange-500 to-yellow-300',
    badgeText: 'text-amber-300',
    borderGlow: 'hover:border-amber-400/60',
    auraGradient: 'radial-gradient(circle at 20% 25%, rgba(245, 158, 11, 0.28) 0%, rgba(217, 119, 6, 0.10) 45%, transparent 72%)',
    orbColorA: 'rgba(251, 191, 36, 0.26)',
    orbColorB: 'rgba(234, 88, 12, 0.20)',
    ringBorder: 'border-amber-400/50',
    scanbeam: 'from-transparent via-amber-400/20 to-transparent',
    motionPreset: { scale: [1, 1.12, 1.04, 1], x: [0, -18, 12, 0], y: [0, -10, 8, 0], rotate: [0, 1.4, -1, 0] },
  },
  {
    name: 'Neo-Noir Continuous Cinema',
    backdropImg: quietManImg,
    topBar: 'from-cyan-400 via-sky-500 to-emerald-400',
    badgeText: 'text-cyan-300',
    borderGlow: 'hover:border-cyan-400/60',
    auraGradient: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.28) 0%, rgba(16, 185, 129, 0.12) 48%, transparent 74%)',
    orbColorA: 'rgba(56, 189, 248, 0.25)',
    orbColorB: 'rgba(20, 184, 166, 0.22)',
    ringBorder: 'border-cyan-400/50',
    scanbeam: 'from-transparent via-cyan-400/20 to-transparent',
    motionPreset: { scale: [1.02, 1.15, 1.05, 1.02], x: [0, 22, -14, 0], y: [0, 12, -8, 0], rotate: [0, -1.6, 1.2, 0] },
  },
  {
    name: 'Poetic Twilight Solitude',
    backdropImg: lonelinessFilmImg,
    topBar: 'from-violet-400 via-fuchsia-400 to-indigo-400',
    badgeText: 'text-violet-300',
    borderGlow: 'hover:border-violet-400/60',
    auraGradient: 'radial-gradient(circle at 30% 75%, rgba(167, 139, 250, 0.28) 0%, rgba(232, 121, 249, 0.12) 48%, transparent 74%)',
    orbColorA: 'rgba(167, 139, 250, 0.26)',
    orbColorB: 'rgba(244, 114, 182, 0.20)',
    ringBorder: 'border-violet-400/50',
    scanbeam: 'from-transparent via-violet-400/20 to-transparent',
    motionPreset: { scale: [1, 1.14, 1.03, 1], x: [0, -14, 18, 0], y: [0, 14, -12, 0], rotate: [0, 1.8, -1.2, 0] },
  },
  {
    name: 'Biomorphic Hybrid Studio',
    backdropImg: hybridsPortraitImg,
    topBar: 'from-emerald-400 via-teal-400 to-lime-300',
    badgeText: 'text-emerald-300',
    borderGlow: 'hover:border-emerald-400/60',
    auraGradient: 'radial-gradient(circle at 75% 65%, rgba(16, 185, 129, 0.28) 0%, rgba(45, 212, 191, 0.12) 48%, transparent 74%)',
    orbColorA: 'rgba(52, 211, 153, 0.26)',
    orbColorB: 'rgba(245, 158, 11, 0.18)',
    ringBorder: 'border-emerald-400/50',
    scanbeam: 'from-transparent via-emerald-400/20 to-transparent',
    motionPreset: { scale: [1.03, 1.16, 1.02, 1.03], x: [0, 16, -20, 0], y: [0, -14, 10, 0], rotate: [0, -1.5, 1.5, 0] },
  },
  {
    name: 'Mirage Luxury Gold',
    backdropImg: desertPerfumeImg,
    topBar: 'from-amber-300 via-rose-400 to-orange-400',
    badgeText: 'text-amber-200',
    borderGlow: 'hover:border-rose-400/60',
    auraGradient: 'radial-gradient(circle at 25% 30%, rgba(251, 191, 36, 0.28) 0%, rgba(251, 113, 133, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(251, 191, 36, 0.26)',
    orbColorB: 'rgba(251, 113, 133, 0.22)',
    ringBorder: 'border-rose-400/50',
    scanbeam: 'from-transparent via-rose-400/20 to-transparent',
    motionPreset: { scale: [1, 1.13, 1.05, 1], x: [0, -20, 14, 0], y: [0, 10, -10, 0], rotate: [0, 1.2, -1.6, 0] },
  },
  {
    name: 'Cybernetic Metropolis Grid',
    backdropImg: cyberGridBgImg,
    topBar: 'from-sky-400 via-indigo-400 to-cyan-300',
    badgeText: 'text-sky-300',
    borderGlow: 'hover:border-sky-400/60',
    auraGradient: 'radial-gradient(circle at 70% 30%, rgba(56, 189, 248, 0.28) 0%, rgba(99, 102, 241, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(56, 189, 248, 0.26)',
    orbColorB: 'rgba(129, 140, 248, 0.22)',
    ringBorder: 'border-sky-400/50',
    scanbeam: 'from-transparent via-sky-400/20 to-transparent',
    motionPreset: { scale: [1.02, 1.15, 1.04, 1.02], x: [0, 20, -16, 0], y: [0, -12, 12, 0], rotate: [0, -1.8, 1.1, 0] },
  },
  {
    name: 'Synthwave Mecha Pulse',
    backdropImg: mechaAnimeImg,
    topBar: 'from-fuchsia-400 via-rose-500 to-amber-400',
    badgeText: 'text-fuchsia-300',
    borderGlow: 'hover:border-fuchsia-400/60',
    auraGradient: 'radial-gradient(circle at 35% 70%, rgba(232, 121, 249, 0.28) 0%, rgba(244, 63, 94, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(232, 121, 249, 0.26)',
    orbColorB: 'rgba(251, 191, 36, 0.20)',
    ringBorder: 'border-fuchsia-400/50',
    scanbeam: 'from-transparent via-fuchsia-400/20 to-transparent',
    motionPreset: { scale: [1, 1.16, 1.04, 1], x: [0, -18, 22, 0], y: [0, 14, -8, 0], rotate: [0, 2.0, -1.4, 0] },
  },
  {
    name: 'Surreal Morphing Aurora',
    backdropImg: auroraBgImg,
    topBar: 'from-teal-300 via-emerald-400 to-cyan-400',
    badgeText: 'text-teal-300',
    borderGlow: 'hover:border-teal-400/60',
    auraGradient: 'radial-gradient(circle at 60% 25%, rgba(45, 212, 191, 0.28) 0%, rgba(16, 185, 129, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(45, 212, 191, 0.26)',
    orbColorB: 'rgba(56, 189, 248, 0.22)',
    ringBorder: 'border-teal-400/50',
    scanbeam: 'from-transparent via-teal-400/20 to-transparent',
    motionPreset: { scale: [1.01, 1.14, 1.06, 1.01], x: [0, 15, -18, 0], y: [0, -15, 9, 0], rotate: [0, -1.4, 1.7, 0] },
  },
  {
    name: 'High-Octane Hypercar Action',
    backdropImg: hypercarTokyoImg,
    topBar: 'from-orange-400 via-amber-400 to-red-400',
    badgeText: 'text-orange-300',
    borderGlow: 'hover:border-orange-400/60',
    auraGradient: 'radial-gradient(circle at 25% 60%, rgba(251, 146, 60, 0.28) 0%, rgba(239, 68, 68, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(251, 146, 60, 0.26)',
    orbColorB: 'rgba(245, 158, 11, 0.22)',
    ringBorder: 'border-orange-400/50',
    scanbeam: 'from-transparent via-orange-400/20 to-transparent',
    motionPreset: { scale: [1, 1.15, 1.03, 1], x: [0, -24, 16, 0], y: [0, 10, -12, 0], rotate: [0, 1.6, -1.6, 0] },
  },
  {
    name: 'Data Sculpture Odyssey',
    backdropImg: scifiOdysseyImg,
    topBar: 'from-cyan-300 via-blue-400 to-purple-400',
    badgeText: 'text-cyan-200',
    borderGlow: 'hover:border-cyan-400/60',
    auraGradient: 'radial-gradient(circle at 75% 35%, rgba(34, 211, 238, 0.28) 0%, rgba(168, 85, 247, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(34, 211, 238, 0.26)',
    orbColorB: 'rgba(168, 85, 247, 0.22)',
    ringBorder: 'border-cyan-400/50',
    scanbeam: 'from-transparent via-cyan-400/20 to-transparent',
    motionPreset: { scale: [1.02, 1.16, 1.04, 1.02], x: [0, 18, -20, 0], y: [0, -10, 14, 0], rotate: [0, -1.7, 1.3, 0] },
  },
  {
    name: 'Viral Terracotta Kinetic',
    backdropImg: terracottaBgImg,
    topBar: 'from-amber-400 via-rose-400 to-emerald-400',
    badgeText: 'text-amber-300',
    borderGlow: 'hover:border-amber-400/60',
    auraGradient: 'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.28) 0%, rgba(244, 63, 94, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(251, 191, 36, 0.26)',
    orbColorB: 'rgba(16, 185, 129, 0.22)',
    ringBorder: 'border-amber-400/50',
    scanbeam: 'from-transparent via-amber-400/20 to-transparent',
    motionPreset: { scale: [1, 1.13, 1.05, 1], x: [0, -16, 20, 0], y: [0, 12, -10, 0], rotate: [0, 1.5, -1.2, 0] },
  },
  {
    name: 'Biophilic Neural Flora',
    backdropImg: biophilicForestImg,
    topBar: 'from-emerald-300 via-green-400 to-teal-400',
    badgeText: 'text-emerald-300',
    borderGlow: 'hover:border-emerald-400/60',
    auraGradient: 'radial-gradient(circle at 65% 70%, rgba(52, 211, 153, 0.28) 0%, rgba(20, 184, 166, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(52, 211, 153, 0.26)',
    orbColorB: 'rgba(163, 230, 53, 0.20)',
    ringBorder: 'border-emerald-400/50',
    scanbeam: 'from-transparent via-emerald-400/20 to-transparent',
    motionPreset: { scale: [1.02, 1.14, 1.04, 1.02], x: [0, 14, -18, 0], y: [0, -14, 10, 0], rotate: [0, -1.3, 1.6, 0] },
  },
  {
    name: 'Surreal 3D Everydays',
    backdropImg: fashionCoutureImg,
    topBar: 'from-amber-400 via-fuchsia-400 to-cyan-400',
    badgeText: 'text-amber-300',
    borderGlow: 'hover:border-amber-400/60',
    auraGradient: 'radial-gradient(circle at 20% 65%, rgba(245, 158, 11, 0.28) 0%, rgba(217, 70, 239, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(245, 158, 11, 0.26)',
    orbColorB: 'rgba(217, 70, 239, 0.22)',
    ringBorder: 'border-amber-400/50',
    scanbeam: 'from-transparent via-amber-400/20 to-transparent',
    motionPreset: { scale: [1, 1.16, 1.05, 1], x: [0, -22, 18, 0], y: [0, 12, -14, 0], rotate: [0, 1.9, -1.5, 0] },
  },
  {
    name: 'Suspense Cinema Soundstage',
    backdropImg: cinemaBackdropImg,
    topBar: 'from-rose-400 via-amber-400 to-orange-500',
    badgeText: 'text-rose-300',
    borderGlow: 'hover:border-rose-400/60',
    auraGradient: 'radial-gradient(circle at 80% 40%, rgba(251, 113, 133, 0.28) 0%, rgba(245, 158, 11, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(251, 113, 133, 0.26)',
    orbColorB: 'rgba(245, 158, 11, 0.22)',
    ringBorder: 'border-rose-400/50',
    scanbeam: 'from-transparent via-rose-400/20 to-transparent',
    motionPreset: { scale: [1.01, 1.15, 1.03, 1.01], x: [0, 20, -14, 0], y: [0, -12, 10, 0], rotate: [0, -1.6, 1.4, 0] },
  },
  {
    name: 'Architectural Trailer Pavilion',
    backdropImg: pavilionImg,
    topBar: 'from-amber-300 via-emerald-400 to-teal-300',
    badgeText: 'text-amber-200',
    borderGlow: 'hover:border-emerald-400/60',
    auraGradient: 'radial-gradient(circle at 40% 25%, rgba(251, 191, 36, 0.26) 0%, rgba(16, 185, 129, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(251, 191, 36, 0.25)',
    orbColorB: 'rgba(16, 185, 129, 0.22)',
    ringBorder: 'border-emerald-400/50',
    scanbeam: 'from-transparent via-emerald-400/20 to-transparent',
    motionPreset: { scale: [1, 1.13, 1.04, 1], x: [0, -15, 15, 0], y: [0, 10, -10, 0], rotate: [0, 1.3, -1.3, 0] },
  },
  {
    name: 'Spatial XR Hologram Lab',
    backdropImg: futuristicDarkBgImg,
    topBar: 'from-cyan-400 via-teal-400 to-emerald-400',
    badgeText: 'text-cyan-300',
    borderGlow: 'hover:border-cyan-400/60',
    auraGradient: 'radial-gradient(circle at 70% 70%, rgba(34, 211, 238, 0.28) 0%, rgba(16, 185, 129, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(34, 211, 238, 0.26)',
    orbColorB: 'rgba(16, 185, 129, 0.22)',
    ringBorder: 'border-cyan-400/50',
    scanbeam: 'from-transparent via-cyan-400/20 to-transparent',
    motionPreset: { scale: [1.02, 1.15, 1.04, 1.02], x: [0, 18, -18, 0], y: [0, -14, 12, 0], rotate: [0, -1.7, 1.5, 0] },
  },
  {
    name: 'Botanical CGI Luxury Studio',
    backdropImg: botanicalSerumImg,
    topBar: 'from-emerald-400 via-amber-300 to-teal-400',
    badgeText: 'text-emerald-300',
    borderGlow: 'hover:border-emerald-400/60',
    auraGradient: 'radial-gradient(circle at 25% 50%, rgba(16, 185, 129, 0.28) 0%, rgba(251, 191, 36, 0.14) 48%, transparent 74%)',
    orbColorA: 'rgba(16, 185, 129, 0.26)',
    orbColorB: 'rgba(251, 191, 36, 0.22)',
    ringBorder: 'border-emerald-400/50',
    scanbeam: 'from-transparent via-emerald-400/20 to-transparent',
    motionPreset: { scale: [1, 1.14, 1.03, 1], x: [0, -16, 14, 0], y: [0, 11, -9, 0], rotate: [0, 1.4, -1.1, 0] },
  },
];

export const CreativeDiscoveryCanvas: React.FC<CreativeDiscoveryCanvasProps> = ({
  creators,
  onSelectCreator,
  onInviteToBrief,
  onOpenChat,
  onOpenBriefBuilder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<string>('All');
  const [selectedContentType, setSelectedContentType] = useState<string>('All');
  const [activeCreatorJump, setActiveCreatorJump] = useState<string>('all');
  const [inspectedProject, setInspectedProject] = useState<{
    project: PortfolioItem;
    creator: CreatorProfile;
  } | null>(null);

  const contentTypeFilters = [
    'All',
    'Commercial TVC',
    'Brand Film',
    'Social Short',
    'Print & Key Visual',
    '3D & Spatial',
  ];

  const toolFilters = [
    'All',
    'Runway',
    'Midjourney',
    'Kling',
    'Stable Diffusion',
    'Google Nano Banana',
    'Blender',
    'ElevenLabs',
    'Suno',
  ];

  const filteredCreators = useMemo(() => {
    if (!Array.isArray(creators) || creators.length === 0) {
      return [];
    }
    const normalizedQuery = (searchQuery || '').toLowerCase().trim();
    const selectedToolLower = (selectedTool || 'All').toLowerCase().trim();
    const selectedContentTypeLower = (selectedContentType || 'All').toLowerCase().trim();

    return creators.filter((creator) =>
      matchesCreatorCriteria(creator, normalizedQuery, selectedToolLower, selectedContentTypeLower)
    );
  }, [creators, searchQuery, selectedTool, selectedContentType]);

  const totalCompletedProjects = useMemo(
    () => computeTotalCompletedProjects(creators),
    [creators]
  );

  const networkAvgSatisfaction = useMemo(
    () => computeNetworkAverageSatisfaction(creators),
    [creators]
  );

  const scrollToCreatorSection = (creatorId: string) => {
    if (!creatorId) return;
    setActiveCreatorJump(creatorId);
    const el = document.getElementById(`creator-showcase-${creatorId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToRoadmapSection = () => {
    const roadmapEl = document.getElementById('creator-success-roadmap-section');
    if (roadmapEl) {
      roadmapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative space-y-12">
      {/* Decorative Social Media & Creator Platform Logos in the Creators Page Background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none"
        aria-hidden="true"
      >
        {CREATORS_PAGE_BACKGROUND_LOGOS.map((bgLogo) => (
          <div
            key={bgLogo.id}
            style={{
              top: bgLogo.top,
              bottom: bgLogo.bottom,
              left: bgLogo.left,
              right: bgLogo.right,
              transform: `rotate(${bgLogo.rotate}deg)`,
            }}
            className="absolute p-3 rounded-2xl bg-white/[0.025] border border-white/[0.06] opacity-20 blur-[0.3px]"
          >
            <AuthenticPlatformLogo platformId={bgLogo.id} className={bgLogo.size} />
          </div>
        ))}
      </div>
      {/* ================================================================= */}
      {/* 1. TOP SEARCH BAR & QUICK CREATOR JUMP RIBBON                     */}
      {/* ================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/[0.08] bg-[#0A0D14]/90 backdrop-blur-2xl p-5 sm:p-6 shadow-hard space-y-4 relative z-10"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creators (Dhruv Bahri, Phil Langer, Paul Trillo, The Dor Brothers, Refik Anadol, Karen X. Cheng, Sofia Crespo, Beeple), skills, tools, or projects..."
              className="w-full bg-[#050609]/90 border border-white/[0.08] focus:border-amber-400/70 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-colors"
            />
          </div>

          {(searchQuery || selectedTool !== 'All' || selectedContentType !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTool('All');
                setSelectedContentType('All');
              }}
              className="px-3.5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:border-amber-400/60 text-[11px] sm:text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter by Content Type */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] mr-1.5 shrink-0 whitespace-nowrap">
            Content Type:
          </span>
          {contentTypeFilters.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedContentType(type)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 ${
                selectedContentType === type
                  ? 'bg-emerald-400 text-[#050609] font-bold shadow-xs'
                  : 'bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]'
              }`}
            >
              {type === 'All' ? 'All Content Types' : type}
            </button>
          ))}
        </div>

        {/* Filter by AI Tool */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-[var(--text-muted)] mr-1.5 shrink-0 whitespace-nowrap">
            Filter by AI Tool:
          </span>
          {toolFilters.map((tool) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 ${
                selectedTool === tool
                  ? 'bg-amber-400 text-[#050609] font-bold shadow-xs'
                  : 'bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]'
              }`}
            >
              {tool === 'All' ? 'All Tools' : tool}
            </button>
          ))}
        </div>

        {/* Quick Jump Index to Separated Creators */}
        {filteredCreators.length > 0 && (
          <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-amber-300 font-bold shrink-0 whitespace-nowrap mr-1.5">
              Jump to Creator:
            </span>
            {filteredCreators.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => scrollToCreatorSection(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap shrink-0 cursor-pointer border transition-all duration-150 ${
                  activeCreatorJump === c.id
                    ? 'bg-amber-400/15 border-amber-400/60 text-amber-200 font-bold'
                    : 'bg-white/[0.02] border-white/[0.07] text-slate-300 hover:text-white hover:border-amber-400/40'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}. {c.name}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* ================================================================= */}
      {/* 2. CINEMATIC HERO SHOWCASE BANNER & TRUST METRICS STRIP           */}
      {/* ================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/[0.08] bg-[#0A0D14]/95 backdrop-blur-2xl overflow-hidden shadow-hard-lg relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono tracking-wide text-slate-300">
                <span className="text-amber-300 font-semibold">
                  Verification → Creator Profiles & AI Portfolios
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300">
                  Brief Builder → Brief Definition
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
                Creator Profiles &{' '}
                <span className="gradient-text-cinema">AI Portfolios</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Every verified content creator is presented with their <strong className="text-white">AI Portfolio</strong>, <strong className="text-white">Completed Projects</strong> count, <strong className="text-white">Average Satisfaction Rating</strong>, skills, AI tools, and previous projects.
              </p>

              {/* AI-Assisted Brief Builder Highlight Bar (Clean Architectural Divider Instead of Nested Card) */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-semibold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Brief Builder → Brief Definition</span>
                  </div>
                  <div className="text-sm font-bold font-display text-white">
                    AI-Assisted Brief Builder: Creating structured briefs from a rough idea.
                  </div>
                </div>
                {onOpenBriefBuilder && (
                  <button
                    onClick={onOpenBriefBuilder}
                    className="btn-tactile px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-amber-400 hover:text-black border border-white/[0.12] hover:border-amber-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap transition-colors"
                  >
                    <span>Open Brief Definition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const firstCreator = filteredCreators[0];
                  if (firstCreator) {
                    scrollToCreatorSection(firstCreator.id);
                  }
                }}
                className="btn-tactile px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#050609] font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Browse {filteredCreators.length} Creator Profiles & AI Portfolios</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (filteredCreators[0]) {
                    onOpenChat(filteredCreators[0]);
                  }
                }}
                className="px-5 py-3 rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Open Brand–Creator Chat</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-[#050609] overflow-hidden border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <img
              src={heroShowcaseImg}
              alt="AI film director working at a color-grading console in a dark studio"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050609] via-[#050609]/35 to-transparent lg:bg-gradient-to-r lg:from-[#0A0D14] lg:via-transparent lg:to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#050609]/85 backdrop-blur-xl border border-white/[0.12]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={collabBannerImg}
                    alt="Creative direction storyboard"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-lg object-cover border border-white/15 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white font-display truncate">
                      Dedicated Chapter Per Creator
                    </div>
                    <div className="text-[11px] font-mono text-amber-200 truncate">
                      {totalCompletedProjects}+ Delivered Films · {networkAvgSatisfaction}/5.00 Avg Rating
                    </div>
                  </div>
                </div>
                <Film className="w-4 h-4 text-amber-300 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Proof Row Below Hero Split */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-white/[0.08] bg-[#07090E]/90 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] font-mono tabular-nums">
          <div className="p-5 sm:p-6 space-y-1">
            <div className="text-xs text-slate-400">Verified AI Creators</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">
              <AnimatedNumber value={creators.length} /> Profiles
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-1">
            <div className="text-xs text-slate-400">Total Completed Projects</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400">
              <AnimatedNumber value={totalCompletedProjects} /> Delivered
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-1">
            <div className="text-xs text-slate-400">Average Satisfaction Rating</div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-300 flex items-center gap-1.5">
              <span>
                <AnimatedNumber value={Number(networkAvgSatisfaction)} decimals={2} /> / 5.00
              </span>
              <Star className="w-4 h-4 fill-amber-300 text-amber-300 shrink-0" />
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-1">
            <div className="text-xs text-slate-400">Average Turnaround</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white">
              5–7 Days
            </div>
          </div>
        </div>

        {/* Continuous Animated Cinema Marquee Ribbon */}
        <div className="border-t border-white/[0.08] bg-[#050609] py-2.5 overflow-hidden">
          <div className="animate-marquee-ribbon flex items-center gap-8 text-xs font-mono text-slate-400">
            {[...creators, ...creators].map((c, mIdx) => (
              <span key={`${c.id}-marquee-${mIdx}`} className="inline-flex items-center gap-2 whitespace-nowrap">
                <span className="text-white font-semibold">{c.name}</span>
                <span>·</span>
                <span className="text-emerald-400">{c.stats.completedProjects} Projects</span>
                <span>·</span>
                <span className="text-amber-300">{c.stats.clientRating.toFixed(2)}★ Rating</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ================================================================= */}
      {/* 3. DEDICATED FULL-WIDTH SHOWCASE FOR EACH CONTENT CREATOR         */}
      {/*    Compact Architectural Gallery Chapters & Kinetic Studio Grid   */}
      {/* ================================================================= */}
      <div id="creator-profiles-grid" className="space-y-8 relative z-10">
        {filteredCreators.map((creator, idx) => {
          const validPortfolio = creator.portfolio.filter(Boolean);
          const completedProjectsCount = creator.stats?.completedProjects ?? 40;
          const satisfactionRating = (creator.stats?.clientRating ?? 4.98).toFixed(2);
          const avgTurnaround = creator.stats?.averageTurnaround ?? '6 Days';
          const satisfactionPct = Math.round(((creator.stats?.clientRating ?? 4.98) / 5) * 100);
          const theme = CREATOR_ACCENT_THEMES[idx % CREATOR_ACCENT_THEMES.length];
          const profileBackdrop = theme.backdropImg || validPortfolio[0]?.thumbnail || creator.featuredProject?.thumbnail;

          return (
            <React.Fragment key={creator.id}>
              {/* Compact Editorial Chapter Index Header */}
              <div
                id={`creator-showcase-${creator.id}`}
                className="scroll-mt-20 flex items-center gap-3 pt-1"
              >
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.12] to-white/[0.04]" />
                <div className="px-3 py-1 rounded-full border border-white/[0.1] bg-[#0A0D14]/90 backdrop-blur-md font-mono text-[10px] text-slate-300 tracking-wider uppercase flex items-center gap-1.5 shrink-0">
                  <Award className={`w-3 h-3 ${theme.badgeText}`} />
                  <span>
                    Creator Showcase {String(idx + 1).padStart(2, '0')} of{' '}
                    {String(filteredCreators.length).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-white font-semibold">{creator.name}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/[0.12] to-white/[0.04]" />
              </div>

              {/* Compact Full-Width Creator Studio Card with Bespoke Background Image & Kinetic Animations */}
              <motion.article
                initial={{ opacity: 0, y: 20, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -3 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`group/profile spotlight-card relative rounded-2xl border border-white/[0.11] ${theme.borderGlow} bg-[#080B12]/95 backdrop-blur-2xl overflow-hidden shadow-hard-lg transition-all duration-300`}
              >
                {/* ========================================================= */}
                {/* BESPOKE ANIMATED BACKGROUND IMAGE & CRAZY KINETIC FX      */}
                {/* ========================================================= */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
                  {/* 1. Distinct Suitability-Matched Background Image with Continuous Ken Burns Pan/Zoom/Tilt */}
                  {profileBackdrop && (
                    <motion.img
                      src={profileBackdrop}
                      alt=""
                      referrerPolicy="no-referrer"
                      animate={theme.motionPreset}
                      transition={{
                        duration: 14 + (idx % 5) * 2,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-[0.22] group-hover/profile:opacity-[0.34] transition-opacity duration-500 saturate-125"
                    />
                  )}

                  {/* 2. Multi-Stop Studio Readability Veil */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#06080E]/95 via-[#080B12]/82 to-[#06080E]/92" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#06080E]/40 via-transparent to-[#06080E]/95" />

                  {/* 3. Bespoke Theme Radial Aura */}
                  <div
                    className="absolute inset-0 opacity-90"
                    style={{ background: theme.auraGradient }}
                  />

                  {/* 4. Crazy Kinetic Floating Light Orbs */}
                  <motion.div
                    animate={{
                      x: [0, 75, -45, 0],
                      y: [0, -40, 35, 0],
                      scale: [1, 1.3, 0.85, 1],
                    }}
                    transition={{
                      duration: 9 + (idx % 4) * 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ background: `radial-gradient(circle, ${theme.orbColorA} 0%, transparent 70%)` }}
                    className="absolute -top-20 left-1/4 w-72 h-72 rounded-full blur-2xl"
                  />
                  <motion.div
                    animate={{
                      x: [0, -80, 50, 0],
                      y: [0, 45, -35, 0],
                      scale: [1, 0.85, 1.35, 1],
                    }}
                    transition={{
                      duration: 11 + (idx % 3) * 1.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ background: `radial-gradient(circle, ${theme.orbColorB} 0%, transparent 70%)` }}
                    className="absolute -bottom-24 right-1/5 w-80 h-80 rounded-full blur-2xl"
                  />

                  {/* 5. Animated Holographic Light Sweep Beam Across Profile */}
                  <motion.div
                    animate={{ x: ['-120%', '220%'] }}
                    transition={{
                      duration: 6.5 + (idx % 3),
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatDelay: 1.5,
                    }}
                    className={`absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r ${theme.scanbeam} opacity-60`}
                  />
                </div>

                {/* Animated Top Specular Energy Bar */}
                <div className="relative z-10 h-1 w-full overflow-hidden bg-white/[0.04]">
                  <motion.div
                    animate={{ x: ['-40%', '40%', '-40%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className={`h-full w-[140%] bg-gradient-to-r ${theme.topBar}`}
                  />
                </div>

                {/* SECTION 1: Compact Creator Identity Header */}
                <div className="relative z-10 px-4 py-3.5 sm:px-6 sm:py-4 border-b border-white/[0.08]">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                    {/* Left: Kinetic Orbiting Avatar + Name + Compact Bio */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 max-w-3xl">
                      <div
                        onClick={() => onSelectCreator(creator)}
                        className="relative group cursor-pointer shrink-0"
                      >
                        {/* Crazy Spinning Dashed Orbital Halo */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                          className={`pointer-events-none absolute -inset-1.5 rounded-2xl border border-dashed ${theme.ringBorder} opacity-80 group-hover:opacity-100`}
                        />
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                          className="pointer-events-none absolute -inset-2.5 rounded-2xl border border-white/10 opacity-50"
                        />
                        <img
                          src={creator.avatar}
                          alt={`${creator.name} portrait`}
                          referrerPolicy="no-referrer"
                          className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-white/25 group-hover:border-amber-400 transition-transform duration-300 group-hover:scale-105 shadow-hard"
                        />
                        <div className="absolute -bottom-1 -right-1 z-20 px-1.5 py-0.2 rounded bg-[#050609] border border-white/20 font-mono text-[9px] font-bold text-amber-300">
                          #{String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <div className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${theme.badgeText}`}>
                          Creator #{String(idx + 1).padStart(2, '0')} · {creator.role}
                        </div>

                        <h2
                          onClick={() => onSelectCreator(creator)}
                          className="font-display font-bold text-base sm:text-lg text-white hover:text-amber-300 transition-colors cursor-pointer break-words leading-snug"
                        >
                          {String(idx + 1).padStart(2, '0')}. {creator.name}
                        </h2>

                        <p className="text-[11px] sm:text-xs text-slate-300 leading-snug max-w-2xl">
                          {creator.bio}
                        </p>
                      </div>
                    </div>

                    {/* Right: Compact Direct Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectCreator(creator)}
                        className="px-3 py-1.5 rounded-lg border border-white/[0.14] bg-black/40 hover:bg-white/[0.1] hover:border-white/30 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap backdrop-blur-md"
                      >
                        <FolderOpen className="w-3 h-3 text-amber-300" />
                        <span>Full AI Portfolio</span>
                      </button>

                      <button
                        onClick={() => onOpenChat(creator)}
                        className="px-3 py-1.5 rounded-lg border border-white/[0.14] bg-black/40 hover:bg-white/[0.1] hover:border-white/30 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap backdrop-blur-md"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-300" />
                        <span>Chat with Creator</span>
                      </button>

                      <button
                        onClick={() => onInviteToBrief(creator)}
                        className="btn-tactile px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#050609] font-bold text-[11px] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <span>Hire / Invite</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Verified Brand Trust Metrics Bar (Compact Single-Line Strip) */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 border-b border-white/[0.08] bg-[#05070C]/75 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] font-mono tabular-nums">
                  <div className="px-4 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Completed Projects:</span>
                      <span className="text-xs sm:text-sm font-extrabold text-emerald-400">
                        {completedProjectsCount} Delivered Projects
                      </span>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>

                  <div className="px-4 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-slate-400">Average Satisfaction Rating:</span>
                      <span className="text-xs sm:text-sm font-extrabold text-amber-300">
                        {satisfactionRating} / 5.0
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({satisfactionPct}% Brand Approval)
                      </span>
                    </div>
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" />
                  </div>

                  <div className="px-4 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Average Delivery Turnaround:</span>
                      <span className="text-xs sm:text-sm font-extrabold text-white">
                        {avgTurnaround}
                      </span>
                    </div>
                    <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  </div>
                </div>

                {/* SECTION 2, 3, 4 & 5: Compact Two-Zone Studio Grid */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
                  {/* Left 4 Columns: Core Creative Skills & AI Tools Used */}
                  <div className="lg:col-span-4 divide-y divide-white/[0.08] bg-[#060911]/55">
                    {/* Core Creative Skills */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${theme.badgeText}`}>
                        Core Creative Skills
                      </div>
                      <ul className="space-y-1 text-[11px] sm:text-xs text-slate-200">
                        {creator.skills.map((skill) => (
                          <li
                            key={skill}
                            className="flex items-start gap-2 leading-snug"
                          >
                            <span className="text-amber-400 font-bold">·</span>
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Tools Used */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                        AI Tools & Production Stack Used
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {creator.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.1] text-[11px] text-slate-200 flex items-center gap-1"
                          >
                            <span className="text-emerald-400 font-bold">·</span>
                            <span>{tool}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right 8 Columns: Previous Projects & Visual Portfolio */}
                  <div className="lg:col-span-8 divide-y divide-white/[0.08] bg-[#060911]/40">
                    {/* Previous Projects (Compact List) */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                        Previous Projects ({validPortfolio.length})
                      </div>

                      <div className="divide-y divide-white/[0.06]">
                        {validPortfolio.map((proj, pIdx) => (
                          <div
                            key={proj.id}
                            onClick={() => setInspectedProject({ project: proj, creator })}
                            className="py-2 first:pt-0 last:pb-0 group cursor-pointer transition-colors space-y-0.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h3 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors">
                                {pIdx + 1}. {proj.title}
                              </h3>
                              <span className="text-[10px] font-mono text-amber-300/90">
                                {proj.clientName} · {proj.year}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                              {proj.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Portfolio Gallery (Compact 3-Column Frame Strip) */}
                    <div className="p-4 sm:p-5 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${theme.badgeText}`}>
                          AI Portfolio ({validPortfolio.length} Works)
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Click any frame to inspect AI portfolio project
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {validPortfolio.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setInspectedProject({ project: item, creator })}
                            className="group relative h-28 sm:h-32 rounded-xl overflow-hidden border border-white/[0.12] hover:border-amber-400/80 cursor-pointer bg-[#050609] shadow-hard transition-colors duration-300"
                          >
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                            <div className="absolute bottom-2 left-2.5 right-2.5 text-white space-y-0.5">
                              <div className="text-[9px] font-mono text-amber-200 truncate">
                                {item.aiTelemetry.primaryModel}
                              </div>
                              <div className="text-[11px] font-bold font-display leading-tight line-clamp-1 group-hover:text-amber-200 transition-colors">
                                {item.title}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            </React.Fragment>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* 4. 3D SCULPTURAL FEATURE: "START FREELANCING"                     */}
      {/* ================================================================= */}
      <div id="start-freelancing-3d-section" className="relative z-10 scroll-mt-24 pt-4">
        <StartFreelancing3D onActivate={scrollToRoadmapSection} />
      </div>

      {/* ================================================================= */}
      {/* 5. INTERACTIVE SECTION: YOUR ROADMAP TO CREATOR SUCCESS           */}
      {/* ================================================================= */}
      <div id="creator-success-roadmap-section" className="relative z-10 scroll-mt-24 pt-4">
        <CreatorSuccessRoadmap
          onExploreMarketplace={() => {
            const firstCreator = filteredCreators[0];
            if (firstCreator) {
              scrollToCreatorSection(firstCreator.id);
            }
          }}
          onOpenBriefs={onOpenBriefBuilder}
        />
      </div>

      {/* Project Lightbox Modal */}
      <AnimatePresence>
        {inspectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-hard-lg"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <span className="text-sm font-bold text-[var(--text-main)]">
                  AI Portfolio Project · {inspectedProject.creator.name}
                </span>
                <button
                  onClick={() => setInspectedProject(null)}
                  className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <img
                  src={inspectedProject.project.thumbnail}
                  alt={inspectedProject.project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-64 object-cover rounded-xl border border-[var(--border-subtle)]"
                />
                <div className="space-y-1">
                  <h4 className="text-xl font-bold font-display text-[var(--text-main)]">
                    {inspectedProject.project.title}
                  </h4>
                  <p className="text-sm font-semibold text-[var(--accent-primary)]">
                    {inspectedProject.project.clientName} ({inspectedProject.project.year})
                  </p>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {inspectedProject.project.description}
                </p>
                <div className="text-sm text-[var(--text-main)] pt-3 border-t border-[var(--border-subtle)]">
                  <strong>AI Tools Used:</strong>{' '}
                  {[
                    inspectedProject.project.aiTelemetry.primaryModel,
                    ...inspectedProject.project.aiTelemetry.secondaryModels,
                  ].join(' · ')}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
