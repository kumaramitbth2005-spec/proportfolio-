import 'dotenv/config';
import http from 'node:http';
import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import multer from 'multer';
import connectDB from './config/db.js';
import { Admin, Profile, Education, Skill, Project, Certificate, Social, Resume, ContactMessage, ChatSession, ChatMessage } from './models/index.js';
import { requireAuth } from './middleware/auth.js';
import { notifyOwner, sendChatEmailToOwner, sendChatEmailToVisitor } from './services/email.js';
import { uploadBuffer } from './services/cloudinary.js';
import { seedContent } from './utils/seed.js';

const app = express();
const server = http.createServer(app);
const clientEnv = process.env.CLIENT_URL || 'http://localhost:5173';
const configuredOrigins = clientEnv.split(',').map(x => x.trim().replace(/\/+$/, '')).filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/+$/, '');
  if (configuredOrigins.includes('*') || configuredOrigins.includes(cleanOrigin)) return true;
  if (/^https?:\/\/localhost(:\d+)?$/.test(cleanOrigin)) return true;
  if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(cleanOrigin)) return true;
  if (/^https:\/\/[a-zA-Z0-9_.-]+\.vercel\.app$/.test(cleanOrigin)) return true;
  if (/^https:\/\/[a-zA-Z0-9_.-]+\.onrender\.com$/.test(cleanOrigin)) return true;
  return false;
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) callback(null, true);
      else callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: true
  }
});

// Track active admin sockets for genuine presence
const adminSockets = new Set();
const broadcastPresence = () => {
  const isOnline = adminSockets.size > 0;
  io.emit('owner:presence', { online: isOnline });
};

app.use(helmet());
app.use(cors({
  origin: (origin, cb) => {
    if (isOriginAllowed(origin)) cb(null, true);
    else cb(new Error('Origin is not allowed by CORS.'));
  },
  credentials: true
}));
app.use(express.json({ limit: '30kb' }));
app.use(cookieParser());
app.use(mongoSanitize());

app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Try again later.' }
}));

app.get('/api/health', (_req, res) => res.json({
  success: true,
  data: {
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    ownerOnline: adminSockets.size > 0
  }
}));

const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
const fail = (res, message, status = 400) => res.status(status).json({ success: false, message });
const isDb = () => mongoose.connection.readyState === 1;

// General CMS resources
const collections = {
  profile: { model: Profile, single: true },
  education: { model: Education },
  skills: { model: Skill },
  projects: { model: Project },
  certificates: { model: Certificate },
  socials: { model: Social },
  resume: { model: Resume, single: true }
};

for (const [path, { model, single }] of Object.entries(collections)) {
  const router = express.Router();
  
  if (path === 'resume') {
    router.get('/pdf', async (req, res, next) => {
      try {
        const resumeDoc = isDb() ? await Resume.findOne().lean() : null;
        const fallbackUrl = resumeDoc?.resumeUrl;
        const overleafUrl = process.env.OVERLEAF_READ_URL?.trim();

        if (overleafUrl) {
          if (overleafUrl.toLowerCase().endsWith('.pdf')) {
            try {
              const fetchResponse = await fetch(overleafUrl);
              if (fetchResponse.ok) {
                const arrayBuffer = await fetchResponse.arrayBuffer();
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                if (req.query.download) {
                  res.setHeader('Content-Disposition', 'attachment; filename="Amit-Kumar-Resume.pdf"');
                } else {
                  res.setHeader('Content-Disposition', 'inline; filename="Amit-Kumar-Resume.pdf"');
                }
                return res.send(Buffer.from(arrayBuffer));
              }
            } catch (err) {
              console.warn('Direct PDF fetch failed:', err.message);
            }
          }
          return res.redirect(overleafUrl);
        }

        if (fallbackUrl) {
          return res.redirect(fallbackUrl);
        }

        return res.status(404).json({ success: false, message: 'Resume is not yet configured.' });
      } catch (e) {
        next(e);
      }
    });
  }
  router.get('/', async (_req, res, next) => {
    try {
      if (!isDb()) return ok(res, single ? null : []);
      const data = single ? await model.findOne().lean() : await model.find().sort({ order: 1, createdAt: -1 }).lean();
      ok(res, data);
    } catch (e) {
      next(e);
    }
  });

  if (path === 'projects') {
    router.get('/:id', async (req, res, next) => {
      try {
        const query = mongoose.isValidObjectId(req.params.id) ? { _id: req.params.id } : { slug: req.params.id };
        const item = await Project.findOne(query).lean();
        return item ? ok(res, item) : fail(res, 'Project not found.', 404);
      } catch (e) {
        next(e);
      }
    });
  }

  router.use(requireAuth);

  if (single) {
    router.put('/', async (req, res, next) => {
      try {
        const data = await model.findOneAndUpdate({}, { $set: req.body }, { new: true, upsert: true, runValidators: true });
        ok(res, data);
      } catch (e) {
        next(e);
      }
    });
  } else {
    router.post('/', async (req, res, next) => {
      try {
        const item = await model.create(req.body);
        ok(res, item, 201);
      } catch (e) {
        next(e);
      }
    });
    router.put('/:id', async (req, res, next) => {
      try {
        if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid item id.');
        const item = await model.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        return item ? ok(res, item) : fail(res, 'Item not found.', 404);
      } catch (e) {
        next(e);
      }
    });
    router.delete('/:id', async (req, res, next) => {
      try {
        if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid item id.');
        const item = await model.findByIdAndDelete(req.params.id);
        return item ? ok(res, { deleted: true }) : fail(res, 'Item not found.', 404);
      } catch (e) {
        next(e);
      }
    });
  }

  app.use(`/api/${path}`, router);
}

// Authentication
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const admin = await Admin.findOne({ email });
    if (!admin || !await bcrypt.compare(password, admin.passwordHash)) {
      return fail(res, 'Email or password is incorrect.', 401);
    }
    if (!process.env.JWT_SECRET) return fail(res, 'Authentication is not configured.', 503);
    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    ok(res, { admin: { name: admin.name, email: admin.email, role: admin.role } });
  } catch (e) {
    next(e);
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  ok(res, { loggedOut: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => ok(res, { admin: { id: req.admin.id, email: req.admin.email, role: req.admin.role } }));

// Media Uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.mimetype))
});

app.post('/api/uploads', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return fail(res, 'Upload a JPG, PNG, WebP, or PDF file under 5 MB.');
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return fail(res, 'File storage is not configured.', 503);
    }
    const type = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';
    const result = await uploadBuffer(req.file.buffer, { folder: 'portfolio', resourceType: type });
    ok(res, { url: result.secure_url, publicId: result.public_id, format: result.format }, 201);
  } catch (e) {
    next(e);
  }
});

// Contact Form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages. Please try again later.' }
});

app.post('/api/contact', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, subject = '', message, website } = req.body;
    if (website) return ok(res, { received: true });
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !message?.trim() || message.trim().length < 10) {
      return fail(res, 'Please provide a valid name, email, and message of at least 10 characters.');
    }
    if (!isDb()) return fail(res, 'Message service is temporarily unavailable.', 503);
    const saved = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: String(subject).trim(),
      message: message.trim()
    });
    notifyOwner(`Portfolio message: ${saved.subject || 'New contact'}`, `From: ${saved.name} <${saved.email}>\n\n${saved.message}`).catch(err => console.error('Email notification failed:', err.message));
    ok(res, { received: true, id: saved._id }, 201);
  } catch (e) {
    next(e);
  }
});

app.get('/api/contact', requireAuth, async (_req, res, next) => {
  try {
    ok(res, await ContactMessage.find().sort({ createdAt: -1 }).limit(250).lean());
  } catch (e) {
    next(e);
  }
});

app.put('/api/contact/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid message id.');
    const status = req.body.status;
    if (!['new', 'read', 'replied', 'archived'].includes(status)) return fail(res, 'Invalid message status.');
    const item = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return item ? ok(res, item) : fail(res, 'Message not found.', 404);
  } catch (e) {
    next(e);
  }
});

app.delete('/api/contact/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid message id.');
    const item = await ContactMessage.findByIdAndDelete(req.params.id);
    return item ? ok(res, { deleted: true }) : fail(res, 'Message not found.', 404);
  } catch (e) {
    next(e);
  }
});

// ==================== REAL-TIME 1-TO-1 CHAT SYSTEM ====================

const chatMessageLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "You're sending messages too quickly. Please wait a moment." }
});

// Get owner real-time presence
app.get('/api/chat/presence', (_req, res) => {
  ok(res, { online: adminSockets.size > 0 });
});

// Visitor starts or reconnects session
app.post('/api/chat/session', async (req, res, next) => {
  try {
    if (!isDb()) return fail(res, 'Chat is temporarily unavailable.', 503);
    const { visitorToken, name, email, message } = req.body;

    // Reconnecting visitor with existing secure token
    if (visitorToken && typeof visitorToken === 'string') {
      const existingSession = await ChatSession.findOne({ visitorToken });
      if (existingSession) {
        existingSession.lastActiveAt = new Date();
        await existingSession.save();
        const messages = await ChatMessage.find({ sessionId: existingSession._id }).sort({ createdAt: 1 }).limit(100).lean();
        return ok(res, {
          session: existingSession,
          visitorToken: existingSession.visitorToken,
          messages,
          ownerOnline: adminSockets.size > 0
        });
      }
    }

    // New visitor creation
    if (!name?.trim() || !email?.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return fail(res, 'Please provide your name and a valid email address.');
    }

    const token = crypto.randomBytes(24).toString('hex');
    const newSession = await ChatSession.create({
      visitorToken: token,
      visitorId: `vis_${Date.now()}_${token.slice(0, 8)}`,
      visitorName: name.trim(),
      visitorEmail: email.trim().toLowerCase(),
      status: 'active',
      lastMessage: message ? String(message).trim().slice(0, 2000) : '',
      lastMessageAt: new Date(),
      lastActiveAt: new Date(),
      unreadForOwner: message ? 1 : 0,
      unreadForVisitor: 0
    });

    let initialMessages = [];
    if (message && message.trim()) {
      const savedMsg = await ChatMessage.create({
        sessionId: newSession._id,
        sender: 'visitor',
        senderType: 'visitor',
        message: String(message).trim().slice(0, 2000),
        read: false,
        deliveredAt: new Date()
      });
      initialMessages.push(savedMsg);

      // Realtime notification to admins
      io.to('admins').emit('chat:new-session', { session: newSession.toObject() });
      io.to('admins').emit('chat:new-message', {
        sessionId: newSession._id,
        message: savedMsg.toObject(),
        session: newSession.toObject()
      });

      // Email owner safely without blocking chat
      try {
        const emailResult = await sendChatEmailToOwner(newSession, savedMsg);
        if (emailResult && emailResult.id) {
          savedMsg.emailMessageId = emailResult.id;
          await savedMsg.save();
        }
      } catch (err) {
        console.warn('Email notification warning:', err.message);
      }
    } else {
      io.to('admins').emit('chat:new-session', { session: newSession.toObject() });
    }

    ok(res, {
      session: newSession,
      visitorToken: newSession.visitorToken,
      messages: initialMessages,
      ownerOnline: adminSockets.size > 0
    }, 201);
  } catch (e) {
    next(e);
  }
});

// Visitor fetch active session and history by token
app.get('/api/chat/session/:token', async (req, res, next) => {
  try {
    if (!isDb()) return fail(res, 'Chat is temporarily unavailable.', 503);
    const session = await ChatSession.findOne({ visitorToken: req.params.token });
    if (!session) return fail(res, 'Chat session not found or expired.', 404);

    // Mark visitor messages as read when visitor re-opens
    if (session.unreadForVisitor > 0) {
      await ChatMessage.updateMany({ sessionId: session._id, sender: 'owner', read: false }, { $set: { read: true, readAt: new Date() } });
      session.unreadForVisitor = 0;
      await session.save();
    }

    const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 }).limit(150).lean();
    ok(res, {
      session,
      visitorToken: session.visitorToken,
      messages,
      ownerOnline: adminSockets.size > 0
    });
  } catch (e) {
    next(e);
  }
});

// Visitor send message
app.post('/api/chat/session/:token/messages', chatMessageLimiter, async (req, res, next) => {
  try {
    if (!isDb()) return fail(res, 'Chat is temporarily unavailable.', 503);
    const session = await ChatSession.findOne({ visitorToken: req.params.token });
    if (!session) return fail(res, 'Chat session not found.', 404);

    const text = String(req.body.message || '').trim();
    if (!text || text.length === 0) return fail(res, 'Message cannot be empty.');
    if (text.length > 2000) return fail(res, 'Message exceeds 2000 characters limit.');

    const saved = await ChatMessage.create({
      sessionId: session._id,
      sender: 'visitor',
      senderType: 'visitor',
      message: text,
      read: false,
      deliveredAt: new Date(),
      clientTempId: req.body.clientTempId
    });

    session.lastMessage = text;
    session.lastMessageAt = new Date();
    session.lastActiveAt = new Date();
    session.unreadForOwner = (session.unreadForOwner || 0) + 1;
    await session.save();

    const msgObj = saved.toObject();

    // Broadcast to exact conversation room
    io.to(`session:${session._id}`).emit('chat:message', msgObj);

    // Broadcast to admin inbox
    io.to('admins').emit('chat:new-message', {
      sessionId: session._id,
      message: msgObj,
      session: session.toObject(),
      unreadForOwner: session.unreadForOwner
    });

    // Notify owner via email safely without blocking chat
    try {
      const emailResult = await sendChatEmailToOwner(session, saved);
      if (emailResult && emailResult.id) {
        saved.emailMessageId = emailResult.id;
        await saved.save();
      }
    } catch (err) {
      console.warn('Email notification warning:', err.message);
    }

    ok(res, { message: msgObj }, 201);
  } catch (e) {
    next(e);
  }
});

// Visitor marks owner messages as read
app.patch('/api/chat/session/:token/read', async (req, res, next) => {
  try {
    const session = await ChatSession.findOne({ visitorToken: req.params.token });
    if (!session) return fail(res, 'Session not found.', 404);

    await ChatMessage.updateMany(
      { sessionId: session._id, sender: 'owner', read: false },
      { $set: { read: true, readAt: new Date() } }
    );
    session.unreadForVisitor = 0;
    await session.save();

    io.to(`session:${session._id}`).emit('chat:read', { sessionId: session._id, by: 'visitor', readAt: new Date() });
    io.to('admins').emit('chat:read', { sessionId: session._id, by: 'visitor', readAt: new Date() });

    ok(res, { read: true });
  } catch (e) {
    next(e);
  }
});

// ==================== ADMIN CHAT MANAGEMENT ====================
const adminChatRoutes = express.Router();
adminChatRoutes.use(requireAuth);

// Get all visitor conversations with search, unread, and filter
adminChatRoutes.get('/sessions', async (req, res, next) => {
  try {
    const { q, status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (q && String(q).trim()) {
      const sanitizedQ = String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(sanitizedQ, 'i');
      filter.$or = [{ visitorName: regex }, { visitorEmail: regex }, { lastMessage: regex }];
    }

    const sessions = await ChatSession.find(filter).sort({ lastMessageAt: -1, updatedAt: -1 }).limit(150).lean();
    ok(res, sessions);
  } catch (e) {
    next(e);
  }
});

// Get messages for a specific conversation and mark as read
adminChatRoutes.get('/sessions/:id/messages', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid session id.');
    const session = await ChatSession.findById(req.params.id);
    if (!session) return fail(res, 'Session not found.', 404);

    // Mark visitor messages as read
    if (session.unreadForOwner > 0) {
      await ChatMessage.updateMany(
        { sessionId: session._id, sender: 'visitor', read: false },
        { $set: { read: true, readAt: new Date() } }
      );
      session.unreadForOwner = 0;
      await session.save();

      io.to(`session:${session._id}`).emit('chat:read', { sessionId: session._id, by: 'owner', readAt: new Date() });
      io.to('admins').emit('chat:read', { sessionId: session._id, by: 'owner', readAt: new Date() });
    }

    const messages = await ChatMessage.find({ sessionId: req.params.id }).sort({ createdAt: 1 }).limit(300).lean();
    ok(res, { session, messages });
  } catch (e) {
    next(e);
  }
});

// Owner sends reply to visitor
adminChatRoutes.post('/sessions/:id/messages', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid session id.');
    const session = await ChatSession.findById(req.params.id);
    if (!session) return fail(res, 'Session not found.', 404);

    const text = String(req.body.message || '').trim();
    if (!text || text.length === 0) return fail(res, 'Reply message cannot be empty.');
    if (text.length > 2000) return fail(res, 'Reply exceeds 2000 characters limit.');

    const saved = await ChatMessage.create({
      sessionId: session._id,
      sender: 'owner',
      senderType: 'owner',
      message: text,
      read: false,
      deliveredAt: new Date()
    });

    session.lastMessage = text;
    session.lastMessageAt = new Date();
    session.unreadForVisitor = (session.unreadForVisitor || 0) + 1;
    await session.save();

    const msgObj = saved.toObject();

    // Instantly emit to visitor conversation room
    io.to(`session:${session._id}`).emit('chat:message', msgObj);

    // Instantly emit to other admin tabs
    io.to('admins').emit('chat:new-message', {
      sessionId: session._id,
      message: msgObj,
      session: session.toObject()
    });

    ok(res, { message: msgObj }, 201);
  } catch (e) {
    next(e);
  }
});

// Update session status (e.g. active / closed)
adminChatRoutes.patch('/sessions/:id/status', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid session id.');
    const { status } = req.body;
    if (!['active', 'closed', 'open'].includes(status)) return fail(res, 'Invalid status.');

    const session = await ChatSession.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!session) return fail(res, 'Session not found.', 404);

    io.to(`session:${session._id}`).emit('chat:session-updated', { session });
    io.to('admins').emit('chat:session-updated', { session });

    ok(res, session);
  } catch (e) {
    next(e);
  }
});

// Delete conversation (with explicit confirmation)
adminChatRoutes.delete('/sessions/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return fail(res, 'Invalid session id.');
    await ChatMessage.deleteMany({ sessionId: req.params.id });
    const session = await ChatSession.findByIdAndDelete(req.params.id);
    if (!session) return fail(res, 'Session not found.', 404);

    io.to('admins').emit('chat:session-deleted', { sessionId: req.params.id });
    ok(res, { deleted: true });
  } catch (e) {
    next(e);
  }
});

app.use('/api/chat', adminChatRoutes);

// ==================== INBOUND EMAIL WEBHOOK ====================
import { Webhook } from 'svix';

app.post('/api/webhooks/email/inbound', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const payload = req.body.toString();
    const headers = req.headers;
    const secret = process.env.RESEND_WEBHOOK_SECRET;

    if (secret) {
      const wh = new Webhook(secret);
      try {
        wh.verify(payload, headers);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return fail(res, 'Invalid signature.', 400);
      }
    }

    const event = JSON.parse(payload);
    if (event.type !== 'email.received') {
      return ok(res, { received: true, ignored: true });
    }

    const emailData = event.data;
    const inReplyTo = emailData.in_reply_to;
    const messageId = emailData.message_id;
    const subject = emailData.subject || '';

    // Prevent duplicate processing
    if (messageId) {
      const existing = await ChatMessage.findOne({ emailMessageId: messageId });
      if (existing) {
        return ok(res, { received: true, duplicate: true });
      }
    }

    let session = null;
    let references = emailData.references || [];
    
    // Priority 1: Match In-Reply-To
    if (inReplyTo) {
      const originalMessage = await ChatMessage.findOne({ emailMessageId: inReplyTo });
      if (originalMessage) {
        session = await ChatSession.findById(originalMessage.sessionId);
      }
    }

    // Priority 2: Match References
    if (!session && references.length > 0) {
      const originalMessage = await ChatMessage.findOne({ emailMessageId: { $in: references } });
      if (originalMessage) {
        session = await ChatSession.findById(originalMessage.sessionId);
      }
    }

    // Priority 3: Match Subject conversation ID
    if (!session) {
      const match = subject.match(/Conversation ID:\s*([a-f0-9]{24})/i);
      if (match && match[1]) {
        session = await ChatSession.findById(match[1]);
      }
    }
    
    if (!session) {
      console.warn('Inbound email could not be matched to a conversation:', emailData);
      return ok(res, { received: true, matched: false });
    }

    const textContent = emailData.text || '';
    if (!textContent.trim()) {
      return ok(res, { received: true, ignored: true });
    }

    // Attempt to strip previous email quotes. Simple heuristic: keep only lines before original message
    let replyText = textContent;
    const lines = textContent.split(/\r?\n/);
    const replyLines = [];
    for (const line of lines) {
      if (line.trim().startsWith('>')) break;
      if (line.match(/^On .* wrote:$/)) break;
      if (line.match(/--+\s*Original Message\s*--+/)) break;
      replyLines.push(line);
    }
    replyText = replyLines.join('\n').trim();
    if (!replyText) replyText = textContent.trim(); // fallback if too aggressive

    if (replyText.length > 4000) replyText = replyText.slice(0, 4000);

    const saved = await ChatMessage.create({
      sessionId: session._id,
      sender: 'owner',
      senderType: 'owner',
      message: replyText,
      read: false,
      deliveredAt: new Date(),
      emailMessageId: messageId,
      inReplyTo,
      references
    });

    session.lastMessage = replyText;
    session.lastMessageAt = new Date();
    session.unreadForVisitor = (session.unreadForVisitor || 0) + 1;
    await session.save();

    const msgObj = saved.toObject();
    io.to(`session:${session._id}`).emit('chat:message', msgObj);
    io.to('admins').emit('chat:new-message', {
      sessionId: session._id,
      message: msgObj,
      session: session.toObject()
    });

    // Optionally send copy to visitor
    await sendChatEmailToVisitor(session, saved, inReplyTo);

    return ok(res, { received: true, matched: true, messageId: saved._id });
  } catch (e) {
    next(e);
  }
});

// ==================== SOCKET.IO HANDLERS ====================
io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie || '';
  const tokenFromCookie = cookieHeader.split(';').map(v => v.trim()).find(v => v.startsWith('adminToken='))?.slice('adminToken='.length);
  const token = socket.handshake.auth?.token || tokenFromCookie;
  if (token && process.env.JWT_SECRET) {
    try {
      socket.data.admin = jwt.verify(decodeURIComponent(token), process.env.JWT_SECRET);
    } catch {}
  }
  next();
});

io.on('connection', socket => {
  // Visitor joins their dedicated private room
  socket.on('visitor:init', async ({ visitorToken, sessionId }) => {
    try {
      let targetId = sessionId;
      if (!targetId && visitorToken) {
        const s = await ChatSession.findOne({ visitorToken });
        if (s) targetId = s._id;
      }
      if (targetId && mongoose.isValidObjectId(targetId)) {
        socket.join(`session:${targetId}`);
        socket.emit('owner:presence', { online: adminSockets.size > 0 });
      }
    } catch {}
  });

  socket.on('chat:join', id => {
    if (typeof id === 'string' && mongoose.isValidObjectId(id)) {
      socket.join(`session:${id}`);
      socket.emit('owner:presence', { online: adminSockets.size > 0 });
    }
  });

  // Admin joins management room and registers presence
  socket.on('admin:join', () => {
    if (socket.data.admin?.role === 'admin' || socket.handshake.auth?.isAdmin) {
      socket.join('admins');
      adminSockets.add(socket.id);
      broadcastPresence();
    }
  });

  // Typing indicators
  socket.on('chat:typing', ({ sessionId, typing, sender }) => {
    if (typeof sessionId === 'string' && mongoose.isValidObjectId(sessionId)) {
      socket.to(`session:${sessionId}`).emit('chat:typing', {
        sessionId,
        typing: Boolean(typing),
        sender: sender || 'owner'
      });
      // Also notify other admins if sent by visitor
      if (sender === 'visitor') {
        socket.to('admins').emit('chat:typing', { sessionId, typing: Boolean(typing), sender: 'visitor' });
      }
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    if (adminSockets.has(socket.id)) {
      adminSockets.delete(socket.id);
      broadcastPresence();
    }
  });
});

// Error handling
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500;
  res.status(status).json({ success: false, message: status === 400 ? err.message : 'Something went wrong.' });
});

const port = Number(process.env.PORT || 5000);
connectDB().then(async connected => {
  if (connected) {
    await seedContent().catch(e => console.error('Seed data:', e.message));
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.JWT_SECRET && !await Admin.exists({ email: process.env.ADMIN_EMAIL.toLowerCase() })) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await Admin.create({
        name: process.env.ADMIN_NAME || 'Portfolio Admin',
        email: process.env.ADMIN_EMAIL.toLowerCase(),
        passwordHash
      });
    }
  }
  server.listen(port, () => console.log(`Portfolio API listening on ${port}`));
}).catch(err => {
  console.error('Database connection failed:', err.message);
  process.exit(1);
});
