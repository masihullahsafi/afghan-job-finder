

import React from 'react';
import { SEO } from '../components/SEO';
import { useAppContext } from '../context/AppContext';

export const Privacy: React.FC = () => {
  const { t } = useAppContext();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO title="Privacy Policy" description="Privacy Policy for Afghan Job Finder" />
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('privacyPolicy')}</h1>
          <div className="prose text-gray-600">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mb-4">
              {t('privacyContent')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};