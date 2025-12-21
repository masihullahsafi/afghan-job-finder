import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole, User } from '../types';
import { Info, ArrowLeft, Loader2, Check, AlertCircle, Eye, EyeOff, Mail } from 'lucide-react';
import { SEO } from '../components/SEO';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // Verification Step
  const [otp, setOtp] = useState('');
  
  const [role, setRole] = useState<UserRole>(UserRole.SEEKER);
  
  // Registration Data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login, register, verifyEmail, t } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const message = (location.state as any)?.message;
  const from = (location.state as any)?.from;

  const handleAuthSuccess = () => {
    if (from) {
      const fullPath = from.pathname + from.search + from.hash;
      navigate(fullPath);
    } else {
      if (role === UserRole.ADMIN) navigate('/admin');
      else if (role === UserRole.EMPLOYER) navigate('/employer');
      else navigate('/seeker');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        // --- 1. VERIFICATION FLOW ---
        if (isVerifying) {
            const result = await verifyEmail(email, otp);
            if (result.success) {
                handleAuthSuccess();
            } else {
                setError(result.message || "Invalid OTP code.");
            }
            setIsLoading(false);
            return;
        }

        // --- 2. FORGOT PASSWORD ---
        if (isForgot) {
            setTimeout(() => {
                setIsLoading(false);
                setResetSent(true);
            }, 1500);
            return;
        }

        // --- 3. LOGIN FLOW ---
        if (isLogin) {
            const result = await login(role, email, password);
            if (result.success) {
                handleAuthSuccess();
            } else {
                setError(result.message || "Invalid credentials.");
            }
            setIsLoading(false);
            return;
        }

        // --- 4. REGISTRATION FLOW ---
        // Validations
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setIsLoading(false);
            return;
        }

        const newUser: User = {
            _id: Date.now().toString(),
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            email,
            role,
            password,
            status: 'Pending', // Pending verification
            plan: 'Free',
            avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
        };

        const result = await register(newUser);
        
        if (result.success && result.requireVerification) {
            setIsVerifying(true); // Switch to OTP screen
            setError(''); // Clear errors
        } else if (!result.success) {
            setError(result.message || "Registration failed.");
        } else {
            // If verification disabled for some reason
            handleAuthSuccess();
        }
        setIsLoading(false);

    } catch (error) {
        console.error("Auth Error", error);
        setError("An unexpected error occurred.");
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <SEO title={isLogin ? "Login" : "Register"} description="Access your Afghan Job Finder account." />
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
      >
        <ArrowLeft size={18} /> Home
      </button>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isVerifying ? "Verify Email" : isForgot ? "Reset Password" : isLogin ? t('login') : t('register')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isVerifying 
                ? `We sent a code to ${email}`
                : isForgot 
                    ? "Enter your email to receive a reset link." 
                    : isLogin 
                        ? "Don't have an account? " 
                        : "Already have an account? "}
            
            {!isVerifying && !isForgot && (
                <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-primary-600 hover:text-primary-500 ml-1">
                {isLogin ? t('register') : t('login')}
                </button>
            )}
          </p>
        </div>

        {/* Status Messages */}
        {message && !error && !isVerifying && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm flex items-center gap-2 border border-blue-100 mb-4">
            <Info size={18} /> <span>{message}</span>
          </div>
        )}
        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100 mb-4 animate-pulse">
                <AlertCircle size={18} className="flex-shrink-0" /> <span>{error}</span>
            </div>
        )}

        {/* --- FORM --- */}
        {resetSent ? (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                <p className="text-gray-600 text-sm mb-6">We've sent a password reset link to your email address.</p>
                <button onClick={() => { setResetSent(false); setIsForgot(false); setIsLogin(true); }} className="text-primary-600 font-bold hover:underline">Back to Login</button>
            </div>
        ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* OTP INPUT */}
                {isVerifying && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Verification Code</label>
                        <input 
                            type="text" 
                            required 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full text-center text-2xl tracking-[0.5em] font-bold p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 uppercase"
                            placeholder="------"
                            maxLength={6}
                        />
                        <p className="text-xs text-center text-gray-500 mt-2">Check your spam folder if you don't see it.</p>
                    </div>
                )}

                {/* ROLE SELECTION */}
                {!isLogin && !isForgot && !isVerifying && (
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        {[UserRole.SEEKER, UserRole.EMPLOYER].map((r) => (
                            <button 
                                key={r}
                                type="button" 
                                onClick={() => setRole(r)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition uppercase ${role === r ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                )}

                {/* LOGIN / REGISTER FIELDS */}
                {!isVerifying && (
                    <>
                        {!isLogin && !isForgot && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                                    <input 
                                        type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                                    <input 
                                        type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                                <input 
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {!isForgot && (
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {!isLogin && !isForgot && (
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                                <input 
                                    type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}
                    </>
                )}

                {/* FORGOT PASSWORD LINK */}
                {isLogin && !isForgot && (
                    <div className="flex justify-end">
                        <button type="button" onClick={() => setIsForgot(true)} className="text-xs font-medium text-primary-600 hover:text-primary-500">Forgot password?</button>
                    </div>
                )}

                {/* SUBMIT BUTTON */}
                <button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isVerifying ? 'Verify Email' : isForgot ? 'Send Link' : isLogin ? 'Sign In' : 'Create Account')}
                </button>

                {isVerifying && (
                    <button type="button" onClick={() => setIsVerifying(false)} className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2">
                        Back to Registration
                    </button>
                )}
            </form>
        )}
      </div>
    </div>
  );
};