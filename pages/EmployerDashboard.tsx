import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateJobDescription, analyzeArticleSEO } from '../services/geminiService';
import { uploadFile } from '../src/services/api';
import { 
  Plus, FileText, Users, Eye, Settings, Edit2, Trash2, Search, X, 
  CheckCircle, CreditCard, Download, Calendar, Camera, Shield, 
  Upload, Bookmark, BarChart2, PenTool, Megaphone, ArrowRight, 
  Bold, Italic, LayoutList, XCircle, RotateCcw, ChevronLeft, 
  ChevronRight, MapPin, Loader2, Sparkles, Globe, Mail, Clock, Filter, AlertTriangle
} from 'lucide-react';
import { Job, BlogPost, Application, User, UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { CVTemplates } from '../components/CVTemplates';
import { AlertModal } from '../components/AlertModal';

export const EmployerDashboard: React.FC = () => {
  const { 
    user, t, jobs, applications, addJob, updateJob, deleteJob, 
    updateApplicationStatus, updateApplicationMeta, updateUserProfile, 
    uploadVerificationDoc, cities, categories, allUsers, addPost, 
    toggleSaveCandidate, announcements 
  } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile' | 'candidates' | 'billing' | 'articles' | 'ats' | 'saved' | 'calendar'>('jobs');
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const [selectedJobIdForApps, setSelectedJobIdForApps] = useState<string | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);
  const [scheduleAppId, setScheduleAppId] = useState<string | null>(null);
  const [rejectAppId, setRejectAppId] = useState<string | null>(null);
  const [analyticsJob, setAnalyticsJob] = useState<Job | null>(null);

  const [alertState, setAlertState] = useState<{isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; onConfirm?: () => void;}>({ isOpen: false, title: '', message: '', type: 'info' });
  
  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experience, setExperience] = useState('Entry');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [vacancyNumber, setVacancyNumber] = useState('');
  const [noOfJobs, setNoOfJobs] = useState('1');
  const [contractDuration, setContractDuration] = useState('');
  const [contractExtensible, setContractExtensible] = useState(false);
  const [probationPeriod, setProbationPeriod] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Any'>('Any');
  const [education, setEducation] = useState('');
  const [nationality, setNationality] = useState('Any');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [applyMethod, setApplyMethod] = useState<'Internal' | 'External'>('Internal');
  const [applyUrl, setApplyUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [companyName, setCompanyName] = useState(user?.name || '');
  const [companyDesc, setCompanyDesc] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [industry, setIndustry] = useState(user?.industry || '');
  const [youtubeUrl, setYoutubeUrl] = useState(user?.youtubeUrl || '');
  const [bannerPreview, setBannerPreview] = useState<string | null>(user?.banner || null);

  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('');
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMessage, setInterviewMessage] = useState("We'd like to invite you for an interview.");
  const [rejectionReason, setRejectionReason] = useState('');

  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateLocation, setCandidateLocation] = useState('');
  const [candidateSkill, setCandidateSkill] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const editorRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
        setCompanyName(user.name);
        setCompanyDesc(user.bio || '');
        setWebsite(user.website || '');
        setIndustry(user.industry || '');
        setYoutubeUrl(user.youtubeUrl || '');
        setBannerPreview(user.banner || null);
    }
  }, [user]);

  if (!user || user.role !== 'EMPLOYER') return <div className="p-10 text-center">Redirecting...</div>;

  const myJobs = jobs.filter(job => job.employerId === user.id || job.company === user.name);
  const selectedJobApps = selectedJobIdForApps 
    ? applications.filter(app => app.jobId === selectedJobIdForApps) 
    : applications.filter(app => myJobs.some(j => j.id === app.jobId));

  const filteredCandidates = allUsers.filter(u => { 
      if (u.role !== 'SEEKER') return false; 
      const matchesSearch = candidateSearch ? (u.name.toLowerCase().includes(candidateSearch.toLowerCase())) : true; 
      const matchesLocation = candidateLocation ? u.address?.toLowerCase().includes(candidateLocation.toLowerCase()) : true; 
      const matchesSkill = candidateSkill ? u.verifiedSkills?.some(s => s.toLowerCase().includes(candidateSkill.toLowerCase())) : true; 
      return matchesSearch && matchesLocation && matchesSkill; 
  });

  const showAlert = (title: string, message: string, type: any = 'info') => setAlertState({ isOpen: true, title, message, type });
  const showConfirm = (title: string, message: string, onConfirm: () => void) => setAlertState({ isOpen: true, title, message, type: 'warning', onConfirm });
  const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

  const resetForm = () => { 
      setTitle(''); setCategory(categories[0]); setJobType('Full-time'); setExperience('Entry'); setSalaryMin(''); setSalaryMax(''); 
      setDeadline(''); setLocation(cities[0]); setSkills(''); setDescription(''); setResponsibilities(''); setApplyMethod('Internal'); 
      setApplyUrl(''); setEditingJobId(null); setVacancyNumber(''); 
      setNoOfJobs('1'); setContractDuration(''); setContractExtensible(false); setProbationPeriod(''); setGender('Any'); 
      setEducation(''); setNationality('Any'); setYearsOfExperience(''); setIsUrgent(false); setIsFeatured(false); 
  };

  const handleEditJob = (job: Job) => { 
      setEditingJobId(job.id); setTitle(job.title); setCategory(job.category); setJobType(job.type); 
      setExperience(job.experienceLevel); setSalaryMin(job.salaryMin.toString()); setSalaryMax(job.salaryMax.toString()); 
      setDeadline(job.deadline); setLocation(job.location); setSkills(job.requirements.join(', ')); 
      setDescription(job.description); setResponsibilities(job.responsibilities ? job.responsibilities.join('\n') : ''); 
      setApplyMethod(job.applyMethod as any || 'Internal'); setApplyUrl(job.applyUrl || ''); 
      setVacancyNumber(job.vacancyNumber || ''); 
      setNoOfJobs(job.noOfJobs?.toString() || '1'); setContractDuration(job.contractDuration || ''); 
      setContractExtensible(job.contractExtensible || false); setProbationPeriod(job.probationPeriod || ''); 
      setGender(job.gender || 'Any'); setEducation(job.education || ''); setNationality(job.nationality || 'Any'); 
      setYearsOfExperience(job.yearsOfExperience || ''); setIsUrgent(job.isUrgent || false); setIsFeatured(job.isFeatured || false); 
      setShowPostModal(true); 
  };

  const handleSubmitJob = (e: React.FormEvent) => { 
      e.preventDefault(); 
      const newJob: Job = { 
          id: editingJobId || Date.now().toString(), employerId: user.id, title, company: user.name, 
          companyLogo: user.avatar || 'https://via.placeholder.com/150', location, salaryMin: parseInt(salaryMin), 
          salaryMax: parseInt(salaryMax), currency: 'AFN', type: jobType as any, experienceLevel: experience as any, 
          category, postedDate: new Date().toISOString().split('T')[0], deadline, description, 
          requirements: skills.split(',').map(s => s.trim()), responsibilities: responsibilities.split('\n').filter(s => s.trim() !== ''), 
          isFeatured, status: 'Active', applyMethod, applyUrl: applyMethod === 'External' ? applyUrl : undefined, 
          isUrgent, vacancyNumber, noOfJobs: parseInt(noOfJobs), contractDuration, contractExtensible, probationPeriod, 
          gender, education, nationality, yearsOfExperience 
      }; 
      editingJobId ? updateJob(newJob) : addJob(newJob);
      showAlert("Success", editingJobId ? "Job updated!" : "Job published!", 'success');
      setShowPostModal(false); resetForm(); 
  };

  const handleAIHelp = async () => { 
      if (title && skills) { setIsGenerating(true); const desc = await generateJobDescription(title, skills); setDescription(desc); setIsGenerating(false); } 
      else showAlert("Error", "Enter Title and Skills first.", 'error');
  };

  const handleAppStatusChange = (appId: string, status: any) => { 
      if (status === 'Interview') { setScheduleAppId(appId); setShowScheduleModal(true); } 
      else if (status === 'Rejected') { setRejectAppId(appId); setShowRejectModal(true); } 
      else { updateApplicationStatus(appId, status); } 
  };

  const handleViewCandidate = (candidate: User) => { setSelectedCandidate(candidate); setShowCandidateModal(true); };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: companyName, bio: companyDesc, website, industry, youtubeUrl, banner: bannerPreview || undefined });
    showAlert("Updated", "Profile saved.", 'success');
  };

  const submitInterviewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduleAppId) {
      updateApplicationStatus(scheduleAppId, 'Interview', { interviewDate, interviewTime, interviewMessage });
      showAlert("Scheduled", "Invitation sent.", 'success');
      setShowScheduleModal(false); setScheduleAppId(null);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { 
      const file = e.target.files?.[0]; 
      if (file) { 
          try { const url = await uploadFile(file); await updateUserProfile({ avatar: url }); showAlert("Success", "Logo updated!", 'success'); } 
          catch(err) { showAlert("Error", "Upload failed.", 'error'); } 
      } 
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try { const url = await uploadFile(e.target.files[0]); setBannerPreview(url); } catch(err) { console.error(err); }
    }
  };

  const handleVerificationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      try { const url = await uploadFile(e.target.files[0]); await uploadVerificationDoc(user.id, url); showAlert("Submitted", "License uploaded.", 'success'); } 
      catch(err) { showAlert("Error", "Upload failed.", 'error'); }
    }
  };

  const handleDownloadResume = (e: React.MouseEvent, url: string | undefined, data?: string) => {
    e.preventDefault(); e.stopPropagation();
    
    // 1. Try direct Cloudinary/Web URL
    if (url && (url.startsWith('http') || url.includes('/'))) {
        window.open(url, '_blank');
        return;
    }
    
    // 2. Try Base64 Data
    if (data) {
        try {
            const byteCharacters = atob(data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
            return;
        } catch (err) {
            console.error("Resume decoding failed", err);
        }
    }
    
    showAlert("Error", "No resume found or file is invalid.", 'error');
  };

  const handleSubmitArticle = async (e: React.FormEvent) => { 
    e.preventDefault(); if (!editorRef.current) return; const content = editorRef.current.innerHTML; 
    if(!content.trim() || !articleTitle) return; setIsSubmittingArticle(true); 
    const seo = await analyzeArticleSEO(content, articleTitle); 
    const newPost: BlogPost = { id: Date.now(), title: articleTitle, content, excerpt: content.replace(/<[^>]+>/g, '').substring(0, 150) + "...", date: new Date().toLocaleDateString(), author: user.name, authorId: user.id, role: "Employer", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: articleCategory || "General", readTime: "5 min", status: 'Pending', ...seo }; 
    addPost(newPost); setIsSubmittingArticle(false); setArticleTitle(''); if(editorRef.current) editorRef.current.innerHTML = ''; 
    showAlert("Success", "Article sent for review.", 'success'); setActiveTab('jobs'); 
  };

  const execCmd = (command: string, value: string | undefined = undefined) => { 
    document.execCommand(command, false, value); 
    editorRef.current?.focus(); 
  };

  const submitRejection = () => { 
      if (rejectAppId && rejectionReason) { 
          updateApplicationStatus(rejectAppId, 'Rejected', { rejectionReason }); 
          setShowRejectModal(false); 
          setRejectAppId(null); 
          setRejectionReason(''); 
          showAlert("Success", "Candidate rejected.", 'success');
      } 
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
      <AlertModal isOpen={alertState.isOpen} onClose={closeAlert} title={alertState.title} message={alertState.message} type={alertState.type} onConfirm={alertState.onConfirm} />
      
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 z-20 flex flex-col h-screen sticky top-0">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <img src={user.avatar || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                  <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={16} className="text-white"/></div>
                  <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 truncate text-sm">{user.name}</h2>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded font-bold">{user.plan}</span>
                  {user.verificationStatus === 'Verified' && <Shield size={10} className="text-green-600"/>}
                </div>
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <button onClick={() => { resetForm(); setShowPostModal(true); }} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"><Plus size={18} /> Post Job</button>
              <nav className="space-y-1">
                {[
                  { id: 'jobs', label: 'My Listings', icon: FileText },
                  { id: 'ats', label: 'ATS Board', icon: LayoutList },
                  { id: 'candidates', label: 'Talent Sourcing', icon: Search },
                  { id: 'calendar', label: 'Interviews', icon: Calendar },
                  { id: 'articles', label: 'Career Blog', icon: PenTool },
                  { id: 'profile', label: 'Settings', icon: Settings },
                ].map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition ${activeTab === item.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <item.icon size={18} /> {item.label}
                  </button>
                ))}
              </nav>
          </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === 'jobs' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-gray-900">Manage Listings</h2>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <table className="w-full text-left text-sm text-gray-600">
                          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b"><tr><th className="px-6 py-4">Title</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Applicants</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
                          <tbody className="divide-y divide-gray-100">
                              {myJobs.map(job => (
                                  <tr key={job.id} className="hover:bg-gray-50 transition">
                                      <td className="px-6 py-4 font-bold text-gray-900">{job.title}</td>
                                      <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{job.status}</span></td>
                                      <td className="px-6 py-4"><button onClick={() => { setSelectedJobIdForApps(job.id); setActiveTab('ats'); }} className="bg-gray-100 px-2 py-1 rounded font-bold text-xs flex items-center gap-1"><Users size={12}/> {applications.filter(a => a.jobId === job.id).length}</button></td>
                                      <td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => handleEditJob(job)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16}/></button><button onClick={() => showConfirm("Delete?", "Confirm deletion", () => deleteJob(job.id))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'ats' && (
              <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-900">ATS Board</h2><select className="bg-white border rounded-lg px-4 py-2 text-sm" value={selectedJobIdForApps || ''} onChange={(e) => setSelectedJobIdForApps(e.target.value)}><option value="">All Vacancies</option>{myJobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}</select></div>
                  <div className="flex-1 overflow-x-auto pb-4"><div className="flex gap-6 min-w-max h-full">{['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].map(status => (
                    <div key={status} className="w-72 bg-gray-100 rounded-2xl flex flex-col border border-gray-200"><div className="p-4 border-b font-bold text-xs text-gray-500 uppercase tracking-widest">{status}</div><div className="p-3 space-y-3 overflow-y-auto flex-1 h-[70vh]">{selectedJobApps.filter(a => a.status === status).map(app => (
                      <div key={app.id} onClick={() => handleViewCandidate(allUsers.find(u => u.id === app.seekerId)!)} className="bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-primary-400 transition cursor-pointer">
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-bold text-sm text-gray-900">{allUsers.find(u => u.id === app.seekerId)?.name}</div>
                            <button onClick={(e) => handleDownloadResume(e, app.resumeUrl, app.resumeData)} className="p-1 text-gray-400 hover:text-primary-600"><Download size={14}/></button>
                        </div>
                        <div className="flex gap-1">
                          {status !== 'Rejected' && status !== 'Offer' && <button onClick={(e) => { e.stopPropagation(); handleAppStatusChange(app.id, status === 'Applied' ? 'Screening' : status === 'Screening' ? 'Interview' : 'Offer'); }} className="flex-1 bg-primary-50 text-primary-700 py-1.5 rounded-lg text-[10px] font-bold">Advance</button>}
                          <button onClick={(e) => { e.stopPropagation(); handleAppStatusChange(app.id, 'Rejected'); }} className="px-2.5 py-1.5 border rounded-lg text-gray-400 hover:text-red-600"><XCircle size={14}/></button>
                        </div>
                      </div>
                    ))}</div></div>
                  ))}</div></div>
              </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-900">Interview Calendar</h2><div className="flex items-center gap-3 bg-white p-2 rounded-xl border"><button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20}/></button><span className="font-bold text-sm min-w-[120px] text-center uppercase tracking-wide">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span><button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={20}/></button></div></div>
              <div className="bg-white rounded-2xl shadow-sm border p-6"><div className="grid grid-cols-7 gap-px bg-gray-200 border rounded-xl overflow-hidden shadow-inner">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="bg-gray-50 py-3 text-center text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{d}</div>)}{(() => { const days = []; const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate(); for(let i=0; i<firstDay; i++) days.push(<div key={`e-${i}`} className="bg-white h-32"/>); for(let d=1; d<=daysInMonth; d++) { const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; const ints = applications.filter(a => myJobs.some(j => j.id === a.jobId) && a.interviewDate === dateStr && a.status === 'Interview'); days.push(<div key={d} className="bg-white h-32 p-2 border-t hover:bg-gray-50 transition group"><span className="text-xs font-bold text-gray-400">{d}</span><div className="mt-2 space-y-1">{ints.map(i => <div key={i.id} className="text-[9px] font-bold p-1 bg-purple-50 text-purple-700 rounded border border-purple-100 truncate" title={`${allUsers.find(u => u.id === i.seekerId)?.name} @ ${i.interviewTime}`}>{i.interviewTime} {allUsers.find(u => u.id === i.seekerId)?.name}</div>)}</div></div>); } return days; })()}</div></div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="space-y-6">
               <h2 className="text-2xl font-bold text-gray-900">Talent Sourcing</h2>
               <div className="bg-white p-6 rounded-2xl border flex flex-col md:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><input type="text" placeholder="Search seekers..." className="w-full pl-10 pr-4 py-2 border rounded-xl" value={candidateSearch} onChange={e => setCandidateSearch(e.target.value)}/></div><div className="md:w-48 relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/><select className="w-full pl-10 pr-4 py-2 border rounded-xl appearance-none bg-white" value={candidateLocation} onChange={e => setCandidateLocation(e.target.value)}><option value="">Any Location</option>{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredCandidates.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-2xl border shadow-sm hover:border-primary-400 transition flex flex-col items-center text-center"><img src={c.avatar} className="w-20 h-20 rounded-full mb-4 border shadow-sm object-cover"/><h3 className="font-bold text-lg text-gray-900">{c.name}</h3><p className="text-sm text-primary-600 font-bold mb-4">{c.jobTitle || 'Candidate'}</p><button onClick={() => handleViewCandidate(c)} className="w-full py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition">View CV Profile</button></div>
                  ))}</div>
            </div>
          )}

          {activeTab === 'profile' && (
              <div className="space-y-6 max-w-4xl">
                  <h2 className="text-2xl font-bold text-gray-900">Company Settings</h2>
                  <div className={`p-5 rounded-2xl border flex items-center justify-between ${user.verificationStatus === 'Verified' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}><div className="flex items-center gap-4"><Shield size={24} className={user.verificationStatus === 'Verified' ? 'text-green-600' : 'text-orange-600'}/><div><h3 className="font-bold text-gray-900 uppercase text-xs">Status</h3><p className={`font-extrabold ${user.verificationStatus === 'Verified' ? 'text-green-700' : 'text-orange-700'}`}>{user.verificationStatus || 'Unverified'}</p></div></div>{user.verificationStatus !== 'Verified' && (<button onClick={() => licenseInputRef.current?.click()} className="bg-white border px-5 py-2.5 rounded-xl font-bold text-sm">Verify Account</button>)}<input type="file" ref={licenseInputRef} className="hidden" accept=".pdf,.jpg,.png" onChange={handleVerificationUpload} /></div>
                  <div className="bg-white rounded-2xl shadow-sm border p-8"><form onSubmit={handleUpdateProfile} className="space-y-6"><div className="grid grid-cols-2 gap-6"><div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Company Name</label><input value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border p-3 rounded-xl" required/></div><div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Industry</label><select value={industry} onChange={e => setIndustry(e.target.value)} className="w-full border p-3 rounded-xl bg-white">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div></div><button type="submit" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold">Save Changes</button></form></div>
              </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-6 max-w-4xl">
              <h2 className="text-2xl font-bold text-gray-900">Write Careers Article</h2>
              <div className="bg-white p-8 rounded-2xl border shadow-sm"><form onSubmit={handleSubmitArticle} className="space-y-6"><div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title</label><input type="text" value={articleTitle} onChange={e => setArticleTitle(e.target.value)} className="w-full border p-4 rounded-xl font-bold text-xl" placeholder="Share expertise..."/></div><div className="border rounded-xl overflow-hidden"><div className="bg-gray-50 border-b p-2 flex gap-2"><button type="button" onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-200 rounded"><Bold size={16}/></button><button type="button" onClick={() => execCmd('italic')} className="p-2 hover:bg-gray-200 rounded"><Italic size={16}/></button></div><div ref={editorRef} contentEditable className="min-h-[400px] p-6 outline-none prose prose-sm max-w-none bg-white"></div></div><button type="submit" disabled={isSubmittingArticle} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50">{isSubmittingArticle ? 'Submitting...' : 'Post Article'}</button></form></div>
            </div>
          )}
      </main>

      {/* --- MODALS --- */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8 border-b pb-4"><div><h2 className="text-2xl font-bold text-gray-900">{editingJobId ? 'Edit Listing' : 'Post New Vacancy'}</h2></div><button onClick={() => setShowPostModal(false)}><X size={24}/></button></div>
            <form onSubmit={handleSubmitJob} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">Job Title</label><input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-xl p-3" placeholder="Senior Project Manager"/></div>
                <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-xl p-3 bg-white">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">Location</label><select value={location} onChange={e => setLocation(e.target.value)} className="w-full border rounded-xl p-3 bg-white">{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">Salary Min</label><input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className="w-full border rounded-xl p-3"/></div>
                <div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">Deadline</label><input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full border rounded-xl p-3"/></div>
              </div>
              <div><div className="flex justify-between items-center mb-2"><label className="block text-[10px] font-extrabold text-gray-400 uppercase">Job Description</label><button type="button" onClick={handleAIHelp} disabled={isGenerating} className="text-xs font-extrabold text-purple-600 flex items-center gap-1.5 transition disabled:opacity-50">{isGenerating ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>} AI Help</button></div><textarea required value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full border rounded-xl p-4 text-sm leading-relaxed" placeholder="Detailed role summary..."></textarea></div>
              <div className="pt-6 border-t flex gap-6"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} className="w-5 h-5 rounded text-red-600"/><span className="text-sm font-bold text-gray-600">Urgent</span></label><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="w-5 h-5 rounded text-blue-600"/><span className="text-sm font-bold text-gray-600">Featured</span></label></div>
              <button type="submit" className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary-500/25 active:scale-95">{editingJobId ? 'Update Listing' : 'Publish Job'}</button>
            </form>
          </div>
        </div>
      )}

      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="font-bold text-xl text-gray-900">{selectedCandidate.name}</h2>
                        <p className="text-sm text-primary-600 font-bold">{selectedCandidate.jobTitle}</p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={(e) => handleDownloadResume(e, (selectedCandidate as any).resumeUrl, selectedCandidate.resumeData)} 
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center gap-2"
                        >
                            <Download size={18}/> View Resume
                        </button>
                        <button onClick={() => setShowCandidateModal(false)} className="p-2 hover:bg-red-50 text-red-600 rounded-full transition">
                            <X size={24}/>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-12 bg-gray-100 flex justify-center">
                    <div className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm]">
                        <CVTemplates user={selectedCandidate} theme="Professional" />
                    </div>
                </div>
            </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4"><div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl"><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-xl">Schedule Interview</h3><button onClick={() => setShowScheduleModal(false)}><X/></button></div><form onSubmit={submitInterviewSchedule} className="space-y-5"><div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">Preferred Date</label><input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} required className="w-full border p-3 rounded-xl"/></div><div><label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-2">Preferred Time</label><input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} required className="w-full border p-3 rounded-xl"/></div><button className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold">Send Invitation</button></form></div></div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4"><div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl"><h3 className="font-bold text-xl text-gray-900 mb-2">Reject Candidate</h3><select value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="w-full border p-3 rounded-xl mb-6 font-bold"><option value="">Select Reason</option><option value="Not qualified">Missing Skills</option><option value="Insufficient experience">Need more experience</option></select><div className="flex gap-3"><button onClick={() => setShowRejectModal(false)} className="flex-1 py-3 border rounded-xl">Cancel</button><button onClick={submitRejection} disabled={!rejectionReason} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">Reject</button></div></div></div>
      )}
    </div>
  );
};