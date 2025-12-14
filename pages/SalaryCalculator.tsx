
import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { useAppContext } from '../context/AppContext';
import { Calculator, DollarSign, PieChart, Info, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SalaryCalculator: React.FC = () => {
  const { t } = useAppContext();
  const navigate = useNavigate();
  const [salary, setSalary] = useState<string>('');
  const [result, setResult] = useState<{
    gross: number;
    tax: number;
    net: number;
    bracket: string;
  } | null>(null);

  const calculateTax = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = parseFloat(salary);
    if (isNaN(gross) || gross < 0) return;

    let tax = 0;
    let bracket = "0%";

    // Afghanistan Tax Logic (2009 Income Tax Law Model)
    if (gross <= 5000) {
      tax = 0;
      bracket = "0% (Exempt)";
    } else if (gross <= 12500) {
      tax = (gross - 5000) * 0.02;
      bracket = "2% (> 5,000)";
    } else if (gross <= 100000) {
      tax = 150 + (gross - 12500) * 0.10;
      bracket = "10% (> 12,500)";
    } else {
      tax = 8900 + (gross - 100000) * 0.20;
      bracket = "20% (> 100,000)";
    }

    setResult({
      gross,
      tax: Math.round(tax),
      net: Math.round(gross - tax),
      bracket
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO title={t('salaryCalculator')} description="Calculate your net salary in Afghanistan after tax." />
      
      <div className="container mx-auto px-4 max-w-4xl">
         {/* Back Button */}
         <button 
           onClick={() => navigate(-1)} 
           className="mb-4 flex items-center gap-1 text-gray-500 hover:text-gray-900 transition font-medium text-sm"
        >
           <ArrowLeft size={16} /> {t('back')}
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Calculator className="text-primary-600" /> {t('salaryCalculator')}
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            {t('calcDisclaimer')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Calculator Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
             <form onSubmit={calculateTax} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{t('grossSalary')} (AFN)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="number" 
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none text-lg text-gray-900 placeholder-gray-400 transition"
                      placeholder="e.g. 25000"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                >
                   {t('calculate')} <ArrowRight size={20} />
                </button>
             </form>
             
             <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex items-start gap-3">
                <Info className="flex-shrink-0 mt-0.5" size={18} />
                <p>{t('calcDisclaimer')}</p>
             </div>
          </div>

          {/* Results */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
             {result ? (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">{t('results')}</h2>
                  
                  <div className="flex justify-between items-center">
                     <span className="text-gray-500 font-medium">{t('grossSalary')}</span>
                     <span className="text-xl font-bold text-gray-900">{result.gross.toLocaleString()} AFN</span>
                  </div>

                  <div className="flex justify-between items-center">
                     <span className="text-gray-500 font-medium">{t('taxBracket')}</span>
                     <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">{result.bracket}</span>
                  </div>

                  <div className="flex justify-between items-center text-red-600">
                     <span className="font-medium">{t('tax')}</span>
                     <span className="text-xl font-bold">- {result.tax.toLocaleString()} AFN</span>
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                     <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-primary-700">{t('netSalary')}</span>
                        <span className="text-3xl font-extrabold text-primary-600">{result.net.toLocaleString()} AFN</span>
                     </div>
                     <p className="text-right text-xs text-gray-400 mt-1">{t('monthlyTakeHome')}</p>
                  </div>
                  
                  {/* Visualization */}
                  <div className="mt-6">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{t('tax')} ({Math.round((result.tax / result.gross) * 100)}%)</span>
                          <span>{t('netSalary')} ({Math.round((result.net / result.gross) * 100)}%)</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                          <div className="bg-red-400 h-full" style={{ width: `${(result.tax / result.gross) * 100}%` }}></div>
                          <div className="bg-green-500 h-full" style={{ width: `${(result.net / result.gross) * 100}%` }}></div>
                      </div>
                  </div>
               </div>
             ) : (
               <div className="text-center text-gray-400 py-10">
                  <PieChart className="mx-auto mb-4 opacity-20" size={64} />
                  <p>{t('grossSalary')}...</p>
               </div>
             )}
          </div>

        </div>

        {/* Tax Table Info */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">{t('taxReference')}</h3>
            </div>
            <div className="p-6 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="pb-3">{t('grossSalary')}</th>
                            <th className="pb-3">{t('taxRate')}</th>
                            <th className="pb-3">{t('calculation')}</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 divide-y divide-gray-50">
                        <tr>
                            <td className="py-3">0 - 5,000</td>
                            <td>0%</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td className="py-3">5,001 - 12,500</td>
                            <td>2%</td>
                            <td>(Gross - 5,000) * 2%</td>
                        </tr>
                        <tr>
                            <td className="py-3">12,501 - 100,000</td>
                            <td>10% + Fixed</td>
                            <td>150 + (Gross - 12,500) * 10%</td>
                        </tr>
                        <tr>
                            <td className="py-3">100,001+</td>
                            <td>20% + Fixed</td>
                            <td>8,900 + (Gross - 100,000) * 20%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};
