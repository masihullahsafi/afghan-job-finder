
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Bookmark, UserPlus, FileSearch, CheckCircle2, ArrowRight, Code, Heart, Calculator, GraduationCap, TrendingUp, Globe, Truck, Shield, Scale, FileText, Wrench, Building2, Users, Database, Zap, BookOpen, Calendar, Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { UserRole } from '../types';

export const Home: React.FC = () => {
  const { t, savedJobIds, toggleSaveJob, jobs, categories, allUsers, posts } = useAppContext();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?keyword=${keyword}&location=${location}`);
  };

  const activeJobs = jobs.filter(j => j.status === 'Active');
  const featuredJobs = activeJobs.filter(j => j.isFeatured).slice(0, 4); 
  const urgentJobs = activeJobs.filter(j => j.isUrgent).slice(0, 4);

  return (
    <div>
      <SEO 
        title="Find Your Dream Job" 
        description="Afghan Job Finder is the leading job portal in Afghanistan. Search thousands of jobs, connect with top employers." 
      />

      <style>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .animate-pulse-red { animation: pulse-red 2s infinite; }
      `}</style>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white py-16 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">{t('heroTitle')}</h1>
          <p className="text-sm md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">{t('heroSubtitle')}</p>

          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 border border-white/20">
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3">
              <Search className="text-gray-400 mr-3" size={20} />
              <input type="text" placeholder={t('searchPlaceholder')} className="bg-transparent w-full focus:outline-none text-gray-800" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3">
              <MapPin className="text-gray-400 mr-3" size={20} />
              <input type="text" placeholder={t('locationPlaceholder')} className="bg-transparent w-full focus:outline-none text-gray-800" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg flex items-center justify-center gap-2">
              <Search size={20} /> {t('searchButton')}
            </button>
          </form>
        </div>
      </section>

      {/* Urgent Recruitment */}
      {urgentJobs.length > 0 && (
          <section className="py-12 bg-red-50/50">
            <div className="container mx-auto px-4">
               <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-red-700 flex items-center gap-2"><Flame size={24} className="fill-current"/> Urgent Recruitment</h2>
                  <p className="text-sm text-red-500 mt-1">Immediate hiring opportunities.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {urgentJobs.map(job => (
                  <div key={job._id} onClick={() => navigate(`/jobs/${job._id}`)} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-4 cursor-pointer border border-red-100 hover:border-red-300 relative group animate-pulse-red">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">URGENT</div>
                    <img src={job.companyLogo} className="w-12 h-12 rounded-lg object-cover mb-4 bg-gray-50 border border-gray-100" />
                    <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1 line-clamp-1 group-hover:text-red-600 transition">{job.title}</h3>
                    <p className="text-xs text-gray-500 mb-2 truncate">{job.company}</p>
                    <div className="pt-2 border-t border-red-50 flex justify-between items-center">
                       <span className="font-bold text-gray-900 text-xs">{job.salaryMin.toLocaleString()} {job.currency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
      )}

      {/* Featured Jobs */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('featuredJobs')}</h2>
            <button onClick={() => navigate('/jobs')} className="text-primary-600 font-medium hover:underline text-sm">{t('viewAll')}</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredJobs.map(job => (
              <div key={job._id} onClick={() => navigate(`/jobs/${job._id}`)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <img src={job.companyLogo} className="w-12 h-12 rounded-lg object-cover" />
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">Featured</span>
                </div>
                <h3 className="font-bold text-sm md:text-base text-gray-900 mb-1 line-clamp-1">{job.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{job.company}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <MapPin size={12}/> {job.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
