
import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { useAppContext } from '../context/AppContext';
import { DollarSign, Search, MapPin, TrendingUp, BarChart2, Briefcase, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SalaryExplorer: React.FC = () => {
  const { t, cities } = useAppContext();
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const POPULAR_ROLES = ['Frontend Developer', 'Project Manager', 'Nurse', 'Teacher', 'Sales Executive', 'Accountant'];

  // Mock Salary Data Generator
  const generateSalaryData = () => {
      const base = 20000 + Math.floor(Math.random() * 30000);
      return {
          min: base,
          median: base + 15000,
          max: base + 45000,
          entry: base,
          mid: base + 20000,
          senior: base + 50000
      };
  };

  const salaryData = hasSearched ? generateSalaryData() : null;

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(role) setHasSearched(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO title="Salary Explorer" description="Explore average salaries for jobs in Afghanistan." />
      
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4">{t('salaryExplorerTitle')}</h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">{t('salaryExplorerSubtitle')}</p>
              
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex flex-col md:flex-row gap-2 bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-sm">
                  <div className="flex-1 bg-white rounded-lg flex items-center px-4">
                      <Search className="text-gray-400" size={20} />
                      <input 
                        type="text" 
                        placeholder={t('searchPlaceholder')} 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-3 outline-none text-gray-900"
                        required
                      />
                  </div>
                  <div className="flex-1 bg-white rounded-lg flex items-center px-4">
                      <MapPin className="text-gray-400" size={20} />
                      <select 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full p-3 outline-none text-gray-900 bg-transparent cursor-pointer"
                      >
                          <option value="">{t('locationPlaceholder')}</option>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                  </div>
                  <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2">
                      {t('searchButton')}
                  </button>
              </form>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wide mr-2 py-1">Popular:</span>
                  {POPULAR_ROLES.map(r => (
                      <button 
                        key={r} 
                        onClick={() => { setRole(r); setHasSearched(true); }}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition"
                      >
                          {r}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4">
          {hasSearched && salaryData ? (
              <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('estimatedSalary')} <span className="text-primary-600">{role}</span></h2>
                      <p className="text-gray-500 mb-8">{location || 'Afghanistan'}</p>

                      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                          <div className="text-center">
                              <p className="text-sm text-gray-500 font-medium mb-1">{t('min')}</p>
                              <p className="text-xl font-bold text-gray-700">{salaryData.min.toLocaleString()} AFN</p>
                          </div>
                          <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 scale-110 shadow-lg">
                              <p className="text-sm text-primary-700 font-bold uppercase tracking-wider mb-2">Average</p>
                              <p className="text-4xl font-extrabold text-primary-900">{salaryData.median.toLocaleString()} <span className="text-base font-normal">AFN/mo</span></p>
                          </div>
                          <div className="text-center">
                              <p className="text-sm text-gray-500 font-medium mb-1">{t('max')}</p>
                              <p className="text-xl font-bold text-gray-700">{salaryData.max.toLocaleString()} AFN</p>
                          </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="mt-12 max-w-2xl mx-auto">
                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative">
                              <div className="absolute left-[20%] right-[20%] h-full bg-primary-200"></div>
                              <div className="absolute left-[45%] w-[10%] h-full bg-primary-600"></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                              <span>Entry Level</span>
                              <span>Experienced</span>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><TrendingUp className="text-green-600"/> {t('careerTrajectory')}</h3>
                          <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">Jr</div>
                                  <div className="flex-1">
                                      <div className="flex justify-between mb-1">
                                          <span className="font-bold text-gray-700">Entry Level</span>
                                          <span className="text-gray-900">{salaryData.entry.toLocaleString()} AFN</span>
                                      </div>
                                      <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-gray-400 h-2 rounded-full w-1/3"></div></div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">Mid</div>
                                  <div className="flex-1">
                                      <div className="flex justify-between mb-1">
                                          <span className="font-bold text-gray-700">Mid Level</span>
                                          <span className="text-gray-900">{salaryData.mid.toLocaleString()} AFN</span>
                                      </div>
                                      <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-blue-500 h-2 rounded-full w-2/3"></div></div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center font-bold">Sr</div>
                                  <div className="flex-1">
                                      <div className="flex justify-between mb-1">
                                          <span className="font-bold text-gray-700">Senior Level</span>
                                          <span className="text-gray-900">{salaryData.senior.toLocaleString()} AFN</span>
                                      </div>
                                      <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-purple-600 h-2 rounded-full w-full"></div></div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><Briefcase className="text-orange-600"/> {t('openPositions')}</h3>
                          <p className="text-sm text-gray-500 mb-6">Based on your search, here are some active listings.</p>
                          <div className="space-y-4">
                              <div className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer flex justify-between items-center" onClick={() => navigate('/jobs')}>
                                  <div>
                                      <h4 className="font-bold text-gray-900">{role}</h4>
                                      <p className="text-xs text-gray-500">Tech Solutions Afghan</p>
                                  </div>
                                  <ArrowRight size={16} className="text-gray-400"/>
                              </div>
                              <div className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition cursor-pointer flex justify-between items-center" onClick={() => navigate('/jobs')}>
                                  <div>
                                      <h4 className="font-bold text-gray-900">Senior {role}</h4>
                                      <p className="text-xs text-gray-500">Roshan Telecom</p>
                                  </div>
                                  <ArrowRight size={16} className="text-gray-400"/>
                              </div>
                          </div>
                          <button onClick={() => navigate(`/jobs?keyword=${role}`)} className="w-full mt-6 bg-gray-900 text-white py-2 rounded-lg font-bold text-sm hover:bg-black transition">
                              {t('viewAll')}
                          </button>
                      </div>
                  </div>
              </div>
          ) : (
              <div className="text-center py-20">
                  <BarChart2 className="mx-auto text-gray-200 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-gray-400">Search to see salary insights</h3>
              </div>
          )}
      </div>
    </div>
  );
};
