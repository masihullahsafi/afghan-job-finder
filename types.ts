
export type Language = 'en' | 'fa' | 'ps';

export enum UserRole {
  SEEKER = 'SEEKER',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN'
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
}

export interface UserDocument {
  id: string;
  name: string;
  type: 'Resume' | 'Certificate' | 'Cover Letter' | 'Other';
  data: string; // Base64
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
  id: string;
  firstName?: string; 
  lastName?: string;  
  name: string;
  email: string;
  role: UserRole;
  password?: string; 
  avatar?: string;
  resume?: string;
  resumeData?: string; 
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
  verificationDocument?: string; // New: Stores Base64 of license
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
  messageTemplates?: { id: string; name: string; content: string }[];
  settings?: UserSettings; 
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  employeeCount: string;
  foundedYear: string;
}

export interface Job {
  id: string;
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
  
  // Detailed Fields
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
  id: string;
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
  interviewLocation?: string;
  employerNotes?: string;
  employerRating?: number; 
  timeline?: ApplicationTimeline[]; 
  rejectionReason?: string; 
}

export interface JobAlert {
  id: string;
  seekerId: string;
  keyword: string;
  location: string;
  category: string;
  frequency: 'Daily' | 'Weekly' | 'Instant';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Alert' | 'Application' | 'System';
  isRead: boolean;
  date: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  relatedJobId?: string;
}

export interface Report {
  id: string;
  jobId: string;
  reason: string;
  details: string;
  status: 'Pending' | 'Resolved';
  date: string;
}

export interface Review {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; 
}

export interface InterviewSession {
  id: string;
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

export interface BlogPost {
  id: number;
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

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    fa: string;
    ps: string;
  };
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: UserRole;
  content: string;
  image?: string;
  likes: string[]; 
  comments: Comment[];
  timestamp: string;
}

export interface SystemAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Success' | 'Urgent';
  targetAudience: 'All' | 'Seekers' | 'Employers';
  createdAt: string;
  isActive: boolean;
}

export interface Event {
  id: string;
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
