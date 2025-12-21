import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapPin, Briefcase, Calendar, Building, CheckCircle, Upload, X, Bookmark, Sparkles, Loader2, FileText, Check, AlertTriangle, Share2, Flag, ArrowRight, MessageSquare, ShieldCheck, BarChart2, AlertCircle, ArrowLeft, DollarSign, Clock, Users, Linkedin, Facebook, Twitter, Copy, Mail, Flame } from 'lucide-react';
import { Application, Report, UserRole } from '../types';
import { generateCoverLetter, analyzeJobMatch, MatchAnalysisResult, fileToBase64, validateResume } from '../services/geminiService';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { InterviewModal } from '../components/InterviewModal';
import { AlertModal } from '../components/AlertModal';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, user, savedJobIds, toggleSaveJob, jobs, submitApplication, applications, allUsers, submitReport } = useAppContext();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onConfirm?: () => void;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setAlertState({ isOpen: true, title, message, type, onConfirm: undefined });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setAlertState({ isOpen: true, title, message, type: 'warning', onConfirm });
  };

  const closeAlert = () => setAlertState(prev => ({ ...prev, isOpen: false }));

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isValidatingFile, setIsValidatingFile] = useState(false);
  const [fileError, setFileError] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<{question: string, answer: string}[]>([]);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [matchResult, setMatchResult] = useState<MatchAnalysisResult | null>(null);
  const [isAnalyzingMatch, setIsAnalyzingMatch] = useState(false);
  const [copied, setCopied] = useState(false);

  const job = jobs.find(j => j._id === id);
  const company = allUsers.find(u => u.name === job?.company && u.role === UserRole.EMPLOYER);
  const similarJobs = jobs.filter(j => j.category === job?.category && j._id !== job?._id).slice(0, 3);
  
  const marketAverageSalary = job ? job.salaryMin * 0.9 : 0; 
  const applicantCount = applications.filter(a => a.jobId === id).length;
  const viewsCount = Math.floor(Math.random() * 500) + 50;

  useEffect(() => {
      if (job && job.screeningQuestions) {
          setScreeningAnswers(job.screeningQuestions.map(q => ({ question: q, answer: '' })));
      }
  }, [job]);

  if (!job) {
    return <div className="p-10 text-center text-gray-500">Job not found.</div>;
  }

  const isSaved = savedJobIds.includes(job._id);
  const hasApplied = applications.some(app => app.jobId === job._id && app.seekerId === user?._id);

  const handleApplyClick = () => {
    if (!user) {
        navigate('/auth', { state: { message: "Please login to apply for jobs." } });
        return;
    }
    if (user.role !== UserRole.SEEKER) {
        showAlert("Access Denied", "Only Job Seekers can apply for jobs.", 'error');
        return;
    }
    
    if (job.applyMethod === 'External' && job.applyUrl) {
        if (job.applyUrl.includes('@') && !job.applyUrl.startsWith('http')) {
            window.location.href = `mailto:${job.applyUrl}?subject=Application for ${job.title}`;
        } else {
            const url = job.applyUrl.startsWith('http') ? job.applyUrl : `https://${job.applyUrl}`;
            window.open(url, '_blank');
        }
    } else {
        setShowApplyModal(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFileError('');
      if (file) {
          setResumeFile(file);
          setIsValidatingFile(true);
          try {
              const base64 = await fileToBase64(file);
              const validation = await validateResume(base64, file.type);
              if (!validation.isValid) {
                  setFileError(validation.reason || "Invalid file format.");
                  setResumeFile(null);
              }
          } catch (e) {
              console.error(e);
              setFileError("Error reading file.");
          } finally {
              setIsValidatingFile(false);
          }
      }
  };

  const handleGenerateCoverLetter = async () => {
    if (!user) return;
    setIsGenerating(true);
    
    let resumeBase64 = undefined;
    let resumeType = undefined;

    if (resumeFile) {
        try {
            resumeBase64 = await fileToBase64(resumeFile);
            resumeType = resumeFile.type;
        } catch(e) { console.error("File error", e); }
    } else if (user.resumeData) {
        resumeBase64 = user.resumeData;
        resumeType = 'application/pdf'; 
    }

    const letter = await generateCoverLetter(
        job.title, 
        job.company, 
        user.name, 
        user.bio || "",
        resumeBase64,
        resumeType
    );
    setCoverLetter(letter);
    setIsGenerating(false);
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (fileError) {
        showAlert("File Error", "Please upload a valid resume.", 'error');
        return;
    }

    setIsSubmitting(true);
    
    let finalResumeData = user.resumeData;
    let finalResumeUrl = user.resumeUrl || '';

    if (resumeFile) {
        try {
            finalResumeData = await fileToBase64(resumeFile);
            // In a real app we'd upload to Cloudinary here, but for demo we treat base64 as the URL if needed
        } catch (e) {
            console.error(e);
            showAlert("Upload Failed", "Error processing file.", 'error');
            setIsSubmitting(false);
            return;
        }
    }

    const newApplication: Application = {
      _id: Date.now().toString(),
      jobId: job._id,
      seekerId: user._id,
      resumeUrl: finalResumeUrl || (resumeFile ? resumeFile.name : 'resume.pdf'),
      resumeData: finalResumeData,
      coverLetter,
      status: 'Applied',
      date: new Date().toISOString().split('T')[0],
      screeningAnswers: screeningAnswers.length > 0 ? screeningAnswers : undefined
    };

    setTimeout(() => {
      submitApplication(newApplication);
      setIsSubmitting(false);
      setShowApplyModal(false);
      navigate('/seeker', { state: { highlightJobId: job._id } });
    }, 1500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const report: Report = {
          _id: Date.now().toString(),
          jobId: job._id,
          reason: reportReason,
          details: reportDetails,
          status: 'Pending',
          date: new Date().toISOString().split('T')[0]
      };
      submitReport(report);
      setShowReportModal(false);
      showAlert("Report Submitted", "Thank you. Our team will review this job listing.", 'success');
  };

  const handleAnalyzeMatch = async () => {
      if (!user) { navigate('/auth'); return; }
      setIsAnalyzingMatch(true);
      const profileText = `${user.jobTitle} ${user.bio} Skills: ${user.verifiedSkills?.join(', ')}`;
      const result = await analyzeJobMatch(job.title, job.description, profileText);
      setMatchResult(result);
      setIsAnalyzingMatch(false);
  };

  const handleShare = () => {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleScreeningChange = (index: number, val: string) => {
      const newAnswers = [...screeningAnswers];
      newAnswers[index].answer = val;
      setScreeningAnswers(newAnswers);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <SEO title={`${job.title} at ${job.company}`} description={`${job.title} in ${job.location}. Apply now on Afghan Job Finder.`} />
      
      <AlertModal 
        isOpen={alertState.isOpen} 
        onClose={closeAlert}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
      />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="container mx-auto px-4 py-4 md:py-6">
              <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium mb-4">
                  <ArrowLeft size={16}/> Back
              </button>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-start gap-4">
                      <img 
                        src={job.companyLogo} 
                        alt={job.company} 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-gray-200 bg-white shadow-sm cursor-pointer hover:opacity-90 transition"
                        onClick={() => company && navigate(`/companies/${company._id}`)}
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random` }}
                      />
                      <div>
                          <div className="flex items-center gap-2 mb-1">
                              <h1 className="text-xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
                              {job.isUrgent && (
                                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] md:text-xs font-bold uppercase border border-red-200 flex items-center gap-1">
                                      <Flame size={12} className="fill-current"/> Urgent
                                  </span>
                              )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                              <span onClick={() => company && navigate(`/companies/${company._id}`)} className={`font-medium ${company ? 'text-primary-600 hover:underline cursor-pointer' : 'text-gray-700'}`}>{job.company}</span>
                              {company?.verificationStatus === 'Verified' && <ShieldCheck size={14} className="text-blue-500"/>}
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500 flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500">{t('posted')} {job.postedDate}</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto hidden md:flex">
                      <button onClick={() => toggleSaveJob(job._id)} className={`p-3 rounded-xl border transition ${isSaved ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                          {isSaved ? <Bookmark size={20} className="fill-current"/> : <Bookmark size={20}/>}
                      </button>
                      <button onClick={handleShare} className="p-3 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition" title="Share">
                          {copied ? <Check size={20} className="text-green-600"/> : <Share2 size={20}/>}
                      </button>
                      {hasApplied ? (
                          <button disabled className="bg-green-100 text-green-700 px-8 py-3 rounded-xl font-bold cursor-default flex items-center gap-2">
                              <CheckCircle size={20}/> Applied
                          </button>
                      ) : (
                          <button onClick={handleApplyClick} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/30">
                              {t('applyNow')} {job.applyMethod === 'External' && <ArrowRight size={16} className="inline ml-1"/>}
                          </button>
                      )}
                  </div>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-gray-900">{t('jobOverview')}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between"><span className="text-gray-500">Vacancy Number</span><span className="font-medium text-gray-900">{job.vacancyNumber || 'N/A'}</span></div>
                      <div className="p-4 border-b border-gray-100 flex justify-between"><span className="text-gray-500">Job Location</span><span className="font-medium text-gray-900">{job.location}</span></div>
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between"><span className="text-gray-500">Category</span><span className="font-medium text-gray-900">{job.category}</span></div>
                      <div className="p-4 border-b border-gray-100 flex justify-between"><span className="text-gray-500">Employment Type</span><span className="font-medium text-gray-900">{job.type}</span></div>
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between"><span className="text-gray-500">Salary</span><span className="font-medium text-gray-900">{job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}</span></div>
                      <div className="p-4 border-b border-gray-100 flex justify-between"><span className="text-gray-500">No. of Jobs</span><span className="font-medium text-gray-900">{job.noOfJobs || 1}</span></div>
                  </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('jobDescription')}</h3>
                  <div className="prose prose-sm md:prose-base text-gray-600 max-w-none whitespace-pre-line leading-relaxed mb-8">{job.description}</div>
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-500 text-sm mb-1">Salary Range</p>
                  <p className="text-2xl font-bold text-gray-900 mb-6">{job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}</p>
                  <button onClick={handleApplyClick} disabled={hasApplied} className={`w-full py-3 rounded-xl font-bold shadow-lg transition mb-3 flex items-center justify-center gap-2 ${hasApplied ? 'bg-green-100 text-green-700 cursor-default' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                      {hasApplied ? <><CheckCircle size={18}/> Applied</> : t('applyNow')}
                  </button>
              </div>
          </div>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('apply')}</h2>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleApplicationSubmit} className="space-y-5">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-gray-500 text-sm">{job.company}</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isValidatingFile} />
                  {isValidatingFile ? <Loader2 size={24} className="animate-spin mx-auto"/> : <><Upload size={24} className="mx-auto text-gray-400 mb-2" /><p className="text-sm font-medium text-gray-700">{resumeFile ? resumeFile.name : (user?.resume || "Click to upload resume")}</p></>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2"><label className="block text-sm font-medium text-gray-700">{t('coverLetter')}</label><button type="button" onClick={handleGenerateCoverLetter} className="text-xs text-purple-600 flex items-center gap-1 hover:text-purple-700 font-medium disabled:opacity-50" disabled={isGenerating}><Sparkles size={12}/> AI Help</button></div>
                <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={5} className="w-full border border-gray-300 rounded-xl p-3 text-sm" placeholder="Explain why you are the best fit..."></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting || !!fileError} className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 flex justify-center items-center gap-2 shadow-lg">{isSubmitting ? <Loader2 className="animate-spin" /> : t('submitApplication')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
