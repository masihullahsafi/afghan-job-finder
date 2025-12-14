import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { Shield, ArrowLeft, Loader2, AlertCircle, Lock } from 'lucide-react';
import { SEO } from '../components/SEO';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const result = await login(UserRole.ADMIN, email, password);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message || "Invalid admin credentials.");
        }
    } catch (error) {
        setError("An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <SEO title="Admin Login" description="Restricted access." />
      
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-[120px] opacity-20 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20 -ml-20 -mb-20"></div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition font-medium z-10"
      >
        <ArrowLeft size={18} /> Exit
      </button>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/30">
              <Shield size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-400">Authorized personnel only.</p>
        </div>

        {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-500/30 mb-4 animate-pulse">
                <AlertCircle size={18} className="flex-shrink-0" /> <span>{error}</span>
            </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Admin Email</label>
                <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500 transition outline-none"
                    placeholder="admin@afghanjobfinder.com"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Password</label>
                <div className="relative">
                    <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-500 transition outline-none"
                        placeholder="••••••••"
                    />
                    <Lock className="absolute right-3 top-3.5 text-gray-500" size={18}/>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Access Dashboard'}
            </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500">
            Secure System • IP Logged
        </div>
      </div>
    </div>
  );
};