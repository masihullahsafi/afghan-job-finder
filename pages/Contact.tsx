
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { ContactMessage } from '../types';

export const Contact: React.FC = () => {
  const { t, sendContactMessage } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to context (Mock DB)
    const newMessage: ContactMessage = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        date: new Date().toISOString().split('T')[0],
        read: false
    };
    sendContactMessage(newMessage);

    setSubmitted(true);
    // Reset after 3 seconds
    setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO 
        title="Contact Us - Afghan Job Finder" 
        description="Get in touch with the Afghan Job Finder team for support, inquiries, or feedback." 
      />
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('contactUs')}</h1>
            <p className="text-gray-600">We'd love to hear from you. Please send us a message or visit us.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-500">info@afghanjobfinder.com</p>
                    <p className="text-gray-500">support@afghanjobfinder.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-500">+93 700 123 456</p>
                    <p className="text-gray-500">+93 799 654 321</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-500">Shahr-e-Naw, Kabul</p>
                    <p className="text-gray-500">Afghanistan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <CheckCircle size={48} className="text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">{t('messageSent')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" 
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" 
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('subject')}</label>
                    <input 
                      type="text" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" 
                      placeholder="Inquiry about..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</label>
                    <textarea 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      rows={4} 
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none" 
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2">
                    <Send size={18} /> {t('sendMessage')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};