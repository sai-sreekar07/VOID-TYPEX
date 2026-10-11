import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Wrench,
  Clapperboard,
  TrendingUp,
  Briefcase,
  Handshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info,
  Award,
  Flame,
  Layers,
  ChevronRight,
  RotateCcw,
  Bot,
  Send,
  Loader2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export interface PlatformBrand {
  id: string;
  name: string;
  category: 'Publishing & Audience Growth' | 'Creative Production & Editing' | 'AI-Assisted Creation';
  brandColor: string;
  bgTint: string;
  borderTint: string;
  tooltip: string;
  stageIds: number[];
}

export interface RoadmapStage {
  number: string;
  stageIndex: number;
  title: string;
  subtitle: string;
  accentTheme: 'amber' | 'emerald' | 'teal';
  pillarTag?: string;
  milestones: string[];
  proTip: string;
  platforms: PlatformBrand[];
}

export const PLATFORM_BRANDS: Record<string, PlatformBrand> = {
  // Publishing and audience growth
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    category: 'Publishing & Audience Growth',
    brandColor: '#FF0000',
    bgTint: 'rgba(255, 0, 0, 0.12)',
    borderTint: 'rgba(255, 0, 0, 0.35)',
    tooltip: 'Long-form video hosting, Shorts discovery, and community building.',
    stageIds: [1, 3, 4],
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    category: 'Publishing & Audience Growth',
    brandColor: '#E4405F',
    bgTint: 'rgba(228, 64, 95, 0.12)',
    borderTint: 'rgba(228, 64, 95, 0.35)',
    tooltip: 'Visual storytelling, Reels distribution, and creator-brand discovery.',
    stageIds: [1, 3, 4],
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Publishing & Audience Growth',
    brandColor: '#00F2FE',
    bgTint: 'rgba(0, 242, 254, 0.12)',
    borderTint: 'rgba(0, 242, 254, 0.35)',
    tooltip: 'Short-form vertical video trends and rapid algorithmic audience reach.',
    stageIds: [1, 3, 4],
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    category: 'Publishing & Audience Growth',
    brandColor: '#1877F2',
    bgTint: 'rgba(24, 119, 242, 0.12)',
    borderTint: 'rgba(24, 119, 242, 0.35)',
    tooltip: 'Broad demographic video distribution, Reels, and interest communities.',
    stageIds: [3, 4],
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Publishing & Audience Growth',
    brandColor: '#0A66C2',
    bgTint: 'rgba(10, 102, 194, 0.14)',
    borderTint: 'rgba(10, 102, 194, 0.4)',
    tooltip: 'Professional networking, portfolio visibility, and B2B brand partnerships.',
    stageIds: [4, 5, 6],
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'Publishing & Audience Growth',
    brandColor: '#E60023',
    bgTint: 'rgba(230, 0, 35, 0.12)',
    borderTint: 'rgba(230, 0, 35, 0.35)',
    tooltip: 'Visual moodboards, aesthetic discovery, and evergreen creative inspiration.',
    stageIds: [1, 3, 5],
  },

  // Creative production and editing
  canva: {
    id: 'canva',
    name: 'Canva',
    category: 'Creative Production & Editing',
    brandColor: '#00C4CC',
    bgTint: 'rgba(0, 196, 204, 0.12)',
    borderTint: 'rgba(0, 196, 204, 0.35)',
    tooltip: 'Accessible graphic design, social templates, thumbnails, and media kits.',
    stageIds: [2, 3, 5],
  },
  premiere: {
    id: 'premiere',
    name: 'Adobe Premiere Pro',
    category: 'Creative Production & Editing',
    brandColor: '#9999FF',
    bgTint: 'rgba(153, 153, 255, 0.14)',
    borderTint: 'rgba(153, 153, 255, 0.4)',
    tooltip: 'Timeline video editing, color grading, and multi-track audio mastering.',
    stageIds: [2, 3],
  },
  aftereffects: {
    id: 'aftereffects',
    name: 'Adobe After Effects',
    category: 'Creative Production & Editing',
    brandColor: '#D291FF',
    bgTint: 'rgba(210, 145, 255, 0.14)',
    borderTint: 'rgba(210, 145, 255, 0.4)',
    tooltip: 'Motion graphics, visual effects compositing, and kinetic typography.',
    stageIds: [2, 5],
  },
  capcut: {
    id: 'capcut',
    name: 'CapCut',
    category: 'Creative Production & Editing',
    brandColor: '#F8FAFC',
    bgTint: 'rgba(248, 250, 252, 0.1)',
    borderTint: 'rgba(248, 250, 252, 0.3)',
    tooltip: 'Fast-paced short-form video editing, auto-captions, and rhythmic transitions.',
    stageIds: [2, 3],
  },
  figma: {
    id: 'figma',
    name: 'Figma',
    category: 'Creative Production & Editing',
    brandColor: '#F24E1E',
    bgTint: 'rgba(242, 78, 30, 0.12)',
    borderTint: 'rgba(242, 78, 30, 0.35)',
    tooltip: 'Collaborative interface design, layout systems, and interactive portfolio decks.',
    stageIds: [2, 5, 6],
  },

  // AI-assisted creation
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'AI-Assisted Creation',
    brandColor: '#10A37F',
    bgTint: 'rgba(16, 163, 127, 0.14)',
    borderTint: 'rgba(16, 163, 127, 0.4)',
    tooltip: 'Ideation, scriptwriting, creative research, and campaign outline structuring.',
    stageIds: [1, 2, 3],
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'AI-Assisted Creation',
    brandColor: '#4E86F6',
    bgTint: 'rgba(78, 134, 246, 0.14)',
    borderTint: 'rgba(78, 134, 246, 0.4)',
    tooltip: 'Multimodal creative brainstorming, visual analysis, and content strategy.',
    stageIds: [1, 2, 4],
  },
  runway: {
    id: 'runway',
    name: 'Runway',
    category: 'AI-Assisted Creation',
    brandColor: '#F59E0B',
    bgTint: 'rgba(245, 158, 11, 0.14)',
    borderTint: 'rgba(245, 158, 11, 0.4)',
    tooltip: 'AI-assisted video generation, motion brush control, and cinematic pre-visualization.',
    stageIds: [2, 5, 6],
  },
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'AI-Assisted Creation',
    brandColor: '#38BDF8',
    bgTint: 'rgba(56, 189, 248, 0.14)',
    borderTint: 'rgba(56, 189, 248, 0.4)',
    tooltip: 'AI voice synthesis, multilingual dubbing, and cinematic soundscapes.',
    stageIds: [2, 3],
  },
};

export const ROADMAP_STAGES: RoadmapStage[] = [
  {
    number: 'Stage 01',
    stageIndex: 1,
    title: 'Discover Your Creative Identity',
    subtitle:
      'Help creators identify their niche, target audience, content format, and personal style.',
    accentTheme: 'amber',
    pillarTag: 'Foundation · Creative Direction',
    milestones: [
      'Choose a niche.',
      'Identify your audience.',
      'Explore content formats.',
      'Define your creator identity.',
    ],
    proTip:
      'Clarity beats volume early on: align what excites you visually with a specific audience pain point or aesthetic curiosity.',
    platforms: [
      PLATFORM_BRANDS.youtube,
      PLATFORM_BRANDS.pinterest,
      PLATFORM_BRANDS.chatgpt,
      PLATFORM_BRANDS.gemini,
    ],
  },
  {
    number: 'Stage 02',
    stageIndex: 2,
    title: 'Master Your Creative Tools',
    subtitle:
      'Introduce the tools and platforms used to create professional content.',
    accentTheme: 'amber',
    pillarTag: 'Core Pillar · Quality Content Craft',
    milestones: [
      'Learn video editing.',
      'Explore AI-assisted creation.',
      'Improve storytelling.',
      'Practice visual design and audio.',
    ],
    proTip:
      'Uncompromising QUALITY CONTENT starts here: combine traditional timeline editing and design precision with modern AI-assisted tools.',
    platforms: [
      PLATFORM_BRANDS.premiere,
      PLATFORM_BRANDS.aftereffects,
      PLATFORM_BRANDS.capcut,
      PLATFORM_BRANDS.canva,
      PLATFORM_BRANDS.figma,
      PLATFORM_BRANDS.runway,
      PLATFORM_BRANDS.elevenlabs,
      PLATFORM_BRANDS.chatgpt,
      PLATFORM_BRANDS.gemini,
    ],
  },
  {
    number: 'Stage 03',
    stageIndex: 3,
    title: 'Create and Publish',
    subtitle:
      'Guide creators through producing and publishing their first pieces of content.',
    accentTheme: 'amber',
    pillarTag: 'Core Pillar · Publishing Consistency',
    milestones: [
      'Develop content ideas.',
      'Create your first projects.',
      'Maintain a publishing schedule.',
      'Optimize content for each platform.',
    ],
    proTip:
      'CONSISTENCY transforms practice into momentum: establish a sustainable weekly publishing cadence tailored to each platform format.',
    platforms: [
      PLATFORM_BRANDS.youtube,
      PLATFORM_BRANDS.instagram,
      PLATFORM_BRANDS.tiktok,
      PLATFORM_BRANDS.facebook,
      PLATFORM_BRANDS.capcut,
      PLATFORM_BRANDS.canva,
      PLATFORM_BRANDS.elevenlabs,
    ],
  },
  {
    number: 'Stage 04',
    stageIndex: 4,
    title: 'Grow Your Audience',
    subtitle:
      'Show how creators can build a recognizable identity and reach more people.',
    accentTheme: 'teal',
    pillarTag: 'Audience & Analytics Momentum',
    milestones: [
      'Study engagement analytics.',
      'Experiment with formats.',
      'Improve audience interaction.',
      'Build a consistent creator brand.',
    ],
    proTip:
      'Retention graphs and comment threads reveal what resonates. Double down on signature visual motifs that make your work unmistakably yours.',
    platforms: [
      PLATFORM_BRANDS.youtube,
      PLATFORM_BRANDS.instagram,
      PLATFORM_BRANDS.tiktok,
      PLATFORM_BRANDS.facebook,
      PLATFORM_BRANDS.linkedin,
      PLATFORM_BRANDS.gemini,
    ],
  },
  {
    number: 'Stage 05',
    stageIndex: 5,
    title: 'Build Your Portfolio',
    subtitle:
      'Help creators showcase their work professionally.',
    accentTheme: 'emerald',
    pillarTag: 'Professional Curation & Proof',
    milestones: [
      'Select your best projects.',
      'Organize a portfolio.',
      'Showcase your creative skills.',
      'Make your profile ready for collaborations.',
    ],
    proTip:
      'Curate only your strongest 4–6 pieces. Document your creative process, tools used, and visual problem-solving so brands understand your craft.',
    platforms: [
      PLATFORM_BRANDS.figma,
      PLATFORM_BRANDS.canva,
      PLATFORM_BRANDS.aftereffects,
      PLATFORM_BRANDS.runway,
      PLATFORM_BRANDS.linkedin,
      PLATFORM_BRANDS.pinterest,
    ],
  },
  {
    number: 'Stage 06',
    stageIndex: 6,
    title: 'Collaborate and Earn',
    subtitle:
      'Represent the transition from independent creation to professional opportunities.',
    accentTheme: 'emerald',
    pillarTag: 'Monetization & Brand Collaborations',
    milestones: [
      'Discover brand opportunities.',
      'Connect with potential clients.',
      'Collaborate on creative projects.',
      'Develop sustainable income opportunities.',
    ],
    proTip:
      'Treat every creative brief with clear communication, reliable milestone delivery, and structured licensing to build recurring collaborations.',
    platforms: [
      PLATFORM_BRANDS.linkedin,
      PLATFORM_BRANDS.youtube,
      PLATFORM_BRANDS.instagram,
      PLATFORM_BRANDS.figma,
      PLATFORM_BRANDS.runway,
    ],
  },
];

/**
 * Renders authentic, proportionally accurate vector brand logos with official colors
 * and a graceful fallback icon if an asset cannot load.
 */
export const AuthenticPlatformLogo: React.FC<{
  platformId: string;
  className?: string;
}> = ({ platformId, className = 'w-5 h-5' }) => {
  switch (platformId) {
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
            fill="#FF0000"
          />
          <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FD5949" />
              <stop offset="50%" stopColor="#D6249F" />
              <stop offset="100%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="url(#ig-grad)" strokeWidth="2.2" />
          <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad)" strokeWidth="2.2" />
          <circle cx="17.5" cy="6.5" r="1.3" fill="#E4405F" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
            fill="#25F4EE"
            transform="translate(-0.6, -0.4)"
          />
          <path
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
            fill="#FE2C55"
            transform="translate(0.6, 0.4)"
          />
          <path
            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            fill="#1877F2"
          />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
            fill="#0A66C2"
          />
        </svg>
      );
    case 'pinterest':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path
            d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"
            fill="#E60023"
          />
        </svg>
      );
    case 'canva':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="canva-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C4CC" />
              <stop offset="100%" stopColor="#7D2AE8" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="11" fill="url(#canva-grad)" />
          <path
            d="M15.6 14.8c-.7 1.1-1.9 1.8-3.4 1.8-2.4 0-4.1-1.8-4.1-4.5 0-2.8 1.8-4.7 4.3-4.7 1.5 0 2.6.7 3.1 1.8l-1.5.9c-.3-.6-.9-1-1.7-1-1.4 0-2.4 1.2-2.4 3 0 1.7 1 2.9 2.4 2.9.9 0 1.6-.4 2-1.1l1.3.9z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'premiere':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect x="1.5" y="1.5" width="21" height="21" rx="4.5" fill="#00005B" stroke="#9999FF" strokeWidth="1.5" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="#9999FF"
            fontSize="10.5"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            Pr
          </text>
        </svg>
      );
    case 'aftereffects':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect x="1.5" y="1.5" width="21" height="21" rx="4.5" fill="#00005B" stroke="#D291FF" strokeWidth="1.5" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="#D291FF"
            fontSize="10.2"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            Ae
          </text>
        </svg>
      );
    case 'capcut':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#0F172A" stroke="#F8FAFC" strokeWidth="1.5" />
          <path
            d="M6.5 8.5L17.5 15.5M17.5 8.5L6.5 15.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <rect x="5" y="7" width="3.5" height="2.5" rx="0.8" fill="#00F2FE" />
          <rect x="5" y="14.5" width="3.5" height="2.5" rx="0.8" fill="#00F2FE" />
        </svg>
      );
    case 'figma':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <path d="M8.5 2h3.5v7H8.5a3.5 3.5 0 1 1 0-7z" fill="#F24E1E" />
          <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" fill="#FF7262" />
          <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" fill="#1ABCFE" />
          <path d="M8.5 9h3.5v7H8.5a3.5 3.5 0 1 1 0-7z" fill="#A259FF" />
          <path d="M8.5 16h3.5v3.5a3.5 3.5 0 1 1-3.5-3.5z" fill="#0ACF83" />
        </svg>
      );
    case 'chatgpt':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10.5" fill="#10A37F" fillOpacity="0.18" stroke="#10A37F" strokeWidth="1.6" />
          <path
            d="M12 5.5a4.5 4.5 0 0 1 4.3 3.2 4.5 4.5 0 0 1 1.7 5.6 4.5 4.5 0 0 1-4.8 3.2 4.5 4.5 0 0 1-4.4-3.1 4.5 4.5 0 0 1-1.6-5.7A4.5 4.5 0 0 1 12 5.5z"
            stroke="#10A37F"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="2.2" fill="#10A37F" />
        </svg>
      );
    case 'gemini':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4E86F6" />
              <stop offset="55%" stopColor="#9B72CB" />
              <stop offset="100%" stopColor="#D96570" />
            </linearGradient>
          </defs>
          <path
            d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z"
            fill="url(#gemini-grad)"
          />
        </svg>
      );
    case 'runway':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="4.5" fill="#18181B" stroke="#F59E0B" strokeWidth="1.6" />
          <path
            d="M8 17V7h4.5a3.2 3.2 0 0 1 0 6.4H8m4.2 0L16 17"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'elevenlabs':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.6" />
          <rect x="8.2" y="6.5" width="2.6" height="11" rx="1.2" fill="#38BDF8" />
          <rect x="13.2" y="6.5" width="2.6" height="11" rx="1.2" fill="#38BDF8" />
        </svg>
      );
    default:
      return <Layers className={`${className} text-amber-400`} />;
  }
};

interface CreatorSuccessRoadmapProps {
  onExploreMarketplace?: () => void;
  onOpenBriefs?: () => void;
  compactMode?: boolean;
}

export const CreatorSuccessRoadmap: React.FC<CreatorSuccessRoadmapProps> = ({
  onExploreMarketplace,
  onOpenBriefs,
  compactMode = false,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(1);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    '1-0': true,
    '1-1': true,
    '1-2': true,
    '1-3': true,
    '2-0': true,
    '2-1': true,
  });
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'All' | 'Publishing & Audience Growth' | 'Creative Production & Editing' | 'AI-Assisted Creation'
  >('All');

  // Interactive AI Agent State for Solving New Content Creator Doubts
  interface AgentMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    actionSteps?: string[];
    recommendedToolTip?: string;
    corePillarReminder?: string;
  }

  const [agentInput, setAgentInput] = useState<string>('');
  const [isAgentLoading, setIsAgentLoading] = useState<boolean>(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome-agent-msg',
      role: 'assistant',
      text: 'Hello! I am your Synthetix Creator Success AI Agent. Ask me any doubt about choosing your niche, mastering AI & video editing tools, staying consistent, building your portfolio, or landing paid brand collaborations.',
      actionSteps: [
        'Pick 1 niche + 1 primary format (e.g., 60s AI short films or luxury product visuals).',
        'Combine AI generation (Runway, Midjourney) with precision timeline editing (Premiere Pro, CapCut).',
        'Publish 2–3 high-craft pieces weekly and curate your top 5 works into your Synthetix portfolio.',
      ],
      recommendedToolTip:
        'Start with ChatGPT or Google Gemini for script hooks, Runway for cinematic motion, and CapCut or Premiere Pro for beat-synced pacing.',
      corePillarReminder:
        'Uncompromising Quality Content earns viewer trust; Relentless Publishing Consistency attracts brand deals.',
    },
  ]);

  const askCreatorAiAgent = async (customPrompt?: string) => {
    const questionText = (customPrompt ?? agentInput).trim();
    if (!questionText || isAgentLoading) return;

    const userMsg: AgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: questionText,
    };

    setAgentMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) {
      setAgentInput('');
    }
    setIsAgentLoading(true);
    setAgentError(null);

    const activeStageObj =
      ROADMAP_STAGES.find((s) => s.stageIndex === selectedStageIndex) || ROADMAP_STAGES[0];
    const totalMs = ROADMAP_STAGES.reduce((acc, s) => acc + s.milestones.length, 0);
    const doneMs = Object.values(completedMilestones).filter(Boolean).length;

    try {
      const res = await fetch('/api/roadmap-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          currentStageTitle: `${activeStageObj.number}: ${activeStageObj.title}`,
          completedMilestonesCount: doneMs,
          totalMilestonesCount: totalMs,
          history: agentMessages.slice(-4).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to reach the Creator Success AI Agent.');
      }

      const aiMsg: AgentMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.answer,
        actionSteps: Array.isArray(data.actionSteps) ? data.actionSteps : [],
        recommendedToolTip: data.recommendedToolTip,
        corePillarReminder: data.corePillarReminder,
      };
      setAgentMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setAgentError(err?.message || 'Failed to get an answer. Please try again.');
    } finally {
      setIsAgentLoading(false);
    }
  };

  const toggleMilestone = (stageIdx: number, milestoneIdx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const key = `${stageIdx}-${milestoneIdx}`;
    setCompletedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const completeAllInStage = (stageIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const stage = ROADMAP_STAGES.find((s) => s.stageIndex === stageIdx);
    if (!stage) return;
    const allDone = stage.milestones.every((_, mIdx) => completedMilestones[`${stageIdx}-${mIdx}`]);
    const next = { ...completedMilestones };
    stage.milestones.forEach((_, mIdx) => {
      next[`${stageIdx}-${mIdx}`] = !allDone;
    });
    setCompletedMilestones(next);
  };

  const resetProgress = () => {
    setCompletedMilestones({});
    setSelectedStageIndex(1);
  };

  const totalMilestonesCount = ROADMAP_STAGES.reduce((acc, s) => acc + s.milestones.length, 0);
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const overallProgressPct = Math.round((completedCount / totalMilestonesCount) * 100);

  const selectedStage =
    ROADMAP_STAGES.find((s) => s.stageIndex === selectedStageIndex) || ROADMAP_STAGES[0];

  const getStageIcon = (index: number, className = 'w-5 h-5') => {
    switch (index) {
      case 1:
        return <Compass className={className} />;
      case 2:
        return <Wrench className={className} />;
      case 3:
        return <Clapperboard className={className} />;
      case 4:
        return <TrendingUp className={className} />;
      case 5:
        return <Briefcase className={className} />;
      case 6:
        return <Handshake className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <section
      aria-label="Your Roadmap to Creator Success"
      className={`relative rounded-3xl bg-[#070B14]/95 border border-white/12 shadow-[0_24px_80px_rgba(0,0,0,0.75)] overflow-hidden text-left ${
        compactMode ? 'p-5 sm:p-7' : 'p-6 sm:p-10 lg:p-12'
      }`}
    >
      {/* Subtle Ambient Studio Illumination */}
      <div
        className="pointer-events-none absolute -top-32 left-1/4 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35), transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute top-1/2 -right-32 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(16,185,127,0.32), transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/3 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.28), transparent 70%)' }}
      />

      {/* Decorative Floating Social Media & Creative Platform Logos in the Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        {[
          { id: 'youtube', top: '4%', left: '4%', size: 'w-12 h-12', delay: 0, rotate: -10 },
          { id: 'instagram', top: '9%', right: '5%', size: 'w-12 h-12', delay: 0.6, rotate: 12 },
          { id: 'tiktok', top: '22%', left: '2%', size: 'w-11 h-11', delay: 1.2, rotate: 8 },
          { id: 'facebook', top: '26%', right: '3%', size: 'w-11 h-11', delay: 1.8, rotate: -12 },
          { id: 'linkedin', top: '40%', left: '3%', size: 'w-11 h-11', delay: 0.4, rotate: -8 },
          { id: 'pinterest', top: '44%', right: '4%', size: 'w-11 h-11', delay: 1.1, rotate: 10 },
          { id: 'canva', top: '58%', left: '2%', size: 'w-11 h-11', delay: 1.5, rotate: 6 },
          { id: 'premiere', top: '62%', right: '2%', size: 'w-11 h-11', delay: 0.8, rotate: -9 },
          { id: 'aftereffects', top: '74%', left: '4%', size: 'w-11 h-11', delay: 1.9, rotate: 11 },
          { id: 'capcut', top: '77%', right: '5%', size: 'w-10 h-10', delay: 0.3, rotate: -7 },
          { id: 'figma', top: '87%', left: '3%', size: 'w-10 h-10', delay: 1.3, rotate: -11 },
          { id: 'chatgpt', top: '89%', right: '3%', size: 'w-11 h-11', delay: 0.9, rotate: 9 },
          { id: 'gemini', top: '16%', left: '48%', size: 'w-10 h-10', delay: 0.7, rotate: 14 },
          { id: 'runway', top: '52%', left: '49%', size: 'w-10 h-10', delay: 1.4, rotate: -8 },
          { id: 'elevenlabs', top: '82%', left: '48%', size: 'w-10 h-10', delay: 2.1, rotate: 7 },
        ].map((item) => (
          <motion.div
            key={item.id}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
            }}
            animate={{
              y: [0, -12, 0],
              rotate: [item.rotate, item.rotate + 5, item.rotate],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
            className="absolute p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm opacity-25 shadow-lg"
          >
            <AuthenticPlatformLogo platformId={item.id} className={item.size} />
          </motion.div>
        ))}
      </div>

      {/* Top Editorial Header & Interactive Journey Telemetry */}
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Creator Progression Map · 06 Chronological Stages</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-[1.08]">
              Your Roadmap to{' '}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
                Creator Success
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              An interactive studio guide taking you from discovering your creative identity and mastering production tools to building a standout portfolio, collaborating with brands, and developing sustainable creative opportunities.
            </p>
          </div>

          {/* Interactive Journey Progress Controller */}
          <div className="w-full lg:w-80 p-4 rounded-2xl bg-[#0D1322]/90 border border-white/12 space-y-3 shrink-0 shadow-lg">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">JOURNEY COMPLETION</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {completedCount}/{totalMilestonesCount} Milestones ({overallProgressPct}%)
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-900 border border-white/10 overflow-hidden p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgressPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400">
              <span>Click any milestone to track progress</span>
              <button
                type="button"
                onClick={resetProgress}
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 cursor-pointer"
                title="Reset milestone checkboxes"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Highlighted Core Pillars: Quality Content & Consistency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/12 via-[#0E1526] to-[#0E1526] border border-amber-400/40 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-400/15 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold">
                Creative Achievement Pillar · Stages 01–03
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                Uncompromising Quality Content
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Master visual storytelling, sound design, and AI-assisted production workflows so every frame reflects intentional craft.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/12 via-[#0E1526] to-[#0E1526] border border-emerald-400/40 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-400/15 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                Growth & Monetization Pillar · Stages 04–06
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                Relentless Publishing & Brand Consistency
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Maintain a reliable publishing schedule, study audience analytics, and present a cohesive portfolio ready for brand collaborations.
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* STEP-BY-STEP PROGRESSION BAR (STEP 01 TO STEP 06)                     */}
        {/* ===================================================================== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B1120]/90 border border-white/12 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              Step-by-Step Roadmap Progression (Step 01 → Step 06)
            </span>
            <span className="text-slate-400">
              Select any step below to jump directly to that stage
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {ROADMAP_STAGES.map((stage) => {
              const isSelected = selectedStageIndex === stage.stageIndex;
              const completedInStage = stage.milestones.filter(
                (_, mIdx) => completedMilestones[`${stage.stageIndex}-${mIdx}`]
              ).length;
              const isStageComplete = completedInStage === stage.milestones.length;

              return (
                <button
                  key={stage.number}
                  type="button"
                  onClick={() => setSelectedStageIndex(stage.stageIndex)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-black border-amber-300 font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                      : isStageComplete
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/50'
                      : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-amber-400/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[10px] font-mono uppercase">
                    <span>STEP 0{stage.stageIndex}</span>
                    <span>
                      {completedInStage}/{stage.milestones.length}
                    </span>
                  </div>
                  <div className="text-xs font-display font-bold truncate">
                    {stage.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* THE WINDING INTERACTIVE ROADMAP CANVAS                                */}
        {/* Connected serpentine SVG path, glowing pulse, 6 chronological steps   */}
        {/* ===================================================================== */}
        <div className="relative py-4">
          {/* Desktop Winding SVG Path Background (Serpentine S-Curve connecting the 6 steps) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <svg
              viewBox="0 0 1200 1450"
              fill="none"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="roadmap-winding-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="45%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="roadmap-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base Muted Track */}
              <path
                d="M 280 110 C 650 110, 920 180, 920 330 C 920 480, 280 490, 280 620 C 280 750, 920 760, 920 890 C 920 1020, 280 1030, 280 1160 C 280 1290, 680 1330, 920 1350"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="5"
                strokeDasharray="10 10"
                strokeLinecap="round"
              />

              {/* Gradually Drawn Glowing Path */}
              <motion.path
                d="M 280 110 C 650 110, 920 180, 920 330 C 920 480, 280 490, 280 620 C 280 750, 920 760, 920 890 C 920 1020, 280 1030, 280 1160 C 280 1290, 680 1330, 920 1350"
                stroke="url(#roadmap-winding-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#roadmap-glow)"
                initial={{ pathLength: 0, opacity: 0.3 }}
                whileInView={{ pathLength: 1, opacity: 0.85 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
              />

              {/* Subtle Moving Light Traveling Along the Winding Path */}
              <motion.path
                d="M 280 110 C 650 110, 920 180, 920 330 C 920 480, 280 490, 280 620 C 280 750, 920 760, 920 890 C 920 1020, 280 1030, 280 1160 C 280 1290, 680 1330, 920 1350"
                stroke="#FDE68A"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="36 420"
                animate={{ strokeDashoffset: [456, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />
            </svg>
          </div>

          {/* Mobile/Tablet Vertical Glowing Spine */}
          <div className="lg:hidden absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-amber-400 via-teal-400 to-emerald-400 rounded-full opacity-40 pointer-events-none" />

          {/* Winding Chronological Step Nodes (Without Platform Logos Cluttering Between the Steps) */}
          <div className="relative z-10 space-y-8 lg:space-y-12">
            {ROADMAP_STAGES.map((stage, idx) => {
              const isEven = idx % 2 === 1;
              const isSelected = selectedStageIndex === stage.stageIndex;
              const completedInStage = stage.milestones.filter(
                (_, mIdx) => completedMilestones[`${stage.stageIndex}-${mIdx}`]
              ).length;
              const isStageComplete = completedInStage === stage.milestones.length;

              const isAmber = stage.accentTheme === 'amber';
              const isTeal = stage.accentTheme === 'teal';

              const borderClass = isSelected
                ? isAmber
                  ? 'border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.28)]'
                  : isTeal
                  ? 'border-teal-400 shadow-[0_0_40px_rgba(20,184,166,0.28)]'
                  : 'border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.28)]'
                : isStageComplete
                ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
                : 'border-white/12 hover:border-white/30';

              const badgeBg = isAmber
                ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                : isTeal
                ? 'bg-teal-400/15 text-teal-300 border-teal-400/40'
                : 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40';

              return (
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  className={`flex flex-col lg:flex-row items-stretch lg:items-center gap-6 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Step Milestone Card */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    onClick={() => setSelectedStageIndex(stage.stageIndex)}
                    className={`w-full lg:w-[66%] rounded-2xl bg-[#0C1220]/95 backdrop-blur-xl border-2 p-5 sm:p-7 transition-all duration-300 cursor-pointer relative overflow-hidden ${borderClass}`}
                  >
                    {/* Top Glow Accent Line */}
                    <div
                      className={`h-1 w-full absolute top-0 left-0 right-0 ${
                        isAmber
                          ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300'
                          : isTeal
                          ? 'bg-gradient-to-r from-teal-400 via-sky-400 to-emerald-400'
                          : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300'
                      }`}
                    />

                    {/* Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl border flex flex-col items-center justify-center font-mono font-extrabold ${badgeBg}`}
                        >
                          <span className="text-[9px] leading-none opacity-80">STEP</span>
                          <span className="text-sm leading-tight">0{stage.stageIndex}</span>
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-extrabold uppercase tracking-wider ${
                                isAmber
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                  : isTeal
                                  ? 'bg-teal-400/20 text-teal-300 border border-teal-400/40'
                                  : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                              }`}
                            >
                              STEP 0{stage.stageIndex} · {stage.number}
                            </span>
                            <span className="text-white/25">·</span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {stage.pillarTag}
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white mt-1">
                            {stage.title}
                          </h3>
                        </div>
                      </div>

                      {/* Completion Counter & Quick Toggle */}
                      <button
                        type="button"
                        onClick={(e) => completeAllInStage(stage.stageIndex, e)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isStageComplete
                            ? 'bg-emerald-400 text-black border-emerald-300'
                            : 'bg-white/5 text-slate-300 border-white/15 hover:bg-white/10'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {completedInStage}/{stage.milestones.length}{' '}
                          {isStageComplete ? 'Step Completed' : 'Done'}
                        </span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                      {stage.subtitle}
                    </p>

                    {/* 4 Interactive Sub-Steps / Milestones */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                      {stage.milestones.map((milestone, mIdx) => {
                        const isDone = !!completedMilestones[`${stage.stageIndex}-${mIdx}`];
                        return (
                          <button
                            key={milestone}
                            type="button"
                            onClick={(e) => toggleMilestone(stage.stageIndex, mIdx, e)}
                            className={`group/ms p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                              isDone
                                ? isAmber
                                  ? 'bg-amber-500/15 border-amber-400/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                  : 'bg-emerald-500/15 border-emerald-400/60 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                : 'bg-white/[0.03] border-white/10 text-slate-200 hover:border-white/25 hover:bg-white/[0.06]'
                            }`}
                          >
                            <div
                              className={`px-1.5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors font-mono text-[10px] font-bold ${
                                isDone
                                  ? isAmber
                                    ? 'bg-amber-400 border-amber-300 text-black'
                                    : 'bg-emerald-400 border-emerald-300 text-black'
                                  : 'border-white/30 bg-black/40 text-slate-300 group-hover/ms:border-amber-400'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                              ) : (
                                <span>
                                  Step {stage.stageIndex}.{mIdx + 1}
                                </span>
                              )}
                            </div>
                            <span className="text-xs sm:text-sm font-medium leading-snug">
                              {milestone}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Studio Pro-Tip Footer inside Step Card */}
                    <div className="pt-3 border-t border-white/10 flex items-start justify-between gap-3 text-xs text-slate-300">
                      <p className="leading-relaxed">
                        <span
                          className={`font-mono font-bold uppercase mr-1.5 ${
                            isAmber ? 'text-amber-300' : 'text-emerald-300'
                          }`}
                        >
                          Step 0{stage.stageIndex} Key Takeaway:
                        </span>
                        {stage.proTip}
                      </p>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${
                          isSelected ? 'rotate-90 text-amber-400' : 'text-slate-500'
                        }`}
                      />
                    </div>
                  </motion.div>

                  {/* Winding Step Node Marker */}
                  <div className="hidden lg:flex flex-col items-center justify-center w-[34%] shrink-0 relative">
                    <motion.button
                      type="button"
                      onClick={() => setSelectedStageIndex(stage.stageIndex)}
                      whileHover={{ scale: 1.08 }}
                      className={`px-5 py-3.5 rounded-2xl border-2 flex items-center gap-3 font-mono font-extrabold text-xs transition-all cursor-pointer z-10 ${
                        isSelected
                          ? isAmber
                            ? 'bg-amber-400 text-black border-white shadow-[0_0_30px_rgba(245,158,11,0.7)]'
                            : 'bg-emerald-400 text-black border-white shadow-[0_0_30px_rgba(16,185,129,0.7)]'
                          : isStageComplete
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                          : 'bg-[#0E1628]/90 text-slate-200 border-white/25 hover:border-amber-400'
                      }`}
                    >
                      {getStageIcon(stage.stageIndex, 'w-5 h-5')}
                      <div className="text-left">
                        <div className="text-[10px] opacity-80 uppercase">
                          ROADMAP STEP 0{stage.stageIndex}
                        </div>
                        <div className="text-xs sm:text-sm font-display font-extrabold">
                          {stage.number}
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* INTERACTIVE AI AGENT: CREATOR SUCCESS MENTOR & DOUBT SOLVER           */}
        {/* ===================================================================== */}
        <div
          id="roadmap-ai-agent-section"
          className="rounded-3xl bg-gradient-to-br from-[#0D1528]/95 via-[#09101E]/95 to-[#071A1C]/95 border-2 border-amber-400/40 p-5 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.75)] space-y-6 relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-25"
            style={{ background: 'radial-gradient(circle, #F59E0B, transparent 70%)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-25"
            style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)' }}
          />

          {/* AI Agent Header */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-400 p-0.5 shadow-[0_0_25px_rgba(245,158,11,0.45)] shrink-0">
                <div className="w-full h-full rounded-[14px] bg-[#070B14] flex items-center justify-center text-amber-300">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive AI Agent · New Content Creator Doubt Solver</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-display text-white">
                  Creator Success AI Agent & Mentor
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Have doubts about starting your freelance journey, picking AI tools, staying consistent, or pricing your first brand deal? Ask the AI Agent below for personalized guidance aligned with{' '}
                  <span className="text-amber-300 font-semibold">
                    {selectedStage.number}: {selectedStage.title}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask Any Creator Doubt</span>
              </span>
            </div>
          </div>

          {/* Quick Doubt Starter Prompts for New Content Creators */}
          <div className="relative z-10 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold">
              Common New Creator Doubts (Click to Ask AI Agent):
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                'How do I choose my niche as a beginner AI creator?',
                'Which AI & editing tools should I learn first for high quality?',
                'How can I stay consistent without burning out?',
                'How many projects do I need in my portfolio to get brand deals?',
                'How should I price my first freelance AI video project?',
              ].map((starter) => (
                <button
                  key={starter}
                  type="button"
                  disabled={isAgentLoading}
                  onClick={() => askCreatorAiAgent(starter)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/60 text-xs text-slate-200 hover:text-amber-200 transition-all cursor-pointer text-left disabled:opacity-50"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="relative z-10 max-h-[420px] overflow-y-auto space-y-4 pr-1">
            {agentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 sm:p-5 rounded-2xl border ${
                  msg.role === 'assistant'
                    ? 'bg-[#090E1A]/90 border-emerald-400/35 text-slate-100'
                    : 'bg-amber-400/15 border-amber-400/45 text-white ml-auto max-w-2xl'
                }`}
              >
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider mb-2">
                  {msg.role === 'assistant' ? (
                    <>
                      <Bot className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-300">
                        Synthetix Creator Success AI Agent
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-amber-300">Your Creator Question</span>
                  )}
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-100">{msg.text}</p>

                {msg.actionSteps && msg.actionSteps.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-white/10 space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Actionable Steps to Succeed:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {msg.actionSteps.map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="font-mono font-bold text-amber-400">
                            0{sIdx + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {msg.recommendedToolTip && (
                  <div className="mt-3 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold text-amber-300 uppercase mr-1.5">
                        Recommended Tool Workflow:
                      </span>
                      <span>{msg.recommendedToolTip}</span>
                    </div>
                  </div>
                )}

                {msg.corePillarReminder && (
                  <div className="mt-2.5 text-[11px] font-mono text-emerald-300 font-semibold">
                    ★ Success Pillar: {msg.corePillarReminder}
                  </div>
                )}
              </div>
            ))}

            {isAgentLoading && (
              <div className="p-4 rounded-2xl bg-[#090E1A]/90 border border-amber-400/30 flex items-center gap-3 text-xs font-mono text-amber-300">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>Creator Success AI Agent is analyzing your roadmap stage and crafting guidance...</span>
              </div>
            )}

            {agentError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-400/40 text-xs text-rose-200 font-mono">
                {agentError}
              </div>
            )}
          </div>

          {/* Ask Doubt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askCreatorAiAgent();
            }}
            className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
          >
            <input
              type="text"
              value={agentInput}
              onChange={(e) => setAgentInput(e.target.value)}
              placeholder="Ask any doubt as a new content creator (e.g., How do I get my first brand client? What tools make videos look cinematic?)..."
              className="flex-1 rounded-2xl bg-[#070B14] border border-white/15 focus:border-amber-400 px-4 py-3 text-xs sm:text-sm font-sans text-white placeholder-slate-400 outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={isAgentLoading || !agentInput.trim()}
              className="btn-tactile px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 text-black font-sans text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isAgentLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Solving...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask AI Mentor</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ===================================================================== */}
        {/* INTERACTIVE PLATFORM ECOSYSTEM DIRECTORY (ALL 15 PLATFORMS)           */}
        {/* ===================================================================== */}
        <div className="rounded-2xl bg-[#0B1120]/90 border border-white/12 p-5 sm:p-7 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Creator Toolkit & Distribution Ecosystem
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                Explore Platforms Across the Creator Journey
              </h3>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  'All',
                  'Publishing & Audience Growth',
                  'Creative Production & Editing',
                  'AI-Assisted Creation',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-amber-400 text-black font-bold'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(PLATFORM_BRANDS)
              .filter(
                (p) =>
                  activeCategoryFilter === 'All' || p.category === activeCategoryFilter
              )
              .map((platform) => (
                <div
                  key={platform.id}
                  style={{
                    backgroundColor: platform.bgTint,
                    borderColor: platform.borderTint,
                  }}
                  className="p-3.5 rounded-xl border flex items-start gap-3 transition-transform hover:-translate-y-0.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <AuthenticPlatformLogo platformId={platform.id} className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold font-display text-white truncate">
                        {platform.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 shrink-0">
                        Stages {platform.stageIds.map((id) => `0${id}`).join(', ')}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-amber-300/90">
                      {platform.category}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {platform.tooltip}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* TRANSPARENCY & LEARNING ROADMAP DISCLAIMER + ACTION FOOTER            */}
        {/* ===================================================================== */}
        <div className="rounded-2xl bg-[#090E1A] border border-white/10 p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-white">
                Educational Creator Roadmap & Independent Brand Notice
              </p>
              <p>
                This interactive guide is an educational learning roadmap designed to help creators structure their skill development and portfolio presentation—it is not a guarantee of audience growth, employment, or earnings. Referenced third-party platforms (YouTube, Instagram, TikTok, Facebook, LinkedIn, Pinterest, Canva, Adobe Premiere Pro, Adobe After Effects, CapCut, Figma, ChatGPT, Google Gemini, Runway, and ElevenLabs) are independent tools shown for educational context and do not imply official partnership or endorsement with Synthetix.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onExploreMarketplace && (
              <button
                type="button"
                onClick={onExploreMarketplace}
                className="btn-tactile px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-sans text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Creator Portfolios</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {onOpenBriefs && (
              <button
                type="button"
                onClick={onOpenBriefs}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/50 text-emerald-300 font-sans text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Browse Brand Briefs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
