
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Language, UserRole, Job, Application, JobAlert, Notification, ActivityLog, ContactMessage, Report, Review, BlogPost, ChatMessage, CommunityPost, InterviewSession, SystemAnnouncement } from '../types';
import { TRANSLATIONS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_USERS, CITIES as INITIAL_CITIES, CATEGORIES as INITIAL_CATEGORIES, MOCK_REPORTS, MOCK_REVIEWS, INITIAL_BLOG_POSTS, MOCK_MESSAGES, MOCK_COMMUNITY_POSTS, MOCK_INTERVIEW_SESSIONS, MOCK_ANNOUNCEMENTS } from '../constants';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  user: User | null;
  login: (role: UserRole, email?: string, password?: string) => Promise<{ success: boolean; message?: string; redirect?: 'register' | 'forgot' }>;
  // Fixed: Added requireVerification to the register method's return type to match server capabilities and fix the error in Auth.tsx.
  register: (user: User) => Promise<{ success: boolean; message?: string; redirect?: 'login'; requireVerification?: boolean }>;
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  uploadVerificationDoc: (userId: string, documentData: string) => Promise<void>;
  logout: () => void;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => void;
  comparisonJobs: Job[];
  addToComparison: (job: Job) => void;
  removeFromComparison: (jobId: string) => void;
  clearComparison: () => void;
  updateUserResume: (filename: string) => void;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  toggleFollowCompany: (companyId: string) => void;
  jobs: Job[];
  applications: Application[];
  addJob: (job: Job) => void; 
  updateJob: (job: Job) => void;
  deleteJob: (jobId: string) => void;
  submitApplication: (application: Application) => void;
  withdrawApplication: (appId: string) => void;
  updateApplicationStatus: (appId: string, status: Application['status'], details?: Partial<Application>) => void;
  updateApplicationMeta: (appId: string, data: any) => void;
  upgradeUserPlan: (plan: 'Free' | 'Standard' | 'Premium') => void;
  toggleSaveCandidate: (candidateId: string) => void;
  allUsers: User[];
  deleteUser: (userId: string) => void;
  approveUser: (userId: string) => void;
  changeUserRole: (userId: string, newRole: UserRole) => void;
  adminUpdateUserPlan: (userId: string, plan: 'Free' | 'Standard' | 'Premium') => void;
  activityLogs: ActivityLog[];
  contactMessages: ContactMessage[];
  sendContactMessage: (msg: ContactMessage) => void;
  reports: Report[];
  resolveReport: (reportId: string) => void;
  submitReport: (report: Report) => void;
  cities: string[];
  addCity: (city: string) => void;
  removeCity: (city: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  jobAlerts: JobAlert[];
  addJobAlert: (alert: JobAlert) => void;
  deleteJobAlert: (alertId: string) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  reviews: Review[];
  addReview: (review: Review) => void;
  deleteReview: (reviewId: string) => void;
  posts: BlogPost[];
  addPost: (post: BlogPost) => void;
  updatePost: (post: BlogPost) => void;
  deletePost: (postId: string) => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (receiverId: string, content: string, relatedJobId?: string) => void;
  markChatAsRead: (senderId: string) => void;
  communityPosts: CommunityPost[];
  addCommunityPost: (post: CommunityPost) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  interviewSessions: InterviewSession[];
  addInterviewSession: (session: InterviewSession) => void;
  announcements: SystemAnnouncement[];
  addAnnouncement: (ann: SystemAnnouncement) => void;
  deleteAnnouncement: (id: string) => void;
  toggleAnnouncementStatus: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const API_URL = '/api';

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { return fallback; }
  }
  return fallback;
};

const saveToStorage = (key: string, value: any) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(() => loadFromStorage('ajf_user', null));
  const [jobs, setJobs] = useState<Job[]>([]); 
  const [applications, setApplications] = useState<Application[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => loadFromStorage('ajf_saved', []));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/jobs`),
          fetch(`${API_URL}/applications`),
          fetch(`${API_URL}/users`)
        ]);
        if (jobsRes.ok) setJobs(await jobsRes.json());
        if (appsRes.ok) setApplications(await appsRes.json());
        if (usersRes.ok) setAllUsers(await usersRes.json());
      } catch (e) {
        setJobs(MOCK_JOBS);
        setApplications(MOCK_APPLICATIONS);
        setAllUsers(MOCK_USERS);
      }
    };
    fetchData();
  }, []);

  const [cities, setCities] = useState<string[]>(() => loadFromStorage('ajf_cities', INITIAL_CITIES));
  const [categories, setCategories] = useState<string[]>(() => loadFromStorage('ajf_categories', INITIAL_CATEGORIES));
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>(() => loadFromStorage('ajf_alerts', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('ajf_notifications', []));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => loadFromStorage('ajf_messages', []));
  const [reports, setReports] = useState<Report[]>(() => loadFromStorage('ajf_reports', MOCK_REPORTS));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('ajf_reviews', MOCK_REVIEWS));
  const [posts, setPosts] = useState<BlogPost[]>(() => loadFromStorage('ajf_posts', INITIAL_BLOG_POSTS));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadFromStorage('ajf_chat', MOCK_MESSAGES));
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => loadFromStorage('ajf_community', MOCK_COMMUNITY_POSTS));
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(() => loadFromStorage('ajf_interviews', MOCK_INTERVIEW_SESSIONS));
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(() => loadFromStorage('ajf_announcements', MOCK_ANNOUNCEMENTS));
  const [comparisonJobs, setComparisonJobs] = useState<Job[]>([]);

  useEffect(() => {
    saveToStorage('ajf_user', user);
    saveToStorage('ajf_saved', savedJobIds);
    saveToStorage('ajf_posts', posts);
  }, [user, savedJobIds, posts]);

  const dir: 'ltr' | 'rtl' = language === 'en' ? 'ltr' : 'rtl';
  const t = (key: string) => TRANSLATIONS[key]?.[language] || key;

  const login = async (role: UserRole, email?: string, password?: string) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (res.status === 200) {
        setUser(data);
        return { success: true };
      }
      if (res.status === 404) {
        return { success: false, message: data.message, redirect: 'register' as const };
      }
      if (res.status === 401) {
        return { success: false, message: data.message, redirect: 'forgot' as const };
      }
      return { success: false, message: data.message || "Invalid credentials" };
    } catch (e) {
      const mock = MOCK_USERS.find(u => u.email === email && u.role === role);
      if (mock) { setUser(mock); return { success: true }; }
      return { success: false, message: "Connection Error" };
    }
  };

  // Fixed: Implementation of register function now handles and returns requireVerification from the server response.
  const register = async (newUser: User) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.status === 201) {
        // Handle cases where email verification (OTP) is required by the server.
        if (data.requireVerification) {
          return { success: true, requireVerification: true };
        }
        setUser(data);
        setAllUsers(prev => [...prev, data]);
        return { success: true };
      }
      if (res.status === 409) {
        return { success: false, message: data.message, redirect: 'login' as const };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (e) {
      // Fallback for offline/development demo purposes.
      setUser(newUser);
      setAllUsers(p => [...p, newUser]);
      return { success: true };
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    return { success: true };
  };

  const uploadVerificationDoc = async (userId: string, documentData: string) => {
    if (user && user._id === userId) {
      setUser({ ...user, verificationStatus: 'Pending', verificationDocument: documentData });
    }
  };

  const logout = () => { setUser(null); localStorage.removeItem('ajf_user'); navigate('/'); };

  const toggleSaveJob = (jobId: string) => {
    if (!user) { navigate('/auth'); return; }
    setSavedJobIds(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
  };

  const addJob = async (job: Job) => {
    setJobs(p => [job, ...p]);
    try { await fetch(`${API_URL}/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) }); } catch(e){}
  };

  const updateJob = (job: Job) => setJobs(p => p.map(j => j._id === job._id ? job : j));
  
  const deleteJob = async (id: string) => {
      setJobs(p => p.filter(j => j._id !== id));
      try { await fetch(`${API_URL}/jobs/${id}`, { method: 'DELETE' }); } catch(e){}
  };
  
  const submitApplication = (app: Application) => setApplications(p => [app, ...p]);
  const withdrawApplication = (id: string) => setApplications(p => p.filter(a => a._id !== id));
  const updateApplicationStatus = (id: string, status: any, details?: any) => setApplications(p => p.map(a => a._id === id ? { ...a, status, ...details } : a));
  const updateApplicationMeta = (id: string, data: any) => setApplications(p => p.map(a => a._id === id ? { ...a, ...data } : a));

  const updateUserProfile = async (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      setAllUsers(p => p.map(u => u._id === user._id ? updated : u));
    }
  };

  const deleteUser = async (id: string) => {
      setAllUsers(p => p.filter(u => u._id !== id));
      try { await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' }); } catch(e){}
  };

  const approveUser = (id: string) => setAllUsers(p => p.map(u => u._id === id ? { ...u, verificationStatus: 'Verified' } : u));
  const changeUserRole = (id: string, role: any) => setAllUsers(p => p.map(u => u._id === id ? { ...u, role } : u));
  const adminUpdateUserPlan = (id: string, plan: any) => setAllUsers(p => p.map(u => u._id === id ? { ...u, plan } : u));

  const value: AppContextType = {
    language, setLanguage, user, login, register, verifyEmail, uploadVerificationDoc, logout, t, dir,
    savedJobIds, toggleSaveJob, comparisonJobs, addToComparison: (j: Job) => setComparisonJobs(p => [...p, j]),
    removeFromComparison: (id: string) => setComparisonJobs(p => p.filter(j => j._id !== id)),
    clearComparison: () => setComparisonJobs([]),
    jobs, applications, addJob, updateJob, deleteJob, submitApplication, withdrawApplication,
    updateApplicationStatus, updateApplicationMeta, updateUserResume: (f: string) => updateUserProfile({ resume: f }),
    updateUserProfile, upgradeUserPlan: (p: any) => updateUserProfile({ plan: p }),
    toggleFollowCompany: (id: string) => updateUserProfile({ following: (user?.following || []).includes(id) ? user?.following?.filter(i => i !== id) : [...(user?.following || []), id] }),
    toggleSaveCandidate: (id: string) => updateUserProfile({ savedCandidates: (user?.savedCandidates || []).includes(id) ? user?.savedCandidates?.filter(i => i !== id) : [...(user?.savedCandidates || []), id] }),
    allUsers, deleteUser,
    approveUser, changeUserRole, adminUpdateUserPlan,
    activityLogs: [], contactMessages: [], sendContactMessage: () => {},
    reports: [], resolveReport: () => {}, submitReport: () => {},
    cities, addCity: (c: string) => setCities(p => [...p, c]), removeCity: (c: string) => setCities(p => p.filter(i => i !== c)),
    categories, addCategory: (c: string) => setCategories(p => [...p, c]), removeCategory: (c: string) => setCategories(p => p.filter(i => i !== c)),
    jobAlerts, addJobAlert: (a: any) => {}, deleteJobAlert: (id: string) => {},
    notifications, markNotificationAsRead: (id: string) => setNotifications(p => p.map(n => n._id === id ? { ...n, isRead: true } : n)),
    markAllNotificationsAsRead: () => setNotifications(p => p.map(n => ({ ...n, isRead: true }))),
    reviews, addReview: (r: any) => setReviews(p => [r, ...p]), deleteReview: (id: string) => setReviews(p => p.filter(r => r._id !== id)),
    posts, addPost: (p: any) => setPosts(prev => [p, ...prev]), updatePost: (p: any) => setPosts(prev => prev.map(i => i._id === p._id ? p : i)),
    deletePost: (id: string) => setPosts(p => p.filter(i => i._id !== id)),
    chatMessages, sendChatMessage: (rid: string, c: string) => setChatMessages(p => [...p, { _id: Date.now().toString(), senderId: user?._id || '', receiverId: rid, content: c, timestamp: new Date().toISOString(), isRead: false }]),
    markChatAsRead: (sid: string) => setChatMessages(p => p.map(m => m.senderId === sid ? { ...m, isRead: true } : m)),
    communityPosts, addCommunityPost: (p: any) => setCommunityPosts(prev => [p, ...prev]),
    toggleLikePost: (id: string) => setCommunityPosts(p => p.map(i => i._id === id ? { ...i, likes: i.likes.includes(user?._id || '') ? i.likes.filter(l => l !== user?._id) : [...i.likes, user?._id || ''] } : i)),
    addComment: (id: string, c: string) => setCommunityPosts(p => p.map(i => i._id === id ? { ...i, comments: [...i.comments, { _id: Date.now().toString(), authorName: user?.name || '', content: c }] } : i)),
    interviewSessions, addInterviewSession: (s: any) => setInterviewSessions(p => [s, ...p]),
    announcements, addAnnouncement: (a: any) => setAnnouncements(p => [a, ...p]), deleteAnnouncement: (id: string) => setAnnouncements(p => p.filter(a => a._id !== id)),
    toggleAnnouncementStatus: (id: string) => setAnnouncements(p => p.map(a => a._id === id ? { ...a, isActive: !a.isActive } : a))
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
