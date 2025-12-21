
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CVTemplates } from '../components/CVTemplates';
import { Download, Mail, ArrowLeft, Share2, Check } from 'lucide-react';
import { SEO } from '../components/SEO';

export const PublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allUsers } = useAppContext();
  const user = allUsers.find(u => u._id === id);

  if (!user || user.role !== 'SEEKER') return <div>Profile Not Found</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <SEO title={`${user.name} - Profile`} />
      <div className="bg-white border-b sticky top-0 z-30 p-4 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-500"><ArrowLeft size={16}/> Home</button>
          <h1 className="font-bold">{user.name}'s Profile</h1>
          <div className="flex gap-2"><button className="bg-primary-600 text-white px-4 py-2 rounded font-bold"><Download size={16} className="inline mr-1"/> PDF</button></div>
      </div>
      <div className="container mx-auto p-8 flex justify-center"><div className="bg-white shadow-xl w-full max-w-[210mm]"><CVTemplates user={user} theme="Professional" /></div></div>
    </div>
  );
};
