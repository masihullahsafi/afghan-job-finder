
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

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

// SMTP Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify SMTP Connection at startup
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter.verify((error, success) => {
        if (error) console.error("❌ SMTP Verification Failed:", error.message);
        else console.log("✅ SMTP Server is ready to send emails");
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
  email: { type: String, unique: true, lowercase: true, trim: true },
  role: String,
  avatar: String,
  bio: String,
  jobTitle: String,
  phone: String,
  address: String,
  password: { type: String, required: true },
  plan: { type: String, default: 'Free' },
  status: { type: String, default: 'Pending' }, 
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
  if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI missing. Check your .env file.");
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

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, ...rest } = req.body;
        const normalizedEmail = email.toLowerCase().trim();
        
        if (!isDbConnected) {
             return res.status(201).json({ ...rest, email: normalizedEmail, _id: Date.now().toString(), status: 'Active' });
        }

        // 1. Initial check for existing user
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ 
                message: "This email is already registered. Please log in." 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now().toString();
        const user = new User({ _id: userId, email: normalizedEmail, ...rest, password: hashedPassword, status: 'Pending' });
        
        // 2. Save user - Wrap in specific catch for E11000 duplicate keys
        try {
            await user.save();
        } catch (saveErr) {
            if (saveErr.code === 11000) {
                return res.status(409).json({ message: "This email is already registered." });
            }
            throw saveErr;
        }

        // 3. Generate and Save OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await OTP.findOneAndUpdate({ email: normalizedEmail }, { code }, { upsert: true });
        
        // 4. Send Real Email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await transporter.sendMail({
                    from: `"Afghan Job Finder" <${process.env.EMAIL_USER}>`,
                    to: normalizedEmail,
                    subject: "Your Verification Code",
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
                            <h2 style="color: #0284c7;">Email Verification</h2>
                            <p>Thank you for joining Afghan Job Finder. Please use the following 6-digit code to verify your account:</p>
                            <div style="background: #f0f9ff; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0c4a6e; text-align: center; padding: 20px; margin: 20px 0; border-radius: 10px; border: 1px solid #bae6fd;">
                                ${code}
                            </div>
                            <p style="font-size: 13px; color: #666;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                        </div>`
                });
                console.log(`✅ Verification email sent to ${normalizedEmail}`);
            } catch (mailErr) {
                console.error(`❌ Mail delivery failed to ${normalizedEmail}:`, mailErr.message);
                // We don't return 500 here so the user can still try to verify if they saw the code in logs
            }
        } else {
            console.warn(`⚠️ EMAIL_USER/PASS missing. OTP for ${normalizedEmail}: ${code}`);
        }

        res.status(201).json({ message: "OTP sent", requireVerification: true, email: normalizedEmail });
    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
});

app.post('/api/verify-email', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const normalizedEmail = email.toLowerCase().trim();
        const record = await OTP.findOne({ email: normalizedEmail, code: otp });
        if (!record) return res.status(400).json({ message: "Invalid or expired verification code." });

        const user = await User.findOneAndUpdate({ email: normalizedEmail }, { status: 'Active' }, { new: true }).select('-password');
        await OTP.deleteOne({ _id: record._id });

        res.json({ user, success: true });
    } catch (e) {
        res.status(500).json({ message: "Verification failed." });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const normalizedEmail = email.toLowerCase().trim();
        if (!isDbConnected) return res.status(200).json({ email: normalizedEmail, role, name: 'Demo User', _id: 'demo-user', plan: 'Premium', status: 'Active' });

        const user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            return res.status(404).json({ message: "No account found with this email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        if (user.status === 'Pending') {
            return res.status(403).json({ message: "Your account is not verified.", requireVerification: true, email: user.email });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: `Access denied. This account is registered as ${user.role}.` });
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
