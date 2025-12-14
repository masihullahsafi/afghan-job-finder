

import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const FAQ: React.FC = () => {
  const { t } = useAppContext();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t('q1'), 
      answer: t('a1')
    },
    {
      question: t('q2'), 
      answer: t('a2')
    },
    {
      question: t('q3'),
      answer: t('a3')
    },
    {
      question: t('step3Title') + "?",
      answer: t('step3Desc')
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO 
        title="Frequently Asked Questions - Afghan Job Finder" 
        description="Answers to common questions about using Afghan Job Finder for seekers and employers." 
      />
      
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('faq')}</h1>
          <p className="text-gray-600">{t('faqContent')}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? <ChevronUp className="text-primary-600" /> : <ChevronDown className="text-gray-400" />}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-50 bg-gray-50/30">
                  <div className="pt-3">{faq.answer}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};