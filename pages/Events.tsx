
import React from 'react';
import { SEO } from '../components/SEO';
import { Calendar, MapPin, Users, Video, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { useAppContext } from '../context/AppContext';

export const Events: React.FC = () => {
  const { t } = useAppContext();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <SEO title="Career Events & Webinars" description="Join job fairs, workshops, and networking events in Afghanistan." />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t('eventsTitle')}</h1>
                <p className="text-gray-600">{t('eventsSubtitle')}</p>
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">{t('filterBy')}</button>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800">{t('viewAll')}</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_EVENTS.map(event => (
                // Fixed: Changed event.id to event._id
                <div key={event._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition">
                    <div className="h-48 relative overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-sm">
                            {event.category}
                        </div>
                        <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                            {event.type}
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-primary-600 font-bold uppercase tracking-wide mb-2">
                            <Calendar size={12}/> {new Date(event.date).toLocaleDateString()} • {event.time}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition">{event.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>
                        
                        <div className="space-y-2 mb-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                {event.type === 'Online' ? <Video size={16} className="text-gray-400"/> : <MapPin size={16} className="text-gray-400"/>}
                                <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-gray-400"/>
                                <span>{event.attendees} Registered</span>
                            </div>
                        </div>

                        <button className="w-full py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-900 hover:text-white transition flex items-center justify-center gap-2">
                            Register Now <ArrowRight size={16}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Newsletter / Alert for Events */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Never Miss an Event</h2>
            <p className="mb-8 opacity-90 max-w-xl mx-auto">Get notified about upcoming job fairs and career workshops in your city.</p>
            <div className="max-w-md mx-auto flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-xl text-gray-900 outline-none" />
                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition">Subscribe</button>
            </div>
        </div>
      </div>
    </div>
  );
};
