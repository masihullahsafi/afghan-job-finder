
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
  
  // Custom Alert State
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

  const job = jobs.find(j => j.id === id);
  const company = allUsers.find(u => u.name === job?.company && u.role === UserRole.EMPLOYER);
  const similarJobs = jobs.filter(j => j.category === job?.category && j.id !== job?.id).slice(0, 3);
  
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

  const isSaved = savedJobIds.includes(job.id);
  const hasApplied = applications.some(app => app.jobId === job.id && app.seekerId === user?.id);

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
    let finalResumeName = user.resume || 'resume.pdf';

    if (resumeFile) {
        finalResumeName = resumeFile.name;
        try {
            finalResumeData = await fileToBase64(resumeFile);
        } catch (e) {
            console.error(e);
            showAlert("Upload Failed", "Error processing file.", 'error');
            setIsSubmitting(false);
            return;
        }
    }

    const newApplication: Application = {
      id: Date.now().toString(),
      jobId: job.id,
      seekerId: user.id,
      resumeUrl: finalResumeName,
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
      navigate('/seeker', { state: { highlightJobId: job.id } });
      // Note: Alert might not show if we navigate away quickly, but dashboard has its own feedback.
    }, 1500);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const report: Report = {
          id: Date.now().toString(),
          jobId: job.id,
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
                        onClick={() => company && navigate(`/companies/${company.id}`)}
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
                              <span onClick={() => company && navigate(`/companies/${company.id}`)} className={`font-medium ${company ? 'text-primary-600 hover:underline cursor-pointer' : 'text-gray-700'}`}>{job.company}</span>
                              {company?.verificationStatus === 'Verified' && <ShieldCheck size={14} className="text-blue-500"/>}
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500 flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-500">{t('posted')} {job.postedDate}</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto hidden md:flex">
                      <button onClick={() => toggleSaveJob(job.id)} className={`p-3 rounded-xl border transition ${isSaved ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
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
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
              {/* Stats Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-gray-900">{t('jobOverview')}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between">
                          <span className="text-gray-500">Vacancy Number</span>
                          <span className="font-medium text-gray-900">{job.vacancyNumber || 'N/A'}</span>
                      </div>
                      <div className="p-4 border-b border-gray-100 flex justify-between">
                          <span className="text-gray-500">Job Location</span>
                          <span className="font-medium text-gray-900">{job.location}</span>
                      </div>
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between">
                          <span className="text-gray-500">Category</span>
                          <span className="font-medium text-gray-900">{job.category}</span>
                      </div>
                      <div className="p-4 border-b border-gray-100 flex justify-between">
                          <span className="text-gray-500">Employment Type</span>
                          <span className="font-medium text-gray-900">{job.type}</span>
                      </div>
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between">
                          <span className="text-gray-500">Salary</span>
                          <span className="font-medium text-gray-900">{job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}</span>
                      </div>
                      <div className="p-4 border-b border-gray-100 flex justify-between">
                          <span className="text-gray-500">No. of Jobs</span>
                          <span className="font-medium text-gray-900">{job.noOfJobs || 1}</span>
                      </div>
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between">
                          <span className="text-gray-500">Years of Experience</span>
                          <span className="font-medium text-gray-900">{job.yearsOfExperience || job.experienceLevel}</span>
                      </div>
                      <div className="p-4 border-b border-gray-100 flex justify-between">
                          <span className="text-gray-500">Contract Duration</span>
                          <span className="font-medium text-gray-900">{job.contractDuration || 'Not Specified'}</span>
                      </div>
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between">
                          <span className="text-gray-500">Contract Extensible</span>
                          <span className="font-medium text-gray-900">{job.contractExtensible ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="p-4 border-b border-gray-100 flex justify-between">
                          <span className="text-gray-500">Probation Period</span>
                          <span className="font-medium text-gray-900">{job.probationPeriod || 'N/A'}</span>
                      </div>
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between">
                          <span className="text-gray-500">Gender</span>
                          <span className="font-medium text-gray-900">{job.gender || 'Any'}</span>
                      </div>
                      <div className="p-4 border-b border-gray-100 flex justify-between">
                          <span className="text-gray-500">Education</span>
                          <span className="font-medium text-gray-900">{job.education || 'Not Specified'}</span>
                      </div>
                      <div className="p-4 border-b border-r border-gray-100 flex justify-between">
                          <span className="text-gray-500">Nationality</span>
                          <span className="font-medium text-gray-900">{job.nationality || 'Any'}</span>
                      </div>
                      <div className="p-4 border-b border-gray-100 flex justify-between">
                          <span className="text-gray-500">Close Date</span>
                          <span className="font-medium text-red-600">{job.deadline}</span>
                      </div>
                  </div>
              </div>

              {/* Market Insights */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                  <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><BarChart2 className="text-primary-400"/> Market Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Salary Comparison */}
                          <div>
                              <p className="text-gray-400 text-xs uppercase font-bold mb-2">Salary Competitiveness</p>
                              <div className="flex items-end gap-2 h-24">
                                  <div className="w-full bg-gray-700 rounded-t relative group">
                                      <div className="absolute bottom-0 w-full bg-gray-500 rounded-t transition-all" style={{ height: '60%' }}></div>
                                      <span className="text-[10px] text-gray-400 absolute -bottom-6 w-full text-center">Avg</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-t relative group">
                                      <div className={`absolute bottom-0 w-full rounded-t transition-all ${job.salaryMin > marketAverageSalary ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ height: job.salaryMin > marketAverageSalary ? '80%' : '50%' }}></div>
                                      <span className={`text-[10px] absolute -bottom-6 w-full text-center font-bold ${job.salaryMin > marketAverageSalary ? 'text-green-400' : 'text-yellow-400'}`}>This Job</span>
                                  </div>
                              </div>
                              <p className="text-xs text-gray-300 mt-8">
                                  This job offers a <span className="text-white font-bold">{job.salaryMin > marketAverageSalary ? 'Higher' : 'Standard'}</span> salary compared to market average.
                              </p>
                          </div>

                          {/* Activity */}
                          <div>
                              <p className="text-gray-400 text-xs uppercase font-bold mb-2">Applicant Interest</p>
                              <div className="flex items-center gap-4 mb-4">
                                  <div className="bg-white/10 p-3 rounded-xl">
                                      <Users size={24} className="text-primary-400"/>
                                  </div>
                                  <div>
                                      <p className="text-2xl font-bold">{applicantCount}</p>
                                      <p className="text-xs text-gray-400">Applicants</p>
                                  </div>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                                  <div className="bg-gradient-to-r from-primary-500 to-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(applicantCount * 2, 100)}%` }}></div>
                              </div>
                              <p className="text-xs text-gray-300">
                                  <span className="text-green-400 font-bold">High Demand.</span> {viewsCount} people viewed this job recently.
                              </p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Match Analysis */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-purple-900 flex items-center gap-2"><Sparkles size={18}/> {t('matchAnalysis')}</h3>
                      <button onClick={handleAnalyzeMatch} disabled={isAnalyzingMatch} className="bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-purple-700 transition disabled:opacity-70 flex items-center gap-2">
                          {isAnalyzingMatch ? <Loader2 size={14} className="animate-spin"/> : t('analyzeMatch')}
                      </button>
                  </div>
                  {matchResult ? (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                          <div className="flex items-center gap-4 mb-4">
                              <div className={`text-3xl font-extrabold ${matchResult.score >= 80 ? 'text-green-600' : matchResult.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {matchResult.score}%
                              </div>
                              <p className="text-sm text-gray-700 font-medium">{matchResult.reason}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div><span className="font-bold text-green-700 block mb-1">{t('strengths')}</span><ul className="list-disc pl-4 text-gray-600 space-y-1">{matchResult.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                              <div><span className="font-bold text-red-700 block mb-1">{t('missingSkills')}</span><ul className="list-disc pl-4 text-gray-600 space-y-1">{matchResult.missingSkills.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                          </div>
                      </div>
                  ) : <p className="text-sm text-purple-700">Check if your profile matches this job's requirements instantly.</p>}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('jobDescription')}</h3>
                  <div className="prose prose-sm md:prose-base text-gray-600 max-w-none whitespace-pre-line leading-relaxed mb-8">
                      {job.description}
                  </div>
                  
                  {job.responsibilities && job.responsibilities.length > 0 && (
                      <div className="mb-8">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('responsibilities')}</h3>
                          <ul className="space-y-3">
                              {job.responsibilities.map((resp, i) => (
                                  <li key={i} className="flex items-start gap-3 text-gray-700">
                                      <div className="mt-1 bg-blue-50 text-blue-600 rounded-full p-0.5"><div className="w-1.5 h-1.5 bg-current rounded-full m-0.5"></div></div>
                                      <span>{resp}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  )}

                  <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{t('requirements')}</h3>
                      <ul className="space-y-3">
                          {job.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-700">
                                  <div className="mt-1 bg-green-50 text-green-600 rounded-full p-0.5"><Check size={12}/></div>
                                  <span>{req}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              {/* Apply Box */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-center mb-6">
                      <p className="text-gray-500 text-sm mb-1">Salary Range</p>
                      <p className="text-2xl font-bold text-gray-900">{job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}</p>
                      <div className="text-xs text-green-600 font-medium bg-green-50 inline-block px-2 py-1 rounded mt-2">
                          Est. Net: ~{(job.salaryMin * 0.95).toLocaleString()} (After Tax)
                      </div>
                  </div>
                  
                  <button 
                    onClick={handleApplyClick}
                    disabled={hasApplied}
                    className={`w-full py-3 rounded-xl font-bold shadow-lg transition mb-3 flex items-center justify-center gap-2 ${hasApplied ? 'bg-green-100 text-green-700 cursor-default' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                  >
                      {hasApplied ? <><CheckCircle size={18}/> Applied</> : (
                          <>
                             {job.applyMethod === 'External' && job.applyUrl?.includes('@') && !job.applyUrl.startsWith('http') ? <Mail size={18}/> : null}
                             {t('applyNow')}
                          </>
                      )}
                  </button>
                  
                  <button 
                    onClick={() => setShowInterviewModal(true)}
                    className="w-full bg-purple-50 text-purple-700 py-3 rounded-xl font-bold hover:bg-purple-100 transition flex items-center justify-center gap-2 border border-purple-100"
                  >
                      <MessageSquare size={18} /> {t('practiceInterview')}
                  </button>
              </div>

              {/* Share Widget */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Share2 size={18}/> Share Job</h3>
                  <div className="grid grid-cols-3 gap-2">
                      <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(job.title + ' ' + window.location.href)}`, '_blank')} className="flex flex-col items-center gap-1 p-2 hover:bg-green-50 rounded-lg transition text-green-600">
                          <MessageSquare size={24}/> <span className="text-xs font-medium">WhatsApp</span>
                      </button>
                      <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')} className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                          <Linkedin size={24}/> <span className="text-xs font-medium">LinkedIn</span>
                      </button>
                      <button onClick={handleShare} className="flex flex-col items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition text-gray-600">
                          {copied ? <Check size={24} className="text-green-500"/> : <Copy size={24}/>} <span className="text-xs font-medium">Copy</span>
                      </button>
                  </div>
              </div>

              {/* Company Mini Profile */}
              {company && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                      <img src={company.avatar} alt={company.name} className="w-16 h-16 rounded-xl mx-auto mb-3 object-cover border border-gray-100"/>
                      <h3 className="font-bold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{company.industry}</p>
                      <button 
                        onClick={() => navigate(`/companies/${company.id}`)}
                        className="text-primary-600 font-bold text-sm hover:underline"
                      >
                          View Full Profile
                      </button>
                  </div>
              )}

              {/* Similar Jobs */}
              <div>
                  <h3 className="font-bold text-gray-900 mb-4">Similar Jobs</h3>
                  <div className="space-y-3">
                      {similarJobs.map(sj => (
                          <div key={sj.id} onClick={() => navigate(`/jobs/${sj.id}`)} className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition cursor-pointer">
                              <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{sj.title}</h4>
                              <p className="text-xs text-gray-500 mb-2">{sj.company}</p>
                              <span className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-600">{sj.location}</span>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="text-center mt-4">
                  <button onClick={() => setShowReportModal(true)} className="text-gray-400 hover:text-red-500 text-xs flex items-center justify-center gap-1 w-full">
                      <Flag size={12}/> {t('report')}
                  </button>
              </div>
          </div>
      </div>

      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-[60px] left-0 w-full bg-white border-t border-gray-200 p-4 md:hidden z-40 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button onClick={() => toggleSaveJob(job.id)} className={`p-3 rounded-xl border flex-shrink-0 transition ${isSaved ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
              {isSaved ? <Bookmark size={20} className="fill-current"/> : <Bookmark size={20}/>}
          </button>
          {hasApplied ? (
              <button disabled className="flex-1 bg-green-100 text-green-700 rounded-xl font-bold flex items-center justify-center gap-2">
                  <CheckCircle size={20}/> Applied
              </button>
          ) : (
              <button onClick={handleApplyClick} className="flex-1 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-lg flex items-center justify-center gap-2">
                  {t('applyNow')} {job.applyMethod === 'External' && <ArrowRight size={16}/>}
              </button>
          )}
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('apply')}</h2>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleApplicationSubmit} className="space-y-5">
              {/* Form Content */}
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-gray-500 text-sm">{job.company}</p>
              </div>

              {/* Resume Selection */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                  {user?.documents && user.documents.length > 0 && (
                      <div className="mb-3">
                          <select 
                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm mb-2"
                            onChange={(e) => {
                                if (e.target.value === 'upload') {
                                    setResumeFile(null);
                                } else {
                                    console.log("Selected doc:", e.target.value);
                                }
                            }}
                          >
                              <option value="upload">Upload New Resume</option>
                              {user.documents.map(doc => (
                                  <option key={doc.id} value={doc.id}>{doc.name} ({doc.date})</option>
                              ))}
                          </select>
                      </div>
                  )}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
                      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isValidatingFile} />
                      {isValidatingFile ? (
                          <div className="flex flex-col items-center text-primary-600"><Loader2 size={24} className="animate-spin mb-2"/><span className="text-sm font-medium">Validating file...</span></div>
                      ) : (
                          <>
                            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm font-medium text-gray-700">{resumeFile ? resumeFile.name : (user?.resume || "Click to upload resume")}</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, DOCX (Max 5MB)</p>
                          </>
                      )}
                  </div>
                  {fileError && <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertTriangle size={12}/> {fileError}</p>}
              </div>

              {/* Screening Questions */}
              {screeningAnswers.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="font-bold text-blue-900 text-sm mb-3">Screening Questions</h4>
                      <div className="space-y-3">
                          {screeningAnswers.map((item, idx) => (
                              <div key={idx}>
                                  <label className="block text-xs font-bold text-gray-700 mb-1">{item.question} <span className="text-red-500">*</span></label>
                                  <input type="text" required value={item.answer} onChange={(e) => handleScreeningChange(idx, e.target.value)} className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Your answer..." />
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">{t('coverLetter')}</label>
                    <button type="button" onClick={handleGenerateCoverLetter} className="text-xs text-purple-600 flex items-center gap-1 hover:text-purple-700 font-medium disabled:opacity-50" disabled={isGenerating}>
                        {isGenerating ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                        {isGenerating ? 'Generating...' : t('generateCoverLetter')}
                    </button>
                </div>
                <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={5} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm text-gray-900" placeholder="Explain why you are the best fit for this role..."></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition">{t('cancel')}</button>
                <button type="submit" disabled={isSubmitting || !!fileError} className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-primary-500/20">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : t('submitApplication')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
          <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Report this Job</h2>
                  <form onSubmit={handleReportSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                          <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm" required>
                              <option value="">Select a reason</option>
                              <option>Scam / Fake</option>
                              <option>Inappropriate Content</option>
                              <option>Expired</option>
                              <option>Other</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                          <textarea value={reportDetails} onChange={(e) => setReportDetails(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg p-2 text-sm" placeholder="Describe the issue..." required></textarea>
                      </div>
                      <div className="flex gap-2">
                          <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                          <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700">Submit Report</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {showInterviewModal && <InterviewModal isOpen={showInterviewModal} onClose={() => setShowInterviewModal(false)} jobId={job.id} jobTitle={job.title} jobDescription={job.description} companyName={job.company} />}
    </div>
  );
};
