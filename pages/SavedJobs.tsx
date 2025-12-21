
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapPin, DollarSign, Clock, Trash2 } from 'lucide-react';
import { UserRole } from '../types';

export const SavedJobs: React.FC = () => {
  const { t, user, savedJobIds, toggleSaveJob, jobs, allUsers } = useAppContext();
  const navigate = useNavigate();

  // Filter jobs based on savedJobIds from context
  // Fixed: Changed job.id to job._id
  const savedJobs = jobs.filter(j => savedJobIds.includes(j._id));

  const handleCompanyClick = (e: React.MouseEvent, companyName: string) => {
    e.stopPropagation();
    const employer = allUsers.find(u => u.name === companyName && u.role === UserRole.EMPLOYER);
    if (employer) {
        // Fixed: Changed employer.id to employer._id
        navigate(`/companies/${employer._id}`);
    }
  };

  if (!user || user.role !== 'SEEKER') {
    return <div className="p-10 text-center text-red-600">{t('accessDenied')}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('savedJobs')}</h1>
        
        {savedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map(job => {
               const companyExists = allUsers.some(u => u.name === job.company && u.role === UserRole.EMPLOYER);
               
               return (
              // Fixed: Changed job.id to job._id
              <div key={job._id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition border border-gray-100 relative group">
                <button 
                    // Fixed: Changed job.id to job._id
                    onClick={(e) => { e.stopPropagation(); toggleSaveJob(job._id); }}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition p-2 bg-red-50 rounded-full shadow-sm z-10"
                    title="Remove from saved"
                >
                    <Trash2 size={18} />
                </button>
                {/* Fixed: Changed job.id to job._id */}
                <div onClick={() => navigate(`/jobs/${job._id}`)} className="cursor-pointer">
                    <div className="flex items-start gap-4 mb-4">
                    <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-lg object-cover bg-gray-100" />
                    <div>
                        <h2 className="font-bold text-gray-900 hover:text-primary-600 line-clamp-1">{job.title}</h2>
                        <p 
                            onClick={(e) => companyExists && handleCompanyClick(e, job.company)}
                            className={`text-sm ${companyExists ? 'text-primary-600 hover:underline cursor-pointer' : 'text-gray-500'}`}
                        >
                            {job.company}
                        </p>
                    </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-gray-400" /> {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-gray-400" /> {job.type}
                        </div>
                    </div>

                    <button className="w-full py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition text-sm font-medium">
                        {t('apply')}
                    </button>
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">You haven't saved any jobs yet.</p>
            <button onClick={() => navigate('/jobs')} className="mt-4 text-primary-600 font-medium hover:underline">Browse Jobs</button>
          </div>
        )}
      </div>
    </div>
  );
};
