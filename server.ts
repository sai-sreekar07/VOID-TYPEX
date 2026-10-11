import express from 'express';
import { createServer as createHttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const httpServer = createHttpServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/ws/chat' });
const PORT = 3000;

app.use(express.json());

const DB_FILE = path.resolve(process.cwd(), '.synthetix_db.json');

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'creator' | 'brand';
  organizationOrHandle: string;
  primarySpecialtyOrIndustry: string;
  avatar: string;
  rememberMe: boolean;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  roomId: string;
  creatorId: string;
  creatorName: string;
  senderId: string;
  senderName: string;
  senderRole: 'creator' | 'brand';
  text: string;
  timestamp: string;
}

export interface StoredBrandInvitation {
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

interface DatabaseSchema {
  users: StoredUser[];
  messages: DirectMessage[];
  invitations?: StoredBrandInvitation[];
}

const DEFAULT_INVITATIONS: StoredBrandInvitation[] = [
  {
    id: 'inv-dhruv-bahri-01',
    brandId: 'brand-heritage-cinema',
    brandName: 'Heritage Cinema Collective',
    brandAvatar: '',
    creatorId: 'creator-dhruv-bahri',
    creatorName: 'Dhruv Bahri',
    creatorHandle: '@dhruvbahri',
    creatorAvatar: '',
    projectTitle: 'Ancient Chronicles: Historical Storytelling AI Short Film',
    briefDescription:
      'We loved your Arjun AI Short Film (2025) and want to hire you for story research, local Stable Diffusion previsualization, and Runway/Hailuo production on our upcoming historical short.',
    proposedBudget: 16500,
    deliverables: 'Previsualization Boards + Custom LoRAs + Final 4K Short Film',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
  },
  {
    id: 'inv-phil-langer-02',
    brandId: 'brand-noir-studios',
    brandName: 'A24 & Noir Narrative Lab',
    brandAvatar: '',
    creatorId: 'creator-phil-langer-film',
    creatorName: 'Phil Langer',
    creatorHandle: '@phillanger',
    creatorAvatar: '',
    projectTitle: 'Continuous Shadow: One-Shot Suspense Thriller Teaser',
    briefDescription:
      'Direct hire invitation inspired by The Quiet Man (2025). We need a suspenseful continuous-shot sequence using Google Nano Banana and Kling 2.1 first-frame/last-frame workflows.',
    proposedBudget: 15000,
    deliverables: '4K Continuous-Shot Short Film + Character Consistency Assets',
    status: 'Accepted',
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
  },
  {
    id: 'inv-yza-voku-03',
    brandId: 'brand-new-yorker-doc',
    brandName: 'Editorial Documentary Showcase',
    brandAvatar: '',
    creatorId: 'creator-yza-voku',
    creatorName: 'YZA Voku',
    creatorHandle: '@yzavoku',
    creatorAvatar: '',
    projectTitle: 'Urban Solitude: Experimental Visual Storytelling Film',
    briefDescription:
      'Inspired by your experimental film "Thank You for Not Answering", we would like to commission an original 2-minute visual essay translating modern solitude into moving images.',
    proposedBudget: 14500,
    deliverables: 'Experimental Short Film + Visual Direction Stills',
    status: 'Deal Locked',
    dealAmount: 15500,
    dealDeliverables: '2-Minute Experimental Short Film + 6x Editorial Keyframes',
    createdAt: new Date(Date.now() - 3600 * 1000 * 36).toISOString(),
  },
];

function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.invitations) || parsed.invitations.length === 0) {
        parsed.invitations = DEFAULT_INVITATIONS;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading DB:', err);
  }
  const initial: DatabaseSchema = {
    users: [],
    invitations: DEFAULT_INVITATIONS,
    messages: [
      {
        id: 'msg-welcome-dhruv-bahri',
        roomId: 'creator-dhruv-bahri',
        creatorId: 'creator-dhruv-bahri',
        creatorName: 'Dhruv Bahri',
        senderId: 'creator-dhruv-bahri',
        senderName: 'Dhruv Bahri',
        senderRole: 'creator',
        text: 'Welcome! Share your historical storytelling or film concept here — we can discuss Stable Diffusion previsualization, custom LoRAs, and Runway/Hailuo production.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'msg-welcome-phil-langer',
        roomId: 'creator-phil-langer-film',
        creatorId: 'creator-phil-langer-film',
        creatorName: 'Phil Langer',
        senderId: 'creator-phil-langer-film',
        senderName: 'Phil Langer',
        senderRole: 'creator',
        text: 'Hi! Let’s discuss your cinematic short film or continuous-shot project using Google Nano Banana, Kling 2.1, Midjourney, and Runway.',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'msg-welcome-yza-voku',
        roomId: 'creator-yza-voku',
        creatorId: 'creator-yza-voku',
        creatorName: 'YZA Voku',
        senderId: 'creator-yza-voku',
        senderName: 'YZA Voku',
        senderRole: 'creator',
        text: 'Hello. Feel free to share your experimental film or visual storytelling brief here.',
        timestamp: new Date().toISOString(),
      },
    ],
  };
  saveDb(initial);
  return initial;
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

function hashPassword(pw: string): string {
  return crypto.createHash('sha256').update(pw + '_synthetix_salt').digest('hex');
}

// Auth Endpoints (Register & Login with Email + Password stored in persistent database)
app.post('/api/auth/register', (req, res) => {
  const {
    name,
    email,
    password,
    role,
    organizationOrHandle,
    primarySpecialtyOrIndustry,
    avatar,
    rememberMe,
  } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  const dbData = loadDb();
  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = dbData.users.find((u) => u.email === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
  }

  const newUser: StoredUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: String(name).trim().slice(0, 100),
    email: normalizedEmail,
    passwordHash: hashPassword(String(password)),
    role: role === 'creator' ? 'creator' : 'brand',
    organizationOrHandle: String(organizationOrHandle || name).trim().slice(0, 100),
    primarySpecialtyOrIndustry: String(primarySpecialtyOrIndustry || 'AI Production').trim().slice(0, 120),
    avatar: String(avatar || ''),
    rememberMe: Boolean(rememberMe),
    createdAt: new Date().toISOString(),
  };

  dbData.users.push(newUser);
  saveDb(dbData);

  const { passwordHash: _ph, ...safeUser } = newUser;
  return res.json({ user: safeUser });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password, role, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const dbData = loadDb();
  const normalizedEmail = String(email).toLowerCase().trim();
  const found = dbData.users.find((u) => u.email === normalizedEmail);

  if (!found || found.passwordHash !== hashPassword(String(password))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  found.rememberMe = Boolean(rememberMe);
  if (role === 'creator' || role === 'brand') {
    found.role = role;
  }
  saveDb(dbData);

  const { passwordHash: _ph, ...safeUser } = found;
  return res.json({ user: safeUser });
});

// Invitations & Hiring Endpoints
app.get('/api/invitations', (_req, res) => {
  const dbData = loadDb();
  return res.json({ invitations: dbData.invitations || DEFAULT_INVITATIONS });
});

app.post('/api/invitations', (req, res) => {
  const {
    brandId,
    brandName,
    brandAvatar,
    creatorId,
    creatorName,
    creatorHandle,
    creatorAvatar,
    projectTitle,
    briefDescription,
    proposedBudget,
    deliverables,
  } = req.body;

  if (!creatorId || !projectTitle) {
    return res.status(400).json({ error: 'Creator and project title are required.' });
  }

  const dbData = loadDb();
  const newInvite: StoredBrandInvitation = {
    id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    brandId: String(brandId || 'brand-studio'),
    brandName: String(brandName || 'Enterprise Brand Partner'),
    brandAvatar: String(brandAvatar || ''),
    creatorId: String(creatorId),
    creatorName: String(creatorName || 'Content Creator').slice(0, 120),
    creatorHandle: String(creatorHandle || '@creator'),
    creatorAvatar: String(creatorAvatar || ''),
    projectTitle: String(projectTitle).trim(),
    briefDescription: String(briefDescription || 'Direct hire campaign invitation.').trim(),
    proposedBudget: Number(proposedBudget) || 15000,
    deliverables: String(deliverables || '4K Master + Project Stems').trim(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  if (!Array.isArray(dbData.invitations)) {
    dbData.invitations = [...DEFAULT_INVITATIONS];
  }
  dbData.invitations.unshift(newInvite);
  saveDb(dbData);

  const payload = JSON.stringify({ type: 'invitation:updated', invitations: dbData.invitations });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  return res.json({ invitation: newInvite, invitations: dbData.invitations });
});

app.patch('/api/invitations/:id/accept', (req, res) => {
  const { id } = req.params;
  const dbData = loadDb();
  const list = dbData.invitations || DEFAULT_INVITATIONS;
  const found = list.find((inv) => inv.id === id);
  if (!found) {
    return res.status(404).json({ error: 'Invitation not found.' });
  }

  found.status = 'Accepted';

  // Also post an automated system confirmation message in the chat room so both can chat immediately
  const acceptMsg: DirectMessage = {
    id: `msg_${Date.now()}_accept`,
    roomId: found.creatorId,
    creatorId: found.creatorId,
    creatorName: found.creatorName,
    senderId: found.creatorId,
    senderName: found.creatorName,
    senderRole: 'creator',
    text: `I have accepted your invitation for "${found.projectTitle}" ($${found.proposedBudget.toLocaleString()}). Let's chat here and finalize our deal terms!`,
    timestamp: new Date().toISOString(),
  };
  dbData.messages.push(acceptMsg);
  saveDb(dbData);

  const payload = JSON.stringify({
    type: 'invitation:updated',
    invitations: list,
    message: acceptMsg,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  return res.json({ invitation: found, invitations: list });
});

app.patch('/api/invitations/:id/deal', (req, res) => {
  const { id } = req.params;
  const { dealAmount, dealDeliverables, senderName, senderRole } = req.body;
  const dbData = loadDb();
  const list = dbData.invitations || DEFAULT_INVITATIONS;
  const found = list.find((inv) => inv.id === id);
  if (!found) {
    return res.status(404).json({ error: 'Invitation not found.' });
  }

  found.status = 'Deal Locked';
  found.dealAmount = Number(dealAmount) || found.proposedBudget;
  found.dealDeliverables = String(dealDeliverables || found.deliverables).trim();

  const dealMsg: DirectMessage = {
    id: `msg_${Date.now()}_deal`,
    roomId: found.creatorId,
    creatorId: found.creatorId,
    creatorName: found.creatorName,
    senderId: String(senderName || 'deal-maker'),
    senderName: String(senderName || found.creatorName),
    senderRole: senderRole === 'brand' ? 'brand' : 'creator',
    text: `DEAL CONFIRMED: "${found.projectTitle}" locked at $${found.dealAmount.toLocaleString()} — Deliverables: ${found.dealDeliverables}.`,
    timestamp: new Date().toISOString(),
  };
  dbData.messages.push(dealMsg);
  saveDb(dbData);

  const payload = JSON.stringify({
    type: 'invitation:updated',
    invitations: list,
    message: dealMsg,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  return res.json({ invitation: found, invitations: list });
});

// Chat Messages History Endpoint
app.get('/api/chat/:creatorId', (req, res) => {
  const { creatorId } = req.params;
  const dbData = loadDb();
  const roomMessages = dbData.messages.filter((m) => m.roomId === creatorId);
  return res.json({ messages: roomMessages });
});

app.post('/api/chat/send', (req, res) => {
  const { creatorId, creatorName, senderId, senderName, senderRole, text } = req.body;
  if (!creatorId || !text || ! String(text).trim()) {
    return res.status(400).json({ error: 'Message text and recipient creator are required.' });
  }

  const dbData = loadDb();
  const newMessage: DirectMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    roomId: String(creatorId),
    creatorId: String(creatorId),
    creatorName: String(creatorName || 'Creator'),
    senderId: String(senderId || 'guest'),
    senderName: String(senderName || 'Guest'),
    senderRole: senderRole === 'creator' ? 'creator' : 'brand',
    text: String(text).trim().slice(0, 1000),
    timestamp: new Date().toISOString(),
  };

  dbData.messages.push(newMessage);
  saveDb(dbData);

  // Broadcast over WebSocket to all connected clients
  const payload = JSON.stringify({ type: 'message:created', message: newMessage });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });

  return res.json({ message: newMessage });
});

// WebSocket Real-Time Chat Handler
wss.on('connection', (ws) => {
  const dbData = loadDb();
  ws.send(JSON.stringify({ type: 'chat:init', messages: dbData.messages }));

  ws.on('message', (raw) => {
    try {
      const parsed = JSON.parse(raw.toString());
      if (parsed.type === 'message:send' && parsed.text && parsed.creatorId) {
        const currentDb = loadDb();
        const msg: DirectMessage = {
          id: parsed.id || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          roomId: String(parsed.creatorId),
          creatorId: String(parsed.creatorId),
          creatorName: String(parsed.creatorName || 'Creator'),
          senderId: String(parsed.senderId || 'guest'),
          senderName: String(parsed.senderName || 'Guest'),
          senderRole: parsed.senderRole === 'creator' ? 'creator' : 'brand',
          text: String(parsed.text).trim().slice(0, 1000),
          timestamp: new Date().toISOString(),
        };

        if (!currentDb.messages.some((m) => m.id === msg.id)) {
          currentDb.messages.push(msg);
          saveDb(currentDb);
        }

        const broadcast = JSON.stringify({ type: 'message:created', message: msg });
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcast);
          }
        });
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  });
});

/**
 * Safely clamps an integer within [min, max] to prevent overflow, NaN, or negative values.
 * Time Complexity: O(1) | Space Complexity: O(1)
 */
function clampSafeInteger(val: unknown, min: number, max: number, fallback: number): number {
  const num = Number(val);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  return Math.min(Math.max(Math.round(num), min), max);
}

// Server-side Gemini API endpoint for AI Brief Builder
app.post('/api/brief-builder', async (req, res) => {
  const { idea, industry, stylePreference, targetBudget } = req.body ?? {};

  if (!idea || typeof idea !== 'string' || !idea.trim()) {
    return res.status(400).json({ error: 'Campaign idea is required' });
  }

  const sanitizedIdea = idea.trim().slice(0, 2000);
  const sanitizedIndustry =
    typeof industry === 'string' && industry.trim()
      ? industry.trim().slice(0, 200)
      : 'Commercial Brand';
  const sanitizedStyle =
    typeof stylePreference === 'string' && stylePreference.trim()
      ? stylePreference.trim().slice(0, 200)
      : 'Cinematic Anamorphic Hyper-Real';
  const sanitizedBudget =
    typeof targetBudget === 'string' && targetBudget.trim()
      ? targetBudget.trim().slice(0, 120)
      : '$8,000 - $16,000';

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Transform this campaign concept into a structured, enterprise-grade AI Creative Production Brief:
Campaign Idea: "${sanitizedIdea}"
Target Industry: "${sanitizedIndustry}"
Visual Style Preference: "${sanitizedStyle}"
Target Budget Range: "${sanitizedBudget}"

Generate a comprehensive production blueprint including title, conceptSummary, contentType, aspectRatio, styleAesthetic, recommendedTools, 4 workflowPhases, promptGuide (positiveCore, negativeConstraints, cameraDirectives), commercialLicenseTier, suggestedBudgetMin, suggestedBudgetMax, estimatedTurnaroundDays, and 3 milestones totaling 100%.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an executive AI creative producer, senior software architect, and technical director for commercial film & generative visual pipelines. Optimize all outputs for 100% test-case coverage, strict JSON schema compliance, deterministic boundary constraints, and static code quality standards (SonarQube compliance). Produce crisp, realistic production specifications for Runway Gen-3 Alpha, Flux.1 Pro, ComfyUI, and 4K ProRes mastering.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            conceptSummary: { type: Type.STRING },
            contentType: { type: Type.STRING },
            aspectRatio: { type: Type.STRING },
            styleAesthetic: { type: Type.STRING },
            recommendedTools: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            workflowPhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phase: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tools: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['phase', 'description', 'tools'],
              },
            },
            promptGuide: {
              type: Type.OBJECT,
              properties: {
                positiveCore: { type: Type.STRING },
                negativeConstraints: { type: Type.STRING },
                cameraDirectives: { type: Type.STRING },
              },
              required: ['positiveCore', 'negativeConstraints', 'cameraDirectives'],
            },
            commercialLicenseTier: { type: Type.STRING },
            suggestedBudgetMin: { type: Type.INTEGER },
            suggestedBudgetMax: { type: Type.INTEGER },
            estimatedTurnaroundDays: { type: Type.INTEGER },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  percentage: { type: Type.INTEGER },
                },
                required: ['title', 'percentage'],
              },
            },
          },
          required: [
            'title',
            'conceptSummary',
            'contentType',
            'aspectRatio',
            'styleAesthetic',
            'recommendedTools',
            'workflowPhases',
            'promptGuide',
            'commercialLicenseTier',
            'suggestedBudgetMin',
            'suggestedBudgetMax',
            'estimatedTurnaroundDays',
            'milestones',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini model');
    }

    const parsed = JSON.parse(text.trim());
    const minBudget = clampSafeInteger(parsed.suggestedBudgetMin, 500, 1_000_000, 8000);
    const maxBudget = Math.max(
      minBudget,
      clampSafeInteger(parsed.suggestedBudgetMax, minBudget, 2_000_000, 16000)
    );
    const turnaroundDays = clampSafeInteger(parsed.estimatedTurnaroundDays, 1, 365, 10);

    return res.json({
      ...parsed,
      suggestedBudgetMin: minBudget,
      suggestedBudgetMax: maxBudget,
      estimatedTurnaroundDays: turnaroundDays,
    });
  } catch (error: any) {
    console.error('Gemini API Brief Builder Error:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Failed to synthesize brief via Gemini API',
    });
  }
});

// Server-side Gemini API endpoint for the Creator Success Roadmap AI Agent
app.post('/api/roadmap-agent', async (req, res) => {
  const { question, currentStageTitle, completedMilestonesCount, totalMilestonesCount, history } =
    req.body ?? {};

  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'Please enter a question for the AI Creator Coach.' });
  }

  const sanitizedQuestion = question.trim().slice(0, 1500);
  const safeStageTitle =
    typeof currentStageTitle === 'string' && currentStageTitle.trim()
      ? currentStageTitle.trim().slice(0, 160)
      : 'Stage 01: Discover Your Creative Identity';
  const safeCompleted = clampSafeInteger(completedMilestonesCount, 0, 100, 0);
  const safeTotal = clampSafeInteger(totalMilestonesCount, 1, 100, 24);

  const safeHistory = Array.isArray(history)
    ? history
        .slice(-6)
        .map((m: any) => {
          const roleLabel = m?.role === 'assistant' ? 'AI Coach' : 'Creator';
          const textContent = typeof m?.text === 'string' ? m.text.trim().slice(0, 500) : '';
          return textContent ? `${roleLabel}: ${textContent}` : '';
        })
        .filter(Boolean)
        .join('\n')
    : '';

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Creator Context:
- Currently Exploring Roadmap Stage: "${safeStageTitle}"
- Roadmap Progress: ${safeCompleted} of ${safeTotal} milestones completed
${safeHistory ? `\nRecent Conversation:\n${safeHistory}\n` : ''}
New Content Creator's Question / Doubt:
"${sanitizedQuestion}"

Provide a clear, encouraging, and highly actionable answer tailored for a new content creator on the Synthetix AI Creator Marketplace.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are the Synthetix Creator Success AI Agent & Mentor inside the "Your Roadmap to Creator Success" studio guide. Your mission is to solve doubts for new content creators and help them achieve freelance success across the 6 roadmap stages: (1) Discover Your Creative Identity, (2) Master Your Creative Tools (Premiere Pro, After Effects, CapCut, Canva, Figma, Runway, ElevenLabs, ChatGPT, Google Gemini), (3) Create and Publish (YouTube, Instagram, TikTok, Facebook), (4) Grow Your Audience, (5) Build Your Portfolio, and (6) Collaborate and Earn with brands. Always emphasize the two core pillars: Uncompromising Quality Content and Relentless Publishing Consistency. Return structured JSON with a concise, supportive answer, 3 concrete actionSteps, a recommendedToolTip, and a corePillarReminder.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'Direct, practical, mentor-style answer to the creator doubt (2-4 sentences).',
            },
            actionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 specific, immediate action steps the creator can take today.',
            },
            recommendedToolTip: {
              type: Type.STRING,
              description: 'Specific tip on which platform or AI/editing tool to use and how.',
            },
            corePillarReminder: {
              type: Type.STRING,
              description: 'Short motivating reminder connecting their question to Quality Content and Consistency.',
            },
          },
          required: ['answer', 'actionSteps', 'recommendedToolTip', 'corePillarReminder'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini model');
    }

    const parsed = JSON.parse(text.trim());
    return res.json({
      answer:
        typeof parsed.answer === 'string' && parsed.answer.trim()
          ? parsed.answer.trim()
          : 'Focus on mastering one workflow at a time and publishing on a reliable weekly schedule.',
      actionSteps: Array.isArray(parsed.actionSteps)
        ? parsed.actionSteps.slice(0, 4).map((s: unknown) => String(s))
        : [
            'Define one clear niche and target audience format.',
            'Produce a 30-second test piece focusing on clean visual storytelling and audio.',
            'Publish on a consistent weekly schedule and track audience retention.',
          ],
      recommendedToolTip:
        typeof parsed.recommendedToolTip === 'string'
          ? parsed.recommendedToolTip.trim()
          : 'Pair Runway or Midjourney for visual ideation with CapCut or Premiere Pro for tight pacing.',
      corePillarReminder:
        typeof parsed.corePillarReminder === 'string'
          ? parsed.corePillarReminder.trim()
          : 'Quality Content earns attention; Consistency builds a sustainable creator career.',
    });
  } catch (error: any) {
    console.error('Gemini API Roadmap Agent Error:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'Failed to get response from Creator Success AI Agent',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server & WebSocket running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
