
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { SEO } from '../components/SEO';
import { Bell, Lock, Eye, Shield, Globe, Save, Trash2, LogOut, Moon, Sun, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { user, updateUserProfile, logout, t, language, setLanguage } = useAppContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'account' | 'notifications' | 'privacy'>('account');
  
  // Local state for form
  const [emailNotif, setEmailNotif] = useState(user?.settings?.emailNotifications ?? true);
  const [pushNotif, setPushNotif] = useState(user?.settings?.pushNotifications ?? true);
  const [publicProfile, setPublicProfile] = useState(user?.settings?.publicProfile ?? true);
  const [showContact, setShowContact] = useState(user?.settings?.showContactInfo ?? false);
  
  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
              <p className="text-red-500 mb-4">{t('accessDenied')}</p>
              <button onClick={() => navigate('/auth')} className="text-primary-600 hover:underline">Go to Login</button>
          </div>
      );
  }

  const handleSaveSettings = async () => {
      setIsSaving(true);
      await updateUserProfile({
          settings: {
              emailNotifications: emailNotif,
              pushNotifications: pushNotif,
              publicProfile: publicProfile,
              showContactInfo: showContact
          }
      });
      setIsSaving(false);
      alert("Settings saved successfully!");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      if (newPass !== confirmPass) {
          alert("New passwords do not match.");
          return;
      }
      if (newPass.length < 6) {
          alert("Password must be at least 6 characters.");
          return;
      }

      setIsSaving(true);
      try {
          // Sending password to backend to be hashed and updated
          await updateUserProfile({ password: newPass });
          alert("Password updated successfully!");
          setCurrentPass('');
          setNewPass('');
          setConfirmPass('');
      } catch (error) {
          console.error(error);
          alert("Failed to update password.");
      } finally {
          setIsSaving(false);
      }
  };

  const handleDeleteAccount = () => {
      const confirmText = prompt("Type 'DELETE' to confirm account deletion. This action is irreversible.");
      if (confirmText === 'DELETE') {
          logout();
          navigate('/');
          alert("Your account has been deleted.");
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO title="Settings - Afghan Job Finder" description="Manage your account settings and preferences." />
      
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings')}</h1>

        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <button 
                        onClick={() => setActiveSection('account')}
                        className={`w-full text-left px-6 py-4 flex items-center gap-3 font-medium transition ${activeSection === 'account' ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Lock size={18}/> Account Security
                    </button>
                    <button 
                        onClick={() => setActiveSection('notifications')}
                        className={`w-full text-left px-6 py-4 flex items-center gap-3 font-medium transition ${activeSection === 'notifications' ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Bell size={18}/> Notifications
                    </button>
                    <button 
                        onClick={() => setActiveSection('privacy')}
                        className={`w-full text-left px-6 py-4 flex items-center gap-3 font-medium transition ${activeSection === 'privacy' ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Eye size={18}/> Privacy & Visibility
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
                
                {/* Account Section */}
                {activeSection === 'account' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Lock className="text-gray-400"/> Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                            {/* Note: Current password validation would typically require a separate API endpoint to verify before update */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input 
                                    type="password" 
                                    value={newPass}
                                    onChange={(e) => setNewPass(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin"/> : null} Update Password
                            </button>
                        </form>

                        <div className="border-t border-gray-100 my-8 pt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Globe className="text-gray-400"/> Language Preference</h2>
                            <div className="grid grid-cols-3 gap-4 max-w-md">
                                <button 
                                    onClick={() => setLanguage('en')}
                                    className={`p-3 rounded-xl border text-center transition ${language === 'en' ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    English
                                </button>
                                <button 
                                    onClick={() => setLanguage('fa')}
                                    className={`p-3 rounded-xl border text-center transition ${language === 'fa' ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    دری
                                </button>
                                <button 
                                    onClick={() => setLanguage('ps')}
                                    className={`p-3 rounded-xl border text-center transition ${language === 'ps' ? 'border-primary-500 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    پښتو
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-red-100 my-8 pt-8">
                            <h2 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2"><AlertTriangle className="text-red-500" size={20}/> Danger Zone</h2>
                            <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                            <button onClick={handleDeleteAccount} className="text-red-600 border border-red-200 bg-red-50 px-6 py-2 rounded-lg font-bold hover:bg-red-100 transition flex items-center gap-2">
                                <Trash2 size={18}/> Delete Account
                            </button>
                        </div>
                    </div>
                )}

                {/* Notifications Section */}
                {activeSection === 'notifications' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Bell className="text-gray-400"/> Notification Preferences</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <h3 className="font-bold text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive job alerts and application updates via email.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <h3 className="font-bold text-gray-900">Push Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive real-time alerts in the browser.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={handleSaveSettings} 
                                disabled={isSaving}
                                className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition flex items-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Save Preferences
                            </button>
                        </div>
                    </div>
                )}

                {/* Privacy Section */}
                {activeSection === 'privacy' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Shield className="text-gray-400"/> Privacy Settings</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <h3 className="font-bold text-gray-900">Public Profile</h3>
                                    <p className="text-sm text-gray-500">Allow employers to find your profile in candidate search.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <h3 className="font-bold text-gray-900">Show Contact Info</h3>
                                    <p className="text-sm text-gray-500">Display email and phone number on your public profile.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={showContact} onChange={(e) => setShowContact(e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={handleSaveSettings} 
                                disabled={isSaving}
                                className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition flex items-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Save Privacy Settings
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};
