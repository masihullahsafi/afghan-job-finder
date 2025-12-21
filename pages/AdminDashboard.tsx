
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Shield, Trash2, Users, Briefcase, LogOut } from 'lucide-react';
import { UserRole } from '../types';
import { SEO } from '../components/SEO';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, jobs, deleteJob, allUsers, deleteUser, approveUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<'jobs' | 'users'>('jobs');

  if (!user || user.role !== 'ADMIN') return <div>Access Denied</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-6"><h1 className="text-xl font-bold mb-8">Admin</h1><nav className="space-y-4"><button onClick={() => setActiveTab('jobs')} className="block">Jobs</button><button onClick={() => setActiveTab('users')} className="block">Users</button><button onClick={() => { logout(); navigate('/'); }} className="block text-red-400">Logout</button></nav></aside>
      <main className="flex-1 p-8">
          {activeTab === 'jobs' && <div className="space-y-4">{jobs.map(j => <div key={j._id} className="bg-white p-4 border rounded flex justify-between items-center"><div><h4 className="font-bold">{j.title}</h4><p className="text-sm">{j.company}</p></div><button onClick={() => deleteJob(j._id)} className="text-red-500"><Trash2 size={18}/></button></div>)}</div>}
          {activeTab === 'users' && <div className="space-y-4">{allUsers.map(u => <div key={u._id} className="bg-white p-4 border rounded flex justify-between items-center"><div><h4 className="font-bold">{u.name}</h4><p className="text-sm">{u.email}</p></div><button onClick={() => deleteUser(u._id)} className="text-red-500"><Trash2 size={18}/></button></div>)}</div>}
      </main>
    </div>
  );
};
