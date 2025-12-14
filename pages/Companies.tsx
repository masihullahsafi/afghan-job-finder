import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, MapPin, Users, Globe, Briefcase, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';

export const Companies: React.FC = () => {
  const { t, allUsers, categories, jobs } = useAppContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  // Filter Employers from allUsers
  const employers = allUsers.filter(u => u.role === UserRole.EMPLOYER && u.status === 'Active');

  const filteredCompanies = employers.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry ? (company.bio?.toLowerCase().includes(selectedIndustry.toLowerCase()) || false) : true;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('companies')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover top employers in Afghanistan and find the perfect workplace for you.</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 rtl:right-3 rtl:left-auto" size={20} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 rtl:pr-10 rtl:pl-4 bg-white text-gray-900"
            />
          </div>
          <div className="md:w-1/4">
             <select 
               value={selectedIndustry}
               onChange={(e) => setSelectedIndustry(e.target.value)}
               className="w-full py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-gray-900"
             >
               <option value="">All Industries</option>
               {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
             </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.length > 0 ? filteredCompanies.map(company => {
            const openJobsCount = jobs.filter(j => j.company === company.name && j.status === 'Active').length;
            
            return (
            <div 
                key={company.id} 
                onClick={() => navigate(`/companies/${company.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-primary-200 transition group flex flex-col h-full cursor-pointer relative overflow-hidden"
            >
               {/* Decorative top bar */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 group-hover:from-primary-400 group-hover:to-primary-600 transition-all duration-500"></div>

               <div className="flex items-start justify-between mb-4">
                 <img 
                    src={company.avatar} 
                    alt={company.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 bg-gray-50 shadow-sm"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${company.name}&background=random`
                    }} 
                 />
                 <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Briefcase size={12} /> {openJobsCount} Jobs
                 </span>
               </div>
               
               <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition flex items-center gap-2">
                 {company.name} 
                 <ArrowRight size={16} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-primary-500"/>
               </h3>
               
               <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed">{company.bio || "No description available."}</p>
               
               <div className="space-y-3 text-sm text-gray-600 mb-6 pt-4 border-t border-gray-50">
                 {company.address && (
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{company.address}</span>
                    </div>
                 )}
                 <div className="flex items-center gap-2">
                   <Users size={16} className="text-gray-400 flex-shrink-0" />
                   <span>10-50 {t('employees')}</span>
                 </div>
                 {company.website && (
                    <div className="flex items-center gap-2 text-primary-600">
                        <Globe size={16} className="text-primary-400 flex-shrink-0" />
                        <span className="truncate hover:underline" onClick={(e) => { e.stopPropagation(); window.open(company.website, '_blank'); }}>{company.website}</span>
                    </div>
                 )}
               </div>
            </div>
          )}) : (
              <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                  <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium text-lg">No companies found matching your criteria.</p>
                  <button onClick={() => { setSearchTerm(''); setSelectedIndustry(''); }} className="mt-4 text-primary-600 hover:underline">Clear Filters</button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};