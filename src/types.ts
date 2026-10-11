export interface WorkflowStage {
  stageNumber: number;
  title: string;
  description: string;
  toolUsed: string;
  inputsOutputs: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Commercial TVC' | 'Brand Film' | 'Social Short' | 'Print & Key Visual' | '3D & Spatial';
  clientName: string;
  year: number;
  aspectRatio: '2.39:1' | '16:9' | '9:16' | '1:1' | '4:3';
  thumbnail: string;
  description: string;
  reproducibilityScore: string;
  commercialLicenseTier: string;
  provenanceHash: string;
  viewsCount: number;
  aiTelemetry: {
    primaryModel: string;
    secondaryModels: string[];
    checkpoint: string;
    seed: number;
    sampler: string;
    steps: number;
    cfgScale: number;
    denoiseStrength: number;
    humanTouchPct: number;
  };
  workflowPipeline: WorkflowStage[];
  promptDetails: {
    positivePrompt: string;
    negativePrompt: string;
    keyTokens: string[];
  };
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatar: string;
  location: string;
  availability: 'Immediately' | 'In 7 Days' | 'Booked Until Next Month';
  rateHourly: number;
  projectMinimum: number;
  bio: string;
  specialization: string[];
  tools: string[];
  skills: string[];
  verificationSignals: {
    identityVerified: boolean;
    verifiedWorkflows: boolean;
    workflowProvenanceHash: string;
    consistencyBenchmark: number;
    commercialIpIndemnity: boolean;
    enterpriseClientCount: number;
    pastBrands: string[];
  };
  stats: {
    clientRating: number;
    completedProjects: number;
    averageTurnaround: string;
  };
  featuredProject: PortfolioItem;
  portfolio: PortfolioItem[];
}

export interface CreativeBrief {
  id: string;
  title: string;
  brandName: string;
  brandLogo: string;
  postedDate: string;
  deadline: string;
  status: 'Accepting Proposals' | 'In Review' | 'Escrow Locked';
  contentType: string;
  styleAesthetic: string;
  formatAspectRatio: string[];
  technicalDeliverables: string[];
  commercialUseRequirements: {
    tier: string;
    territories: string;
    duration: string;
    modelTrainingIpExclusion: boolean;
    indemnityRequired: boolean;
  };
  budgetMin: number;
  budgetMax: number;
  proposalsCount: number;
  conceptOverview: string;
  deliverableCheckpoints: {
    name: string;
    pct: number;
    deliverable: string;
  }[];
  requiredTools: string[];
  styleTags: string[];
}

export interface EngagementProposal {
  id: string;
  briefId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  bidAmount: number;
  estimatedDays: number;
  proposalPitch: string;
  proposedPipeline: string[];
  proposedModels: string[];
  status: 'Shortlisted' | 'Pending' | 'Accepted';
  sampleSeed: number;
  submittedDate: string;
}

export interface ActiveEngagement {
  id: string;
  briefTitle: string;
  brandName: string;
  creatorName: string;
  creatorHandle: string;
  contractValue: number;
  currentStage: string;
  progressPct: number;
  deadline: string;
  iterationsCount: number;
  verifiableProvenance: string;
  milestones: {
    name: string;
    amount: number;
    completed: boolean;
  }[];
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'creator' | 'brand';
  organizationOrHandle: string;
  primarySpecialtyOrIndustry: string;
  avatar: string;
}

export interface BrandInvitation {
  id: string;
  brandId: string;
  brandName: string;
  brandAvatar: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  projectTitle: string;
  briefDescription: string;
  proposedBudget: number;
  deliverables: string;
  status: 'Pending' | 'Accepted' | 'Deal Locked';
  dealAmount?: number;
  dealDeliverables?: string;
  createdAt: string;
}
