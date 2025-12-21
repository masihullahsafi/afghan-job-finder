
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { generateJobDescription, analyzeArticleSEO } from '../../services/geminiService';
import { uploadFile } from '../services/api';
import { Plus, FileText, Users, Eye, Settings, Edit2, Trash2, Search, X, CheckCircle, CreditCard, Download, Calendar, Camera, Shield, Upload, Bookmark, BarChart2, PenTool, Megaphone, ArrowRight, Bold, Italic, LayoutList, XCircle, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Job, BlogPost, Application, User } from '../../types';
import { useNavigate } from 'react-router-dom';
import { CVTemplates } from '../../components/CVTemplates';
import { AlertModal } from '../../components/AlertModal';

export const EmployerDashboard: React.FC = () => {
  const { user, t, jobs, applications, addJob, updateJob, deleteJob, updateApplicationStatus, updateApplicationMeta, updateUserProfile, uploadVerificationDoc, cities, categories, allUsers, addPost, toggleSaveCandidate, announcements } = useAppContext();
  const navigate = useNavigate();
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'jobs' | 'profile' | 'candidates' | 'billing' | 'articles' | 'ats' | 'saved' | 'calendar'>('jobs');
  
  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showAppReviewModal, setShowAppReviewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Data Selections
  const [selectedJobIdForApps, setSelectedJobIdForApps] = useState<string | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [analyticsJob, setAnalyticsJob] = useState<Job | null>(null);
  const [reviewApp, setReviewApp] = useState<Application | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);
  const [scheduleAppId, setScheduleAppId] = useState<string | null>(null);
  const [rejectAppId, setRejectAppId] = useState<string | null>(null);

  // Alert State
  const [alertState, setAlertState] = useState<{isOpen: boolean; title: string; message: string; type: 'success' | 'error' | 'warning' | 'info'; onConfirm?: () => void;}>({ isOpen: false, title: '', message: '', type: 'info' });
  
  // Job Post Form
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

  // Profile Form
  const [companyName, setCompanyName] = useState(user?.name || '');
  const [companyDesc, setCompanyDesc] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [industry, setIndustry] = useState(user?.industry || '');
  const [youtubeUrl, setYoutubeUrl] = useState(user?.youtubeUrl || '');
  const [bannerPreview, setBannerPreview] = useState<string | null>(user?.banner || null);

  // Article Form
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('');
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  
  // Interview Form
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewMessage, setInterviewMessage] = useState("We'd like to invite you for an interview.");
  
  // Review Form
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');

  // Search Filters
  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateLocation, setCandidateLocation] = useState('');
  const [candidateSkill, setCandidateSkill] = useState('');

  // Calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);

  // Effects
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

  if (!user || user.role !== 'EMPLOYER') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                  <p className="text-gray-600 mb-4">Please login as an Employer.</p>
                  <button onClick={() => navigate('/auth')} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold">Login</button>
              </div>
          </div>
      );
  }

  // Derived Data
  const myJobs = jobs.filter(job => job.employerId === user?._id || job.company === user?.name);
  const selectedJobApps = selectedJobIdForApps 
    ? applications.filter(app => app.jobId === selectedJobIdForApps) 
    : applications.filter(app => myJobs.some(j => j._id === app.jobId));

  const savedTalentList = allUsers.filter(u => user.savedCandidates?.includes(u._id));
  const activeAnnouncements = announcements.filter(a => a.isActive && (a.targetAudience === 'All' || a.targetAudience === 'Employers'));
  
  const filteredCandidates = allUsers.filter(u => { 
      if (u.role !== 'SEEKER') return false; 
      const matchesSearch = candidateSearch ? (u.name.toLowerCase().includes(candidateSearch.toLowerCase()) || u.jobTitle?.toLowerCase().includes(candidateSearch.toLowerCase())) : true; 
      const matchesLocation = candidateLocation ? u.address?.toLowerCase().includes(candidateLocation.toLowerCase()) : true; 
      const matchesSkill = candidateSkill ? u.verifiedSkills?.some(s => s.toLowerCase().includes(candidateSkill.toLowerCase())) : true; 
      return matchesSearch && matchesLocation && matchesSkill; 
  });

  // Alert Helpers
  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertState({ isOpen: true, title, message, type, onConfirm: undefined });
  };
  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setAlertState({ isOpen: true, title, message, type: 'warning', onConfirm });
  };
  const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

  // --- Handlers ---

  const handleOpenPostModal = () => { 
      if (user?.status === 'Pending') { 
          showAlert("Account Pending", "Your company profile is under review.", 'warning'); 
          return; 
      } 
      resetForm(); 
      setShowPostModal(true); 
  };

  const resetForm = () => { 
      setTitle(''); setCategory(''); setJobType('Full-time'); setExperience('Entry'); setSalaryMin(''); setSalaryMax(''); 
      setDeadline(''); setLocation(''); setSkills(''); setDescription(''); setResponsibilities(''); setApplyMethod('Internal'); 
      setApplyUrl(''); setEditingJobId(null); setVacancyNumber(''); 
      setNoOfJobs('1'); setContractDuration(''); setContractExtensible(false); setProbationPeriod(''); setGender('Any'); 
      setEducation(''); setNationality('Any'); setYearsOfExperience(''); setIsUrgent(false); setIsFeatured(false); 
  };

  const handleEditJob = (job: Job) => { 
      setEditingJobId(job._id); setTitle(job.title); setCategory(job.category); setJobType(job.type); 
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

  const handleDeleteJob = (_id: string) => showConfirm("Delete Job", "Are you sure?", () => deleteJob(_id));

  const handleSubmitJob = (e: React.FormEvent) => { 
      e.preventDefault(); 
      const newJob: Job = { 
          _id: editingJobId || Date.now().toString(), employerId: user._id, title, company: user.name, 
          companyLogo: user.avatar || 'https://via.placeholder.com/150', location, salaryMin: parseInt(salaryMin), 
          salaryMax: parseInt(salaryMax), currency: 'AFN', type: jobType as any, experienceLevel: experience as any, 
          category, postedDate: new Date().toISOString().split('T')[0], deadline, description, 
          requirements: skills.split(',').map(s => s.trim()), responsibilities: responsibilities.split('\n').filter(s => s.trim() !== ''), 
          isFeatured, status: 'Active', applyMethod, applyUrl: applyMethod === 'External' ? applyUrl : undefined, 
          isUrgent, vacancyNumber, noOfJobs: parseInt(noOfJobs), contractDuration, contractExtensible, probationPeriod, 
          gender, education, nationality, yearsOfExperience 
      }; 
      if (editingJobId) { updateJob(newJob); showAlert("Success", "Job updated successfully!", 'success'); } 
      else { addJob(newJob); showAlert("Success", "Job posted successfully!", 'success'); } 
      setShowPostModal(false); resetForm(); 
  };

  const handleAIHelp = async () => { 
      if (title && skills) { 
          setIsGenerating(true); 
          const desc = await generateJobDescription(title, skills); 
          setDescription(desc); 
          setIsGenerating(false); 
      } else showAlert("Missing Info", "Please enter Title and Skills.", 'warning'); 
  };

  const handleViewApps = (jobId: string) => { setSelectedJobIdForApps(jobId); setActiveTab('ats'); };
  const handleOpenAnalytics = (job: Job) => { setAnalyticsJob(job); setShowAnalyticsModal(true); };
  
  const handleAppStatusChange = (appId: string, status: any) => { 
      if (status === 'Interview') { setScheduleAppId(appId); setShowScheduleModal(true); } 
      else if (status === 'Rejected') { setRejectAppId(appId); setShowRejectModal(true); } 
      else { updateApplicationStatus(appId, status); } 
  };

  const submitRejection = () => { 
      if (rejectAppId && rejectionReason) { 
          updateApplicationStatus(rejectAppId, 'Rejected', { rejectionReason }); 
          setShowRejectModal(false); setRejectAppId(null); setRejectionReason(''); 
      } 
  };

  const submitInterviewSchedule = (e: React.FormEvent) => { 
      e.preventDefault(); 
      if (scheduleAppId) { 
          updateApplicationStatus(scheduleAppId, 'Interview', { interviewDate, interviewTime, interviewMessage }); 
          showAlert("Scheduled", "Invitation sent.", 'success'); 
          setShowScheduleModal(false); setInterviewDate(''); setInterviewTime(''); 
      } 
  };

  const handleDownloadResume = (e: React.MouseEvent, filename: string, applicantId: string, resumeData?: string) => { 
      e.preventDefault(); e.stopPropagation(); 
      // If it's a Cloudinary URL
      if (resumeData && resumeData.startsWith('http')) {
          window.open(resumeData, '_blank');
          return;
      }
      // If it's Base64 (Legacy)
      if (resumeData) { 
          try { 
              const byteCharacters = atob(resumeData); 
              const byteNumbers = new Array(byteCharacters.length); 
              for (let i = 0; i < byteCharacters.length; i++) { byteNumbers[i] = byteCharacters.charCodeAt(i); } 
              const byteArray = new Uint8Array(byteNumbers); 
              const blob = new Blob([byteArray], { type: filename.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream' }); 
              const element = document.createElement("a"); element.href = URL.createObjectURL(blob); element.download = filename; 
              document.body.appendChild(element); element.click(); document.body.removeChild(element); 
          } catch (error) { console.error("Download failed", error); showAlert("Error", "Download failed. Invalid file.", 'error'); } 
          return; 
      } 
      showAlert("No File", "Resume not found.", 'error'); 
  };

  const handleViewCandidate = (candidate: User) => { setSelectedCandidate(candidate); setShowCandidateModal(true); };
  
  const handleUpdateProfile = (e: React.FormEvent) => { 
      e.preventDefault(); 
      updateUserProfile({ name: companyName, bio: companyDesc, website, industry, youtubeUrl, banner: bannerPreview || undefined }); 
      showAlert("Updated", "Profile saved.", 'success'); 
  };

  // Cloudinary Uploads
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { try { const file = e.target.files[0]; const url = await uploadFile(file); setBannerPreview(url); } catch(err) { console.error(err); } } };
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) { try { const url = await uploadFile(file); await updateUserProfile({ avatar: url }); showAlert("Success", "Logo updated!", 'success'); } catch(err) { console.error(err); } } };
  
  const handleVerificationUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          try {
              const url = await uploadFile(file);
              await uploadVerificationDoc(user._id, url);
              showAlert("Request Sent", "License uploaded. Status: Pending.", 'success');
          } catch(err) {
              showAlert("Error", "Failed to upload file.", 'error');
          }
      }
  };

  // Article
  const execCmd = (command: string, value: string | undefined = undefined) => { document.execCommand(command, false, value); editorRef.current?.focus(); };
  
  const handleSubmitArticle = async (e: React.FormEvent) => { e.preventDefault(); if (!editorRef.current) return; const content = editorRef.current.innerHTML; if(!content.trim() || !articleTitle) return; setIsSubmittingArticle(true); const seo = await analyzeArticleSEO(content, articleTitle); const newPost: BlogPost = { _id: Date.now(), title: articleTitle, content: content, excerpt: content.replace(/<[^>]+>/g, '').substring(0, 150) + "...", date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), author: user.name, authorId: user._id, role: "Employer", image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", category: articleCategory || "General", readTime: Math.ceil(content.split(' ').length / 200) + " min read", status: 'Pending', seoTitle: seo.seoTitle, seoDescription: seo.seoDescription, seoKeywords: seo.keywords }; addPost(newPost); setIsSubmittingArticle(false); setArticleTitle(''); if(editorRef.current) editorRef.current.innerHTML = ''; showAlert("Success", "Article submitted.", 'success'); setActiveTab('jobs'); };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
      <AlertModal isOpen={alertState.isOpen} onClose={closeAlert} title={alertState.title} message={alertState.message} type={alertState.type} onConfirm={alertState.onConfirm} />
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 z-20">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <img src={user.avatar || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                  <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera size={16} className="text-white"/></div>
                  <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              </div>
              <div className="min-w-0"><h2 className="font-bold text-gray-900 truncate">{user.name}</h2><p className="text-xs text-gray-500">{user.plan} Plan</p>{user.verificationStatus === 'Verified' && <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5"><Shield size={10}/> Verified</span>}</div>
          </div>
          <div className="p-4">
              <button onClick={handleOpenPostModal} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 mb-6"><Plus size={20} /> {t('postJob')}</button>
              <nav className="space-y-1">{[{ id: 'jobs', label: 'My Jobs', icon: FileText }, { id: 'ats', label: 'ATS Board', icon: LayoutList }, { id: 'candidates', label: 'Candidate Search', icon: Search }, { id: 'calendar', label: 'Interviews', icon: Calendar }, { id: 'saved', label: 'Saved Talent', icon: Bookmark }, { id: 'articles', label: 'Write Article', icon: PenTool }, { id: 'profile', label: 'Company Profile', icon: Settings }, { id: 'billing', label: 'Billing & Plan', icon: CreditCard }].map(item => <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === item.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}><item.icon size={18} /> {item.label}</button>)}</nav>
          </div>
          <div className="p-4 mt-auto border-t border-gray-100"><button onClick={() => navigate(`/companies/${user._id}`)} className="w-full flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition justify-center"><Eye size={16} /> Preview Public Profile</button></div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
          {activeAnnouncements.length > 0 && <div className="mb-6 space-y-2">{activeAnnouncements.map(ann => <div key={ann._id} className="p-4 rounded-xl border flex items-start gap-3 bg-blue-50 border-blue-200 text-blue-800"><Megaphone size={20} className="flex-shrink-0 mt-0.5" /><div><h4 className="font-bold text-sm">{ann.title}</h4><p className="text-sm opacity-90">{ann.message}</p></div></div>)}</div>}

          {/* JOBS TAB */}
          {activeTab === 'jobs' && (
              <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Jobs</h2>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <table className="w-full text-left text-sm text-gray-600">
                          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500"><tr><th className="px-6 py-4">Job Title</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Applicants</th><th className="px-6 py-4">Posted</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
                          <tbody className="divide-y divide-gray-100">
                              {myJobs.map(job => (
                                  <tr key={job._id} className="hover:bg-gray-50 transition">
                                      <td className="px-6 py-4 font-medium text-gray-900">{job.title}{job.isUrgent && <span className="ml-2 bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Urgent</span>}{job.isFeatured && <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Featured</span>}</td>
                                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{job.status}</span></td>
                                      <td className="px-6 py-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-bold text-xs">{applications.filter(a => a.jobId === job._id).length}</span></td>
                                      <td className="px-6 py-4">{job.postedDate}</td>
                                      <td className="px-6 py-4 text-right flex justify-end gap-2"><button onClick={() => handleViewApps(job._id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Users size={18} /></button><button onClick={() => handleOpenAnalytics(job)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"><BarChart2 size={18} /></button><button onClick={() => handleEditJob(job)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Edit2 size={18} /></button><button onClick={() => handleDeleteJob(job._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
              <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${user.verificationStatus === 'Verified' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                      <div className="flex items-center gap-3"><Shield size={24} className={user.verificationStatus === 'Verified' ? 'text-green-600' : 'text-yellow-600'}/><div><h3 className={`font-bold ${user.verificationStatus === 'Verified' ? 'text-green-800' : 'text-yellow-800'}`}>Status: {user.verificationStatus || 'Unverified'}</h3><p className="text-sm opacity-80">{user.verificationStatus === 'Verified' ? 'Trusted Company' : 'Upload Business License to get verified.'}</p></div></div>
                      {user.verificationStatus !== 'Verified' && (<div><button onClick={() => licenseInputRef.current?.click()} className="bg-white border border-yellow-300 text-yellow-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-100 transition shadow-sm flex items-center gap-2"><Upload size={14}/> Upload License</button><input type="file" ref={licenseInputRef} className="hidden" accept=".pdf,.jpg,.png" onChange={handleVerificationUpload} /></div>)}
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div><label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label><input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full border p-2 rounded-lg"/></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-1">Website</label><input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full border p-2 rounded-lg"/></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-1">Industry</label><select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full border p-2 rounded-lg bg-white"><option value="">Select Industry</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-1">YouTube Video URL</label><input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full border p-2 rounded-lg"/></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-1">About</label><textarea value={companyDesc} onChange={(e) => setCompanyDesc(e.target.value)} rows={4} className="w-full border p-2 rounded-lg"></textarea></div>
                          <div><label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>{bannerPreview && <div className="mb-2 h-32 w-full overflow-hidden rounded-lg"><img src={bannerPreview} className="w-full h-full object-cover"/></div>}<input type="file" accept="image/*" onChange={handleBannerUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/></div>
                          <div className="pt-4"><button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold">Save Profile</button></div>
                      </form>
                  </div>
              </div>
          )}

          {/* ATS TAB */}
          {activeTab === 'ats' && (
              <div className="space-y-6 h-full flex flex-col">
                  <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-900">ATS Board</h2><select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm" value={selectedJobIdForApps || ''} onChange={(e) => setSelectedJobIdForApps(e.target.value)}><option value="">All Jobs</option>{myJobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}</select></div>
                  <div className="flex-1 overflow-x-auto pb-4"><div className="flex gap-6 min-w-max h-full">{['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'].map(status => <div key={status} className="w-80 bg-gray-100 rounded-xl flex flex-col h-full border border-gray-200"><div className="p-4 border-b border-gray-200 font-bold text-sm bg-gray-200">{status} ({selectedJobApps.filter(a => a.status === status).length})</div><div className="p-3 space-y-3 overflow-y-auto flex-1">{selectedJobApps.filter(a => a.status === status).map(app => <div key={app._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer"><div className="flex justify-between items-center"><h4 className="font-bold text-sm">{allUsers.find(u => u._id === app.seekerId)?.name}</h4><button onClick={() => handleDownloadResume({preventDefault:()=>{}, stopPropagation:()=>{}} as any, app.resumeUrl, app._id, app.resumeData)}><Download size={14} className="text-gray-400 hover:text-primary-600"/></button></div><div className="flex gap-1 mt-2">
                      {status === 'Applied' && <button onClick={() => handleAppStatusChange(app._id, 'Screening')} className="p-1 bg-blue-50 text-blue-600 rounded"><ArrowRight size={14}/></button>}
                      {status === 'Screening' && <><button onClick={() => updateApplicationStatus(app._id, 'Interview')} className="p-1 bg-blue-50 text-blue-600 rounded"><ArrowRight size={14}/></button><button onClick={() => { setScheduleAppId(app._id); setShowScheduleModal(true); }} className="p-1 bg-purple-50 text-purple-600 rounded"><Calendar size={14}/></button></>}
                      {status === 'Interview' && <button onClick={() => updateApplicationStatus(app._id, 'Offer')} className="p-1 bg-green-50 text-green-600 rounded"><CheckCircle size={14}/></button>}
                      {(status === 'Rejected' || status === 'Offer') && <button onClick={() => updateApplicationStatus(app._id, 'Screening')} className="p-1 bg-gray-50 text-gray-600 rounded" title="Revert"><RotateCcw size={14}/></button>}
                      {status !== 'Rejected' && <button onClick={() => { setRejectAppId(app._id); setShowRejectModal(true); }} className="p-1 text-red-600 bg-red-50 rounded"><XCircle size={14}/></button>}
                  </div></div>)}</div></div>)}</div></div>
              </div>
          )}
          
          {/* Other Tabs */}
          {activeTab === 'candidates' && <div className="space-y-6"><h2 className="text-2xl font-bold text-gray-900">Candidate Search</h2><div className="flex gap-2"><input type="text" placeholder="Skills, Title..." value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)} className="border p-2 rounded-lg text-sm w-40"/><input type="text" placeholder="Location..." value={candidateLocation} onChange={(e) => setCandidateLocation(e.target.value)} className="border p-2 rounded-lg text-sm w-40"/></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredCandidates.map(c => <div key={c._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center"><img src={c.avatar} className="w-20 h-20 rounded-full mb-3 bg-gray-100"/><h3 className="font-bold">{c.name}</h3><p className="text-sm text-gray-500">{c.jobTitle}</p><div className="flex gap-2 mt-4"><button onClick={() => toggleSaveCandidate(c._id)} className="border p-2 rounded-lg text-sm">{user.savedCandidates?.includes(c._id) ? 'Saved' : 'Save'}</button><button onClick={() => handleViewCandidate(c)} className="bg-primary-600 text-white p-2 rounded-lg text-sm">View</button></div></div>)}</div></div>}
          {activeTab === 'saved' && <div className="space-y-6"><h2 className="text-2xl font-bold text-gray-900">Saved Talent</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{savedTalentList.map(c => <div key={c._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center"><img src={c.avatar} className="w-20 h-20 rounded-full mb-3"/><h3 className="font-bold">{c.name}</h3><button onClick={() => handleViewCandidate(c)} className="bg-primary-600 text-white p-2 rounded-lg text-sm mt-4">View</button></div>)}</div></div>}
          {activeTab === 'billing' && <div className="text-center py-20 bg-white rounded-xl"><h3>Current Plan: {user.plan}</h3><button className="bg-primary-600 text-white px-4 py-2 rounded-lg mt-4" onClick={() => setShowPaymentModal(true)}>Upgrade</button></div>}
          
          {/* Calendar */}
          {activeTab === 'calendar' && <div className="space-y-6"><div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-900">Interview Calendar</h2><div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200"><button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button><span className="font-bold">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span><button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20}/></button></div></div><div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="bg-gray-50 py-3 text-center text-xs font-bold text-gray-500 uppercase">{d}</div>)}{(() => { const days = []; const year = currentMonth.getFullYear(); const month = currentMonth.getMonth(); const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate(); for(let i=0; i<firstDay; i++) days.push(<div key={`e-${i}`} className="bg-white h-32"/>); for(let d=1; d<=daysInMonth; d++) { const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; const ints = applications.filter(a => myJobs.some(j => j._id === a.jobId) && a.interviewDate === dateStr && a.status === 'Interview'); days.push(<div key={d} className="bg-white h-32 p-2 border-t"><span className="font-bold text-sm">{d}</span>{ints.map(i => <div key={i._id} className="text-[10px] bg-purple-100 p-1 rounded mt-1 truncate">{i.interviewTime}</div>)}</div>); } return days; })()}</div></div></div>}
          
          {/* Articles */}
          {activeTab === 'articles' && <div className="space-y-6"><h2 className="text-2xl font-bold">Write Article</h2><div className="bg-white p-6 rounded-xl border"><input value={articleTitle} onChange={e => setArticleTitle(e.target.value)} className="w-full border p-2 rounded mb-4" placeholder="Title"/><div className="border p-2 bg-gray-50 flex gap-2"><button onClick={() => execCmd('bold')} className="p-1 hover:bg-gray-200"><Bold size={16}/></button><button onClick={() => execCmd('italic')} className="p-1 hover:bg-gray-200"><Italic size={16}/></button></div><div ref={editorRef} contentEditable className="w-full border min-h-[300px] p-4 outline-none"></div><button onClick={handleSubmitArticle} className="bg-primary-600 text-white px-6 py-2 rounded mt-4">Submit</button></div></div>}
      </main>
      
      {/* Modals */}
      {showPostModal && <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"><div className="flex justify-between p-6 border-b"><h2 className="text-xl font-bold">{editingJobId ? 'Edit' : 'Post'} Job</h2><button onClick={() => setShowPostModal(false)}><X/></button></div><form onSubmit={handleSubmitJob} className="p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 rounded"/><select value={category} onChange={e => setCategory(e.target.value)} className="border p-2 rounded">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div className="grid grid-cols-3 gap-4"><select value={location} onChange={e => setLocation(e.target.value)} className="border p-2 rounded">{cities.map(c => <option key={c} value={c}>{c}</option>)}</select><input value={salaryMin} onChange={e => setSalaryMin(e.target.value)} placeholder="Min Salary" className="border p-2 rounded"/><input value={salaryMax} onChange={e => setSalaryMax(e.target.value)} placeholder="Max Salary" className="border p-2 rounded"/></div><div className="grid grid-cols-3 gap-4"><input value={vacancyNumber} onChange={e => setVacancyNumber(e.target.value)} placeholder="Vacancy No" className="border p-2 rounded"/><input value={noOfJobs} onChange={e => setNoOfJobs(e.target.value)} placeholder="No of Jobs" type="number" className="border p-2 rounded"/><input value={contractDuration} onChange={e => setContractDuration(e.target.value)} placeholder="Duration" className="border p-2 rounded"/></div><div className="grid grid-cols-3 gap-4"><input value={probationPeriod} onChange={e => setProbationPeriod(e.target.value)} placeholder="Probation" className="border p-2 rounded"/><input value={education} onChange={e => setEducation(e.target.value)} placeholder="Education" className="border p-2 rounded"/><input value={gender} onChange={e => setGender(e.target.value as any)} placeholder="Gender" className="border p-2 rounded"/></div><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4} className="w-full border p-2 rounded"/><textarea value={responsibilities} onChange={e => setResponsibilities(e.target.value)} placeholder="Responsibilities" rows={4} className="w-full border p-2 rounded"/><div className="flex items-center gap-2"><input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)}/> Urgent Hiring</div><button type="submit" className="w-full bg-primary-600 text-white py-3 rounded font-bold">Save Job</button></form></div></div>}
      {showCandidateModal && selectedCandidate && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] flex flex-col"><div className="p-4 border-b flex justify-between"><h2 className="font-bold">Candidate Profile</h2><div className="flex gap-2"><button onClick={(e) => handleDownloadResume(e, 'resume.pdf', selectedCandidate._id, selectedCandidate.resumeData)} className="bg-gray-900 text-white px-4 py-2 rounded text-sm"><Download size={16}/></button><button onClick={() => setShowCandidateModal(false)}><X/></button></div></div><div className="flex-1 overflow-y-auto p-8"><CVTemplates user={selectedCandidate} theme="Professional" /></div></div></div>}
      {showScheduleModal && <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-md p-6"><h3 className="font-bold mb-4">Schedule Interview</h3><form onSubmit={submitInterviewSchedule} className="space-y-4"><input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} className="w-full border p-2 rounded"/><input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)} className="w-full border p-2 rounded"/><textarea value={interviewMessage} onChange={e => setInterviewMessage(e.target.value)} className="w-full border p-2 rounded" rows={3}></textarea><button className="w-full bg-purple-600 text-white py-2 rounded font-bold">Send</button></form></div></div>}
      {showRejectModal && <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-sm p-6"><h3 className="font-bold mb-4">Reject Candidate</h3><select value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} className="w-full border p-2 rounded mb-4"><option value="">Select Reason</option><option value="Not qualified">Not qualified</option><option value="Position filled">Position filled</option></select><button onClick={submitRejection} className="w-full bg-red-600 text-white py-2 rounded font-bold">Reject</button></div></div>}
    </div>
  );
};
