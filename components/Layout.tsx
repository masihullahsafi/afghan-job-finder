
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Menu, X, Globe, User, LogOut, Shield, Bell, MessageSquare, Crown, ChevronRight, Home, Building2, BookOpen, PlusCircle, Search, Briefcase, Users, Settings } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t, user, logout, notifications, markNotificationAsRead, markAllNotificationsAsRead, chatMessages } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLanguageChange = (lang: 'en' | 'fa' | 'ps') => {
    setLanguage(lang);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;
  
  // Chat Unread Count
  const unreadMessages = user ? chatMessages.filter(m => m.receiverId === user.id && !m.isRead).length : 0;

  // Active link helper
  const isActive = (path: string) => pathname === path;

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${language === 'fa' || language === 'ps' ? 'font-arabic' : 'font-sans'}`}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-50">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
                AJ
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Afghan Job Finder</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className={`font-medium text-sm transition-colors ${isActive('/') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>{t('home')}</Link>
              <Link to="/jobs" className={`font-medium text-sm transition-colors ${isActive('/jobs') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>{t('jobs')}</Link>
              <Link to="/companies" className={`font-medium text-sm transition-colors ${isActive('/companies') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>{t('companies')}</Link>
              <Link to="/community" className={`font-medium text-sm transition-colors ${isActive('/community') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>{t('community')}</Link>
              <Link to="/blog" className={`font-medium text-sm transition-colors ${isActive('/blog') ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'}`}>{t('blog')}</Link>
              {user?.role === 'ADMIN' && (
                 <Link to="/admin" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 text-sm bg-red-50 px-3 py-1 rounded-full">
                   <Shield size={14} /> Admin
                 </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Language Switcher (Desktop) */}
              <div className="hidden md:block relative group">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm transition">
                  <Globe size={16} />
                  <span className="uppercase">{language}</span>
                </button>
                <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100 p-1 z-50 transform origin-top-right">
                  <button onClick={() => handleLanguageChange('en')} className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${language === 'en' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}>English</button>
                  <button onClick={() => handleLanguageChange('fa')} className={`block w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition-colors ${language === 'fa' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}>دری</button>
                  <button onClick={() => handleLanguageChange('ps')} className={`block w-full text-right px-4 py-2 rounded-lg text-sm font-medium transition-colors ${language === 'ps' ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}>پښتو</button>
                </div>
              </div>

              {user ? (
                <div className="flex items-center gap-2 md:gap-3">
                   {/* Messages Link */}
                   <Link to="/messages" className="text-gray-500 hover:text-primary-600 relative p-2 rounded-full hover:bg-gray-100 transition">
                      <MessageSquare size={20} />
                      {unreadMessages > 0 && (
                         <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white"></span>
                      )}
                   </Link>

                   {/* Notifications */}
                   <div className="relative" ref={notifRef}>
                     <button 
                       onClick={() => setIsNotifOpen(!isNotifOpen)}
                       className="text-gray-500 hover:text-primary-600 relative p-2 rounded-full hover:bg-gray-100 transition"
                     >
                       <Bell size={20} />
                       {unreadCount > 0 && (
                         <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                       )}
                     </button>
                     
                     {/* Notification Dropdown */}
                     {isNotifOpen && (
                        <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-100 origin-top-right">
                          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm">
                             <h3 className="font-bold text-gray-900 text-sm">{t('notifications')}</h3>
                             {unreadCount > 0 && (
                               <button onClick={markAllNotificationsAsRead} className="text-xs text-primary-600 hover:underline font-medium">{t('markAllRead')}</button>
                             )}
                          </div>
                          <div className="max-h-[350px] overflow-y-auto">
                            {userNotifications.length > 0 ? (
                                userNotifications.map(notif => (
                                  <div 
                                    key={notif.id} 
                                    onClick={() => {
                                      markNotificationAsRead(notif.id);
                                      if(notif.link) {
                                        navigate(notif.link);
                                        setIsNotifOpen(false);
                                      }
                                    }}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-blue-50/30' : 'bg-white'}`}
                                  >
                                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-primary-500' : 'bg-gray-200'}`}></div>
                                    <div>
                                      <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{notif.title}</p>
                                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                                      <p className="text-[10px] text-gray-400 mt-2 font-medium">{notif.date}</p>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <div className="p-10 text-center text-gray-400 text-sm flex flex-col items-center">
                                <Bell size={24} className="mb-2 opacity-20" />
                                {t('noNotifications')}
                              </div>
                            )}
                          </div>
                        </div>
                     )}
                   </div>
                   
                   <div className="hidden md:block w-px h-6 bg-gray-200 mx-1"></div>

                   {/* User Menu Dropdown */}
                   <div className="relative" ref={userMenuRef}>
                       <button 
                         onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                         className="hidden md:flex items-center gap-2 pl-2 hover:bg-gray-50 rounded-lg pr-3 py-1 transition group cursor-pointer"
                       >
                         <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200 group-hover:border-primary-300">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover"/> : user.name[0]}
                         </div>
                         <div className="text-left">
                            <p className="text-sm font-bold text-gray-700 leading-none group-hover:text-primary-700">{user.name.split(' ')[0]}</p>
                            {user.role === 'EMPLOYER' && user.plan === 'Premium' && (
                                <span className="text-[10px] text-yellow-600 font-bold flex items-center gap-0.5 mt-0.5">
                                    <Crown size={8} className="fill-current"/> PRO
                                </span>
                            )}
                         </div>
                       </button>

                       {isUserMenuOpen && (
                           <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in duration-100 origin-top-right">
                               <button 
                                 onClick={() => { setIsUserMenuOpen(false); navigate(user.role === 'EMPLOYER' ? '/employer' : user.role === 'ADMIN' ? '/admin' : '/seeker'); }}
                                 className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                               >
                                   <User size={16}/> {t('dashboard')}
                               </button>
                               <button 
                                 onClick={() => { setIsUserMenuOpen(false); navigate('/settings'); }}
                                 className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                               >
                                   <Settings size={16}/> {t('settings')}
                               </button>
                               <div className="h-px bg-gray-100 my-1"></div>
                               <button 
                                 onClick={() => { setIsUserMenuOpen(false); logout(); navigate('/'); }}
                                 className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                               >
                                   <LogOut size={16}/> {t('logout')}
                               </button>
                           </div>
                       )}
                   </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/auth" className="text-gray-600 hover:text-primary-600 font-bold text-sm px-3 py-2">{t('login')}</Link>
                  <Link to="/auth" className="bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition font-bold text-sm shadow-lg shadow-primary-500/20 active:scale-95 transform duration-100">
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <button 
              className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Menu (Overlay) */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-right duration-300 md:hidden">
            {/* Mobile Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                <span className="font-bold text-xl text-gray-900 tracking-tight">Menu</span>
                <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600"
                >
                    <X size={24}/>
                </button>
            </div>

            {/* ADDED PADDING BOTTOM (pb-28) TO ENSURE LOGOUT IS VISIBLE */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-28">
                
                {/* User Section (Mobile) */}
                {user ? (
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center gap-4" onClick={() => { navigate(user.role === 'EMPLOYER' ? '/employer' : user.role === 'ADMIN' ? '/admin' : '/seeker'); setIsMobileMenuOpen(false); }}>
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg truncate">{user.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 uppercase">{user.role}</span>
                                {user.role === 'EMPLOYER' && user.plan === 'Premium' && (
                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1.5 py-0.5 rounded font-bold border border-yellow-200 flex items-center gap-0.5">
                                        <Crown size={10} className="fill-current"/> PRO
                                    </span>
                                )}
                            </div>
                        </div>
                        <ChevronRight className="text-gray-400" size={20}/>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-center shadow-sm">
                            {t('login')}
                        </Link>
                        <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary-600 text-white py-3 rounded-xl font-bold text-center shadow-lg shadow-primary-500/20">
                            {t('register')}
                        </Link>
                    </div>
                )}

                {/* Additional Links */}
                <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Explore</p>
                    <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Users size={18}/></div>
                        {t('community')}
                    </Link>
                    <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center"><BookOpen size={18}/></div>
                        {t('blog')}
                    </Link>
                    <Link to="/salaries" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Briefcase size={18}/></div>
                        Salary Explorer
                    </Link>
                    <Link to="/events" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition">
                        <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center"><User size={18}/></div>
                        Events
                    </Link>
                    <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center"><Settings size={18}/></div>
                        {t('settings')}
                    </Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><Shield size={18}/></div>
                        {t('about')}
                    </Link>
                </div>

                {/* Language Switcher (Mobile) */}
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Language</p>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button 
                            onClick={() => handleLanguageChange('en')} 
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            English
                        </button>
                        <button 
                            onClick={() => handleLanguageChange('fa')} 
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'fa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            دری
                        </button>
                        <button 
                            onClick={() => handleLanguageChange('ps')} 
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${language === 'ps' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            پښتو
                        </button>
                    </div>
                </div>

                {/* Logout Button - Pushed to bottom via mt-auto, but protected by container padding */}
                {user && (
                    <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }} 
                        className="w-full flex items-center justify-center gap-2 p-4 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-xl transition mt-auto"
                    >
                        <LogOut size={20}/> {t('logout')}
                    </button>
                )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Add padding bottom for mobile nav */}
      <main className="flex-grow pb-24 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) - Always Visible */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 px-6 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary-600' : 'text-gray-400'}`}>
              <Home size={24} className={isActive('/') ? 'fill-current' : ''} />
              <span className="text-[10px] font-medium">{t('home')}</span>
          </Link>
          <Link to="/jobs" className={`flex flex-col items-center gap-1 ${isActive('/jobs') ? 'text-primary-600' : 'text-gray-400'}`}>
              <Briefcase size={24} className={isActive('/jobs') ? 'fill-current' : ''} />
              <span className="text-[10px] font-medium">{t('jobs')}</span>
          </Link>
          
          {/* Main Action Button */}
          <div className="relative -top-5">
              <button 
                onClick={() => navigate(user?.role === 'EMPLOYER' ? '/employer' : '/jobs')}
                className="bg-primary-600 text-white p-4 rounded-full shadow-lg shadow-primary-600/30 hover:scale-105 transition active:scale-95"
              >
                  {user?.role === 'EMPLOYER' ? <PlusCircle size={24} /> : <Search size={24} />}
              </button>
          </div>

          <Link to="/community" className={`flex flex-col items-center gap-1 ${isActive('/community') ? 'text-primary-600' : 'text-gray-400'}`}>
              <Users size={24} className={isActive('/community') ? 'fill-current' : ''} />
              <span className="text-[10px] font-medium">Community</span>
          </Link>
          <Link 
            to={user ? (user.role === 'EMPLOYER' ? '/employer' : user.role === 'ADMIN' ? '/admin' : '/seeker') : '/auth'} 
            className={`flex flex-col items-center gap-1 ${['/employer', '/seeker', '/admin', '/auth'].includes(pathname) ? 'text-primary-600' : 'text-gray-400'}`}
          >
              <User size={24} className={['/employer', '/seeker', '/admin', '/auth'].includes(pathname) ? 'fill-current' : ''} />
              <span className="text-[10px] font-medium">{user ? 'Profile' : t('login')}</span>
          </Link>
      </div>

      {/* Footer (Hidden on Mobile Main Views to avoid clutter, optional) */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4 text-white">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold">AJ</div>
                  <span className="text-xl font-bold">Afghan Job Finder</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-400 mb-4">
                The most trusted bridge between talent and opportunity in Afghanistan. Connecting thousands of professionals with top employers.
              </p>
              <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition cursor-pointer text-white">FB</div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition cursor-pointer text-white">TW</div>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition cursor-pointer text-white">LN</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/jobs" className="hover:text-primary-400 transition flex items-center gap-2"><ChevronRight size={14}/> Browse Jobs</Link></li>
                <li><Link to="/companies" className="hover:text-primary-400 transition flex items-center gap-2"><ChevronRight size={14}/> Companies</Link></li>
                <li><Link to="/blog" className="hover:text-primary-400 transition flex items-center gap-2"><ChevronRight size={14}/> Career Advice</Link></li>
                <li><Link to="/about" className="hover:text-primary-400 transition flex items-center gap-2"><ChevronRight size={14}/> {t('about')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Tools</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/tools/salary-calculator" className="hover:text-primary-400 transition flex items-center gap-2"><ChevronRight size={14}/> Salary Calculator</Link></li>
                <li><Link to="/salaries" className="hover:text-primary-400 transition flex items-center gap-2"><ChevronRight size={14}/> Salary Explorer</Link></li>
                <li><Link to="/tools/skills-assessment" className="hover:text-primary-400 transition flex items-center gap-2"><ChevronRight size={14}/> Skill Assessment</Link></li>
                <li><Link to="/events" className="hover:text-primary-400 transition flex items-center gap-2"><ChevronRight size={14}/> Events</Link></li>
              </ul>
            </div>

             <div>
              <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/faq" className="hover:text-primary-400 transition">FAQ</Link></li>
                <li><Link to="/privacy" className="hover:text-primary-400 transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary-400 transition">Terms of Service</Link></li>
                <li><Link to="/contact" className="hover:text-primary-400 transition underline">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Afghan Job Finder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
