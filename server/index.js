
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
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
}); 

const aiClient = (process.env.API_KEY && GoogleGenAI)
  ? new GoogleGenAI({ apiKey: process.env.API_KEY }) 
  : null;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(express.json({ limit: '20mb' }));

// --- SCHEMAS ---
const OTPSchema = new mongoose.Schema({
    email: String,
    code: String,
    createdAt: { type: Date, default: Date.now, expires: 600 } // 10 mins
});

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
  status: { type: String, default: 'Pending' }, // Defaults to Pending for OTP
  verificationStatus: { type: String, default: 'Unverified' },
  verificationDocument: String,
  verifiedSkills: [String],
  savedCandidates: [String],
  resumeUrl: String,
  resume: String,
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
const OTP = mongoose.model('OTP', OTPSchema);

// --- DB CONNECTION ---
let isDbConnected = false;
const connectDB = async () => {
  if (!process.env.MONGO_URI) return;
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

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, ...rest } = req.body;
        if (!isDbConnected) return res.status(201).json({ ...rest, email, _id: Date.now().toString(), status: 'Active' });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "You already have an account with us. Please log in or reset your password if you forgot it." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now().toString();
        const user = new User({ _id: userId, email, ...rest, password: hashedPassword, status: 'Pending' });
        await user.save();

        // Generate OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.create({ email, code });
        
        console.log(`[MOCK EMAIL] To: ${email}, OTP: ${code}`); // Mocking email send

        res.status(201).json({ message: "OTP sent", requireVerification: true, email });
    } catch (e) {
        res.status(500).json({ message: "Registration failed" });
    }
});

app.post('/api/verify-email', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const record = await OTP.findOne({ email, code: otp });
        if (!record) return res.status(400).json({ message: "Invalid or expired OTP." });

        await User.findOneAndUpdate({ email }, { status: 'Active' });
        await OTP.deleteOne({ _id: record._id });

        const user = await User.findOne({ email }).select('-password');
        res.json({ user, success: true });
    } catch (e) {
        res.status(500).json({ message: "Verification failed." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        if (!isDbConnected) return res.status(200).json({ email, role, name: 'Demo User', _id: 'demo-user', plan: 'Premium', status: 'Active' });

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "We couldn't find an account with that email. Let's get you registered!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password. Please check your credentials and try again." });
        }

        if (user.status === 'Pending') {
            return res.status(403).json({ message: "Please verify your email before logging in.", requireVerification: true });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: `This account is registered as an ${user.role}.` });
        }
        
        const { password: _, ...userData } = user.toObject();
        res.json(userData);
    } catch (e) {
        res.status(500).json({ message: "Login failed." });
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
        if (!isDbConnected) return res.json({ _id: _id || Date.now().toString(), ...rest });
        const job = await Job.findOneAndUpdate({ _id: _id }, rest, { upsert: true, new: true });
        res.status(201).json(job);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/jobs/:id', async (req, res) => {
    try {
        if (isDbConnected) await Job.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = isDbConnected ? await User.find().select('-password') : [];
        res.json(users);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        if (isDbConnected) await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/applications', async (req, res) => {
    try {
        const apps = isDbConnected ? await Application.find() : [];
        res.json(apps);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    try {
        if (!isCloudinaryConfigured) {
            const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            return res.json({ url: dataUrl });
        }
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
            if (error) return res.status(500).json({ error: "Upload failed" });
            res.json({ url: result.secure_url });
        }).end(req.file.buffer);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API Not Found' });
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on port ${PORT}`));
