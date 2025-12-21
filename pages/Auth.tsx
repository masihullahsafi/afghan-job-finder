
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole, User } from '../types';
import { Info, ArrowLeft, Loader2, Check, AlertCircle, Eye, EyeOff, Mail, Key, UserCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);
  
  // Form Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login, register, t } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from;

  const handleAuthSuccess = () => {
    if (from) {
      navigate(from.pathname + from.search + from.hash);
    } else {
      const user = JSON.parse(localStorage.getItem('ajf_user') || '{}');
      if (user.role === UserRole.ADMIN) navigate('/admin');
      else if (user.role === UserRole.EMPLOYER) navigate('/employer');
      else navigate('/seeker');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        if (isForgot) {
            setTimeout(() => { setIsLoading(false); setResetSent(true); }, 1500);
            return;
        }

        if (isLogin) {
            const result = await login(role, email, password);
            if (result.success) {
                handleAuthSuccess();
            } else {
                setError(result.message || "");
                if (result.redirect === 'register') {
                    // Pre-fill email and switch to register
                    setTimeout(() => { setIsLogin(false); setError(result.message || ""); }, 2000);
                }
                if (result.redirect === 'forgot') {
                    // Password wrong, show option
                }
            }
            setIsLoading(false);
            return;
        }

        // Registration Flow
        if (password !== confirmPassword) { setError("Passwords do not match."); setIsLoading(false); return; }
        
        const newUser: User = {
            _id: Date.now().toString(),
            firstName, lastName, name: `${firstName} ${lastName}`,
            email, role, password, plan: 'Free',
            avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
        };

        const result = await register(newUser);
        if (result.success) {
            handleAuthSuccess();
        } else {
            setError(result.message || "");
            if (result.redirect === 'login') {
                setTimeout(() => { setIsLogin(true); setError(result.message || ""); }, 2000);
            }
        }
        setIsLoading(false);

    } catch (err) {
        setError("An unexpected error occurred.");
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <SEO title={isLogin ? "Login" : "Register"} />
      
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition font-medium">
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary-50 rounded-full text-primary-600 mb-4">
              {isLogin ? <Key size={32}/> : <UserCircle size={32}/>}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">{isForgot ? "Reset Password" : isLogin ? t('login') : t('register')}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isForgot ? "Enter your email to receive a reset link." : isLogin ? "Welcome back! Please enter your details." : "Join thousands of professionals in Afghanistan."}
          </p>
        </div>

        {error && (
            <div className={`p-3 rounded-lg text-sm flex items-start gap-2 mb-4 animate-in slide-in-from-top-2 duration-300 ${error.includes("already") || error.includes("Redirecting") ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}

        {resetSent ? (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-600 text-sm mb-6">We've sent a recovery link to <strong>{email}</strong>.</p>
                <button onClick={() => { setResetSent(false); setIsForgot(false); setIsLogin(true); setError(''); }} className="text-primary-600 font-bold hover:underline">Back to Login</button>
            </div>
        ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
                {!isForgot && !isLogin && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">First Name</label>
                            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Last Name</label>
                            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="name@company.com" />
                    </div>
                </div>

                {!isForgot && (
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                            {isLogin && <button type="button" onClick={() => setIsForgot(true)} className="text-[10px] font-bold text-primary-600 hover:underline uppercase tracking-wider">Forgot?</button>}
                        </div>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>
                )}

                {!isForgot && !isLogin && (
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">Confirm Password</label>
                        <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="••••••••" />
                    </div>
                )}

                {!isForgot && (
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button type="button" onClick={() => setRole(UserRole.SEEKER)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition uppercase ${role === UserRole.SEEKER ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Seeker</button>
                        <button type="button" onClick={() => setRole(UserRole.EMPLOYER)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition uppercase ${role === UserRole.EMPLOYER ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Employer</button>
                    </div>
                )}

                <button type="submit" disabled={isLoading} className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50">
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isForgot ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account')}
                </button>

                <div className="mt-6 text-center">
                    <button type="button" onClick={() => { setIsLogin(!isLogin); setIsForgot(false); setError(''); }} className="text-sm font-medium text-gray-500 hover:text-primary-600">
                        {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
                    </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};
