import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface StartFreelancing3DProps {
  onActivate?: () => void;
  compact?: boolean;
  className?: string;
  tagline?: string;
}

interface Logo3DConfig {
  id: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin' | 'pinterest' | 'canva' | 'runway';
  name: string;
  /** Whether this 3D logo sits directly ON the 3D note letters or orbits AROUND it in space */
  placement: 'on-note' | 'around-note';
  /** Desktop 3D position relative to anchor (%) */
  xPct: number;
  yPct: number;
  /** Base Z depth in px */
  zPx: number;
  /** Initial 3D tilt angles in deg */
  rotX: number;
  rotY: number;
  rotZ: number;
  /** Size scale */
  scale: number;
  /** Float phase offset (radians) & speed */
  phase: number;
  speed: number;
  /** Brand material colors for 3D extrusion & bevels */
  faceGradient: string;
  sideColorDark: string;
  sideColorLight: string;
  bevelHighlight: string;
  ambientGlow: string;
  mobileVisible: boolean;
}

const ORBITING_3D_LOGOS: Logo3DConfig[] = [
  // ============================================================================
  // GROUP 1: PLACED DIRECTLY ON THE 3D "START FREELANCING" NOTE SCULPTURE
  // ============================================================================
  {
    id: 'youtube',
    name: 'YouTube',
    placement: 'on-note',
    xPct: -34,
    yPct: -36,
    zPx: 34,
    rotX: 10,
    rotY: 16,
    rotZ: -11,
    scale: 0.96,
    phase: 0.2,
    speed: 1.15,
    faceGradient: 'linear-gradient(145deg, #FF2A2A 0%, #E60000 55%, #990000 100%)',
    sideColorDark: '#5C0000',
    sideColorLight: '#B80000',
    bevelHighlight: 'rgba(255, 190, 190, 0.85)',
    ambientGlow: 'rgba(255, 0, 0, 0.45)',
    mobileVisible: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    placement: 'on-note',
    xPct: 36,
    yPct: -32,
    zPx: 40,
    rotX: 12,
    rotY: -18,
    rotZ: 12,
    scale: 0.98,
    phase: 1.4,
    speed: 0.98,
    faceGradient: 'linear-gradient(135deg, #833AB4 0%, #E1306C 48%, #F77737 82%, #FCAF45 100%)',
    sideColorDark: '#4A154B',
    sideColorLight: '#9E1F63',
    bevelHighlight: 'rgba(255, 220, 180, 0.85)',
    ambientGlow: 'rgba(225, 48, 108, 0.45)',
    mobileVisible: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    placement: 'on-note',
    xPct: -38,
    yPct: 24,
    zPx: 36,
    rotX: -10,
    rotY: 18,
    rotZ: 8,
    scale: 0.92,
    phase: 2.7,
    speed: 1.08,
    faceGradient: 'linear-gradient(145deg, #1F2430 0%, #0D1017 60%, #05070B 100%)',
    sideColorDark: '#06080D',
    sideColorLight: '#25F4EE',
    bevelHighlight: 'rgba(37, 244, 238, 0.8)',
    ambientGlow: 'rgba(254, 44, 85, 0.42)',
    mobileVisible: true,
  },

  // ============================================================================
  // GROUP 2: ORBITING FREELY AROUND THE 3D NOTE IN SURROUNDING SPACE
  // ============================================================================
  {
    id: 'linkedin',
    name: 'LinkedIn',
    placement: 'around-note',
    xPct: 42,
    yPct: 28,
    zPx: 44,
    rotX: -14,
    rotY: -22,
    rotZ: -9,
    scale: 1.04,
    phase: 3.9,
    speed: 1.2,
    faceGradient: 'linear-gradient(145deg, #1B80E8 0%, #0A66C2 60%, #004182 100%)',
    sideColorDark: '#002952',
    sideColorLight: '#0A66C2',
    bevelHighlight: 'rgba(175, 220, 255, 0.75)',
    ambientGlow: 'rgba(10, 102, 194, 0.38)',
    mobileVisible: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    placement: 'around-note',
    xPct: -43,
    yPct: -6,
    zPx: 18,
    rotX: 16,
    rotY: 22,
    rotZ: -7,
    scale: 0.94,
    phase: 4.8,
    speed: 0.9,
    faceGradient: 'linear-gradient(145deg, #3B92FF 0%, #1877F2 58%, #0B4DA6 100%)',
    sideColorDark: '#072F66',
    sideColorLight: '#1460C7',
    bevelHighlight: 'rgba(185, 225, 255, 0.72)',
    ambientGlow: 'rgba(24, 119, 242, 0.34)',
    mobileVisible: true,
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    placement: 'around-note',
    xPct: 24,
    yPct: 42,
    zPx: 28,
    rotX: -16,
    rotY: -14,
    rotZ: 10,
    scale: 0.94,
    phase: 5.5,
    speed: 1.12,
    faceGradient: 'linear-gradient(145deg, #FF2442 0%, #E60023 58%, #9E0018 100%)',
    sideColorDark: '#5E000E',
    sideColorLight: '#BD001C',
    bevelHighlight: 'rgba(255, 190, 200, 0.72)',
    ambientGlow: 'rgba(230, 0, 35, 0.34)',
    mobileVisible: true,
  },
  {
    id: 'canva',
    name: 'Canva',
    placement: 'around-note',
    xPct: 44,
    yPct: -6,
    zPx: -16,
    rotX: 16,
    rotY: -18,
    rotZ: 6,
    scale: 0.88,
    phase: 2.1,
    speed: 0.94,
    faceGradient: 'linear-gradient(135deg, #00C4CC 0%, #3B71FE 55%, #7D2AE8 100%)',
    sideColorDark: '#2A1154',
    sideColorLight: '#0099A3',
    bevelHighlight: 'rgba(170, 250, 255, 0.75)',
    ambientGlow: 'rgba(0, 196, 204, 0.32)',
    mobileVisible: false,
  },
  {
    id: 'runway',
    name: 'Runway',
    placement: 'around-note',
    xPct: -24,
    yPct: 42,
    zPx: -12,
    rotX: -15,
    rotY: 16,
    rotZ: -8,
    scale: 0.88,
    phase: 3.3,
    speed: 1.04,
    faceGradient: 'linear-gradient(145deg, #F59E0B 0%, #B45309 55%, #451A03 100%)',
    sideColorDark: '#2E1002',
    sideColorLight: '#D97706',
    bevelHighlight: 'rgba(254, 243, 199, 0.8)',
    ambientGlow: 'rgba(245, 158, 11, 0.34)',
    mobileVisible: false,
  },
];

/**
 * Renders the authentic brand SVG relief glyph at a specified Z layer
 */
const BrandReliefGlyph: React.FC<{
  id: Logo3DConfig['id'];
  isShadowLayer?: boolean;
  isSideExtrusion?: boolean;
}> = ({ id, isShadowLayer = false, isSideExtrusion = false }) => {
  const fillPrimary = isShadowLayer
    ? 'rgba(0,0,0,0.65)'
    : isSideExtrusion
    ? '#CBD5E1'
    : '#FFFFFF';

  switch (id) {
    case 'youtube':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible" aria-hidden="true">
          {/* Outer rounded TV bevel frame */}
          <rect
            x="3"
            y="7"
            width="30"
            height="22"
            rx="6.5"
            fill={isShadowLayer ? 'rgba(0,0,0,0.5)' : isSideExtrusion ? '#B91C1C' : 'rgba(255,255,255,0.14)'}
            stroke={fillPrimary}
            strokeWidth="1.6"
          />
          {/* Iconic Play Triangle */}
          <path d="M15 12.5L24.5 18L15 23.5V12.5Z" fill={fillPrimary} />
        </svg>
      );

    case 'instagram':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible" aria-hidden="true">
          <rect
            x="5.5"
            y="5.5"
            width="25"
            height="25"
            rx="7"
            fill="none"
            stroke={fillPrimary}
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="5.8"
            fill="none"
            stroke={fillPrimary}
            strokeWidth="2.5"
          />
          <circle cx="25.2" cy="10.8" r="1.7" fill={fillPrimary} />
        </svg>
      );

    case 'tiktok':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible" aria-hidden="true">
          {!isShadowLayer && !isSideExtrusion && (
            <>
              {/* Cyan 3D offset harmonic */}
              <path
                d="M22.2 7.2C23.1 9.8 25.2 11.7 28 12V15.6C25.9 15.5 24 14.8 22.5 13.6V21.4C22.5 25.5 19.1 28.8 15 28.8C10.9 28.8 7.5 25.5 7.5 21.4C7.5 17.3 10.9 14 15 14C15.5 14 16 14.1 16.5 14.2V18C16 17.8 15.5 17.7 15 17.7C12.9 17.7 11.3 19.3 11.3 21.4C11.3 23.5 12.9 25.1 15 25.1C17.1 25.1 18.8 23.5 18.8 21.4V7.2H22.2Z"
                fill="#25F4EE"
                transform="translate(-1.3, -1.1)"
              />
              {/* Magenta-Red 3D offset harmonic */}
              <path
                d="M22.2 7.2C23.1 9.8 25.2 11.7 28 12V15.6C25.9 15.5 24 14.8 22.5 13.6V21.4C22.5 25.5 19.1 28.8 15 28.8C10.9 28.8 7.5 25.5 7.5 21.4C7.5 17.3 10.9 14 15 14C15.5 14 16 14.1 16.5 14.2V18C16 17.8 15.5 17.7 15 17.7C12.9 17.7 11.3 19.3 11.3 21.4C11.3 23.5 12.9 25.1 15 25.1C17.1 25.1 18.8 23.5 18.8 21.4V7.2H22.2Z"
                fill="#FE2C55"
                transform="translate(1.3, 1.1)"
              />
            </>
          )}
          <path
            d="M22.2 7.2C23.1 9.8 25.2 11.7 28 12V15.6C25.9 15.5 24 14.8 22.5 13.6V21.4C22.5 25.5 19.1 28.8 15 28.8C10.9 28.8 7.5 25.5 7.5 21.4C7.5 17.3 10.9 14 15 14C15.5 14 16 14.1 16.5 14.2V18C16 17.8 15.5 17.7 15 17.7C12.9 17.7 11.3 19.3 11.3 21.4C11.3 23.5 12.9 25.1 15 25.1C17.1 25.1 18.8 23.5 18.8 21.4V7.2H22.2Z"
            fill={fillPrimary}
          />
        </svg>
      );

    case 'facebook':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible" aria-hidden="true">
          <path
            d="M21.2 29.5V19.2H24.7L25.2 15.1H21.2V12.5C21.2 11.3 21.6 10.5 23.3 10.5H25.4V6.8C25 6.8 23.7 6.6 22.2 6.6C19 6.6 16.8 8.6 16.8 12.1V15.1H13.3V19.2H16.8V29.5H21.2Z"
            fill={fillPrimary}
          />
        </svg>
      );

    case 'linkedin':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="2.5" fill={fillPrimary} />
          <rect x="8.3" y="14.8" width="4.4" height="13.5" rx="1" fill={fillPrimary} />
          <path
            d="M15.8 14.8H19.9V16.7C20.6 15.4 22.1 14.4 24.3 14.4C27.9 14.4 29.2 16.7 29.2 20.4V28.3H24.8V21.2C24.8 19.3 24.2 18.1 22.6 18.1C20.9 18.1 20.2 19.3 20.2 21.2V28.3H15.8V14.8Z"
            fill={fillPrimary}
          />
        </svg>
      );

    case 'pinterest':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible" aria-hidden="true">
          <path
            d="M18.2 6.5C11.9 6.5 8.5 10.8 8.5 15.5C8.5 17.7 9.7 20.4 11.6 21.3C11.9 21.5 12.1 21.4 12.2 21C12.3 20.7 12.6 19.5 12.7 19C12.8 18.8 12.7 18.6 12.5 18.3C11.9 17.5 11.4 16.3 11.4 15.1C11.4 11.9 13.9 9.1 17.9 9.1C21.4 9.1 23.9 11.4 23.9 14.8C23.9 18.8 21.8 21.7 19.2 21.7C17.7 21.7 16.6 20.5 16.9 19C17.3 17.2 18.1 15.3 18.1 14C18.1 12.8 17.5 11.9 16.2 11.9C14.7 11.9 13.5 13.4 13.5 15.5C13.5 16.8 14 17.7 14 17.7L12.1 25.5C11.7 27.1 12 29.2 12.1 29.5C12.2 29.7 12.4 29.7 12.6 29.5C12.8 29.2 14.4 27.1 14.9 25.2L15.8 21.6C16.4 22.7 18 23.6 19.7 23.6C24.4 23.6 27.8 19.3 27.8 14.2C27.8 9.6 23.7 6.5 18.2 6.5Z"
            fill={fillPrimary}
          />
        </svg>
      );

    case 'canva':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible" aria-hidden="true">
          <path
            d="M24.8 22.4C23.5 24.5 21.2 25.8 18.5 25.8C14.1 25.8 10.8 22.4 10.8 17.9C10.8 13.4 14.2 10 18.6 10C21.5 10 23.8 11.4 24.9 13.6L22.1 15.1C21.4 13.8 20.1 13.1 18.6 13.1C15.9 13.1 14 15.1 14 17.9C14 20.7 15.9 22.7 18.6 22.7C20.2 22.7 21.5 21.9 22.2 20.7L24.8 22.4Z"
            fill={fillPrimary}
          />
        </svg>
      );

    case 'runway':
      return (
        <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-8 sm:h-8 overflow-visible" aria-hidden="true">
          <path
            d="M11 9.5H20.2C23.6 9.5 25.8 11.5 25.8 14.6C25.8 16.9 24.4 18.6 22.2 19.3L26.2 26.5H22.3L18.8 19.8H14.6V26.5H11V9.5ZM14.6 12.6V16.8H19.7C21.3 16.8 22.2 15.9 22.2 14.7C22.2 13.5 21.3 12.6 19.7 12.6H14.6Z"
            fill={fillPrimary}
          />
        </svg>
      );
  }
};

/**
 * Individual 3D Collectible Social Media Object with 14 extruded Z-layers,
 * metallic/ceramic beveled edges, specular lighting, and 3D relief icon.
 */
const Collectible3DLogo: React.FC<{
  logo: Logo3DConfig;
  index: number;
  pointer: { x: number; y: number };
  compact: boolean;
  prefersReducedMotion: boolean;
}> = ({ logo, index, pointer, compact, prefersReducedMotion }) => {
  const [hovered, setHovered] = useState(false);

  // 12 depth slices for solid 3D block thickness
  const depthSlices = [-18, -16, -14, -12, -10, -8, -6, -5, -4, -3, -2, -1];

  // Dynamic tilt combining base 3D angle + pointer parallax + hover elevation
  const dynRotX = logo.rotX - pointer.y * 14 + (hovered ? -8 : 0);
  const dynRotY = logo.rotY + pointer.x * 18 + (hovered ? 12 : 0);
  const dynRotZ = logo.rotZ + (hovered ? 0 : pointer.x * 3);
  const dynZ = (compact ? logo.zPx * 0.75 : logo.zPx) + (hovered ? 28 : 0);

  return (
    <motion.div
      initial={
        prefersReducedMotion
          ? { opacity: 1, scale: logo.scale }
          : { opacity: 0, scale: 0.4, rotateX: logo.rotX + 35, rotateY: logo.rotY - 35 }
      }
      animate={{
        opacity: 1,
        scale: hovered ? logo.scale * 1.14 : logo.scale,
        y: prefersReducedMotion ? 0 : [0, -9, 0, 7, 0],
        rotateZ: prefersReducedMotion ? dynRotZ : [dynRotZ - 2.5, dynRotZ + 2.5, dynRotZ - 2.5],
      }}
      transition={{
        opacity: { duration: 0.55, delay: 0.12 + index * 0.07, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
        y: {
          duration: 4.8 / logo.speed,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: logo.phase * 0.4,
        },
        rotateZ: {
          duration: 6.2 / logo.speed,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: logo.phase * 0.3,
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        left: `calc(50% + ${compact ? logo.xPct * 0.92 : logo.xPct}%)`,
        top: `calc(50% + ${compact ? logo.yPct * 0.92 : logo.yPct}%)`,
        transform: `translate(-50%, -50%) translateZ(${dynZ}px) rotateX(${dynRotX}deg) rotateY(${dynRotY}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className={`absolute select-none pointer-events-auto cursor-pointer ${
        logo.mobileVisible ? 'block' : 'hidden sm:block'
      }`}
      aria-hidden="true"
    >
      <div
        className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 transition-transform duration-200"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 1. Deep 3D Cast Shadow Plane on Stage Floor */}
        <div
          className="absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300"
          style={{
            background: logo.ambientGlow,
            transform: `translateZ(-32px) translate(${-pointer.x * 10}px, ${12 - pointer.y * 8}px) scale(1.18)`,
            opacity: hovered ? 0.95 : 0.65,
          }}
        />
        <div
          className="absolute inset-1 rounded-2xl bg-black/85 blur-md"
          style={{
            transform: `translateZ(-24px) translate(${-pointer.x * 6}px, 10px)`,
          }}
        />

        {/* 2. Solid 3D Extruded Sidewall Slices (-18px to -1px) */}
        {depthSlices.map((zSlice, sIdx) => {
          const isBevelSlice = zSlice >= -3 || zSlice <= -16;
          return (
            <div
              key={zSlice}
              className="absolute inset-0 rounded-2xl"
              style={{
                transform: `translateZ(${zSlice}px)`,
                background: isBevelSlice
                  ? `linear-gradient(135deg, ${logo.bevelHighlight} 0%, ${logo.sideColorLight} 45%, ${logo.sideColorDark} 100%)`
                  : `linear-gradient(160deg, ${logo.sideColorLight} 0%, ${logo.sideColorDark} 100%)`,
                boxShadow:
                  sIdx === 0
                    ? `0 2px 8px rgba(0,0,0,0.9), inset 0 0 2px rgba(255,255,255,0.25)`
                    : undefined,
              }}
            />
          );
        })}

        {/* 3. Main Polished Ceramic / Metallic Front Face (Z = 0px) */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            transform: 'translateZ(0px)',
            background: logo.faceGradient,
            boxShadow: `inset 0 2px 3px ${logo.bevelHighlight}, inset 0 -3px 6px rgba(0,0,0,0.65), 0 0 1px rgba(255,255,255,0.5)`,
          }}
        >
          {/* Studio Specular Reflection Sheen across the 3D surface */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${50 - pointer.x * 35}% ${30 - pointer.y * 35}%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 38%, transparent 70%)`,
            }}
          />
          {/* Machined Inner Bevel Rim */}
          <div className="absolute inset-[2px] rounded-[14px] border border-white/25 pointer-events-none" />
        </div>

        {/* 4. Extruded 3D Relief Emblem Floating Above the Block Face (+2px to +8px) */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(2px)' }}
        >
          <BrandReliefGlyph id={logo.id} isShadowLayer />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(4px)' }}
        >
          <BrandReliefGlyph id={logo.id} isSideExtrusion />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'translateZ(6px)' }}
        >
          <BrandReliefGlyph id={logo.id} isSideExtrusion />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]"
          style={{ transform: 'translateZ(8px)' }}
        >
          <BrandReliefGlyph id={logo.id} />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Interactive 3D Sculptural Feature: "START FREELANCING"
 * Combines a real-time 3D perspective projection canvas (orbital paths, connecting filaments,
 * depth particles, studio lighting) with a 24-layer volumetric extruded 3D typographic
 * sculpture and 3D collectible social media logos.
 */
export const StartFreelancing3D: React.FC<StartFreelancing3DProps> = ({
  onActivate,
  compact = false,
  className = '',
  tagline = 'Turn Your AI Creativity Into High-Paying Brand Deals · Quality Content & Consistency',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());

  const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSculptureHovered, setIsSculptureHovered] = useState(false);
  const [isInView, setIsInView] = useState(true);

  // Pause expensive rendering when not visible in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setIsInView(entries[0].isIntersecting);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Real-time 3D Perspective Canvas for Orbital Paths, 3D Tethers & Studio Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = Math.max(rect.width, 300);
      height = Math.max(rect.height, 260);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Subtle 3D studio dust particles suspended in depth
    const particles = Array.from({ length: 28 }, (_, i) => ({
      x: (Math.sin(i * 7.3) * 0.45),
      y: (Math.cos(i * 11.7) * 0.42),
      z: ((i % 7) - 3) * 35,
      radius: (i % 3) * 0.75 + 1.0,
      isEmerald: i % 3 === 0,
      phase: i * 0.9,
    }));

    const project3D = (
      x: number,
      y: number,
      z: number,
      rotXDeg: number,
      rotYDeg: number
    ) => {
      const rx = (rotXDeg * Math.PI) / 180;
      const ry = (rotYDeg * Math.PI) / 180;

      // Rotate around Y
      const x1 = x * Math.cos(ry) + z * Math.sin(ry);
      const z1 = -x * Math.sin(ry) + z * Math.cos(ry);

      // Rotate around X
      const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
      const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);

      const fov = 750;
      const scale = fov / Math.max(fov - z2, 120);
      return {
        px: width / 2 + x1 * scale,
        py: height / 2 + y2 * scale,
        scale,
        z2,
      };
    };

    const renderLoop = (now: number) => {
      const t = prefersReducedMotion ? 0 : now * 0.001;

      // Smooth pointer interpolation
      currentPointerRef.current.x +=
        (targetPointerRef.current.x - currentPointerRef.current.x) * 0.08;
      currentPointerRef.current.y +=
        (targetPointerRef.current.y - currentPointerRef.current.y) * 0.08;

      const px = currentPointerRef.current.x;
      const py = currentPointerRef.current.y;

      ctx.clearRect(0, 0, width, height);

      const sceneRotX = -py * 12 + Math.sin(t * 0.7) * 2.5;
      const sceneRotY = px * 15 + Math.cos(t * 0.6) * 3.5;

      // 1. Studio Key Light & Emerald Rim Volumetric Aura
      const keyGrad = ctx.createRadialGradient(
        width * (0.5 + px * 0.12),
        height * (0.45 + py * 0.12),
        10,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.55
      );
      keyGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
      keyGrad.addColorStop(0.45, 'rgba(16, 185, 129, 0.07)');
      keyGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = keyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Two Tilted 3D Orbital Rings in 3D Perspective
      const drawOrbitalRing = (
        rxRadius: number,
        ryRadius: number,
        tiltX: number,
        tiltY: number,
        strokeStyle: string
      ) => {
        ctx.beginPath();
        const steps = 72;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          const ox = Math.cos(theta) * rxRadius;
          const oy = Math.sin(theta) * ryRadius;
          const oz = Math.sin(theta * 2) * 28;
          const pt = project3D(ox, oy, oz, sceneRotX + tiltX, sceneRotY + tiltY);
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 1.15;
        ctx.stroke();
      };

      drawOrbitalRing(
        width * 0.41,
        height * 0.34,
        18,
        -12,
        'rgba(245, 158, 11, 0.22)'
      );
      drawOrbitalRing(
        width * 0.35,
        height * 0.28,
        -20,
        16,
        'rgba(16, 185, 129, 0.18)'
      );

      // 3. Draw Elegant 3D Connecting Filaments from Central Sculpture to Each 3D Logo
      const centerPt = project3D(0, 0, 12, sceneRotX, sceneRotY);

      ORBITING_3D_LOGOS.forEach((logo) => {
        const lx = (logo.xPct / 100) * width * (compact ? 0.92 : 1);
        const ly = (logo.yPct / 100) * height * (compact ? 0.92 : 1);
        const floatY = prefersReducedMotion
          ? 0
          : Math.sin(t * logo.speed + logo.phase) * 7;
        const logoPt = project3D(lx, ly + floatY, logo.zPx, sceneRotX, sceneRotY);

        // Curved 3D Bezier Filament
        const midPt = project3D(
          lx * 0.52,
          (ly + floatY) * 0.35,
          logo.zPx * 0.6 + 24,
          sceneRotX,
          sceneRotY
        );

        const lineGrad = ctx.createLinearGradient(
          centerPt.px,
          centerPt.py,
          logoPt.px,
          logoPt.py
        );
        lineGrad.addColorStop(0, 'rgba(251, 191, 36, 0.06)');
        lineGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.28)');
        lineGrad.addColorStop(1, 'rgba(16, 185, 129, 0.42)');

        ctx.beginPath();
        ctx.moveTo(centerPt.px, centerPt.py);
        ctx.quadraticCurveTo(midPt.px, midPt.py, logoPt.px, logoPt.py);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 1.25;
        ctx.stroke();

        // Small glowing orbital anchor node near the logo
        ctx.beginPath();
        ctx.arc(midPt.px, midPt.py, 2.1 * midPt.scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(253, 230, 138, 0.65)';
        ctx.fill();
      });

      // 4. Render Sparse Reflective 3D Particles
      particles.forEach((p) => {
        const driftY = prefersReducedMotion ? 0 : Math.sin(t * 0.8 + p.phase) * 8;
        const pt = project3D(
          p.x * width,
          p.y * height + driftY,
          p.z,
          sceneRotX,
          sceneRotY
        );
        const alpha = Math.min(Math.max((pt.scale - 0.7) * 1.2, 0.15), 0.75);
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, p.radius * pt.scale, 0, Math.PI * 2);
        ctx.fillStyle = p.isEmerald
          ? `rgba(52, 211, 153, ${alpha})`
          : `rgba(253, 224, 71, ${alpha})`;
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        rafId = window.requestAnimationFrame(renderLoop);
      }
    };

    rafId = window.requestAnimationFrame(renderLoop);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(rafId);
    };
  }, [compact, isInView, prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    targetPointerRef.current = {
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
    };
    setPointer(targetPointerRef.current);
  };

  const handleMouseLeave = () => {
    targetPointerRef.current = { x: 0, y: 0 };
    setPointer({ x: 0, y: 0 });
    setIsSculptureHovered(false);
  };

  // 22 physical extrusion slices for the central "START FREELANCING" 3D typography
  const textExtrusionSlices = Array.from({ length: 22 }, (_, i) => -(i + 1) * 1.55);

  const stageRotX = -pointer.y * 12 + (isSculptureHovered ? 3.5 : 0);
  const stageRotY = pointer.x * 15 + (isSculptureHovered ? -4.5 : 0);

  const aroundNoteLogos = ORBITING_3D_LOGOS.filter((l) => l.placement === 'around-note');
  const onNoteLogos = ORBITING_3D_LOGOS.filter((l) => l.placement === 'on-note');

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full overflow-visible select-none ${
        compact
          ? 'min-h-[360px] sm:min-h-[410px] py-4 px-2 sm:p-6'
          : 'min-h-[430px] sm:min-h-[500px] lg:min-h-[540px] py-8 px-4 sm:p-10'
      } flex items-center justify-center ${className}`}
      style={{
        perspective: '1350px',
      }}
    >
      {/* Open-Space Volumetric Studio Aura (No Box Container) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-85"
        style={{
          background:
            'radial-gradient(ellipse 62% 52% at 50% 46%, rgba(245, 158, 11, 0.16) 0%, rgba(16, 185, 129, 0.09) 42%, rgba(0, 0, 0, 0) 75%)',
        }}
        aria-hidden="true"
      />

      {/* Interactive 3D Perspective Canvas (Orbital Paths, Connecting Filaments & Depth Particles) */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
      />

      {/* Master 3D Spatial Stage (Preserve-3D, Free-Floating Without Box) */}
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.9, rotateX: 16, rotateY: -12 }
        }
        whileInView={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: `rotateX(${stageRotX}deg) rotateY(${stageRotY}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 w-full h-full min-h-[320px] sm:min-h-[380px] flex items-center justify-center transition-transform duration-150 ease-out"
      >
        {/* =============================================================== */}
        {/* GROUP 2: 3D SOCIAL MEDIA LOGOS ORBITING AROUND THE NOTE         */}
        {/* =============================================================== */}
        {aroundNoteLogos.map((logo, idx) => (
          <Collectible3DLogo
            key={logo.id}
            logo={logo}
            index={idx}
            pointer={pointer}
            compact={compact}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}

        {/* =============================================================== */}
        {/* CENTRAL SCULPTURAL 3D TYPOGRAPHY: "START FREELANCING"           */}
        {/* (Unboxed Free-Floating 3D Monument + Logos Perched ON the Note) */}
        {/* =============================================================== */}
        <motion.div
          animate={
            prefersReducedMotion
              ? { y: 0 }
              : {
                  y: [0, -9, 0, 6, 0],
                  rotateX: [0, 2.8, 0, -2.2, 0],
                  rotateY: [0, -3.2, 0, 3.2, 0],
                }
          }
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transform: `translateZ(${isSculptureHovered ? 48 : 30}px)`,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-20 flex items-center justify-center px-4"
        >
          <div
            role={onActivate ? 'button' : undefined}
            tabIndex={onActivate ? 0 : undefined}
            onClick={onActivate}
            onMouseEnter={() => setIsSculptureHovered(true)}
            onMouseLeave={() => setIsSculptureHovered(false)}
            onKeyDown={(e) => {
              if (onActivate && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onActivate();
              }
            }}
            aria-label="START FREELANCING"
            style={{ transformStyle: 'preserve-3d' }}
            className={`group relative inline-flex flex-col items-center justify-center px-4 py-4 sm:px-8 sm:py-6 outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl ${
              onActivate ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {/* Soft Volumetric Atmospheric Glow Behind the Free-Floating 3D Letters (No Box) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 rounded-full blur-3xl transition-all duration-500"
              style={{
                background:
                  'radial-gradient(circle, rgba(245,158,11,0.34) 0%, rgba(16,185,129,0.20) 48%, transparent 74%)',
                transform: `translateZ(-42px) translate(${-pointer.x * 16}px, ${14 - pointer.y * 10}px) scale(${
                  isSculptureHovered ? 1.16 : 1.02
                })`,
              }}
            />

            {/* =========================================================== */}
            {/* GROUP 1: 3D SOCIAL MEDIA LOGOS PLACED DIRECTLY ON THE NOTE  */}
            {/* =========================================================== */}
            {onNoteLogos.map((logo, idx) => (
              <Collectible3DLogo
                key={logo.id}
                logo={logo}
                index={idx}
                pointer={pointer}
                compact={compact}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}

            {/* Floating Unboxed 3D Studio Kicker Above Letters (Z = +18px) */}
            <div
              style={{ transform: 'translateZ(18px)' }}
              className="relative z-20 mb-2 inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-[0.22em] text-amber-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
            >
              <span>✦ 3D Creator Launchpad · Interactive Roadmap ✦</span>
            </div>

            {/* 3D Extruded Typography Container */}
            <div className="relative flex items-center justify-center py-1" style={{ transformStyle: 'preserve-3d' }}>
              {/* 22 Extruded 3D Depth Layers (Sculptural Metallic Gold & Obsidian Sidewalls) */}
              {textExtrusionSlices.map((zDepth, sliceIdx) => {
                const isFrontBevel = sliceIdx <= 2;
                const isMidBody = sliceIdx > 2 && sliceIdx <= 14;
                const sliceColor = isFrontBevel
                  ? '#FDE68A'
                  : isMidBody
                  ? sliceIdx % 2 === 0
                    ? '#D97706'
                    : '#B45309'
                  : '#271203';

                return (
                  <div
                    key={zDepth}
                    aria-hidden="true"
                    style={{
                      transform: `translateZ(${zDepth}px)`,
                      color: sliceColor,
                      textShadow:
                        sliceIdx === textExtrusionSlices.length - 1
                          ? '0 22px 38px rgba(0,0,0,0.95)'
                          : '0 1px 1px rgba(0,0,0,0.55)',
                    }}
                    className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center font-display font-black tracking-[-0.03em] leading-[0.92] select-none ${
                      compact
                        ? 'text-4xl sm:text-5xl lg:text-6xl'
                        : 'text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem]'
                    }`}
                  >
                    <span className="block">START</span>
                    <span className="block">FREELANCING</span>
                  </div>
                );
              })}

              {/* PRIMARY ACCESSIBLE 3D SCULPTURAL TEXT LAYER (Z = 0px) */}
              {/* Exact required text: "START FREELANCING" */}
              <div
                style={{
                  transform: 'translateZ(0px)',
                  backgroundImage: `linear-gradient(${130 + pointer.x * 28}deg, #FFFFFF 0%, #FEF3C7 22%, #FBBF24 50%, #34D399 82%, #FFFFFF 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: isSculptureHovered
                    ? 'drop-shadow(0 6px 22px rgba(245, 158, 11, 0.65))'
                    : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.85))',
                }}
                className={`relative z-10 flex flex-col items-center justify-center text-center font-display font-black tracking-[-0.03em] leading-[0.92] transition-all duration-200 ${
                  compact
                    ? 'text-4xl sm:text-5xl lg:text-6xl'
                    : 'text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem]'
                }`}
              >
                <span className="block">START</span>
                <span className="sr-only"> </span>
                <span className="block">FREELANCING</span>
              </div>

              {/* Specular Top Bevel Glint Layer (Z = +3px) */}
              <div
                aria-hidden="true"
                style={{
                  transform: 'translateZ(3px)',
                  backgroundImage: `linear-gradient(${115 - pointer.x * 40}deg, transparent 20%, rgba(255,255,255,0.78) 48%, transparent 75%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  opacity: isSculptureHovered ? 0.92 : 0.55,
                }}
                className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center font-display font-black tracking-[-0.03em] leading-[0.92] select-none transition-opacity duration-200 ${
                  compact
                    ? 'text-4xl sm:text-5xl lg:text-6xl'
                    : 'text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem]'
                }`}
              >
                <span className="block">START</span>
                <span className="block">FREELANCING</span>
              </div>
            </div>

            {/* Unboxed Floating 3D Tagline Beneath "START FREELANCING" (Z = +22px) */}
            {tagline && (
              <div
                style={{
                  transform: 'translateZ(22px)',
                  transformStyle: 'preserve-3d',
                }}
                className="relative z-20 mt-4 max-w-lg text-center space-y-1.5"
              >
                <p className="text-xs sm:text-sm font-display font-bold text-amber-100 tracking-wide leading-snug drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                  “{tagline}”
                </p>
                {onActivate && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-300 group-hover:text-amber-300 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    <span>Click 3D Note to Open Creator Success Roadmap & AI Coach →</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
