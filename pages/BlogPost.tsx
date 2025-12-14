
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { SEO } from '../components/SEO';
import { ArrowLeft, Calendar, Clock, User, Share2, Check, ExternalLink } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { UserRole } from '../types';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, allUsers } = useAppContext();
  const [copied, setCopied] = useState(false);
  
  const post = posts.find(p => p.id === Number(id));

  if (!post) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-gray-900">Article not found</h2>
              <button onClick={() => navigate('/blog')} className="mt-4 text-primary-600 hover:underline">Back to Blog</button>
          </div>
      );
  }

  // Filter other published posts
  const otherPosts = posts.filter(p => p.id !== post.id && p.status === 'Published').slice(0, 2);

  // Check if author is a registered employer
  const authorProfile = allUsers.find(u => u.id === post.authorId && u.role === UserRole.EMPLOYER);

  const handleShare = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleAuthorClick = () => {
      if (authorProfile) {
          navigate(`/companies/${authorProfile.id}`);
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO title={post.seoTitle || `${post.title} - Career Advice`} description={post.seoDescription || post.excerpt} />
      
      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[400px] w-full">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full p-4">
              <div className="container mx-auto">
                 <button 
                    onClick={() => navigate('/blog')} 
                    className="text-white hover:bg-white/20 p-2 rounded-full transition flex items-center gap-2 font-medium backdrop-blur-sm bg-black/20"
                 >
                    <ArrowLeft size={20} /> Back
                 </button>
              </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
             <div className="container mx-auto max-w-6xl">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 md:mb-4 inline-block shadow-sm">
                    {post.category}
                </span>
                <h1 className="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight max-w-4xl">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300 text-xs md:text-sm">
                   <div className="flex items-center gap-2">
                      <Calendar size={14} className="md:w-4 md:h-4" /> {post.date}
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock size={14} className="md:w-4 md:h-4" /> {post.readTime}
                   </div>
                </div>
             </div>
          </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-6 md:-mt-10 relative z-10">
         <div className="flex flex-col lg:flex-row gap-8">
             
             {/* Main Content */}
             <div className="lg:w-3/4">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-12 border border-gray-100">
                    {/* Author Info */}
                    <div className="flex justify-between items-center mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-100">
                        <div 
                            className={`flex items-center gap-3 ${authorProfile ? 'cursor-pointer group' : ''}`}
                            onClick={handleAuthorClick}
                        >
                            {authorProfile?.avatar ? (
                                <img src={authorProfile.avatar} alt={post.author} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-gray-200 group-hover:border-primary-500 transition" />
                            ) : (
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                    {post.author[0]}
                                </div>
                            )}
                            <div>
                                <p className={`font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base ${authorProfile ? 'group-hover:text-primary-600 transition' : ''}`}>
                                    {post.author}
                                    {authorProfile && <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition" />}
                                </p>
                                <p className="text-xs text-primary-600 font-medium uppercase">{post.role}</p>
                            </div>
                        </div>
                        <div className="relative">
                            <button 
                                onClick={handleShare}
                                className="text-gray-400 hover:text-primary-600 transition p-2 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200"
                                title="Share Article"
                            >
                                {copied ? <Check size={20} className="text-green-600"/> : <Share2 size={20} />}
                            </button>
                            {copied && (
                                <span className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                    Link Copied!
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div 
                        className="prose prose-sm md:prose-lg max-w-none text-gray-700 leading-relaxed font-serif"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    ></div>

                    {/* Tags (Mock) */}
                    <div className="mt-8 md:mt-10 pt-6 border-t border-gray-50 flex flex-wrap gap-2">
                        {post.seoKeywords ? post.seoKeywords.map((tag, idx) => (
                             <span key={idx} className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full">#{tag}</span>
                        )) : (
                            ['Career', post.category, 'Advice'].map(tag => (
                                <span key={tag} className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full">#{tag}</span>
                            ))
                        )}
                    </div>
                </div>

                {/* Read Next */}
                <div className="mt-12">
                    <h3 className="font-bold text-gray-900 mb-6 text-xl">Read Next</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {otherPosts.map(p => (
                            <Link key={p.id} to={`/blog/${p.id}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 md:border-0">
                                <div className="h-40 md:h-48 overflow-hidden">
                                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                                </div>
                                <div className="p-4 md:p-6">
                                    <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition text-base md:text-lg mb-2 line-clamp-2">{p.title}</h4>
                                    <p className="text-xs text-gray-500">{p.date} • {p.readTime}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
             </div>

             {/* Sidebar */}
             <div className="lg:w-1/4 space-y-8 mt-4 lg:mt-0">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                     <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Sponsored</h3>
                     <AdBanner className="h-64 w-full" label="Advertisement" />
                     <div className="mt-6 pt-6 border-t border-gray-100">
                         <h4 className="font-bold text-gray-900 mb-2">About the Author</h4>
                         <p className="text-sm text-gray-600 mb-4">{authorProfile?.bio || `Expert in ${post.category} with years of experience in the Afghan job market.`}</p>
                         {authorProfile && (
                             <button 
                                onClick={handleAuthorClick}
                                className="text-primary-600 text-sm font-bold hover:underline"
                             >
                                View Company Profile
                             </button>
                         )}
                     </div>
                 </div>
                 <AdBanner className="h-96 w-full" label="Partner Ad" />
             </div>
         </div>
      </div>
    </div>
  );
};
