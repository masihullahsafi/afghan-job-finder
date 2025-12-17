
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Language, UserRole, Job, Application, JobAlert, Notification, ActivityLog, ContactMessage, Report, Review, BlogPost, ChatMessage, CommunityPost, InterviewSession, SystemAnnouncement } from '../types';
import { TRANSLATIONS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_USERS, CITIES as INITIAL_CITIES, CATEGORIES as INITIAL_CATEGORIES, MOCK_REPORTS, MOCK_REVIEWS, INITIAL_BLOG_POSTS, MOCK_MESSAGES, MOCK_PDF_BASE64, MOCK_COMMUNITY_POSTS, MOCK_INTERVIEW_SESSIONS, MOCK_ANNOUNCEMENTS } from '../constants';

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
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(`Error parsing ${key} from storage`, e);
      return fallback;
    }
  }
  return fallback;
};

const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.error('Local Storage is full.');
    } else {
      console.error('Error saving to storage', e);
    }
  }
};

// Use relative URL '/api' for both production and development (via proxy)
// This avoids hardcoding localhost or ports in the frontend bundle.
const API_URL = '/api';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState<Language>('en');
  const [isOffline, setIsOffline] = useState(false);
  
  const [user, setUser] = useState<User | null>(() => {
      return loadFromStorage('ajf_user', null) as User | null;
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]); 
  const [applications, setApplications] = useState<Application[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔄 Connecting to Backend at " + API_URL);
        const jobsRes = await fetch(`${API_URL}/jobs`);
        if (!jobsRes.ok) throw new Error("Backend offline");
        const jobsData = await jobsRes.json();
        
        const appsRes = await fetch(`${API_URL}/applications`);
        const appsData = await appsRes.json();

        let usersData = [];
        try {
            const usersRes = await fetch(`${API_URL}/users`);
            if (usersRes.ok) usersData = await usersRes.json();
        } catch (e) {
            console.warn("Could not fetch users from DB, falling back to local.");
        }

        if (Array.isArray(jobsData) && jobsData.length > 0) {
          setJobs(jobsData);
          setIsOffline(false);
        } else {
          setJobs(MOCK_JOBS);
          setIsOffline(false); 
        }

        if (Array.isArray(appsData) && appsData.length > 0) setApplications(appsData);
        else setApplications(MOCK_APPLICATIONS);

        if (Array.isArray(usersData) && usersData.length > 0) setAllUsers(usersData);
        else setAllUsers(MOCK_USERS);

      } catch (error) {
        console.warn("❌ Backend Unavailable. Switching to Offline Mode (Local Data).");
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
  useEffect(() => saveToStorage('ajf_applications', applications), [applications]);
  useEffect(() => saveToStorage('ajf_users', allUsers), [allUsers]);
  useEffect(() => saveToStorage('ajf_cities', cities), [cities]);
  useEffect(() => saveToStorage('ajf_categories', categories), [categories]);
  useEffect(() => saveToStorage('ajf_alerts', jobAlerts), [jobAlerts]);
  useEffect(() => saveToStorage('ajf_notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('ajf_logs', activityLogs), [activityLogs]);
  useEffect(() => saveToStorage('ajf_messages', contactMessages), [contactMessages]);
  useEffect(() => saveToStorage('ajf_reports', reports), [reports]);
  useEffect(() => saveToStorage('ajf_reviews', reviews), [reviews]);
  useEffect(() => saveToStorage('ajf_posts', posts), [posts]);
  useEffect(() => saveToStorage('ajf_chat', chatMessages), [chatMessages]);
  useEffect(() => saveToStorage('ajf_community', communityPosts), [communityPosts]);
  useEffect(() => saveToStorage('ajf_interviews', interviewSessions), [interviewSessions]);
  useEffect(() => saveToStorage('ajf_announcements', announcements), [announcements]);

  const dir = language === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    if (language === 'en') {
      document.body.style.fontFamily = "'Inter', sans-serif";
    } else {
      document.body.style.fontFamily = "'Noto Naskh Arabic', serif";
    }
  }, [language, dir]);

  const login = async (role: UserRole, email?: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    if (!isOffline && email && password) {
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
                return { success: false, message: errorData.message || "Invalid credentials." };
            }
        } catch (e) {
            console.error("Login Error (DB)", e);
            return { success: false, message: "Connection failed. Please try again." };
        }
    }
    // Demo Mode logic...
    let mockUser: User | undefined;
    if (role === UserRole.ADMIN) mockUser = MOCK_USERS.find(u => u.role === UserRole.ADMIN);
    else if (role === UserRole.EMPLOYER) { mockUser = MOCK_USERS.find(u => u.role === UserRole.EMPLOYER); if(mockUser) mockUser.plan = 'Premium'; }
    else mockUser = MOCK_USERS.find(u => u.role === UserRole.SEEKER);
    if (mockUser) { setUser(mockUser); return { success: true }; }
    return { success: false, message: "Demo user not found." };
  };

  const register = async (newUser: User): Promise<{ success: boolean; message?: string; requireVerification?: boolean }> => {
      if (!isOffline) {
          try {
              const res = await fetch(`${API_URL}/register`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newUser)
              });
              const data = await res.json();
              if (!res.ok) return { success: false, message: data.message || "Registration failed." };
              if (data.requireVerification) return { success: true, requireVerification: true };
              return { success: true };
          } catch(e) { return { success: false, message: "Server error. Please verify backend is running." }; }
      }
      setAllUsers(prev => [...prev, newUser]);
      setUser(newUser);
      return { success: true };
  };

  const verifyEmail = async (email: string, otp: string): Promise<{ success: boolean; message?: string }> => {
      if(isOffline) return { success: true };
      try {
          const res = await fetch(`${API_URL}/verify-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, otp })
          });
          if(res.ok) {
              const data = await res.json();
              setUser(data.user);
              return { success: true };
          } else {
              const err = await res.json();
              return { success: false, message: err.message };
          }
      } catch(e) { return { success: false, message: "Connection error" }; }
  };

  const uploadVerificationDoc = async (userId: string, documentData: string) => {
      if (!isOffline) {
          try {
              await fetch(`${API_URL}/upload-verification`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId, documentData })
              });
              if (user && user.id === userId) {
                  setUser({ ...user, verificationStatus: 'Pending', verificationDocument: documentData });
              }
          } catch (e) { console.error("Upload error", e); }
      } else {
          if (user && user.id === userId) {
              setUser({ ...user, verificationStatus: 'Pending', verificationDocument: documentData });
          }
      }
  };

  const logout = () => { setUser(null); setSavedJobIds([]); localStorage.removeItem('ajf_user'); };
  const t = (key: string) => { if (!TRANSLATIONS[key]) return key; return TRANSLATIONS[key][language] || key; };
  const toggleSaveJob = (jobId: string) => {
    if (!user) { navigate('/auth'); return; }
    let newSavedIds;
    if (savedJobIds.includes(jobId)) newSavedIds = savedJobIds.filter(id => id !== jobId);
    else newSavedIds = [...savedJobIds, jobId];
    setSavedJobIds(newSavedIds);
    localStorage.setItem(`saved_jobs_${user.id}`, JSON.stringify(newSavedIds));
  };
  const addLog = (action: string) => {
    if (!user) return;
    setActivityLogs(prev => [{id: Date.now().toString(), adminName: user.name, action: action, details: `Action performed by ${user.role}`, timestamp: new Date().toLocaleString()}, ...prev]);
  };
  const addNotification = (userId: string, title: string, message: string, type: Notification['type'], link?: string) => {
    setNotifications(prev => [{id: Date.now().toString() + Math.random().toString().slice(2, 5), userId, title, message, type, isRead: false, date: new Date().toLocaleString(), link}, ...prev]);
  };
  const addJob = async (job: Job) => {
    setJobs(prev => [job, ...prev]);
    addLog(`Job Posted: ${job.title}`);
    if (!isOffline) {
        try { await fetch(`${API_URL}/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(job) }); } catch (error) { console.error("DB Sync Error", error); }
    }
  };
  const updateJob = async (updatedJob: Job) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    addLog(`Job Updated: ${updatedJob.title}`);
  };
  const deleteJob = async (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    addLog(`Job Deleted: ${jobId}`);
    if (!isOffline) { try { await fetch(`${API_URL}/jobs/${jobId}`, { method: 'DELETE' }); } catch (error) { console.error("DB Sync Error", error); } }
  };
  const submitApplication = async (application: Application) => {
    const appWithTimeline = { ...application, timeline: [{ status: 'Applied', date: new Date().toLocaleString(), note: 'Application submitted' }] };
    setApplications(prev => [...prev, appWithTimeline]);
    if (!isOffline) { try { await fetch(`${API_URL}/applications`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(appWithTimeline) }); } catch(e) { console.error("App Submit Error", e); } }
    const job = jobs.find(j => j.id === application.jobId);
    if (job && job.employerId) addNotification(job.employerId, 'New Application', `You received a new application for ${job.title}.`, 'Application', '/employer');
    addLog(`Application Submitted: ${application.id}`);
  };
  const withdrawApplication = (appId: string) => { setApplications(prev => prev.filter(a => a.id !== appId)); addLog(`Application Withdrawn: ${appId}`); };
  const updateApplicationStatus = async (appId: string, status: Application['status'], interviewDetails?: Partial<Application>) => {
    setApplications(prev => prev.map(app => {
        if (app.id === appId) {
            const newTimelineEntry = { status, date: new Date().toLocaleString(), note: interviewDetails?.interviewMessage || (status === 'Interview' ? 'Interview scheduled' : undefined) };
            const updatedApp = { ...app, status, ...interviewDetails, timeline: [newTimelineEntry, ...(app.timeline || [])] };
            if (!isOffline) { fetch(`${API_URL}/applications/${appId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedApp) }).catch(e => console.error(e)); }
            return updatedApp;
        }
        return app;
    }));
    const app = applications.find(a => a.id === appId);
    if (app) addNotification(app.seekerId, 'Application Update', `Your application status: ${status}`, 'Application', '/seeker');
  };
  const updateApplicationMeta = (appId: string, data: { employerNotes?: string; employerRating?: number }) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        const updated = { ...app, ...data };
        if (!isOffline) fetch(`${API_URL}/applications/${appId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }).catch(e => console.error(e));
        return updated;
      }
      return app;
    }));
  };
  const updateUserProfile = async (data: Partial<User>) => {
      if (user) {
          const updatedUser = { ...user, ...data };
          setUser(updatedUser);
          if(!isOffline) await fetch(`${API_URL}/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updatedUser) }).catch(e => console.error(e));
          setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      }
  };
  const updateUserResume = (filename: string) => { if (user) updateUserProfile({ resume: filename }); };
  const upgradeUserPlan = (plan: 'Free' | 'Standard' | 'Premium') => { if (user) updateUserProfile({ plan }); };
  const toggleFollowCompany = (companyId: string) => { if (!user) return; const currentFollowing = user.following || []; let newFollowing; if (currentFollowing.includes(companyId)) newFollowing = currentFollowing.filter(id => id !== companyId); else newFollowing = [...currentFollowing, companyId]; updateUserProfile({ following: newFollowing }); };
  const toggleSaveCandidate = (candidateId: string) => { if (!user) return; const currentSaved = user.savedCandidates || []; let newSaved; if (currentSaved.includes(candidateId)) newSaved = currentSaved.filter(id => id !== candidateId); else newSaved = [...currentSaved, candidateId]; updateUserProfile({ savedCandidates: newSaved }); };
  const addToComparison = (job: Job) => { if (comparisonJobs.length < 3 && !comparisonJobs.some(j => j.id === job.id)) setComparisonJobs(prev => [...prev, job]); };
  const removeFromComparison = (jobId: string) => setComparisonJobs(prev => prev.filter(j => j.id !== jobId));
  const clearComparison = () => setComparisonJobs([]);
  const deleteUser = (userId: string) => { setAllUsers(prev => prev.filter(u => u.id !== userId)); setJobs(prev => prev.filter(j => j.employerId !== userId)); setApplications(prev => prev.filter(a => a.seekerId !== userId)); addLog(`User Deleted: ${userId}`); };
  const approveUser = (userId: string) => {
    const updatedUser = allUsers.find(u => u.id === userId);
    if(updatedUser && !isOffline) fetch(`${API_URL}/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Active', verificationStatus: 'Verified' }) });
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Active', verificationStatus: 'Verified' } : u));
    addNotification(userId, 'Account Approved', 'Your account has been verified and activated.', 'System', '/dashboard');
    addLog(`User Approved: ${userId}`);
  };
  const changeUserRole = (userId: string, newRole: UserRole) => { setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u)); addLog(`User Role Changed: ${userId} to ${newRole}`); };
  const adminUpdateUserPlan = (userId: string, plan: 'Free' | 'Standard' | 'Premium') => { setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, plan } : u)); addLog(`User Plan Updated: ${userId} to ${plan}`); };
  const sendContactMessage = (msg: ContactMessage) => setContactMessages(prev => [msg, ...prev]);
  const submitReport = (report: Report) => setReports(prev => [report, ...prev]);
  const resolveReport = (reportId: string) => { setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: 'Resolved' } : r)); addLog(`Report Resolved: ${reportId}`); };
  const addCity = (city: string) => setCities(prev => [...prev, city]);
  const removeCity = (city: string) => setCities(prev => prev.filter(c => c !== city));
  const addCategory = (category: string) => setCategories(prev => [...prev, category]);
  const removeCategory = (category: string) => setCategories(prev => prev.filter(c => c !== category));
  const addJobAlert = (alert: JobAlert) => setJobAlerts(prev => [...prev, alert]);
  const deleteJobAlert = (alertId: string) => setJobAlerts(prev => prev.filter(a => a.id !== alertId));
  const markNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const markAllNotificationsAsRead = () => { if (user) setNotifications(prev => prev.map(n => n.userId === user.id ? { ...n, isRead: true } : n)); };
  const addReview = (review: Review) => setReviews(prev => [review, ...prev]);
  const deleteReview = (reviewId: string) => setReviews(prev => prev.filter(r => r.id !== reviewId));
  const addPost = (post: BlogPost) => setPosts(prev => [post, ...prev]);
  const updatePost = (post: BlogPost) => setPosts(prev => prev.map(p => p.id === post.id ? post : p));
  const deletePost = (postId: number) => setPosts(prev => prev.filter(p => p.id !== postId));
  const sendChatMessage = (receiverId: string, content: string, relatedJobId?: string) => { if (!user) return; setChatMessages(prev => [...prev, {id: Date.now().toString(), senderId: user.id, receiverId, content, timestamp: new Date().toISOString(), isRead: false, relatedJobId}]); };
  const markChatAsRead = (senderId: string) => { if (!user) return; setChatMessages(prev => prev.map(msg => (msg.receiverId === user.id && msg.senderId === senderId && !msg.isRead) ? { ...msg, isRead: true } : msg)); };
  const addCommunityPost = (post: CommunityPost) => setCommunityPosts(prev => [post, ...prev]);
  const toggleLikePost = (postId: string) => { if (!user) return; setCommunityPosts(prev => prev.map(post => { if (post.id === postId) { const isLiked = post.likes.includes(user.id); return { ...post, likes: isLiked ? post.likes.filter(id => id !== user.id) : [...post.likes, user.id] }; } return post; })); };
  const addComment = (postId: string, content: string) => { if (!user) return; setCommunityPosts(prev => prev.map(post => { if (post.id === postId) { return { ...post, comments: [...post.comments, {id: Date.now().toString(), authorId: user.id, authorName: user.name, authorAvatar: user.avatar, content, timestamp: new Date().toISOString()}] }; } return post; })); };
  const addInterviewSession = (session: InterviewSession) => setInterviewSessions(prev => [session, ...prev]);
  const addAnnouncement = (ann: SystemAnnouncement) => setAnnouncements(prev => [ann, ...prev]);
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
