require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const path = require('path');

let GoogleGenAI;
try {
  const genAIModule = require("@google/genai");
  GoogleGenAI = genAIModule.GoogleGenAI;
} catch (e) {
  console.warn("⚠️ Google GenAI module not found. AI features will be disabled.");
}

const app = express();

// --- CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() }); 
const aiClient = (process.env.GEMINI_API_KEY && GoogleGenAI)
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) 
  : null;

// --- MIDDLEWARE ---
app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// --- SCHEMAS ---
const JobSchema = new mongoose.Schema({
  id: String, employerId: String, title: String, company: String, companyLogo: String,
  location: String, salaryMin: Number, salaryMax: Number, currency: String, type: String,
  experienceLevel: String, category: String, postedDate: String, deadline: String,
  description: String, requirements: [String], responsibilities: [String], status: String,
  applyMethod: String, applyUrl: String, isFeatured: Boolean, isUrgent: Boolean,
  vacancyNumber: String, noOfJobs: Number, contractDuration: String, contractExtensible: Boolean,
  probationPeriod: String, gender: String, education: String, nationality: String, yearsOfExperience: String
});

const UserSchema = new mongoose.Schema({
  id: String, firstName: String, lastName: String, name: String,
  email: { type: String, unique: true }, role: String, avatar: String, bio: String, title: String,
  password: { type: String, required: true }, 
  resumeData: String, resumeUrl: String, plan: String, status: String,
  isVerified: { type: Boolean, default: false }, verificationStatus: { type: String, default: 'Unverified' },
  verificationDocument: String, jobTitle: String, phone: String, city: String, address: String,
  website: String, industry: String, youtubeUrl: String, banner: String, verifiedSkills: [String]
});

const ApplicationSchema = new mongoose.Schema({
  id: String, jobId: String, seekerId: String, employerId: String, 
  resumeUrl: String, status: String, date: String, timeline: Array
});

const Job = mongoose.model('Job', JobSchema);
const User = mongoose.model('User', UserSchema);
const Application = mongoose.model('Application', ApplicationSchema);

// --- DB CONNECTION ---
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.log("⚠️ MONGO_URI missing. Using in-memory mode.");
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    if (err.message.includes('ENOTFOUND') || err.message.includes('SRV')) {
      console.error("💡 HINT: DNS SRV resolution failed. Your host cannot resolve the MongoDB cluster URL.");
      console.error("👉 FIX: Try using a standard connection string (mongodb://) instead of (mongodb+srv://).");
    }
    console.log("⚠️ Continuing in 'in-memory' mode.");
  }
};
connectDB();

// --- API ROUTES ---
app.get('/api/health', (req, res) => res.send('API Active'));

app.get('/api/jobs', async (req, res) => {
  try { 
      if (mongoose.connection.readyState !== 1) return res.json([]);
      const jobs = await Job.find({ status: 'Active' }).sort({ postedDate: -1 }); 
      res.json(jobs); 
  } catch(e) { res.status(500).json({error: e.message}) }
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, model = 'gemini-3-flash-preview', config } = req.body;
    if (!aiClient) return res.status(503).json({ text: "AI Service Unavailable" });
    const response = await aiClient.models.generateContent({ model, contents: prompt, config });
    res.json({ text: response.text });
  } catch (error) {
    res.status(500).json({ error: "AI Generation Failed" });
  }
});

// --- SERVE FRONTEND ---
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({error: 'API Not Found'});
    res.sendFile(path.join(distPath, 'index.html'));
});

// --- SERVER START ---
const PORT = process.env.PORT || 5050; 
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} (PID: ${process.pid})`);
});
