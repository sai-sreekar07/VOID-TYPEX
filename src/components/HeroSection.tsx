import React from 'react';
import { ArrowRight } from 'lucide-react';
import paulPortraitImg from '../assets/images/creator_portrait_paul_1791638006658.jpg';
import clairePortraitImg from '../assets/images/creator_portrait_claire_1791638027865.jpg';
import directorImg from '../assets/images/director_portrait_1_1791626812610.jpg';
import davePortraitImg from '../assets/images/creator_portrait_dave_1791638041354.jpg';

interface HeroSectionProps {
  onExploreCreators: () => void;
  onOpenBriefBuilder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCreators,
  onOpenBriefBuilder,
}) => {
  const featuredCreators = [
    {
      name: 'Paul Trillo',
      avatar: paulPortraitImg,
      briefDefinition: '19x Vimeo Staff Pick winner directing narrative AI cinema & brand documentaries.',
      skills: 'Temporal Continuity · Camera Trajectory Control',
      tools: 'Runway Gen-3 Alpha · ComfyUI · Flux.1 Pro',
      previousProjects: 'The Generative Auteur, Where the Robots Grow',
    },
    {
      name: 'Karen X. Cheng',
      avatar: directorImg,
      briefDefinition: 'Emmy-nominated creative director known for viral choreography & brand campaigns.',
      skills: 'Viral Storytelling · Exact Product Lock',
      tools: 'Flux.1 Pro · Kling 1.5 · Runway Gen-3 Alpha',
      previousProjects: 'Aurora Cellular Film, Cosmopolitan AI Cover',
    },
    {
      name: 'Claire Silver',
      avatar: clairePortraitImg,
      briefDefinition: 'Louvre & Christie’s exhibited AI artist directing haute couture monographs.',
      skills: 'Couture Textile Conditioning · 100MP Print',
      tools: 'Midjourney v6.1 · Flux.1 Pro · ComfyUI',
      previousProjects: 'Monolith Silk Monograph, Crimson Origami',
    },
    {
      name: 'Dave Clark',
      avatar: davePortraitImg,
      briefDefinition: 'Award-winning showrunner directing sci-fi & anime-inspired generative films.',
      skills: 'Sakuga Anime Pipelines · Unreal 5 to Latent',
      tools: 'ComfyUI · Kling 1.5 · ElevenLabs',
      previousProjects: 'Orbital Valkyrie, Where the Robots Grow',
    },
  ];

  return (
    <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/95 backdrop-blur-md p-6 sm:p-10 lg:p-12 transition-colors space-y-8 shadow-hard">
      {/* Split-Screen Hero: Left = Editorial Overview, Right = Organized Creator Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
              Verified AI Content Creators · Organized Directory
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[var(--text-main)] font-display leading-[1.1]">
              Connect Directly with Acclaimed AI Content Creators.
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              Browse organized creator profiles featuring their name, brief definition, core skills, AI tools used, previous projects, and visual portfolio — then invite them and chat directly to lock in a deal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreCreators}
              className="btn-tactile px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-sm"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--accent-text)',
              }}
            >
              <span>Browse Creator Profiles</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenBriefBuilder}
              className="px-5 py-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] font-semibold text-xs sm:text-sm cursor-pointer transition-colors whitespace-nowrap"
            >
              <span>Create Campaign Brief</span>
            </button>
          </div>
        </div>

        {/* Right Column: Clean 2x2 Organized Content Creators Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredCreators.map((creator) => (
            <div
              key={creator.name}
              onClick={onExploreCreators}
              className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--accent-primary)] p-4 space-y-3 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border border-[var(--border-subtle)] shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-base text-[var(--text-main)] break-words">
                    {creator.name}
                  </h3>
                  <p className="text-[11px] font-mono text-[var(--accent-primary)]">
                    Content Creator
                  </p>
                </div>
              </div>

              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                {creator.briefDefinition}
              </p>

              <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1 text-[11px] font-mono">
                <div className="truncate">
                  <span className="text-[var(--text-muted)]">Skills: </span>
                  <span className="text-[var(--text-main)]">{creator.skills}</span>
                </div>
                <div className="truncate">
                  <span className="text-[var(--text-muted)]">AI Tools: </span>
                  <span className="text-[var(--accent-primary)]">{creator.tools}</span>
                </div>
                <div className="truncate">
                  <span className="text-[var(--text-muted)]">Projects: </span>
                  <span className="text-[var(--text-main)]">{creator.previousProjects}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
