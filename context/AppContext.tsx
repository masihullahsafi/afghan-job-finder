

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
  login: (role: UserRole, email?: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (user: User) => Promise<{ success: boolean; message?: string; requireVerification?: boolean }>;
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
  updateApplicationStatus: (appId: string, status: Application['status'], interviewDetails?: Partial<Application>) => void;
  updateApplicationMeta: (appId: string, data: { employerNotes?: string; employerRating?: number }) => void;
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
  deletePost: (postId: number) => void;
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

const API_URL = '/api';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('en');
  const [isOffline, setIsOffline] = useState(false);
  const [user, setUser] = useState<User | null>(() => loadFromStorage('ajf_user', null));
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]); 
  const [applications, setApplications] = useState<Application[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await fetch(`${API_URL}/jobs`);
        const jobsData = await jobsRes.json();
        
        const appsRes = await fetch(`${API_URL}/applications`);
        const appsData = await appsRes.json();

        let usersData = [];
        const usersRes = await fetch(`${API_URL}/users`);
        if (usersRes.ok) usersData = await usersRes.json();

        if (Array.isArray(jobsData) && jobsData.length > 0) setJobs(jobsData);
        else setJobs(MOCK_JOBS);

        if (Array.isArray(appsData)) setApplications(appsData);
        if (Array.isArray(usersData) && usersData.length > 0) setAllUsers(usersData);
        else setAllUsers(MOCK_USERS);

      } catch (error) {
        setIsOffline(true); 
        setJobs(loadFromStorage('ajf_jobs', MOCK_JOBS));
        setApplications(loadFromStorage('ajf_applications', MOCK_APPLICATIONS));
        setAllUsers(loadFromStorage('ajf_users', MOCK_USERS));
      }
    };
    fetchData();
  }, []); 

  const [cities, setCities] = useState<string[]>(() => loadFromStorage('ajf_cities', INITIAL_CITIES));
  const [categories, setCategories] = useState<string[]>(() => loadFromStorage('ajf_categories', INITIAL_CATEGORIES));
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>(() => loadFromStorage('ajf_alerts', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage('ajf_notifications', []));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadFromStorage('ajf_logs', []));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => loadFromStorage('ajf_messages', []));
  const [reports, setReports] = useState<Report[]>(() => loadFromStorage('ajf_reports', MOCK_REPORTS));
  const [reviews, setReviews] = useState<Review[]>(() => loadFromStorage('ajf_reviews', MOCK_REVIEWS));
  const [posts, setPosts] = useState<BlogPost[]>(() => loadFromStorage('ajf_posts', INITIAL_BLOG_POSTS));
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadFromStorage('ajf_chat', MOCK_MESSAGES));
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => loadFromStorage('ajf_community', MOCK_COMMUNITY_POSTS));
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(() => loadFromStorage('ajf_interviews', MOCK_INTERVIEW_SESSIONS));
  const [announcements, setAnnouncements] = useState<SystemAnnouncement[]>(() => loadFromStorage('ajf_announcements', MOCK_ANNOUNCEMENTS));
  const [comparisonJobs, setComparisonJobs] = useState<Job[]>([]);

  useEffect(() => saveToStorage('ajf_user', user), [user]);
  useEffect(() => saveToStorage('ajf_jobs', jobs), [jobs]); 
  useEffect(() => saveToStorage('ajf_users', allUsers), [allUsers]);

  const dir = language === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    document.body.style.fontFamily = language === 'en' ? "'Inter', sans-serif" : "'Noto Naskh Arabic', serif";
  }, [language, dir]);

  const t = (key: string) => { if (!TRANSLATIONS[key]) return key; return TRANSLATIONS[key][language] || key; };

  const login = async (role: UserRole, email?: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });
        if (res.ok) {
            const dbUser = await res.json();
            setUser(dbUser);
            return { success: true };
        } else {
            const errorData = await res.json();
            return { success: false, message: errorData.message };
        }
    } catch (e) {
        // Fallback for Demo
        const mockUser = MOCK_USERS.find(u => u.email === email && u.role === role);
        if (mockUser) { setUser(mockUser); return { success: true }; }
        return { success: false, message: "System error. Demo mode active." };
    }
  };

  const register = async (newUser: User): Promise<{ success: boolean; message?: string; requireVerification?: boolean }> => {
      try {
          const res = await fetch(`${API_URL}/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser)
          });
          const data = await res.json();
          if (res.ok) {
              setUser(data);
              return { success: true };
          }
          return { success: false, message: data.message };
      } catch(e) {
          // Fallback for Demo
          setAllUsers(prev => [...prev, newUser]);
          setUser(newUser);
          return { success: true };
      }
  };

  const verifyEmail = async (email: string, otp: string): Promise<{ success: boolean; message?: string }> => ({ success: true });

  const uploadVerificationDoc = async (userId: string, documentData: string) => {
      try {
          await fetch(`${API_URL}/upload-verification`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, documentData })
          });
      } catch (e) {}
      if (user && user.id === userId) setUser({ ...user, verificationStatus: 'Pending', verificationDocument: documentData });
  };

  const logout = () => { setUser(null); setSavedJobIds([]); localStorage.removeItem('ajf_user'); };
  const toggleSaveJob = (jobId: string) => { if (!user) { navigate('/auth'); return; } setSavedJobIds(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]); };
  const addJob = async (job: Job) => { setJobs(prev => [job, ...prev]); try { await fetch(`${API_URL}/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) }); } catch (error) {} };
  const updateJob = async (updatedJob: Job) => setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
  const deleteJob = async (jobId: string) => setJobs(prev => prev.filter(j => j.id !== jobId));
  const submitApplication = async (application: Application) => setApplications(prev => [...prev, application]);
  const withdrawApplication = (appId: string) => setApplications(prev => prev.filter(a => a.id !== appId));
  const updateApplicationStatus = async (appId: string, status: Application['status'], details?: any) => setApplications(prev => prev.map(app => app.id === appId ? { ...app, status, ...details } : app));
  const updateApplicationMeta = (appId: string, data: any) => setApplications(prev => prev.map(app => app.id === appId ? { ...app, ...data } : app));
  const updateUserProfile = async (data: Partial<User>) => { if (user) { const updatedUser = { ...user, ...data }; setUser(updatedUser); setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u)); } };
  const updateUserResume = (filename: string) => { if (user) updateUserProfile({ resume: filename }); };
  const upgradeUserPlan = (plan: any) => { if (user) updateUserProfile({ plan }); };
  const toggleFollowCompany = (companyId: string) => { if (!user) return; const current = user.following || []; const updated = current.includes(companyId) ? current.filter(id => id !== companyId) : [...current, companyId]; updateUserProfile({ following: updated }); };
  const toggleSaveCandidate = (candidateId: string) => { if (!user) return; const current = user.savedCandidates || []; const updated = current.includes(candidateId) ? current.filter(id => id !== candidateId) : [...current, candidateId]; updateUserProfile({ savedCandidates: updated }); };
  const addToComparison = (job: Job) => { if (comparisonJobs.length < 3 && !comparisonJobs.some(j => j.id === job.id)) setComparisonJobs(prev => [...prev, job]); };
  const removeFromComparison = (jobId: string) => setComparisonJobs(prev => prev.filter(j => j.id !== jobId));
  const clearComparison = () => setComparisonJobs([]);
  const deleteUser = (userId: string) => setAllUsers(prev => prev.filter(u => u.id !== userId));
  const approveUser = (userId: string) => setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Active', verificationStatus: 'Verified' } : u));
  const changeUserRole = (userId: string, role: any) => setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  const adminUpdateUserPlan = (userId: string, plan: any) => setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, plan } : u));
  const sendContactMessage = (msg: ContactMessage) => setContactMessages(prev => [msg, ...prev]);
  const submitReport = (report: Report) => setReports(prev => [report, ...prev]);
  const resolveReport = (id: string) => setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  const addCity = (city: string) => setCities(prev => [...prev, city]);
  const removeCity = (city: string) => setCities(prev => prev.filter(c => c !== city));
  const addCategory = (cat: string) => setCategories(prev => [...prev, cat]);
  const removeCategory = (cat: string) => setCategories(prev => prev.filter(c => c !== cat));
  const addJobAlert = (alert: JobAlert) => setJobAlerts(prev => [...prev, alert]);
  const deleteJobAlert = (id: string) => setJobAlerts(prev => prev.filter(a => a.id !== id));
  const markNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllNotificationsAsRead = () => { if (user) setNotifications(prev => prev.map(n => n.userId === user.id ? { ...n, isRead: true } : n)); };
  const addReview = (review: Review) => setReviews(prev => [review, ...prev]);
  const deleteReview = (id: string) => setReviews(prev => prev.filter(r => r.id !== id));
  const addPost = (post: BlogPost) => setPosts(prev => [post, ...prev]);
  const updatePost = (post: BlogPost) => setPosts(prev => prev.map(p => p.id === post.id ? post : p));
  const deletePost = (id: number) => setPosts(prev => prev.filter(p => p.id !== id));
  const sendChatMessage = (receiverId: string, content: string, relatedJobId?: string) => { if (!user) return; setChatMessages(prev => [...prev, {id: Date.now().toString(), senderId: user.id, receiverId, content, timestamp: new Date().toISOString(), isRead: false, relatedJobId}]); };
  const markChatAsRead = (senderId: string) => { if (!user) return; setChatMessages(prev => prev.map(msg => (msg.receiverId === user.id && msg.senderId === senderId) ? { ...msg, isRead: true } : msg)); };
  const addCommunityPost = (post: CommunityPost) => setCommunityPosts(prev => [post, ...prev]);
  const toggleLikePost = (id: string) => { if (!user) return; setCommunityPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes.includes(user.id) ? p.likes.filter(uid => uid !== user.id) : [...p.likes, user.id] } : p)); };
  const addComment = (pid: string, content: string) => { if (!user) return; setCommunityPosts(prev => prev.map(p => p.id === pid ? { ...p, comments: [...p.comments, {id: Date.now().toString(), authorId: user.id, authorName: user.name, content, timestamp: new Date().toISOString()}] } : p)); };
  const addInterviewSession = (s: InterviewSession) => setInterviewSessions(prev => [s, ...prev]);
  const addAnnouncement = (a: SystemAnnouncement) => setAnnouncements(prev => [a, ...prev]);
  const deleteAnnouncement = (id: string) => setAnnouncements(prev => prev.filter(a => a.id !== id));
  const toggleAnnouncementStatus = (id: string) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));

  const value = {
    language, setLanguage, user, login, register, verifyEmail, uploadVerificationDoc, logout, t, dir: dir as 'ltr' | 'rtl',
    savedJobIds, toggleSaveJob, comparisonJobs, addToComparison, removeFromComparison, clearComparison,
    jobs, applications, addJob, updateJob, deleteJob, submitApplication, withdrawApplication,
    updateApplicationStatus, updateApplicationMeta, updateUserResume, updateUserProfile,
    upgradeUserPlan, toggleFollowCompany, toggleSaveCandidate, allUsers, deleteUser,
    approveUser, changeUserRole, adminUpdateUserPlan, activityLogs, contactMessages,
    sendContactMessage, reports, resolveReport, submitReport, cities, addCity, removeCity,
    categories, addCategory, removeCategory, jobAlerts, addJobAlert, deleteJobAlert,
    notifications, markNotificationAsRead, markAllNotificationsAsRead, reviews, addReview,
    deleteReview, posts, addPost, updatePost, deletePost, chatMessages, sendChatMessage,
    markChatAsRead, communityPosts, addCommunityPost, toggleLikePost, addComment,
    interviewSessions, addInterviewSession, announcements, addAnnouncement, deleteAnnouncement,
    toggleAnnouncementStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
