import React from 'react';
import { SEO } from '../components/SEO';
import { useAppContext } from '../context/AppContext';
import { Users, Target, ShieldCheck, TrendingUp } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useAppContext();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO title="About Us - Afghan Job Finder" description="Learn about our mission to connect talent with opportunity in Afghanistan." />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{t('about')}</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    We are dedicated to rebuilding Afghanistan's economy by connecting talented individuals with the right opportunities through advanced technology.
                </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="bg-blue-50 p-4 rounded-full text-blue-600 mb-4">
                        <Target size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed">
                        To bridge the gap between job seekers and employers in Afghanistan by providing a reliable, accessible, and intelligent platform that fosters economic growth and professional development.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="bg-purple-50 p-4 rounded-full text-purple-600 mb-4">
                        <TrendingUp size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
                    <p className="text-gray-600 leading-relaxed">
                        A thriving Afghanistan where every skilled individual has access to meaningful work, and every business can find the talent they need to innovate and succeed.
                    </p>
                </div>
            </div>

            {/* Core Values */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <ShieldCheck className="text-green-600 mb-4" size={28} />
                        <h3 className="font-bold text-lg mb-2">Trust & Safety</h3>
                        <p className="text-gray-500 text-sm">We verify employers and monitor listings to ensure a safe environment for all users.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <Users className="text-orange-600 mb-4" size={28} />
                        <h3 className="font-bold text-lg mb-2">Community First</h3>
                        <p className="text-gray-500 text-sm">Built for Afghans, by Afghans. We understand the local market dynamics and cultural needs.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-100">
                        <Target className="text-blue-600 mb-4" size={28} />
                        <h3 className="font-bold text-lg mb-2">AI-Powered Matches</h3>
                        <p className="text-gray-500 text-sm">Using advanced AI to match skills with requirements, saving time for both candidates and recruiters.</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-900 rounded-3xl p-10 text-white text-center">
                <h2 className="text-2xl font-bold mb-8">Our Impact</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <div className="text-4xl font-bold text-primary-400 mb-1">5k+</div>
                        <div className="text-sm text-gray-400">Active Jobs</div>
                    </div>
                    <div>
                         <div className="text-4xl font-bold text-primary-400 mb-1">10k+</div>
                        <div className="text-sm text-gray-400">Seekers</div>
                    </div>
                     <div>
                         <div className="text-4xl font-bold text-primary-400 mb-1">500+</div>
                        <div className="text-sm text-gray-400">Companies</div>
                    </div>
                     <div>
                         <div className="text-4xl font-bold text-primary-400 mb-1">1k+</div>
                        <div className="text-sm text-gray-400">Placements</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};