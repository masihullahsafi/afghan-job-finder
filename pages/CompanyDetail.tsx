
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MapPin, Globe, Briefcase, Bookmark, ArrowRight, Mail, Phone, ExternalLink, ArrowLeft, Star, MessageSquare, Plus, X, BookOpen, Calendar, Facebook, Twitter, Linkedin, Check, Image as ImageIcon, Play, PlayCircle } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { SEO } from '../components/SEO';
import { Review, UserRole } from '../types';

export const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allUsers, jobs, t, savedJobIds, toggleSaveJob, reviews, addReview, user, posts, toggleFollowCompany } = useAppContext();
  const [activeTab, setActiveTab] = useState<'jobs' | 'reviews' | 'articles' | 'gallery'>('jobs');
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Find the employer in the "database"
  const company = allUsers.find(u => u.id === id && u.role === 'EMPLOYER');

  if (!company) {
    return <div className="p-10 text-center text-gray-500">Company not found.</div>;
  }

  // Find active jobs for this company
  const companyJobs = jobs.filter(j => j.company === company.name && j.status === 'Active');
  
  // Find articles by this company (Visible to ALL users including visitors)
  const companyArticles = posts.filter(p => p.authorId === company.id && p.status === 'Published');
  
  // Smart Tab Selection: If no jobs but has articles, default to articles
  useEffect(() => {
      if (companyJobs.length === 0 && companyArticles.length > 0) {
          setActiveTab('articles');
      }
  }, [companyJobs.length, companyArticles.length]);

  // Find reviews for this company
  const companyReviews = reviews.filter(r => r.companyId === company.id);
  const avgRating = companyReviews.length > 0 
    ? (companyReviews.reduce((acc, r) => acc + r.rating, 0) / companyReviews.length).toFixed(1) 
    : 'New';

  const isFollowing = user?.following?.includes(company.id);

  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      
      const newReview: Review = {
          id: Date.now().toString(),
          companyId: company.id,
          userId: user.id,
          userName: user.name,
          rating,
          comment,
          date: new Date().toISOString().split('T')[0]
      };
      
      addReview(newReview);
      setShowReviewModal(false);
      setComment('');
      setRating(5);
  };

  const handleFollow = () => {
      if (!user) {
          navigate('/auth', { state: { message: "Please login to follow companies." } });
          return;
      }
      if (user.role !== UserRole.SEEKER) {
          alert("Only job seekers can follow companies.");
          return;
      }
      toggleFollowCompany(company.id);
  };

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  };
  const videoId = company.youtubeUrl ? getYoutubeId(company.youtubeUrl) : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO 
        title={`${company.name} - Company Profile`} 
        description={`Learn more about ${company.name} and view their open positions in Afghanistan.`} 
      />

      {/* Banner / Cover Image */}
      <div className="relative w-full h-64 md:h-80 bg-gray-900 overflow-hidden">
          {company.banner ? (
              <img src={company.banner} alt="Cover" className="w-full h-full object-cover opacity-90" />
          ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-900 to-gray-900">
                  <div className="absolute inset-0 bg-pattern opacity-10"></div>
              </div>
          )}
          <div className="absolute top-0 left-0 w-full p-4">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-1 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg transition font-medium text-sm backdrop-blur-sm"
                >
                <ArrowLeft size={16} /> Back
              </button>
          </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        
        {/* Company Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative -mt-16 md:-mt-20 flex-shrink-0">
                <img 
                    src={company.avatar} 
                    alt={company.name} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-white shadow-md bg-white" 
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${company.name}&background=random`
                    }}
                />
                <div className="absolute bottom-2 right-2 bg-green-500 border-2 border-white w-5 h-5 rounded-full" title="Verified Active"></div>
            </div>
            
            <div className="text-center md:text-left flex-1 pb-2">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{company.name}</h1>
                {company.industry && (
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-wide">
                    {company.industry}
                  </span>
                )}
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg border border-yellow-100 text-sm font-bold">
                    <Star size={14} className="fill-current text-yellow-500"/> {avgRating}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
                {company.address && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-gray-400" /> {company.address}
                  </div>
                )}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary-600 transition">
                    <Globe size={16} className="text-gray-400" /> {company.website}
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto">
                  <button 
                    onClick={handleFollow}
                    className={`px-6 py-2.5 rounded-lg font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm ${isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                  >
                      {isFollowing ? <><Check size={16}/> {t('following')}</> : <><Plus size={16}/> {t('follow')}</>}
                  </button>
                  <button onClick={() => {
                      const jobsTab = document.getElementById('jobs-tab');
                      if (jobsTab) jobsTab.scrollIntoView({ behavior: 'smooth' });
                      setActiveTab('jobs');
                  }} className="px-6 py-2.5 rounded-lg font-bold text-sm bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 transition flex items-center justify-center gap-2">
                      <Briefcase size={16}/> View {companyJobs.length} Jobs
                  </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                      <div>
                          <h3 className="font-bold text-gray-900 mb-2">About Us</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{company.bio || "No description available."}</p>
                      </div>
                      
                      {/* Video Section */}
                      {videoId && (
                          <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 bg-black">
                              <div className="aspect-video">
                                  <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={`https://www.youtube.com/embed/${videoId}`} 
                                    title="Company Video" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                  ></iframe>
                              </div>
                              <div className="p-3 bg-gray-50 border-t border-gray-100">
                                  <p className="text-xs font-bold text-gray-700 flex items-center gap-2"><PlayCircle size={14} className="text-red-600"/> Life at {company.name}</p>
                              </div>
                          </div>
                      )}
                  </div>
                  <div className="md:border-l md:pl-8 border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-3 text-gray-600">
                              <Mail size={16} className="text-gray-400"/>
                              <span>{company.email}</span>
                          </div>
                          {company.phone && (
                              <div className="flex items-center gap-3 text-gray-600">
                                  <Phone size={16} className="text-gray-400"/>
                                  <span>{company.phone}</span>
                              </div>
                          )}
                          {company.socialLinks && (
                              <div className="flex gap-3 mt-4">
                                  {company.socialLinks.linkedin && (
                                      <a href={company.socialLinks.linkedin} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Linkedin size={18}/></a>
                                  )}
                                  {company.socialLinks.facebook && (
                                      <a href={company.socialLinks.facebook} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Facebook size={18}/></a>
                                  )}
                                  {company.socialLinks.twitter && (
                                      <a href={company.socialLinks.twitter} target="_blank" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><Twitter size={18}/></a>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div id="jobs-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                
                {/* Tabs Header */}
                <div className="flex border-b border-gray-200 gap-2 md:gap-6 overflow-x-auto no-scrollbar mask-gradient-right">
                    <button 
                        onClick={() => setActiveTab('jobs')}
                        className={`pb-3 px-2 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === 'jobs' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Jobs ({companyJobs.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('articles')}
                        className={`pb-3 px-2 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === 'articles' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Articles ({companyArticles.length})
                    </button>
                    {company.gallery && company.gallery.length > 0 && (
                        <button 
                            onClick={() => setActiveTab('gallery')}
                            className={`pb-3 px-2 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === 'gallery' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            Gallery
                        </button>
                    )}
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-3 px-2 font-bold text-sm transition border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        Reviews ({companyReviews.length})
                    </button>
                </div>

                {/* Jobs Tab */}
                {activeTab === 'jobs' && (
                    <div className="space-y-4">
                        {companyJobs.length > 0 ? companyJobs.map(job => {
                            const isSaved = savedJobIds.includes(job.id);
                            return (
                                <div key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition cursor-pointer group relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition">{job.title}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                                <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded">{job.type}</span>
                                                <span className="font-medium text-gray-900">{job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleSaveJob(job.id); }}
                                            className={`p-2 rounded-full transition ${isSaved ? 'text-primary-600 bg-primary-50' : 'text-gray-300 hover:text-primary-600 hover:bg-gray-50'}`}
                                        >
                                            {isSaved ? <Bookmark size={20} className="fill-current"/> : <Bookmark size={20}/>}
                                        </button>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Posted {job.postedDate}</span>
                                        <span className="text-primary-600 text-sm font-bold group-hover:underline flex items-center gap-1">
                                            View Job <ArrowRight size={14}/>
                                        </span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                                <Briefcase size={32} className="mx-auto text-gray-300 mb-2"/>
                                <p className="text-gray-500">No active job openings at the moment.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Articles Tab (Visible to All) */}
                {activeTab === 'articles' && (
                    <div className="space-y-6">
                        {companyArticles.length > 0 ? companyArticles.map(article => (
                            <div key={article.id} onClick={() => navigate(`/blog/${article.id}`)} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row group h-full">
                                <div className="sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-primary-600 font-bold uppercase mb-2">
                                            <BookOpen size={12}/> {article.category}
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 line-clamp-2">{article.title}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{article.excerpt}</p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
                                        <span>{article.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                                <BookOpen size={32} className="mx-auto text-gray-300 mb-2"/>
                                <p className="text-gray-500">This company hasn't posted any articles yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {company.gallery && company.gallery.length > 0 ? company.gallery.map((img, i) => (
                            <div key={i} className="rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-video group">
                                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                                <ImageIcon size={32} className="mx-auto text-gray-300 mb-2"/>
                                <p className="text-gray-500">No images in gallery.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 text-lg">Employee Reviews</h3>
                            {user && user.role === UserRole.SEEKER && (
                                <button 
                                    onClick={() => setShowReviewModal(true)}
                                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition shadow-md"
                                >
                                    Write a Review
                                </button>
                            )}
                        </div>
                        
                        {companyReviews.length > 0 ? (
                            <div className="space-y-4">
                                {companyReviews.map(review => (
                                    <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-gray-900">{review.userName}</div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={14} 
                                                            className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">{review.date}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                                <MessageSquare size={32} className="mx-auto text-gray-300 mb-2"/>
                                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <AdBanner className="h-64" label="Sponsored" />
                <AdBanner className="h-64" label="Partner" />
            </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
                        <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                    </div>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                        key={star} 
                                        type="button" 
                                        onClick={() => setRating(star)}
                                        className={`transition hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        <Star size={32} className="fill-current"/>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Share your thoughts about working here..."
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition">
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
