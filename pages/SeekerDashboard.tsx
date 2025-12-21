
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText, Calendar, Briefcase, ChevronRight, Loader2, X, Edit2, Camera, Upload, Download, FolderOpen, LogOut, MessageSquare, Eye, Trash2, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { improveResumeSummary } from '../services/geminiService';
import { uploadFile } from '../src/services/api'; 
import { UserDocument, User } from '../types';
import { CVTemplates } from '../components/CVTemplates';

declare var html2pdf: any;

export const SeekerDashboard: React.FC = () => {
  const { user, t, jobs, applications, updateUserProfile, logout, interviewSessions } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'applications' | 'documents' | 'interviews' | 'ai'>('applications');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [cvTheme, setCvTheme] = useState<'Modern' | 'Professional' | 'Creative' | 'Minimal'>('Professional');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [resumeSummary, setResumeSummary] = useState(user?.bio || '');
  
  // Profile Form States
  const [editName, setEditName] = useState(user?.name || '');
  const [editTitle, setEditTitle] = useState(user?.jobTitle || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user || user.role !== 'SEEKER') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><p className="text-red-600 font-bold mb-4">{t('accessDenied')}</p><button onClick={() => navigate('/auth')} className="bg-primary-600 text-white px-6 py-2 rounded-lg">Login</button></div></div>;
  }

  // Filter apps using the correct _id key
  const myApps = applications.filter(app => app.seekerId === user._id).map(app => ({
    ...app,
    job: jobs.find(j => j._id === app.jobId)
  }));

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFile(file);
        await updateUserProfile({ avatar: url });
        alert("Avatar updated!");
      } catch (err) { 
        console.error(err);
        alert(err instanceof Error ? err.message : "Upload failed."); 
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({ name: editName, jobTitle: editTitle, phone: editPhone, address: editAddress, bio: editBio });
    setShowProfileModal(false);
  };

  const handleImproveSummary = async () => {
    setIsImproving(true);
    const improved = await improveResumeSummary(resumeSummary);
    setResumeSummary(improved);
    setIsImproving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      const newDoc: UserDocument = {
        _id: Date.now().toString(),
        name: file.name,
        type: 'Resume',
        data: url,
        date: new Date().toISOString().split('T')[0],
        size: (file.size / 1024).toFixed(0) + ' KB'
      };
      
      const currentDocs = user.documents || [];
      const updatedData: Partial<User> = { 
        documents: [newDoc, ...currentDocs],
        resumeUrl: url, 
        resume: file.name 
      };

      await updateUserProfile(updatedData);
      alert("Resume uploaded!");
    } catch (err) { 
      console.error(err);
      alert(err instanceof Error ? err.message : "Upload failed."); 
    } finally { 
      setIsUploading(false); 
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm("Delete this document?")) {
      const newDocs = user.documents?.filter(d => d._id !== docId) || [];
      updateUserProfile({ documents: newDocs });
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('cv-preview-content');
    if (element) {
      html2pdf().set({ margin: 10, filename: `${user.name}_CV.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } }).from(element).save();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-20 h-20 rounded-full object-cover border-4 border-primary-50 shadow-sm" />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"><Camera size={20}/></div>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 font-medium">{user.jobTitle || "Add a job title"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowCVModal(true)} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition"><Download size={18}/> {t('uploadResume')}</button>
            <button onClick={() => setShowProfileModal(true)} className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition"><Edit2 size={18}/> {t('editProfile')}</button>
            <button onClick={logout} className="p-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"><LogOut size={20}/></button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <nav className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {[
              { id: 'applications', label: t('myApplications'), icon: Briefcase },
              { id: 'documents', label: 'Documents', icon: FolderOpen },
              { id: 'interviews', label: t('interviews'), icon: MessageSquare },
              { id: 'ai', label: 'AI Tools', icon: Sparkles }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-between p-4 text-sm font-bold border-l-4 transition ${activeTab === tab.id ? 'bg-primary-50 text-primary-700 border-primary-600' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3"><tab.icon size={20}/> {tab.label}</div>
                <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'}/>
              </button>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-3">
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('myApplications')}</h2>
              {myApps.length > 0 ? myApps.map(app => (
                <div key={app._id} className="bg-white p-6 rounded-2xl border flex justify-between items-center shadow-sm">
                  <div className="flex gap-4 items-center">
                    <img src={app.job?.companyLogo} className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                    <div>
                      <h4 className="font-bold text-gray-900">{app.job?.title}</h4>
                      <p className="text-sm text-gray-500">{app.job?.company} • {app.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${app.status === 'Rejected' ? 'bg-red-100 text-red-700' : app.status === 'Applied' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              )) : <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">No applications yet.</div>}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">My Documents</h2>
                <label className="bg-primary-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary-700 cursor-pointer flex items-center gap-2 transition">
                  {isUploading ? <Loader2 size={16} className="animate-spin"/> : <Plus size={16}/>} Upload New
                  <input type="file" className="hidden" onChange={handleFileUpload} ref={fileInputRef} disabled={isUploading}/>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.documents?.map(doc => (
                  <div key={doc._id} className="bg-white p-4 rounded-xl border flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-red-50 p-2.5 rounded-lg text-red-600 flex-shrink-0"><FileText size={20}/></div>
                      <div className="min-w-0"><p className="font-bold text-gray-900 text-sm truncate">{doc.name}</p><p className="text-xs text-gray-400">{doc.date} • {doc.size}</p></div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => window.open(doc.data, '_blank')} className="p-2 text-gray-400 hover:text-primary-600 transition"><Eye size={18}/></button>
                      <button onClick={() => handleDeleteDocument(doc._id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">AI Career Assistant</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <Sparkles size={40} className="absolute top-4 right-4 opacity-20" />
                  <h3 className="text-lg font-bold mb-2">Resume Optimizer</h3>
                  <p className="text-sm opacity-80 mb-4">Let our AI rewrite your professional summary to grab recruiters' attention.</p>
                  <button onClick={() => setShowAIModal(true)} className="bg-white text-purple-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition">Improve Summary</button>
                </div>
                <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                  <MessageSquare size={40} className="absolute top-4 right-4 opacity-20" />
                  <h3 className="text-lg font-bold mb-2">Interview Coach</h3>
                  <p className="text-sm opacity-80 mb-4">Practice your interview skills with personalized questions for any role.</p>
                  <button onClick={() => navigate('/tools/skills-assessment')} className="bg-white text-blue-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition">Start Mock Interview</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('editProfile')}</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full border rounded-lg p-2.5" required/></div>
                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Title</label><input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border rounded-lg p-2.5" /></div>
              </div>
              <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio / Summary</label><textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={4} className="w-full border rounded-lg p-2.5" /></div>
              <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-lg">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {showAIModal && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex items-center gap-2 mb-4 text-purple-600 font-bold"><Sparkles size={20}/> AI Resume Optimizer</div>
            <textarea value={resumeSummary} onChange={e => setResumeSummary(e.target.value)} rows={6} className="w-full border border-purple-100 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Paste your current professional summary here..."></textarea>
            <div className="flex gap-3 mt-6">
              <button onClick={handleImproveSummary} disabled={isImproving} className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 disabled:opacity-50">
                {isImproving ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18}/>} Improve with AI
              </button>
              <button onClick={() => { updateUserProfile({ bio: resumeSummary }); setShowAIModal(false); }} className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black">Use This Summary</button>
            </div>
          </div>
        </div>
      )}

      {showCVModal && (
        <div className="fixed inset-0 bg-black/80 z-[120] flex flex-col p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-6xl mx-auto rounded-t-2xl p-4 border-b flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                 <h2 className="font-bold text-gray-900">CV Generator</h2>
                 <select value={cvTheme} onChange={(e: any) => setCvTheme(e.target.value)} className="text-sm border border-gray-200 rounded-lg p-1.5 outline-none">
                    <option value="Professional">Professional</option>
                    <option value="Modern">Modern</option>
                    <option value="Creative">Creative</option>
                    <option value="Minimal">Minimal</option>
                 </select>
              </div>
              <div className="flex gap-2">
                 <button onClick={handleDownloadPDF} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary-700 transition"><Download size={16}/> Download PDF</button>
                 <button onClick={() => setShowCVModal(false)} className="p-2 text-gray-400 hover:text-gray-900"><X size={24}/></button>
              </div>
           </div>
           <div className="bg-gray-100 flex-1 overflow-y-auto w-full max-w-6xl mx-auto p-4 md:p-12 flex justify-center rounded-b-2xl border-x border-b">
              <div id="cv-preview-content" className="bg-white shadow-2xl scale-75 md:scale-100 origin-top">
                 <CVTemplates user={user} theme={cvTheme} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
