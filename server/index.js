// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const helmet = require('helmet');
// const cloudinary = require('cloudinary').v2;
// const multer = require('multer');
// const streamifier = require('streamifier');
// const path = require('path');

// let GoogleGenAI;
// try {
//   const genAIModule = require("@google/genai");
//   GoogleGenAI = genAIModule.GoogleGenAI;
// } catch (e) {
//   console.warn("⚠️ Google GenAI module not found. AI features will be disabled.");
// }

// const app = express();

// // --- CONFIGURATION ---
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const upload = multer({ storage: multer.memoryStorage() }); 
// const aiClient = (process.env.GEMINI_API_KEY && GoogleGenAI)
//   ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) 
//   : null;

// // --- MIDDLEWARE ---
// app.use(helmet({
//   contentSecurityPolicy: false, 
// }));
// app.use(cors({
//     origin: '*', 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json({ limit: '10mb' }));

// // --- SCHEMAS ---
// const JobSchema = new mongoose.Schema({
//   id: String, employerId: String, title: String, company: String, companyLogo: String,
//   location: String, salaryMin: Number, salaryMax: Number, currency: String, type: String,
//   experienceLevel: String, category: String, postedDate: String, deadline: String,
//   description: String, requirements: [String], responsibilities: [String], status: String,
//   applyMethod: String, applyUrl: String, isFeatured: Boolean, isUrgent: Boolean,
//   vacancyNumber: String, noOfJobs: Number, contractDuration: String, contractExtensible: Boolean,
//   probationPeriod: String, gender: String, education: String, nationality: String, yearsOfExperience: String
// });

// const UserSchema = new mongoose.Schema({
//   id: String, firstName: String, lastName: String, name: String,
//   email: { type: String, unique: true }, role: String, avatar: String, bio: String, title: String,
//   password: { type: String, required: true }, 
//   resumeData: String, resumeUrl: String, plan: String, status: String,
//   isVerified: { type: Boolean, default: false }, verificationStatus: { type: String, default: 'Unverified' },
//   verificationDocument: String, jobTitle: String, phone: String, city: String, address: String,
//   website: String, industry: String, youtubeUrl: String, banner: String, verifiedSkills: [String]
// });

// const ApplicationSchema = new mongoose.Schema({
//   id: String, jobId: String, seekerId: String, employerId: String, 
//   resumeUrl: String, resumeData: String, status: String, date: String, timeline: Array
// });

// const Job = mongoose.model('Job', JobSchema);
// const User = mongoose.model('User', UserSchema);
// const Application = mongoose.model('Application', ApplicationSchema);

// // --- DB CONNECTION ---
// const connectDB = async () => {
//   const uri = process.env.MONGO_URI;
//   if (!uri) {
//     console.log("⚠️ MONGO_URI missing. Using in-memory mode.");
//     return;
//   }
//   try {
//     await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
//     console.log("✅ Connected to MongoDB");
//   } catch (err) {
//     console.error("❌ MongoDB Error:", err.message);
//     console.log("⚠️ Continuing in 'in-memory' mode.");
//   }
// };
// connectDB();

// // --- API ROUTES ---
// app.get('/api/health', (req, res) => res.send('API Active'));

// // GET all jobs
// app.get('/api/jobs', async (req, res) => {
//   try { 
//       if (mongoose.connection.readyState !== 1) return res.json([]);
//       const jobs = await Job.find({ status: 'Active' }).sort({ postedDate: -1 }); 
//       res.json(jobs); 
//   } catch(e) { res.status(500).json({error: e.message}) }
// });

// // POST a job
// app.post('/api/jobs', async (req, res) => {
//     try {
//         const job = new Job(req.body);
//         await job.save();
//         res.status(201).json(job);
//     } catch (e) { res.status(400).json({ error: e.message }); }
// });

// // GET all users (Admin/Search)
// app.get('/api/users', async (req, res) => {
//     try {
//         if (mongoose.connection.readyState !== 1) return res.json([]);
//         const users = await User.find().select('-password');
//         res.json(users);
//     } catch (e) { res.status(500).json({ error: e.message }); }
// });

// // GET all applications
// app.get('/api/applications', async (req, res) => {
//     try {
//         if (mongoose.connection.readyState !== 1) return res.json([]);
//         const apps = await Application.find();
//         res.json(apps);
//     } catch (e) { res.status(500).json({ error: e.message }); }
// });

// // Auth: Login
// app.post('/api/login', async (req, res) => {
//     const { email, password, role } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user || user.role !== role) return res.status(401).json({ message: "Invalid credentials." });
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (isMatch) {
//             const { password: _, ...userData } = user.toObject();
//             res.json(userData);
//         } else {
//             res.status(401).json({ message: "Invalid credentials." });
//         }
//     } catch (e) { res.status(500).json({ message: "Login error" }); }
// });

// // Auth: Register
// app.post('/api/register', async (req, res) => {
//     try {
//         const { password, ...rest } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = new User({ ...rest, password: hashedPassword });
//         await user.save();
//         const { password: _, ...userData } = user.toObject();
//         res.status(201).json(userData);
//     } catch (e) { res.status(400).json({ message: e.message }); }
// });

// // AI Generation
// app.post('/api/ai/generate', async (req, res) => {
//   try {
//     const { prompt, model = 'gemini-3-flash-preview', config } = req.body;
//     if (!aiClient) return res.status(503).json({ text: "AI Service Unavailable" });
//     const response = await aiClient.models.generateContent({ model, contents: prompt, config });
//     res.json({ text: response.text });
//   } catch (error) {
//     res.status(500).json({ error: "AI Generation Failed" });
//   }
// });

// // --- SERVE FRONTEND ---
// const distPath = path.join(__dirname, '../dist');
// app.use(express.static(distPath));

// // Catch-all must be the LAST route
// app.get('*', (req, res) => {
//     if (req.path.startsWith('/api')) return res.status(404).json({error: 'API Not Found'});
//     res.sendFile(path.join(distPath, 'index.html'));
// });

// // --- SERVER START ---
// const PORT = process.env.PORT || 5050; 
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`🚀 Server running on port ${PORT} (PID: ${process.pid})`);
// });


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
} catch {
  console.warn("⚠️ Google GenAI disabled");
}

const app = express();
const api = express.Router(); // ✅ NEW: isolate API

// --- CONFIG ---
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
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'] }));
app.use(express.json({ limit: '10mb' }));

// 🔒 API ONLY JSON GUARANTEE
api.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// --- SCHEMAS ---
const JobSchema = new mongoose.Schema({ status: String }, { strict: false });
const UserSchema = new mongoose.Schema({ password: String }, { strict: false });
const ApplicationSchema = new mongoose.Schema({}, { strict: false });

const Job = mongoose.model('Job', JobSchema);
const User = mongoose.model('User', UserSchema);
const Application = mongoose.model('Application', ApplicationSchema);

// --- DB ---
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (e) {
    console.error("❌ MongoDB failed:", e.message);
  }
})();

// --- API ROUTES ---
api.get('/health', (_, res) => res.json({ status: 'API Active' }));

api.get('/jobs', async (req, res) => {
  console.log('📡 /api/jobs hit'); // ✅ DEBUG LINE
  if (mongoose.connection.readyState !== 1) return res.json([]);
  const jobs = await Job.find({ status: 'Active' }).sort({ postedDate: -1 });
  res.json(jobs);
});

api.post('/jobs', async (req, res) => {
  const job = await new Job(req.body).save();
  res.status(201).json(job);
});

api.get('/users', async (_, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);
  res.json(await User.find().select('-password'));
});

api.get('/applications', async (_, res) => {
  if (mongoose.connection.readyState !== 1) return res.json([]);
  res.json(await Application.find());
});

api.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ message: 'Invalid' });
  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid' });
  const { password, ...safe } = user.toObject();
  res.json(safe);
});

api.post('/register', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = await new User({ ...req.body, password: hash }).save();
  const { password, ...safe } = user.toObject();
  res.status(201).json(safe);
});

// ✅ MOUNT API
app.use('/api', api);

// --- FRONTEND ---
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// ❗ ABSOLUTE FINAL CATCH
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// --- START ---
const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`🚀 Running on ${PORT}`)
);
