
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

  const handleCompanyClick = (e: React.MouseEvent, companyName: string) => {
    e.stopPropagation();
    const employer = allUsers.find(u => u.name === companyName && u.role === UserRole.EMPLOYER);
    if (employer) {
        navigate(`/companies/${employer.id}`);
    }
  };

  const getCategoryIcon = (category: string) => {
    const normalized = category.toLowerCase();
    if (normalized.includes('tech') || normalized.includes('software') || normalized.includes('it')) return <Code size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('health') || normalized.includes('medical') || normalized.includes('nurse')) return <Heart size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('finance') || normalized.includes('account') || normalized.includes('bank')) return <Calculator size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('education') || normalized.includes('teach')) return <GraduationCap size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('sales') || normalized.includes('market')) return <TrendingUp size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('ngo') || normalized.includes('non-profit')) return <Globe size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('logistic') || normalized.includes('driver') || normalized.includes('transport')) return <Truck size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('security')) return <Shield size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('legal') || normalized.includes('law')) return <Scale size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('admin') || normalized.includes('office')) return <FileText size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('engineer') || normalized.includes('construct')) return <Wrench size={20} className="md:w-6 md:h-6" />;
    if (normalized.includes('manage') || normalized.includes('hr')) return <Users size={20} className="md:w-6 md:h-6" />;
    return <Briefcase size={20} className="md:w-6 md:h-6" />;
  };

  const featuredJobs = jobs.filter(j => j.isFeatured && j.status === 'Active').slice(0, 4); 
  const urgentJobs = jobs.filter(j => j.isUrgent && j.status === 'Active').slice(0, 4);
  const latestJobs = jobs.filter(j => j.status === 'Active').slice(0, 4);
  const topCompanies = allUsers.filter(u => u.role === UserRole.EMPLOYER && u.status === 'Active').slice(0, 4);
  const latestArticles = posts.filter(p => p.status === 'Published').slice(0, 4); 

  return (
    <div>
      <SEO 
        title="Find Your Dream Job" 
        description="Afghan Job Finder is the leading job portal in Afghanistan. Search thousands of jobs, connect with top employers, and build your career." 
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white py-16 lg:py-28 relative overflow-hidden">
        {/* Abstract shapes for aesthetics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-sm md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            {t('heroSubtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2 border border-white/20 relative z-20">
            <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
              <Search className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" size={20} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className="bg-transparent w-full focus:outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-gray-300 transition focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
              <MapPin className="text-gray-400 mr-3 rtl:ml-3 rtl:mr-0" size={20} />
              <input 
                type="text" 
                placeholder={t('locationPlaceholder')}
                className="bg-transparent w-full focus:outline-none text-gray-800 placeholder-gray-400 text-sm md:text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg whitespace-nowrap flex items-center justify-center gap-2 text-sm md:text-base">
              <Search size={20} />
              {t('searchButton')}
            </button>
          </form>
          
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs md:text-sm text-primary-200">
             <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Verified Employers</span>
             <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Daily Updates</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-gray-100 py-6 md:py-8">
         <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-2 md:gap-8 divide-x divide-gray-100 rtl:divide-x-reverse">
               <div className="text-center">
                  <p className="text-lg md:text-3xl font-extrabold text-gray-900">{jobs.length}+</p>
                  <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wide mt-1">Jobs</p>
               </div>
               <div className="text-center">
                  <p className="text-lg md:text-3xl font-extrabold text-gray-900">{allUsers.filter(u => u.role === UserRole.EMPLOYER).length}+</p>
                  <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wide mt-1">Companies</p>
               </div>
               <div className="text-center">
                  <p className="text-lg md:text-3xl font-extrabold text-gray-900">{allUsers.filter(u => u.role === UserRole.SEEKER).length}+</p>
                  <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wide mt-1">Seekers</p>
               </div>
               <div className="text-center">
                  <p className="text-lg md:text-3xl font-extrabold text-gray-900">24/7</p>
                  <p className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wide mt-1">Support</p>
               </div>
            </div>
         </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('popularCategories')}</h2>
            <p className="text-gray-600 text-sm md:text-base">Explore opportunities in the most in-demand sectors.</p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.slice(0,12).map((cat) => (
              <div key={cat} onClick={() => navigate(`/jobs?category=${cat}`)} className="p-3 md:p-6 bg-white border border-gray-100 rounded-xl hover:shadow-lg hover:border-primary-100 transition cursor-pointer flex flex-col items-center text-center group transform hover:-translate-y-1 duration-300">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary-600 group-hover:text-white transition shadow-sm">
                  {getCategoryIcon(cat)}
                </div>
                <h3 className="font-semibold text-gray-800 text-xs md:text-sm group-hover:text-primary-700 leading-tight">{cat}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgent Recruitment */}
      {urgentJobs.length > 0 && (
          <section className="py-12 bg-red-50">
            <div className="container mx-auto px-4">
               <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-red-700 flex items-center gap-2"><Flame size={24} className="fill-current"/> Urgent Recruitment</h2>
                  <p className="text-xs md:text-base text-red-500 mt-1">Immediate hiring opportunities.</p>
                </div>
                <button onClick={() => navigate('/jobs')} className="text-red-600 font-medium hover:underline text-xs md:text-base">{t('viewAll')}</button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {urgentJobs.map(job => (
                  <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-3 md:p-6 cursor-pointer border border-red-200 hover:border-red-400 relative group flex flex-col h-full">
                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">URGENT</div>
                    <div className="flex items-start justify-between mb-2 md:mb-4">
                      <img 
                        src={job.companyLogo} 
                        alt={job.company} 
                        className="w-10 h-10 md:w-14 md:h-14 rounded-lg object-cover bg-gray-50 border border-gray-100" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random` }}
                      />
                    </div>
                    
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-red-600 transition">{job.title}</h3>
                    <p className="text-xs md:text-sm mb-2 md:mb-4 truncate text-gray-500">{job.company}</p>

                    <div className="flex flex-wrap gap-1 mb-2 mt-auto">
                      <span className="text-[10px] md:text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 truncate">{job.location}</span>
                    </div>
                    
                    <div className="pt-2 md:pt-4 border-t border-red-50">
                       <span className="font-bold text-gray-900 text-xs md:text-sm truncate">{job.salaryMin.toLocaleString()} {job.currency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
      )}

      {/* Top Companies Section */}
      <section className="py-12 bg-white">
         <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-6">
               <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('topCompanies')}</h2>
                  <p className="text-xs md:text-base text-gray-500 mt-1">Work for the best employers</p>
               </div>
               <button onClick={() => navigate('/companies')} className="text-primary-600 font-medium hover:underline flex items-center gap-1 bg-primary-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition hover:bg-primary-100 text-xs md:text-sm">
                 {t('viewAll')} <ArrowRight size={14}/>
               </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {topCompanies.map(company => (
                    <div key={company.id} onClick={() => navigate(`/companies/${company.id}`)} className="bg-white border border-gray-200 rounded-xl p-3 md:p-6 hover:shadow-xl hover:border-primary-200 transition cursor-pointer text-center group relative overflow-hidden flex flex-col items-center h-full">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <img 
                            src={company.avatar} 
                            alt={company.name} 
                            className="w-12 h-12 md:w-20 md:h-20 rounded-xl object-cover mb-2 md:mb-4 border border-gray-100 group-hover:scale-110 transition duration-300 bg-gray-50 shadow-sm" 
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${company.name}&background=random` }}
                        />
                        <h3 className="font-bold text-gray-900 mb-1 text-xs md:text-base group-hover:text-primary-600 transition truncate w-full px-1">{company.name}</h3>
                        <p className="text-[10px] md:text-xs text-gray-500 mb-2 uppercase tracking-wide truncate w-full">{company.industry || "General"}</p>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('featuredJobs')}</h2>
              <p className="text-xs md:text-base text-gray-500 mt-1">Top opportunities curated for you</p>
            </div>
            <button onClick={() => navigate('/jobs')} className="text-primary-600 font-medium hover:underline text-xs md:text-base">{t('viewAll')}</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {featuredJobs.map(job => {
               const isSaved = savedJobIds.includes(job.id);
               return (
              <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-3 md:p-6 cursor-pointer border border-gray-100 hover:border-primary-300 relative group flex flex-col h-full">
                <div className="flex items-start justify-between mb-2 md:mb-4">
                  <img 
                    src={job.companyLogo} 
                    alt={job.company} 
                    className="w-10 h-10 md:w-14 md:h-14 rounded-lg object-cover bg-gray-50 border border-gray-100" 
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random` }}
                  />
                  <span className="bg-green-100 text-green-700 text-[8px] md:text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md tracking-wide">Featured</span>
                </div>
                
                <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition">{job.title}</h3>
                <p className="text-xs md:text-sm mb-2 md:mb-4 truncate text-gray-500">{job.company}</p>

                <div className="flex flex-wrap gap-1 mb-2 mt-auto">
                  <span className="text-[10px] md:text-xs bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 truncate">{job.location}</span>
                </div>
                
                <div className="pt-2 md:pt-4 border-t border-gray-50 flex items-center justify-between">
                   <span className="font-bold text-gray-900 text-xs md:text-sm truncate">{job.salaryMin.toLocaleString()} {job.currency}</span>
                   <button 
                        onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                        className={`p-1.5 rounded-full transition ${isSaved ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:text-primary-600 hover:bg-gray-100'}`}
                   >
                       {isSaved ? <Bookmark size={14} className="md:w-5 md:h-5 fill-current" /> : <Bookmark size={14} className="md:w-5 md:h-5" />}
                   </button>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>
      
      {/* Latest Jobs List */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
           <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('latestJobs')}</h2>
              <p className="text-xs md:text-base text-gray-600 mt-1">Recently posted opportunities</p>
            </div>
            <button onClick={() => navigate('/jobs')} className="text-primary-600 font-medium hover:underline text-xs md:text-base">{t('viewAll')}</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
            {latestJobs.map(job => (
              <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="bg-white rounded-xl p-3 md:p-6 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-200 hover:border-primary-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 group h-full md:h-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                  <img 
                    src={job.companyLogo} 
                    alt={job.company} 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" 
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random` }}
                  />
                  <div className="min-w-0 w-full">
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 group-hover:text-primary-600 truncate line-clamp-1 md:line-clamp-none">{job.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 truncate">{job.company}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-1 md:gap-4 text-[10px] md:text-sm text-gray-500 w-full md:w-auto justify-start md:justify-end mt-auto md:mt-0">
                   <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 truncate max-w-[80px] md:max-w-none">
                      <MapPin size={10} className="text-gray-400 md:w-3 md:h-3"/> <span className="truncate">{job.location}</span>
                   </div>
                   <span className="font-bold text-gray-900 text-xs md:text-sm">{job.salaryMin.toLocaleString()} {job.currency}</span>
                   <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap ml-auto md:ml-0 hidden sm:block">{job.postedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
              <div className="flex justify-between items-end mb-6">
                  <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">{t('blog')}</h2>
                      <p className="text-xs md:text-base text-gray-600 mt-1">Tips and insights to boost your career</p>
                  </div>
                  <button onClick={() => navigate('/blog')} className="text-primary-600 font-medium hover:underline text-xs md:text-base">{t('viewAll')}</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                  {latestArticles.map(post => (
                      <div key={post.id} onClick={() => navigate(`/blog/${post.id}`)} className="cursor-pointer group bg-white border border-gray-100 rounded-xl p-2 md:p-0 md:border-0 hover:shadow-lg transition">
                          <div className="h-32 md:h-48 rounded-lg md:rounded-xl overflow-hidden mb-2 md:mb-3 relative">
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[8px] md:text-[10px] font-bold text-gray-900">{post.category}</div>
                          </div>
                          <div className="px-1 md:px-0">
                            <h3 className="font-bold text-xs md:text-lg text-gray-900 mb-1 md:mb-2 group-hover:text-primary-600 line-clamp-2 leading-tight">{post.title}</h3>
                            <div className="flex items-center text-[10px] md:text-xs text-gray-400 gap-2 md:gap-3">
                                <span>{post.date}</span>
                                <span className="hidden md:inline">•</span>
                                <span className="hidden md:inline">{post.readTime}</span>
                            </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 py-12 md:py-16 text-white relative overflow-hidden mb-8 md:mb-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-16 -mb-16"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('areYouEmployer')}</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-base md:text-lg">{t('employerCTA')}</p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-xl transition shadow-lg transform hover:-translate-y-1 text-sm md:text-base"
          >
            {t('postJobFree')}
          </button>
        </div>
      </section>
    </div>
  );
};
