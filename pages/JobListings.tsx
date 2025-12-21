
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

  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const [selectedCity, setSelectedCity] = useState(params.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState(params.get('category') || '');
  const [selectedCompany, setSelectedCompany] = useState(params.get('company') || '');
  const [selectedType, setSelectedType] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [sortOption, setSortOption] = useState('newest'); 
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const uniqueCompanies = useMemo(() => Array.from(new Set(jobs.map(job => job.company))).sort(), [jobs]);

  const handleCompanyClick = (e: React.MouseEvent, companyName: string) => {
    e.stopPropagation();
    const employer = allUsers.find(u => u.name === companyName && u.role === UserRole.EMPLOYER);
    if (employer) navigate(`/companies/${employer._id}`);
  };

  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job => {
      if (job.status !== 'Active') return false;
      const matchKeyword = job.title.toLowerCase().includes(keyword.toLowerCase()) || job.company.toLowerCase().includes(keyword.toLowerCase());
      const matchCity = selectedCity ? job.location === selectedCity : true;
      const matchCategory = selectedCategory ? job.category === selectedCategory : true;
      const matchCompany = selectedCompany ? job.company === selectedCompany : true;
      const matchType = selectedType ? job.type === selectedType : true;
      const matchMinSalary = minSalary ? job.salaryMin >= parseInt(minSalary) : true;
      const matchMaxSalary = maxSalary ? job.salaryMax <= parseInt(maxSalary) : true;
      return matchKeyword && matchCity && matchCategory && matchCompany && matchType && matchMinSalary && matchMaxSalary;
    });

    if (sortOption === 'newest') result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    else if (sortOption === 'oldest') result.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
    else if (sortOption === 'salaryHighLow') result.sort((a, b) => b.salaryMax - a.salaryMax);
    else if (sortOption === 'salaryLowHigh') result.sort((a, b) => a.salaryMin - b.salaryMin);

    return result;
  }, [keyword, selectedCity, selectedCategory, selectedCompany, selectedType, minSalary, maxSalary, sortOption, jobs]);

  useEffect(() => setCurrentPage(1), [keyword, selectedCity, selectedCategory, selectedCompany, selectedType, minSalary, maxSalary, sortOption]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const displayedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setKeyword(''); setSelectedCity(''); setSelectedCategory(''); setSelectedCompany('');
    setSelectedType(''); setMinSalary(''); setMaxSalary(''); setSortOption('newest');
    setCurrentPage(1); setShowMobileFilters(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 pb-24">
      <SEO title="Browse Jobs" description="Search for the latest job openings in Afghanistan." />
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          <div className="lg:hidden mb-4"><button onClick={() => setShowMobileFilters(true)} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded-xl font-bold text-gray-700 shadow-sm"><Filter size={18} /> {t('showFilters')}</button></div>
          <div className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:bg-transparent lg:z-auto lg:w-1/4 ${showMobileFilters ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
            <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-100 bg-white"><h2 className="text-xl font-bold text-gray-900">{t('filterBy')}</h2><button onClick={() => setShowMobileFilters(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600"><X size={24} /></button></div>
            <div className="h-full overflow-y-auto lg:overflow-visible p-4 lg:p-0"><div className="lg:sticky lg:top-24 space-y-6"><div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label><input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full border rounded-lg p-2" /></div>
              <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">Location</label><select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full border rounded-lg p-2">{cities.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              <button onClick={clearFilters} className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">{t('clearFilters')}</button>
            </div></div></div>
          </div>
          <main className="w-full lg:w-3/4">
            <div className="grid grid-cols-1 gap-4">
              {displayedJobs.map(job => {
                const isSaved = savedJobIds.includes(job._id);
                const isCompared = comparisonJobs.some(j => j._id === job._id);
                return (
                  <div key={job._id} onClick={() => navigate(`/jobs/${job._id}`)} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer border border-transparent hover:border-primary-200 relative group">
                    <div className="flex gap-4"><img src={job.companyLogo} className="w-14 h-14 rounded-lg object-cover" /><div className="flex-1 min-w-0"><h2 className="text-lg font-bold text-gray-900">{job.title}</h2><p onClick={(e) => handleCompanyClick(e, job.company)} className="text-primary-600 hover:underline">{job.company}</p></div></div>
                    <div className="absolute top-4 right-4 flex gap-2"><button onClick={(e) => { e.stopPropagation(); isCompared ? removeFromComparison(job._id) : addToComparison(job); }} className={`p-2 rounded-full border ${isCompared ? 'bg-purple-600 text-white' : 'bg-white'}`}><Scale size={18}/></button><button onClick={(e) => { e.stopPropagation(); toggleSaveJob(job._id); }} className={`p-2 rounded-full border ${isSaved ? 'bg-primary-600 text-white' : 'bg-white'}`}>{isSaved ? <Bookmark size={18} className="fill-current" /> : <Bookmark size={18} />}</button></div>
                  </div>
              )})}
            </div>
          </main>
        </div>
      </div>
      <JobCompareModal isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} jobs={comparisonJobs} onRemoveJob={removeFromComparison} />
    </div>
  );
};
