
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
// Added Plus to the imports from lucide-react
import { Shield, Trash2, Users, Briefcase, LogOut, CheckCircle, XCircle, BarChart2, ShieldCheck, Megaphone, Bell, Settings, Filter, Search, MoreVertical, ExternalLink, Plus } from 'lucide-react';
import { UserRole, User, Job, SystemAnnouncement } from '../types';
import { SEO } from '../components/SEO';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, jobs, deleteJob, allUsers, deleteUser, approveUser, announcements, addAnnouncement, deleteAnnouncement, toggleAnnouncementStatus } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'users' | 'verifications' | 'announcements'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annMsg, setAnnMsg] = useState('');
  const [annType, setAnnType] = useState<'Info' | 'Warning' | 'Urgent'>('Info');
  const [annTarget, setAnnTarget] = useState<'All' | 'Seekers' | 'Employers'>('All');

  if (!user || user.role !== 'ADMIN') return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
              <Shield size={64} className="mx-auto text-red-200 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
              <button onClick={() => navigate('/auth')} className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg font-bold">Login</button>
          </div>
      </div>
  );

  // Stats
  const seekerCount = allUsers.filter(u => u.role === UserRole.SEEKER).length;
  const employerCount = allUsers.filter(u => u.role === UserRole.EMPLOYER).length;
  const pendingVerifications = allUsers.filter(u => u.verificationStatus === 'Pending');

  const filteredUsers = allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase()));

  const handlePostAnnouncement = (e: React.FormEvent) => {
      e.preventDefault();
      if (!annTitle || !annMsg) return;
      const newAnn: SystemAnnouncement = {
          _id: Date.now().toString(),
          title: annTitle,
          message: annMsg,
          type: annType as any,
          targetAudience: annTarget as any,
          createdAt: new Date().toISOString().split('T')[0],
          isActive: true
      };
      addAnnouncement(newAnn);
      setAnnTitle('');
      setAnnMsg('');
      alert("Announcement posted.");
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col md:flex-row">
      <SEO title="Admin Dashboard" />
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex-shrink-0">
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold">AD</div>
              <h1 className="text-lg font-bold">Administrator</h1>
          </div>
          <nav className="p-4 space-y-1">
              {[
                  { id: 'overview', label: 'Overview', icon: BarChart2 },
                  { id: 'verifications', label: 'Verifications', icon: ShieldCheck, badge: pendingVerifications.length },
                  { id: 'users', label: 'Manage Users', icon: Users },
                  { id: 'jobs', label: 'Manage Jobs', icon: Briefcase },
                  { id: 'announcements', label: 'Announcements', icon: Megaphone },
              ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setActiveTab(item.id as any)} 
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                      <div className="flex items-center gap-3">
                          <item.icon size={20} /> {item.label}
                      </div>
                      {item.badge ? <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span> : null}
                  </button>
              ))}
              <div className="pt-10">
                  <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition hover:bg-red-400/10 rounded-xl font-bold">
                      <LogOut size={20} /> Logout
                  </button>
              </div>
          </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
              <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder={`Search ${activeTab}...`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
                  />
              </div>
          </div>

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Jobs</p>
                          <div className="flex items-end justify-between">
                              <span className="text-4xl font-extrabold text-gray-900">{jobs.length}</span>
                              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={24}/></div>
                          </div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Seekers</p>
                          <div className="flex items-end justify-between">
                              <span className="text-4xl font-extrabold text-gray-900">{seekerCount}</span>
                              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={24}/></div>
                          </div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Employers</p>
                          <div className="flex items-end justify-between">
                              <span className="text-4xl font-extrabold text-gray-900">{employerCount}</span>
                              <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Shield size={24}/></div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900">Recent System Activity</h3>
                          <button className="text-sm text-primary-600 font-bold hover:underline">View All</button>
                      </div>
                      <div className="p-6 space-y-4">
                          {jobs.slice(0, 5).map(j => (
                              <div key={j._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Briefcase size={20} className="text-gray-400"/></div>
                                      <div><p className="text-sm font-bold text-gray-900">{j.title}</p><p className="text-xs text-gray-500">Posted by {j.company}</p></div>
                                  </div>
                                  <span className="text-xs text-gray-400">{j.postedDate}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* VERIFICATIONS */}
          {activeTab === 'verifications' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                              <tr>
                                  <th className="px-6 py-4">Employer</th>
                                  <th className="px-6 py-4">Registration Email</th>
                                  <th className="px-6 py-4">License</th>
                                  <th className="px-6 py-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {pendingVerifications.length > 0 ? pendingVerifications.map(u => (
                                  <tr key={u._id} className="hover:bg-gray-50 transition">
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                              <img src={u.avatar} className="w-10 h-10 rounded-lg object-cover" />
                                              <span className="font-bold text-gray-900">{u.name}</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                                      <td className="px-6 py-4">
                                          {u.verificationDocument ? (
                                              <button onClick={() => window.open(u.verificationDocument, '_blank')} className="text-primary-600 font-bold hover:underline flex items-center gap-1">
                                                  <ExternalLink size={14}/> View Document
                                              </button>
                                          ) : <span className="text-gray-400">Not uploaded</span>}
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                          <div className="flex justify-end gap-2">
                                              <button onClick={() => approveUser(u._id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition flex items-center gap-1"><CheckCircle size={14}/> Approve</button>
                                              <button className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition flex items-center gap-1"><XCircle size={14}/> Reject</button>
                                          </div>
                                      </td>
                                  </tr>
                              )) : (
                                  <tr><td colSpan={4} className="p-12 text-center text-gray-400">No pending verifications.</td></tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Role</th><th className="px-6 py-4">Plan</th><th className="px-6 py-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map(u => (
                                <tr key={u._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div><p className="font-bold text-gray-900">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div>
                                    </td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === UserRole.EMPLOYER ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{u.role}</span></td>
                                    <td className="px-6 py-4 text-gray-600">{u.plan || 'Free'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => { if(confirm('Delete user?')) deleteUser(u._id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
              </div>
          )}

          {/* JOBS */}
          {activeTab === 'jobs' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr><th className="px-6 py-4">Job Title</th><th className="px-6 py-4">Company</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredJobs.map(j => (
                                <tr key={j._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-900">{j.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{j.company}</td>
                                    <td className="px-6 py-4"><span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">{j.status}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => { if(confirm('Delete job?')) deleteJob(j._id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                   </table>
              </div>
          )}

          {/* ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"><Plus className="text-primary-600"/> Create Announcement</h3>
                      <form onSubmit={handlePostAnnouncement} className="space-y-4">
                          <div><label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Title</label><input type="text" value={annTitle} onChange={e => setAnnTitle(e.target.value)} required className="w-full border p-2 rounded-xl" placeholder="e.g. System Maintenance" /></div>
                          <div><label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Message</label><textarea value={annMsg} onChange={e => setAnnMsg(e.target.value)} required className="w-full border p-2 rounded-xl" rows={3}></textarea></div>
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Type</label><select value={annType} onChange={e => setAnnType(e.target.value as any)} className="w-full border p-2 rounded-xl bg-white">{['Info', 'Warning', 'Urgent'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                              <div><label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Target</label><select value={annTarget} onChange={e => setAnnTarget(e.target.value as any)} className="w-full border p-2 rounded-xl bg-white">{['All', 'Seekers', 'Employers'].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                          </div>
                          <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition">Post System-wide</button>
                      </form>
                  </div>
                  
                  <div className="space-y-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Active Announcements</h3>
                      {announcements.map(ann => (
                          <div key={ann._id} className={`p-4 rounded-xl border flex items-start justify-between shadow-sm ${ann.type === 'Urgent' ? 'bg-red-50 border-red-100' : ann.type === 'Warning' ? 'bg-yellow-50 border-yellow-100' : 'bg-blue-50 border-blue-100'}`}>
                              <div className="flex gap-3">
                                  <div className={`p-2 rounded-lg ${ann.type === 'Urgent' ? 'text-red-600' : 'text-primary-600'}`}><Bell size={20}/></div>
                                  <div><h4 className="font-bold text-sm text-gray-900">{ann.title}</h4><p className="text-xs text-gray-600 leading-relaxed mt-1">{ann.message}</p></div>
                              </div>
                              <button onClick={() => deleteAnnouncement(ann._id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                          </div>
                      ))}
                  </div>
              </div>
          )}

      </main>
    </div>
  );
};
