import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Zap,
  FileCheck
} from 'lucide-react';
import { CreativeBrief } from '../types';
import studioDocumentaryImg from '../assets/images/creator_studio_documentary_1791638060877.jpg';

interface AiBriefBuilderProps {
  onPublishBrief: (brief: CreativeBrief) => void;
}

export const AiBriefBuilder: React.FC<AiBriefBuilderProps> = ({ onPublishBrief }) => {
  const [idea, setIdea] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Brand Documentary & Film');
  const [stylePreference, setStylePreference] = useState<string>('Cinematic Anamorphic Hyper-Real');
  const [targetBudget, setTargetBudget] = useState<string>('$8,000 - $16,000');
  
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedBrief, setGeneratedBrief] = useState<any | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [publishedSuccess, setPublishedSuccess] = useState<boolean>(false);

  const presetIdeas = [
    {
      label: 'Brand Documentary Film',
      text: 'A 60-second cinematic brand documentary following a creative director in an architectural studio blending live 35mm cinematography with Runway Gen-3 Alpha and ComfyUI.',
      industry: 'Brand Documentary & Film',
      style: 'Cinematic Anamorphic Hyper-Real',
      budget: '$12,000 - $24,000'
    },
    {
      label: 'Bio-Cosmetics Macro Droplet',
      text: 'Macro commercial for an organic cellular face serum showcasing viscous liquid droplets merging over ultra-realistic textured skin with volumetric morning sunbeam caustics.',
      industry: 'Beauty & Skincare',
      style: 'Surrealist Biophilic & Macro Photoreal',
      budget: '$6,000 - $12,000'
    },
    {
      label: 'Cyberpunk Anime Sakuga',
      text: 'An explosive high-octane anime opening sequence with fluid sakuga sword fighting and high-speed hoverbike pursuit through holographic skyscrapers in Neo-Kyoto.',
      industry: 'Music & Entertainment',
      style: 'Cel-Shaded Sakuga Anime',
      budget: '$14,000 - $28,000'
    },
    {
      label: 'Zero-Gravity Haute Couture',
      text: 'Haute couture virtual fashion editorial featuring an avant-garde gown made of iridescent liquid metal drifting in microgravity with hyper-detailed fabric sheen.',
      industry: 'Fashion & Luxury',
      style: 'High-Key Studio Editorial',
      budget: '$8,000 - $15,000'
    }
  ];

  const handleApplyPreset = (preset: typeof presetIdeas[0]) => {
    setIdea(preset.text);
    setIndustry(preset.industry);
    setStylePreference(preset.style);
    setTargetBudget(preset.budget);
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    setGeneratedBrief(null);

    try {
      const response = await fetch('/api/brief-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          industry,
          stylePreference,
          targetBudget,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setGeneratedBrief(data);
    } catch (err) {
      console.warn('Backend fallback structured brief:', err);
      setGeneratedBrief({
        title: `${industry.split(' ')[0]} Commercial Production Specification`,
        conceptSummary: `An enterprise-grade generative campaign translating the core directive: "${idea}". Designed with temporal motion consistency, custom LoRA character identity anchors, and commercial-grade 4K delivery.`,
        contentType: idea.toLowerCase().includes('vertical') ? 'Social Short (9:16)' : 'Cinematic Brand Film',
        aspectRatio: idea.toLowerCase().includes('vertical') ? '9:16 (Vertical Reels)' : '2.39:1 (Anamorphic Cinema)',
        styleAesthetic: `${stylePreference} with anamorphic lens distortion, volumetric rim lighting, deep contrast, and natural filmic grain texture.`,
        recommendedTools: [
          'Runway Gen-3 Alpha',
          'Flux.1 Pro',
          'ComfyUI + ControlNet',
          'Topaz Video AI 4K',
          'ElevenLabs Sound Design'
        ],
        workflowPhases: [
          {
            phase: '01. Lookdev & Keyframe Consistency',
            description: 'Generate multi-angle keyframe turnarounds using Flux.1 Pro and train subject LoRA checkpoints to lock visual identity.',
            tools: ['Flux.1 Pro', 'Kohya LoRA Trainer']
          },
          {
            phase: '02. Video Synthesis & Camera Pathing',
            description: 'Translate keyframes into motion using Runway Gen-3 Alpha with precise motion vector trajectories and depth guidance.',
            tools: ['Runway Gen-3 Alpha', 'Kling 1.5']
          },
          {
            phase: '03. Soundscape & Multitrack Synth',
            description: 'Compose bespoke reactive audio stems, synthetic foley effects, and spatial ambiances.',
            tools: ['ElevenLabs', 'Stable Audio 2.0']
          },
          {
            phase: '04. Temporal Stabilization & 4K Master',
            description: 'Upscale to 4K 60fps ProRes 422 HQ via Topaz Video AI, apply grain match, and export ComfyUI provenance metadata.',
            tools: ['Topaz Video AI', 'DaVinci Resolve Studio']
          }
        ],
        promptGuide: {
          positiveCore: `Cinematic 35mm photograph, ${idea}, master lighting, photorealistic textures, 8k resolution, cinematic atmosphere, shot on ARRI Alexa 65.`,
          negativeConstraints: 'morphing faces, duplicate limbs, cartoonish, low resolution, motion blur blurriness, plastic skin, AI watermark, frame jitter.',
          cameraDirectives: 'Smooth kinetic dolly-in, shallow depth of field (f/1.4), anamorphic flare, gentle atmospheric haze.'
        },
        commercialLicenseTier: 'Enterprise Commercial with AI Model Indemnity',
        suggestedBudgetMin: 6500,
        suggestedBudgetMax: 14000,
        estimatedTurnaroundDays: 7,
        milestones: [
          { title: 'Milestone 1: 5x Approved Styleframes & LoRA Identity Anchor', percentage: 30 },
          { title: 'Milestone 2: 1080p Motion Prev-viz & Sound Design Cut', percentage: 40 },
          { title: 'Milestone 3: 4K 60fps ProRes Master + ComfyUI Provenance Package', percentage: 30 }
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyJson = () => {
    if (!generatedBrief) return;
    navigator.clipboard.writeText(JSON.stringify(generatedBrief, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePublishToMarketplace = () => {
    if (!generatedBrief) return;

    const newBrief: CreativeBrief = {
      id: `brief-${Date.now()}`,
      title: generatedBrief.title,
      brandName: `${industry.split(' ')[0]} Brand Group`,
      brandLogo: studioDocumentaryImg,
      postedDate: 'Just now',
      deadline: 'In 14 Days',
      status: 'Accepting Proposals',
      contentType: generatedBrief.contentType,
      styleAesthetic: generatedBrief.styleAesthetic,
      formatAspectRatio: [generatedBrief.aspectRatio?.includes('9:16') ? '9:16' : '16:9'],
      technicalDeliverables: [
        '4K 60fps ProRes 422 HQ Masters',
        'Reproducible ComfyUI / Seed Checkpoint JSON',
        'Spatial Audio & Stem Tracks',
      ],
      commercialUseRequirements: {
        tier: generatedBrief.commercialLicenseTier || 'Enterprise Broadcast & AI Indemnified',
        territories: 'Global Digital & Broadcast in Perpetuity',
        duration: 'Perpetual',
        modelTrainingIpExclusion: true,
        indemnityRequired: true,
      },
      budgetMin: generatedBrief.suggestedBudgetMin || 6000,
      budgetMax: generatedBrief.suggestedBudgetMax || 14000,
      proposalsCount: 0,
      conceptOverview: generatedBrief.conceptSummary,
      deliverableCheckpoints: generatedBrief.milestones?.map((m: any) => ({
        name: m.title,
        pct: m.percentage,
        deliverable: `Stage deliverable with ${m.percentage}% escrow release`,
      })) || [
        { name: '1. Styleframes & LoRA Anchor', pct: 30, deliverable: '30% Release' },
        { name: '2. Motion Prev-viz', pct: 40, deliverable: '40% Release' },
        { name: '3. 4K Master & IP Package', pct: 30, deliverable: '30% Release' },
      ],
      requiredTools: generatedBrief.recommendedTools || ['Runway Gen-3 Alpha', 'Flux.1 Pro'],
      styleTags: [industry.split(' ')[0], 'AI-Crafted', '4K Commercial'],
    };

    onPublishBrief(newBrief);
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 lg:p-8 transition-colors">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
            Brief Builder → Brief Definition · Verification → Creator Profiles & AI Portfolios
          </p>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--text-main)] font-display">
            AI-Assisted Brief Builder: Creating structured briefs from a rough idea.
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Specify your rough campaign concept below. Our AI-Assisted Brief Builder transforms a rough idea into a structured Brief Definition with a 4-stage workflow pipeline, recommended AI tool stack, conditioning prompts, and milestone schedule.
          </p>
        </div>
      </div>

      {/* Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <div className="lg:col-span-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] p-5 lg:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>01. Rough Idea Input (AI-Assisted Brief Builder)</span>
            </h3>
            <span className="text-xs font-mono text-[var(--text-muted)]">Step 1 of 2</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-sans font-medium text-[var(--text-muted)] block">
              Quick Concept Starters:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presetIdeas.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2.5 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:border-[var(--accent-primary)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-sans font-medium transition-colors text-left cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-sans font-medium text-[var(--text-main)] block">
              Describe your campaign idea, visual goals, or mood:
            </label>
            <textarea
              rows={4}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. A hyper-realistic perfume commercial showing crystalline glass bottles floating in deep azure Mediterranean waters with caustics..."
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)] font-sans leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
            <div>
              <label className="font-medium text-[var(--text-muted)] block mb-1">Target Industry:</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="Automotive & Mobility">Automotive & Mobility</option>
                <option value="Fashion & Luxury">Fashion & Luxury</option>
                <option value="Beauty & Skincare">Beauty & Skincare</option>
                <option value="Consumer Tech & Gaming">Consumer Tech & Gaming</option>
                <option value="Music & Entertainment">Music & Entertainment</option>
                <option value="Food & Beverage">Food & Beverage</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-[var(--text-muted)] block mb-1">Visual Aesthetic:</label>
              <select
                value={stylePreference}
                onChange={(e) => setStylePreference(e.target.value)}
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-[var(--text-main)] font-sans focus:outline-none focus:border-[var(--accent-primary)]"
              >
                <option value="Cinematic Anamorphic Hyper-Real">Cinematic Anamorphic Hyper-Real</option>
                <option value="Surrealist Biophilic & Macro Photoreal">Surrealist Biophilic & Macro</option>
                <option value="Cyberpunk Neon Noir">Cyberpunk Neon Noir</option>
                <option value="High-Key Studio Editorial">High-Key Studio Editorial</option>
                <option value="Cel-Shaded Sakuga Anime">Cel-Shaded Sakuga Anime</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-sans font-medium text-[var(--text-muted)] block mb-1">Estimated Target Budget:</label>
            <input
              type="text"
              value={targetBudget}
              onChange={(e) => setTargetBudget(e.target.value)}
              className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-xl p-2.5 text-[var(--text-main)] font-mono tabular-nums text-xs focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!idea.trim() || isGenerating}
            className={`btn-tactile w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 ${
              !idea.trim() || isGenerating
                ? 'opacity-50 cursor-not-allowed bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                : 'bg-[var(--accent-primary)] text-[var(--accent-text)] cursor-pointer'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Production Brief...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Generate Structured Production Brief</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)] p-5 lg:p-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <h3 className="font-display font-bold text-base text-[var(--text-main)] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>02. Structured Brief Definition</span>
            </h3>

            {generatedBrief && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:border-[var(--border-hover)] text-[var(--text-main)] text-xs font-mono border border-[var(--border-subtle)] flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                </button>

                <button
                  onClick={handlePublishToMarketplace}
                  className="btn-tactile px-4 py-1.5 rounded-xl bg-[var(--accent-primary)] text-[var(--accent-text)] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {publishedSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Published</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Publish Brief</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {!generatedBrief && !isGenerating && (
            <div className="space-y-4">
              {/* Interactive Studio Blueprint Preview Before Synthesis */}
              <div className="p-4 sm:p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                    <h4 className="font-display font-bold text-sm sm:text-base text-[var(--text-main)]">
                      No Brief Synthesized Yet · Live Specification Blueprint
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300 uppercase">
                    Ready to Architect
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Select one of the quick concept starters on the left or describe your campaign idea, then click "Generate Structured Production Brief". Below is a live preview of the specification modules that will be generated:
                </p>

                {/* Live Parameter Preview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-0.5">
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Selected Industry</span>
                    <span className="text-[var(--text-main)] font-bold truncate block">{industry}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-0.5">
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Visual Aesthetic</span>
                    <span className="text-amber-300 font-bold truncate block">{stylePreference}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-0.5">
                    <span className="text-[10px] text-[var(--text-muted)] block uppercase">Target Budget</span>
                    <span className="text-emerald-400 font-bold tabular-nums block">{targetBudget}</span>
                  </div>
                </div>

                {/* 4 Specification Blueprint Modules Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]/60 border border-white/[0.06] space-y-1">
                    <div className="font-mono text-[11px] font-bold text-amber-300">
                      01 · 4-Stage AI Production Pipeline
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                      Lookdev LoRA identity anchors, motion camera synthesis, reactive soundscape stems, and 4K ProRes mastering.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]/60 border border-white/[0.06] space-y-1">
                    <div className="font-mono text-[11px] font-bold text-emerald-300">
                      02 · Prompt Conditioning & Camera Rig
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                      Positive lighting core, negative artifact constraints, and kinetic lens movement directives.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]/60 border border-white/[0.06] space-y-1">
                    <div className="font-mono text-[11px] font-bold text-sky-300">
                      03 · 3-Beat Visual Storyboard Breakdown
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                      Opening establishing hook, hero dynamic transformation, and brand packshot resolution.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)]/60 border border-white/[0.06] space-y-1">
                    <div className="font-mono text-[11px] font-bold text-amber-200">
                      04 · Commercial IP Indemnity & Escrow
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                      30% / 40% / 30% milestone release schedule with reproducible seed & checkpoint provenance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center mx-auto">
                <Cpu className="w-6 h-6 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-base text-[var(--text-main)]">
                  Architecting Production Specifications...
                </h4>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Mapping creative intent into model checkpoints, aspect ratios, and ComfyUI pipelines.
                </p>
              </div>
            </div>
          )}

          {generatedBrief && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs font-mono tabular-nums">
                  <span className="text-[var(--accent-primary)] font-semibold">
                    {generatedBrief.contentType} · {generatedBrief.aspectRatio}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    ${generatedBrief.suggestedBudgetMin?.toLocaleString()} – ${generatedBrief.suggestedBudgetMax?.toLocaleString()}
                  </span>
                </div>
                <h4 className="text-xl font-bold font-display text-[var(--text-main)]">
                  {generatedBrief.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {generatedBrief.conceptSummary}
                </p>
              </div>

              <div className="text-xs font-mono space-y-1">
                <span className="text-[var(--text-muted)] block">Recommended Model & Tool Stack:</span>
                <p className="text-[var(--text-main)] font-semibold">
                  {generatedBrief.recommendedTools?.join(' · ')}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-[var(--text-muted)] block">
                  Recommended 4-Stage Production Workflow:
                </span>
                <div className="space-y-2">
                  {generatedBrief.workflowPhases?.map((stage: any, i: number) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between text-[var(--text-main)] font-bold">
                        <span>{stage.phase}</span>
                        <span className="text-[var(--accent-primary)] font-normal">
                          {stage.tools?.join(' · ')}
                        </span>
                      </div>
                      <p className="text-[var(--text-muted)] leading-relaxed font-sans">
                        {stage.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {generatedBrief.promptGuide && (
                <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2 text-xs font-mono">
                  <span className="text-[var(--accent-primary)] font-semibold block">
                    Prompt Conditioning Guide
                  </span>
                  <div className="space-y-1.5">
                    <div>
                      <span className="text-emerald-400 font-semibold">Positive Core: </span>
                      <span className="text-[var(--text-main)]">{generatedBrief.promptGuide.positiveCore}</span>
                    </div>
                    <div>
                      <span className="text-red-400 font-semibold">Negative Constraints: </span>
                      <span className="text-[var(--text-muted)]">{generatedBrief.promptGuide.negativeConstraints}</span>
                    </div>
                    <div>
                      <span className="text-sky-400 font-semibold">Camera Direction: </span>
                      <span className="text-[var(--text-main)]">{generatedBrief.promptGuide.cameraDirectives}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 font-mono text-xs tabular-nums">
                <span className="text-[var(--text-muted)] block">
                  3-Stage Escrow Milestone Schedule:
                </span>
                <div className="space-y-1.5">
                  {generatedBrief.milestones?.map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-between"
                    >
                      <span className="text-[var(--text-main)]">{m.title}</span>
                      <span className="text-emerald-400 font-bold">{m.percentage}% Release</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Beat Visual Storyboard Shot Breakdown */}
              <div className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                    3-Beat Visual Storyboard Shot Breakdown
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    4K 60fps ProRes 422 HQ · Temporal Lock
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-white/[0.06] space-y-1">
                    <div className="font-mono text-[10px] font-bold text-amber-300">
                      SHOT 01 · 0:00–0:05 (HOOK)
                    </div>
                    <div className="font-display font-bold text-[var(--text-main)]">
                      Atmospheric Establishing Frame
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                      Anamorphic wide establishing shot locking subject LoRA identity and volumetric lighting mood.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-white/[0.06] space-y-1">
                    <div className="font-mono text-[10px] font-bold text-emerald-300">
                      SHOT 02 · 0:05–0:20 (CORE MOTION)
                    </div>
                    <div className="font-display font-bold text-[var(--text-main)]">
                      Kinetic Camera Transformation
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                      Continuous motion-vector camera trajectory with fluid physics and beat-synced audio stems.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-white/[0.06] space-y-1">
                    <div className="font-mono text-[10px] font-bold text-sky-300">
                      SHOT 03 · 0:20–0:30 (RESOLUTION)
                    </div>
                    <div className="font-display font-bold text-[var(--text-main)]">
                      Hero Packshot & Brand Signature
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] leading-snug">
                      High-detail macro hero frame graded in 4K with commercial IP provenance metadata.
                    </p>
                  </div>
                </div>
              </div>

              {/* Technical Delivery & Commercial Rights Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs tabular-nums">
                <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] block">Master Resolution</span>
                  <span className="text-[var(--text-main)] font-bold">4K UHD (60fps)</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] block">Est. Turnaround</span>
                  <span className="text-amber-300 font-bold">{generatedBrief.estimatedTurnaroundDays || 7} Days</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] block">IP Provenance</span>
                  <span className="text-emerald-400 font-bold">Seed & JSON Lock</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] space-y-0.5">
                  <span className="text-[10px] text-[var(--text-muted)] block">Commercial Tier</span>
                  <span className="text-[var(--text-main)] font-bold truncate block">
                    {generatedBrief.commercialLicenseTier || 'Enterprise Indemnified'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
