
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { generateJobDescription } from '../services/geminiService';
import { uploadFile } from '../src/services/api';
import { Plus, FileText, Users, Eye, Settings, Edit2, Trash2, Search, X, CheckCircle, CreditCard, Download, Calendar, Camera, Shield, Upload, Bookmark, BarChart2, PenTool, Megaphone, ArrowRight, Bold, Italic, LayoutList, XCircle, RotateCcw, ChevronLeft, ChevronRight, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { Job, Application, User } from '../types';
import { useNavigate } from 'react-router-dom';
import { CVTemplates } from '../components/CVTemplates';
import { AlertModal } from '../components/AlertModal';

export const EmployerDashboard: React.FC = () => {
  const { user, t, jobs, applications, addJob, updateJob, deleteJob, updateApplicationStatus, updateUserProfile, uploadVerificationDoc, cities, categories, allUsers, toggleSaveCandidate } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'jobs' | 'ats' | 'candidates' | 'profile'>('jobs');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<User | null>(null);

  // Job Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  if (!user || user.role !== 'EMPLOYER') return <div className="p-20 text-center font-bold text-red-600">Access Denied</div>;

  const myJobs = jobs.filter(job => job.employerId === user._id || job.company === user.name);

  const handleOpenPost = (job?: Job) => {
    if (job) {
      setEditingJobId(job._id); setTitle(job.title); setCategory(job.category); setLocation(job.location);
      setSalaryMin(job.salaryMin.toString()); setSalaryMax(job.salaryMax.toString()); setDeadline(job.deadline);
      setDescription(job.description); setSkills(job.requirements.join(', '));
    } else {
      setEditingJobId(null); setTitle(''); setCategory(categories[0]); setLocation(cities[0]);
      setSalaryMin(''); setSalaryMax(''); setDeadline(''); setDescription(''); setSkills('');
    }
    setShowPostModal(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const newJob: Job = {
      _id: editingJobId || Date.now().toString(),
      employerId: user._id,
      title, company: user.name, companyLogo: user.avatar, location,
      salaryMin: parseInt(salaryMin), salaryMax: parseInt(salaryMax),
      currency: 'AFN', type: 'Full-time', experienceLevel: 'Mid', category,
      postedDate: new Date().toISOString().split('T')[0], deadline,
      description, requirements: skills.split(',').map(s => s.trim()),
      responsibilities: [], isFeatured: false, status: 'Active'
    };
    editingJobId ? updateJob(newJob) : addJob(newJob);
    setShowPostModal(false);
  };

  const handleAIHelp = async () => {
    if (!title) return alert("Enter job title first");
    setIsGenerating(true);
    const desc = await generateJobDescription(title, skills);
    setDescription(desc);
    setIsGenerating(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10 border-b pb-6">
          <img src={user.avatar} className="w-12 h-12 rounded-lg object-cover" />
          <div className="min-w-0"><h2 className="font-bold text-gray-900 truncate">{user.name}</h2><p className="text-xs text-gray-500 uppercase">{user.plan}</p></div>
        </div>
        <button onClick={() => handleOpenPost()} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold mb-6 hover:bg-primary-700 transition shadow-lg shadow-primary-500/20">Post Job</button>
        <nav className="space-y-1">
          {[{ id: 'jobs', label: 'My Jobs', icon: FileText }, { id: 'ats', label: 'ATS Board', icon: LayoutList }, { id: 'candidates', label: 'Candidate Search', icon: Search }, { id: 'profile', label: 'Company Profile', icon: Settings }].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === item.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}><item.icon size={18}/> {item.label}</button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Job Listings</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold"><tr><th className="px-6 py-4">Title</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
                <tbody className="divide-y">
                  {myJobs.map(job => (
                    <tr key={job._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleOpenPost(job)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><Edit2 size={18}/></button>
                        <button onClick={() => deleteJob(job._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ats' && (
           <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">ATS Board</h2>
              <div className="flex gap-6 overflow-x-auto pb-4">
                {['Applied', 'Screening', 'Interview', 'Rejected'].map(status => (
                  <div key={status} className="w-72 bg-gray-100 rounded-xl p-3 border border-gray-200 min-h-[400px]">
                    <h3 className="font-bold text-sm mb-3 px-1 uppercase tracking-wider text-gray-500">{status}</h3>
                    <div className="space-y-3">
                      {applications.filter(a => a.status === status && myJobs.some(j => j._id === a.jobId)).map(app => (
                        <div key={app._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-primary-400 transition">
                           <p className="font-bold text-sm text-gray-900">{allUsers.find(u => u._id === app.seekerId)?.name}</p>
                           <p className="text-xs text-gray-500 mt-1">{jobs.find(j => j._id === app.jobId)?.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white p-8 rounded-2xl shadow-sm border">
            <h2 className="text-xl font-bold mb-6">Company Profile</h2>
            <div className="space-y-4">
               <div><label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label><input type="text" value={user.name} className="w-full border p-2 rounded-lg bg-gray-50" readOnly/></div>
               <div><label className="block text-sm font-bold text-gray-700 mb-1">Email</label><input type="text" value={user.email} className="w-full border p-2 rounded-lg bg-gray-50" readOnly/></div>
               <div><label className="block text-sm font-bold text-gray-700 mb-1">About</label><textarea value={user.bio} className="w-full border p-2 rounded-lg bg-gray-50" readOnly rows={4}/></div>
            </div>
          </div>
        )}
      </main>

      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingJobId ? 'Edit Listing' : 'Post New Job'}</h2>
              <button onClick={() => setShowPostModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveJob} className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-1">Job Title</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="e.g. Senior Software Engineer" required/></div>
                <div><label className="block text-sm font-bold mb-1">Category</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full border p-2 rounded-lg bg-white">{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div><label className="block text-sm font-bold mb-1">Location</label><select value={location} onChange={e => setLocation(e.target.value)} className="w-full border p-2 rounded-lg bg-white">{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                 <div><label className="block text-sm font-bold mb-1">Salary Min</label><input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} className="w-full border p-2 rounded-lg" required/></div>
                 <div><label className="block text-sm font-bold mb-1">Salary Max</label><input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} className="w-full border p-2 rounded-lg" required/></div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 flex justify-between items-center">
                   Job Description
                   <button type="button" onClick={handleAIHelp} disabled={isGenerating} className="text-xs font-bold text-primary-600 flex items-center gap-1 hover:underline">
                      {isGenerating ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} Help me write with AI
                   </button>
                </label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} className="w-full border p-2 rounded-lg" required/>
              </div>
              <div><label className="block text-sm font-bold mb-1">Requirements (comma separated)</label><input value={skills} onChange={e => setSkills(e.target.value)} className="w-full border p-2 rounded-lg" placeholder="React, TypeScript, 3+ years experience" required/></div>
              <div className="pt-4"><button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg">Save Listing</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
