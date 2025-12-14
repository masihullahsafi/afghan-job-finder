

import React from 'react';
import { SEO } from '../components/SEO';
import { useAppContext } from '../context/AppContext';

export const Terms: React.FC = () => {
  const { t } = useAppContext();
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO title="Terms of Service" description="Terms of Service for Afghan Job Finder" />
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('termsOfService')}</h1>
          <div className="prose text-gray-600">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="mb-4">
              {t('termsContent')}
            </p>
            <div className="mt-8 space-y-4">
                <div>
                   <h3 className="font-bold text-gray-800">{t('acceptanceOfTerms')}</h3>
                   <p className="text-sm mt-1">{t('termsContent')}</p>
                </div>
                 <div>
                   <h3 className="font-bold text-gray-800">{t('accounts')}</h3>
                   <p className="text-sm mt-1">Users are responsible for maintaining the confidentiality of their account credentials.</p>
                </div>
                 <div>
                   <h3 className="font-bold text-gray-800">{t('jobPostings')}</h3>
                   <p className="text-sm mt-1">Employers must provide accurate information. We do not guarantee the validity of any job offer.</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};