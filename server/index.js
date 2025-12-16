
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');
const { GoogleGenAI } = require("@google/genai");
const path = require('path');

const app = express();

// --- CONFIGURATION ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() }); 
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
  resumeData: String, 
  resumeUrl: String, 
  plan: String, status: String,
  isVerified: { type: Boolean, default: false }, verificationToken: String,
  verificationStatus: { type: String, default: 'Unverified' },
  verificationDocument: String, jobTitle: String, phone: String, country: String, city: String,
  address: String, dob: String, website: String, industry: String, companyDetails: Object,
  youtubeUrl: String, banner: String, socialLinks: Object, gallery: [String], verifiedSkills: [String],
  experience: Array, education: Array, documents: Array, settings: Object, following: [String], savedCandidates: [String]
});

const ApplicationSchema = new mongoose.Schema({
  id: String, jobId: String, seekerId: String, employerId: String, 
  resumeUrl: String, coverLetter: String, status: String, date: String, interviewDate: String,
  interviewTime: String, interviewMessage: String, employerNotes: String,
  employerRating: Number, timeline: Array, screeningAnswers: Array, rejectionReason: String
});

const Job = mongoose.model('Job', JobSchema);
const User = mongoose.model('User', UserSchema);
const Application = mongoose.model('Application', ApplicationSchema);

// --- DB CONNECTION ---
const connectDB = async () => {
  // If running locally without Mongo, don't crash
  if (!process.env.MONGO_URI) {
    console.log("⚠️ MONGO_URI missing. Using in-memory mode (data will not persist).");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
  }
};
connectDB();

// --- HELPER: CLOUDINARY UPLOAD ---
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "afghan_job_finder" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// --- API ROUTES ---

app.get('/api/health', (req, res) => {
    res.send('Afghan Job Finder Backend is Running!');
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });
    const result = await streamUpload(req.file.buffer);
    res.json({ url: result.secure_url, public_id: result.public_id, format: result.format });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, model = 'gemini-2.5-flash', config } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ text: "AI Service Unavailable" });
    const response = await aiClient.models.generateContent({ model, contents: prompt, config });
    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "AI Generation Failed" });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found." });
    if (user.role !== role) return res.status(403).json({ message: `Access denied. This account is for ${user.role}s.` });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const { password: _, ...userData } = user.toObject();
      res.json(userData);
    } else {
      res.status(401).json({ message: "Invalid password." });
    }
  } catch (e) { res.status(500).json({ message: "Login error" }); }
});

app.post('/api/register', async (req, res) => {
  try {
    const { password, email, ...otherData } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({ ...otherData, email, password: hashedPassword });
    await newUser.save();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: "Registration failed: " + e.message }); }
});

app.get('/api/jobs', async (req, res) => {
  try { const jobs = await Job.find().sort({ postedDate: -1 }); res.json(jobs); } 
  catch(e) { res.status(500).json({error: e.message}) }
});
app.post('/api/jobs', async (req, res) => {
  try { const newJob = new Job(req.body); await newJob.save(); res.json(newJob); } 
  catch(e) { res.status(400).json({error: e.message}) }
});
app.put('/api/jobs/:id', async (req, res) => {
  try { await Job.findOneAndUpdate({ id: req.params.id }, req.body); res.json({success:true}); } 
  catch(e) { res.status(500).json({error: e.message}) }
});
app.delete('/api/jobs/:id', async (req, res) => {
  try { await Job.deleteOne({ id: req.params.id }); res.json({ success: true }); } 
  catch(e) { res.status(500).json({error: e.message}) }
});

app.get('/api/users', async (req, res) => {
  try { const users = await User.find().select('-password'); res.json(users); } 
  catch(e) { res.status(500).json({error: e.message}) }
});
app.put('/api/users/:id', async (req, res) => {
  try {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    await User.findOneAndUpdate({ id: req.params.id }, req.body);
    res.json({ success: true });
  } catch(e) { res.status(500).json({error: e.message}) }
});

app.get('/api/applications', async (req, res) => {
  try { const apps = await Application.find(); res.json(apps); } 
  catch(e) { res.status(500).json({error: e.message}) }
});
app.post('/api/applications', async (req, res) => {
  try { const newApp = new Application(req.body); await newApp.save(); res.json(newApp); } 
  catch(e) { res.status(400).json({error: e.message}) }
});
app.put('/api/applications/:id', async (req, res) => {
  try { await Application.findOneAndUpdate({ id: req.params.id }, req.body); res.json({ success: true }); } 
  catch(e) { res.status(500).json({error: e.message}) }
});

app.post('/api/upload-verification', async (req, res) => {
    res.json({success: true}); 
});

// --- SERVE FRONTEND (STATIC FILES) ---
// This serves the React build files
app.use(express.static(path.join(__dirname, '../dist')));

// Handle all other routes by returning the React app (Client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
