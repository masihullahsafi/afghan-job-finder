
export type Language = 'en' | 'fa' | 'ps';

export enum UserRole {
  SEEKER = 'SEEKER',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN'
}

export interface Experience {
  _id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  _id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

export interface UserDocument {
  _id: string;
  name: string;
  type: 'Resume' | 'Certificate' | 'Cover Letter' | 'Other';
  data: string; // URL or Base64
  date: string;
  size?: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  publicProfile: boolean;
  showContactInfo: boolean;
}

export interface User {
  _id: string;
  firstName?: string; 
  lastName?: string;  
  name: string;
  email: string;
  role: UserRole;
  password?: string; 
  avatar?: string;
  resume?: string;      // Filename
  resumeData?: string;  // Base64 Data
  resumeUrl?: string;   // Cloudinary URL or Link
  phone?: string;
  mobile?: string; 
  country?: string; 
  city?: string;    
  dob?: string;     
  address?: string;
  jobTitle?: string;
  bio?: string;
  status?: 'Active' | 'Pending' | 'Suspended';
  isVerified?: boolean; 
  verificationStatus?: 'Unverified' | 'Pending' | 'Verified'; 
  verificationDocument?: string; 
  website?: string;
  description?: string;
  industry?: string;
  plan?: 'Free' | 'Standard' | 'Premium';
  verifiedSkills?: string[]; 
  following?: string[]; 
  savedCandidates?: string[]; 
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  banner?: string; 
  gallery?: string[]; 
  youtubeUrl?: string; 
  experience?: Experience[];
  education?: Education[];
  documents?: UserDocument[]; 
  messageTemplates?: { _id: string; name: string; content: string }[];
  settings?: UserSettings; 
}

export interface Job {
  _id: string;
  employerId?: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string; 
  salaryMin: number;
  salaryMax: number;
  currency: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  category: string;
  postedDate: string;
  deadline: string; 
  description: string;
  requirements: string[];
  responsibilities: string[];
  isFeatured: boolean;
  isUrgent?: boolean;
  status: 'Active' | 'Closed' | 'Pending' | 'Rejected';
  screeningQuestions?: string[];
  applyMethod?: 'Internal' | 'External' | 'Email';
  applyUrl?: string; 
  vacancyNumber?: string;
  noOfJobs?: number;
  contractDuration?: string;
  contractExtensible?: boolean;
  probationPeriod?: string;
  gender?: 'Male' | 'Female' | 'Any';
  education?: string;
  nationality?: string;
  yearsOfExperience?: string; 
}

export interface ApplicationTimeline {
  status: string;
  date: string;
  note?: string;
}

export interface Application {
  _id: string;
  jobId: string;
  seekerId: string;
  resumeUrl: string;
  resumeData?: string; 
  coverLetter: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
  date: string;
  screeningAnswers?: { question: string; answer: string }[];
  interviewDate?: string;
  interviewTime?: string;
  interviewMessage?: string;
  rejectionReason?: string; 
  timeline?: ApplicationTimeline[];
}

export interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  authorId?: string; 
  role: string;
  image: string;
  category: string;
  readTime: string;
  status: 'Published' | 'Pending' | 'Rejected';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface CommunityPost {
  _id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: UserRole;
  content: string;
  image?: string;
  likes: string[]; 
  comments: any[];
  timestamp: string;
}

export interface SystemAnnouncement {
  _id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Success' | 'Urgent';
  targetAudience: 'All' | 'Seekers' | 'Employers';
  createdAt: string;
  isActive: boolean;
}

export interface Event {
  _id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  type: 'Online' | 'In-Person';
  location: string;
  description: string;
  image: string;
  attendees: number;
  category: string;
}

export interface Report {
  _id: string;
  jobId: string;
  reason: string;
  details: string;
  status: 'Pending' | 'Resolved';
  date: string;
}

export interface Review {
  _id: string;
  companyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  relatedJobId?: string;
}

export interface InterviewSession {
  _id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  date: string;
  transcript: {
    question: string;
    answer: string;
    feedback: string;
  }[];
  score: number; 
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; 
}

export interface JobAlert {
  _id: string;
  userId: string;
  keyword?: string;
  location?: string;
  category?: string;
  type?: string;
  frequency: 'Daily' | 'Weekly' | 'Instant';
  isActive: boolean;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
}

export interface ActivityLog {
  _id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

// Fixed: Export TranslationDictionary interface
export interface TranslationDictionary {
  [key: string]: {
    [key in Language]: string;
  };
}
