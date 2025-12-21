
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapPin, Briefcase, Calendar, CheckCircle, Upload, X, Bookmark, Sparkles, Loader2, FileText, Check, AlertTriangle, ArrowLeft, DollarSign, Clock } from 'lucide-react';
import { Application, UserRole } from '../types';
import { analyzeJobMatch } from '../services/geminiService';
import { SEO } from '../components/SEO';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, user, savedJobIds, toggleSaveJob, jobs, submitApplication, applications, allUsers } = useAppContext();
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const job = jobs.find(j => j._id === id);
  const isSaved = savedJobIds.includes(job?._id || '');
  const hasApplied = applications.some(app => app.jobId === job?._id && app.seekerId === user?._id);

  useEffect(() => {
    if (job && user && user.role === UserRole.SEEKER && !matchScore) {
       handleAnalyzeMatch();
    }
  }, [job, user]);

  const handleAnalyzeMatch = async () => {
    if (!job || !user) return;
    setIsAnalyzing(true);
    const analysis = await analyzeJobMatch(job.title, job.description, user.bio || '');
    if (analysis) setMatchScore(analysis.score);
    setIsAnalyzing(false);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !job) return;
    setIsSubmitting(true);
    const newApp: Application = {
      _id: Date.now().toString(),
      jobId: job._id,
      seekerId: user._id,
      resumeUrl: user.resumeUrl || '',
      coverLetter,
      status: 'Applied',
      date: new Date().toISOString().split('T')[0]
    };
    submitApplication(newApp);
    setIsSubmitting(false);
    setShowApplyModal(false);
    alert("Application submitted successfully!");
    navigate('/seeker');
  };

  if (!job) return <div className="p-20 text-center text-gray-500">Job not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <SEO title={`${job.title} at ${job.company}`} jobData={job} />
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={20}/></button>
            <img src={job.companyLogo} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-primary-600 font-bold hover:underline cursor-pointer">{job.company}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => toggleSaveJob(job._id)} className={`flex-1 md:flex-none p-3 rounded-xl border transition ${isSaved ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white text-gray-400'}`}><Bookmark size={20} className={isSaved ? 'fill-current' : ''}/></button>
            <button onClick={() => user ? (user.role === UserRole.SEEKER ? setShowApplyModal(true) : alert("Only job seekers can apply")) : navigate('/auth')} disabled={hasApplied} className="flex-1 md:flex-none bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50">
              {hasApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Job Description</h2>
            <div className="prose max-w-none text-gray-600 leading-relaxed">{job.description}</div>
            <h2 className="text-xl font-bold text-gray-900 mt-10 mb-6 border-b pb-4">Requirements</h2>
            <ul className="space-y-3">
               {job.requirements.map((req, i) => <li key={i} className="flex items-start gap-3 text-gray-600"><CheckCircle className="text-green-500 mt-1" size={18}/> {req}</li>)}
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Job Overview</h3>
            <div className="space-y-4 text-sm">
               <div className="flex items-center gap-3"><MapPin size={18} className="text-gray-400"/><span className="text-gray-600">{job.location}</span></div>
               <div className="flex items-center gap-3"><DollarSign size={18} className="text-gray-400"/><span className="text-gray-600 font-bold">{job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}</span></div>
               <div className="flex items-center gap-3"><Clock size={18} className="text-gray-400"/><span className="text-gray-600">{job.type}</span></div>
               <div className="flex items-center gap-3"><Calendar size={18} className="text-gray-400"/><span className="text-gray-600">Deadline: {job.deadline}</span></div>
            </div>
          </div>
          
          {user && user.role === UserRole.SEEKER && (
             <div className="bg-gradient-to-br from-primary-900 to-gray-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <Sparkles size={40} className="absolute top-4 right-4 opacity-20" />
                <h3 className="text-lg font-bold mb-2">AI Profile Match</h3>
                <p className="text-xs text-primary-100 mb-4 opacity-80">We've analyzed your skills against this job's requirements.</p>
                {isAnalyzing ? <div className="flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin"/> Calculating...</div> : <div className="text-4xl font-extrabold text-primary-400">{matchScore}%</div>}
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-4"><div className="bg-primary-500 h-full rounded-full transition-all duration-1000" style={{ width: `${matchScore || 0}%` }}></div></div>
             </div>
          )}
        </aside>
      </div>

      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold">Apply for {job.title}</h2>
                 <button onClick={() => setShowApplyModal(false)}><X size={24}/></button>
              </div>
              <form onSubmit={handleApply} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Cover Letter (Optional)</label>
                    <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5} className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500" placeholder="Why are you a good fit?"></textarea>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <FileText className="text-primary-600"/>
                    <div className="flex-1 min-w-0"><p className="text-sm font-bold truncate">{user?.resume || "No resume uploaded"}</p><p className="text-xs text-gray-500">Using your primary resume</p></div>
                    <button type="button" onClick={() => navigate('/seeker')} className="text-xs text-primary-600 font-bold hover:underline">Change</button>
                 </div>
                 <button type="submit" disabled={isSubmitting} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin mx-auto"/> : 'Submit Application'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
