
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

let GoogleGenAI;
try {
  const genAIModule = require("@google/genai");
  GoogleGenAI = genAIModule.GoogleGenAI;
} catch (e) {
  console.warn("⚠️ Google GenAI module not found.");
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

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json({ limit: '10mb' }));

// --- SCHEMAS ---
const JobSchema = new mongoose.Schema({
  _id: String,
  employerId: String,
  title: String,
  company: String,
  companyLogo: String,
  location: String,
  salaryMin: Number,
  salaryMax: Number,
  currency: { type: String, default: 'AFN' },
  type: String,
  experienceLevel: String,
  category: String,
  postedDate: String,
  deadline: String,
  description: String,
  requirements: [String],
  responsibilities: [String],
  status: { type: String, default: 'Active' },
  isUrgent: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  applyMethod: { type: String, default: 'Internal' },
  applyUrl: String,
  vacancyNumber: String,
  noOfJobs: Number,
  contractDuration: String,
  contractExtensible: Boolean,
  probationPeriod: String,
  gender: String,
  education: String,
  nationality: String,
  yearsOfExperience: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  _id: String,
  firstName: String,
  lastName: String,
  name: String,
  email: { type: String, unique: true },
  role: String,
  avatar: String,
  bio: String,
  jobTitle: String,
  phone: String,
  address: String,
  password: { type: String, required: true },
  plan: { type: String, default: 'Free' },
  status: { type: String, default: 'Active' },
  verificationStatus: { type: String, default: 'Unverified' },
  verificationDocument: String,
  verifiedSkills: [String],
  savedCandidates: [String],
  documents: [{
    _id: String,
    name: String,
    type: String,
    data: String,
    date: String,
    size: String
  }]
}, { _id: false });

const ApplicationSchema = new mongoose.Schema({
  _id: String,
  jobId: String,
  seekerId: String,
  status: { type: String, default: 'Applied' },
  date: String,
  resumeUrl: String,
  resumeData: String,
  coverLetter: String,
  interviewDate: String,
  interviewTime: String,
  interviewMessage: String,
  rejectionReason: String,
  screeningAnswers: [{ question: String, answer: String }]
}, { _id: false });

const Job = mongoose.model('Job', JobSchema);
const User = mongoose.model('User', UserSchema);
const Application = mongoose.model('Application', ApplicationSchema);

// --- DB CONNECTION ---
let isDbConnected = false;
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("⚠️ MONGO_URI missing. Running in DEMO mode.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isDbConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
};
connectDB();

// --- API ROUTES ---

app.get('/api/health', (req, res) => res.json({ status: 'OK', db: isDbConnected }));

app.post('/api/register', async (req, res) => {
    try {
        const { _id, password, ...rest } = req.body;
        const userId = _id || Date.now().toString();
        
        if (!isDbConnected) {
            return res.status(201).json({ ...rest, _id: userId, status: 'Active' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ _id: userId, ...rest, password: hashedPassword });
        await user.save();
        
        const { password: _, ...userData } = user.toObject();
        res.status(201).json(userData);
    } catch (e) {
        console.error("Registration Error:", e);
        res.status(500).json({ message: "Registration failed: " + e.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (!isDbConnected) {
            return res.status(200).json({ email, role, name: 'Demo User', _id: 'demo-user', plan: 'Premium', status: 'Active' });
        }
        const user = await User.findOne({ email });
        if (!user || user.role !== role) return res.status(401).json({ message: "Invalid credentials." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });
        
        const { password: _, ...userData } = user.toObject();
        res.json(userData);
    } catch (e) {
        res.status(500).json({ message: "Server error during login." });
    }
});

app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = isDbConnected ? await Job.find() : [];
        res.json(jobs);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/jobs', async (req, res) => {
    try {
        const { _id, ...rest } = req.body;
        const jobId = _id || Date.now().toString();
        
        if (!isDbConnected) return res.json({ _id: jobId, ...rest });
        
        const job = new Job({ _id: jobId, ...rest });
        await job.save();
        res.status(201).json(job);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/applications', async (req, res) => {
    try {
        const apps = isDbConnected ? await Application.find() : [];
        res.json(apps);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = isDbConnected ? await User.find().select('-password') : [];
        res.json(users);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    try {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) return res.status(500).json(error);
            res.json({ url: result.secure_url });
        }).end(req.file.buffer);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, model = 'gemini-3-flash-preview' } = req.body;
    if (!aiClient) return res.status(503).json({ text: "AI service currently unavailable." });
    const response = await aiClient.models.generateContent({ model, contents: prompt });
    res.json({ text: response.text });
  } catch (error) { res.status(500).json({ error: "AI proxy failed." }); }
});

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on port ${PORT}`));
