
import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { Calendar, User, ArrowRight, Clock, Tag, Search, Hash } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CATEGORIES = ["All", "Market Trends", "Resume Tips", "Interview Prep", "Remote Work", "General"];

export const Blog: React.FC = () => {
  const { posts } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filter only published posts
  const publishedPosts = posts.filter(p => p.status === 'Published');

  const filteredPosts = publishedPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.readTime.toLowerCase().includes(query) || // Search by time (e.g. "5 min")
        ("#" + post.category.toLowerCase()).includes(query); // Search by hashtag

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <SEO 
        title="Career Advice & News - Afghan Job Finder" 
        description="Latest career advice, job market trends, and news for job seekers in Afghanistan." 
      />
      
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Career Advice & Insights</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Expert guidance to help you navigate the Afghan job market, build your skills, and land your dream job.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          
          {/* Main Content */}
          <div className="lg:w-2/3">
             {/* Controls: Search & Category */}
             <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search articles by keyword, #topic, author, or read time..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm transition"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                        activeCategory === cat 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                        {cat}
                    </button>
                    ))}
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-8">
               {filteredPosts.length > 0 ? filteredPosts.map(post => (
                 <div key={post.id} className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition group flex flex-col md:flex-row h-full">
                    <div className="md:w-2/5 h-32 md:h-auto overflow-hidden relative">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold text-gray-900 shadow-sm">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-3 md:p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3">
                           <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                           <span className="flex items-center gap-1"><Clock size={12}/> {post.readTime}</span>
                        </div>
                        <Link to={`/blog/${post.id}`}>
                           <h2 className="text-sm md:text-2xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-primary-600 transition leading-tight line-clamp-2">{post.title}</h2>
                        </Link>
                        <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed hidden md:block">{post.excerpt}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto md:mt-4">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-[10px] md:text-xs">
                               {post.author[0]}
                            </div>
                            <div className="hidden md:block">
                               <p className="text-xs font-bold text-gray-900">{post.author}</p>
                               <p className="text-[10px] text-gray-500">{post.role}</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => navigate(`/blog/${post.id}`)}
                            className="text-primary-600 text-[10px] md:text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all bg-primary-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg"
                         >
                           Read <span className="hidden md:inline">Article</span> <ArrowRight size={14}/>
                         </button>
                      </div>
                    </div>
                 </div>
               )) : (
                 <div className="col-span-2 text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <Hash className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-gray-900">No articles found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or category.</p>
                    <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-4 text-primary-600 hover:underline">
                        Clear Search
                    </button>
                 </div>
               )}
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <Tag size={18} className="text-primary-600"/> Popular Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                   {['Resume', 'Interview', 'Salary', 'Remote Work', 'Networking', 'Soft Skills'].map(tag => (
                      <span 
                        key={tag} 
                        onClick={() => setSearchQuery(tag)}
                        className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg border border-gray-100 hover:border-primary-200 hover:text-primary-600 cursor-pointer transition"
                      >
                        #{tag}
                      </span>
                   ))}
                </div>
             </div>

             <AdBanner className="h-64" label="Sponsored" />

             <div className="bg-gradient-to-br from-primary-900 to-gray-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                <h3 className="text-xl font-bold mb-3 relative z-10">Subscribe to our Newsletter</h3>
                <p className="text-primary-100 text-sm mb-6 relative z-10">Get the latest job opportunities and career advice delivered to your inbox weekly.</p>
                <div className="space-y-3 relative z-10">
                   <input type="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                   <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition shadow-lg">
                      Subscribe
                   </button>
                </div>
             </div>
             
             <AdBanner className="h-64" label="Partner Ad" />
          </div>
        </div>
      </div>
    </div>
  );
};
