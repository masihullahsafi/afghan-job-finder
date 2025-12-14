
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CVTemplates } from '../components/CVTemplates';
import { Download, Mail, ArrowLeft, Printer, Share2, Check } from 'lucide-react';
import { SEO } from '../components/SEO';

export const PublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allUsers } = useAppContext();
  const [theme, setTheme] = useState<'Modern' | 'Professional' | 'Creative' | 'Minimal'>('Professional');
  const [copied, setCopied] = useState(false);

  const user = allUsers.find(u => u.id === id);

  if (!user || user.role !== 'SEEKER') {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-500 mb-6">The profile you are looking for does not exist or is private.</p>
            <button onClick={() => navigate('/')} className="text-primary-600 hover:underline">Go Home</button>
        </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <SEO title={`${user.name} - Professional Profile`} description={`View the professional profile and CV of ${user.name}.`} />
      
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm no-print">
          <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 text-sm font-medium">
                      <ArrowLeft size={16}/> Home
                  </button>
                  <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
                  <h1 className="font-bold text-gray-900 truncate">{user.name}'s Profile</h1>
              </div>

              <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 mr-4">
                      <span className="text-xs text-gray-500">Theme:</span>
                      <select 
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as any)}
                        className="bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary-500"
                      >
                          <option value="Professional">Professional</option>
                          <option value="Modern">Modern</option>
                          <option value="Creative">Creative</option>
                          <option value="Minimal">Minimal</option>
                      </select>
                  </div>

                  <button 
                    onClick={handleShare}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                    title="Copy Link"
                  >
                      {copied ? <Check size={20} className="text-green-600"/> : <Share2 size={20}/>}
                  </button>
                  
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition shadow-lg"
                  >
                      <Download size={16}/> Download PDF
                  </button>
                  
                  <a 
                    href={`mailto:${user.email}`}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition shadow-lg"
                  >
                      <Mail size={16}/> Contact
                  </a>
              </div>
          </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="w-full max-w-[210mm] bg-white shadow-2xl rounded-sm print:shadow-none print:w-full">
              <CVTemplates user={user} theme={theme} />
          </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
            .no-print { display: none !important; }
            body { background: white; }
            .container { max-width: 100%; padding: 0; }
            @page { margin: 0; }
        }
      `}</style>
    </div>
  );
};
