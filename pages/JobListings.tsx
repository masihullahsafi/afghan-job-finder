
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Filter, MapPin, DollarSign, Clock, Bookmark, ChevronLeft, ChevronRight, X, ArrowUpDown, Scale } from 'lucide-react';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { UserRole } from '../types';
import { JobCompareModal } from '../components/JobCompareModal';

export const JobListings: React.FC = () => {
  const { t, savedJobIds, toggleSaveJob, jobs, cities, categories, allUsers, comparisonJobs, addToComparison, removeFromComparison, clearComparison } = useAppContext();
  const locationHook = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(locationHook.search);

  // Filters State
  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const [selectedCity, setSelectedCity] = useState(params.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || '');
  const [selectedCompany, setSelectedCompany] = useState(params.get('company') || '');
  const [selectedType, setSelectedType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [sortOption, setSortOption] = useState('newest'); 
  
  // Mobile Filter Toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique companies
  const uniqueCompanies = useMemo(() => {
    return Array.from(new Set(jobs.map(job => job.company))).sort();
  }, [jobs]);

  const handleCompanyClick = (e: React.MouseEvent, companyName: string) => {
    e.stopPropagation();
    const employer = allUsers.find(u => u.name === companyName && u.role === UserRole.EMPLOYER);
    if (employer) {
        navigate(`/companies/${employer.id}`);
    }
  };

  // Filter Logic
  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      if (job.status !== 'Active') return false;

      const matchKeyword = job.title.toLowerCase().includes(keyword.toLowerCase()) || 
                           job.company.toLowerCase().includes(keyword.toLowerCase());
      const matchCity = selectedCity ? job.location === selectedCity : true;
      const matchCategory = selectedCategory ? job.category === selectedCategory : true;
      const matchCompany = selectedCompany ? job.company === selectedCompany : true;
      const matchType = selectedType ? job.type === selectedType : true;
      
      const salary = job.salaryMin; 
      const matchMinSalary = minSalary ? salary >= parseInt(minSalary) : true;
      const matchMaxSalary = maxSalary ? salary <= parseInt(maxSalary) : true;

      return matchKeyword && matchCity && matchCategory && matchCompany && matchType && matchMinSalary && matchMaxSalary;
    });

    // Sorting
    if (sortOption === 'newest') {
      result = result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    } else if (sortOption === 'oldest') {
      result = result.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
    } else if (sortOption === 'salaryHighLow') {
      result = result.sort((a, b) => b.salaryMax - a.salaryMax);
    } else if (sortOption === 'salaryLowHigh') {
      result = result.sort((a, b) => a.salaryMin - b.salaryMin);
    }

    return result;
  }, [keyword, selectedCity, selectedCategory, selectedCompany, selectedType, minSalary, maxSalary, sortOption, jobs]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, selectedCity, selectedCategory, selectedCompany, selectedType, minSalary, maxSalary, sortOption]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const displayedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setKeyword('');
    setSelectedCity('');
    setSelectedCategory('');
    setSelectedCompany('');
    setSelectedType('');
    setMinSalary('');
    setMaxSalary('');
    setSortOption('newest');
    setCurrentPage(1);
    setShowMobileFilters(false);
  };

  const selectClassName = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 text-sm text-gray-900 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer";
  const inputClassName = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-primary-500 text-sm text-gray-900 placeholder-gray-400 shadow-sm hover:bg-gray-50 transition-colors";

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMobileFilters]);

  return (
    <div className="bg-gray-50 min-h-screen py-8 pb-24">
      <SEO title="Browse Jobs" description="Search for the latest job openings in Afghanistan." />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-xl font-bold text-gray-700 shadow-sm"
            >
              <Filter size={18} /> {t('showFilters')}
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`
            fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:bg-transparent lg:z-auto lg:w-1/4
            ${showMobileFilters ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Header */}
            <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-100 bg-white">
               <h2 className="text-xl font-bold text-gray-900">{t('filterBy')}</h2>
               <button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                 <X size={24} />
               </button>
            </div>

            <div className="h-full overflow-y-auto lg:overflow-visible p-4 lg:p-0">
                <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {/* ... Filters content ... */}
                    <div className="hidden lg:flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-primary-600" />
                        <h3 className="font-bold text-gray-900">{t('filterBy')}</h3>
                    </div>
                    </div>

                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('searchButton')}</label>
                    <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={t('searchPlaceholder')} className={inputClassName} />
                    </div>

                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('locationPlaceholder')}</label>
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className={selectClassName}>
                        <option value="">All Cities</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    </div>

                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={selectClassName}>
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    </div>

                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('salaryRange')} (AFN)</label>
                    <div className="flex gap-2">
                        <input type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} placeholder={t('min')} className={inputClassName} />
                        <input type="number" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} placeholder={t('max')} className={inputClassName} />
                    </div>
                    </div>

                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className={selectClassName}>
                        <option value="">All Companies</option>
                        {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    </div>

                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <div className="space-y-2">
                        {['Full-time', 'Part-time', 'Remote', 'Contract'].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="jobType" checked={selectedType === type} onChange={() => setSelectedType(type)} className="text-primary-600 focus:ring-primary-500 border-gray-300" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{t(type === 'Full-time' ? 'fullTime' : type === 'Part-time' ? 'partTime' : type === 'Remote' ? 'remote' : type.toLowerCase()) || type}</span>
                        </label>
                        ))}
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="radio" name="jobType" checked={selectedType === ''} onChange={() => setSelectedType('')} className="text-primary-600 focus:ring-primary-500 border-gray-300" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{t('any')}</span>
                        </label>
                    </div>
                    </div>

                    <button onClick={clearFilters} className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition">{t('clearFilters')}</button>
                    <button onClick={() => setShowMobileFilters(false)} className="w-full py-3 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition mt-3 lg:hidden">View {filteredJobs.length} Results</button>
                </div>
                
                <div className="hidden lg:block"><AdBanner className="h-64" /></div>
                </div>
            </div>
          </div>

          {/* Job List */}
          <main className="w-full lg:w-3/4">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {filteredJobs.length} {t('jobsFound')} 
                {filteredJobs.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">(Page {currentPage} of {totalPages})</span>}
              </h1>
              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">{t('sortBy')}:</span>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-gray-900">
                  <option value="newest">{t('newest')}</option>
                  <option value="oldest">{t('oldest')}</option>
                  <option value="salaryHighLow">{t('salaryHighLow')}</option>
                  <option value="salaryLowHigh">{t('salaryLowHigh')}</option>
                </select>
              </div>
            </div>

            {/* Comparison Action */}
            {comparisonJobs.length > 0 && (
                <div className="fixed bottom-24 lg:bottom-10 right-4 lg:right-10 z-40 animate-in slide-in-from-bottom-4 duration-300">
                    <button onClick={() => setShowCompareModal(true)} className="bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition">
                        <Scale size={20}/> Compare Jobs ({comparisonJobs.length})
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {displayedJobs.length > 0 ? displayedJobs.map(job => {
                const isSaved = savedJobIds.includes(job.id);
                const companyExists = allUsers.some(u => u.name === job.company && u.role === UserRole.EMPLOYER);
                const isCompared = comparisonJobs.some(j => j.id === job.id);
                
                return (
                <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition cursor-pointer border border-transparent hover:border-primary-200 relative group">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Logo */}
                    <img src={job.companyLogo} alt={job.company} className="w-14 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-24"> {/* Added padding right to prevent overlap with top-right buttons */}
                      <h2 className="text-lg font-bold text-gray-900 hover:text-primary-600 truncate">{job.title}</h2>
                      <p 
                          onClick={(e) => companyExists && handleCompanyClick(e, job.company)}
                          className={`font-medium mb-2 text-sm ${companyExists ? 'text-primary-600 hover:underline cursor-pointer' : 'text-gray-600'}`}
                      >
                          {job.company}
                      </p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign size={14}/> {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {t(job.type.toLowerCase().replace('-', '') as any) || job.type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats & Button */}
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-400">{t('posted')} {job.postedDate}</span>
                    <button className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition">
                      {t('details')}
                    </button>
                  </div>
                  
                  {/* Action Buttons - Top Right (Moved slightly down/styled) */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); isCompared ? removeFromComparison(job.id) : addToComparison(job); }}
                        className={`p-2 rounded-full shadow-sm border transition-all duration-200 ${isCompared ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-400 border-gray-100 hover:border-purple-200 hover:text-purple-600'}`}
                        title={isCompared ? "Remove from Compare" : "Compare"}
                      >
                          <Scale size={18} />
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                        className={`p-2 rounded-full shadow-sm border transition-all duration-200 ${isSaved ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-400 border-gray-100 hover:border-primary-200 hover:text-primary-600'}`}
                        title={isSaved ? "Unsave" : "Save"}
                      >
                        {isSaved ? <Bookmark size={18} className="fill-current" /> : <Bookmark size={18} />}
                      </button>
                  </div>
                </div>
              )}) : (
                <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <p className="text-gray-500 text-lg">{t('noJobsFound')}</p>
                  <button onClick={clearFilters} className="mt-4 text-primary-600 font-medium hover:underline">{t('clearFilters')}</button>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700">
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                   if (totalPages > 8 && (page > 2 && page < totalPages - 1 && Math.abs(page - currentPage) > 1)) {
                      if (page === 3 || page === totalPages - 2) return <span key={page} className="text-gray-400">...</span>;
                      return null;
                   }
                   return (
                   <button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-medium transition ${currentPage === page ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                     {page}
                   </button>
                )})}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700">
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <JobCompareModal isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} jobs={comparisonJobs} onRemoveJob={removeFromComparison} />
    </div>
  );
};
