
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole, CommunityPost } from '../types';
import { Heart, MessageCircle, Send, User, MoreVertical, Image as ImageIcon, Briefcase, TrendingUp, Search } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { fileToBase64 } from '../services/geminiService';

export const Community: React.FC = () => {
  const { user, t, communityPosts, addCommunityPost, toggleLikePost, addComment, allUsers } = useAppContext();
  const navigate = useNavigate();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
              const file = e.target.files[0];
              const base64 = await fileToBase64(file);
              setNewPostImage(`data:${file.type};base64,${base64}`);
          } catch (err) {
              console.error(err);
          }
      }
  };

  const handleCreatePost = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
          navigate('/auth', { state: { message: "Please login to post." } });
          return;
      }
      if (!newPostContent.trim() && !newPostImage) return;

      const post: CommunityPost = {
          id: Date.now().toString(),
          authorId: user.id,
          authorName: user.name,
          authorAvatar: user.avatar,
          authorRole: user.role,
          content: newPostContent,
          image: newPostImage || undefined,
          likes: [],
          comments: [],
          timestamp: new Date().toISOString()
      };

      addCommunityPost(post);
      setNewPostContent('');
      setNewPostImage(null);
  };

  const handleSubmitComment = (postId: string) => {
      if (!user) {
          navigate('/auth');
          return;
      }
      if (!commentInput.trim()) return;
      addComment(postId, commentInput);
      setCommentInput('');
  };

  // Filter posts
  const filteredPosts = communityPosts.filter(p => p.content.toLowerCase().includes(searchTerm.toLowerCase()));

  // Suggested Connections (simple random sample)
  const suggestions = allUsers.filter(u => u.id !== user?.id && u.role !== 'ADMIN').slice(0, 3);

  return (
    <div className="bg-gray-100 min-h-screen pt-4 pb-20">
      <SEO title="Community" description="Professional Network for Afghan Job Seekers and Employers." />
      
      <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Sidebar (Profile) */}
              <div className="hidden lg:block lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                      {user ? (
                          <>
                            <div className="h-20 bg-gray-700"></div>
                            <div className="px-6 pb-6 relative">
                                <div className="absolute -top-10 left-6 border-4 border-white rounded-full overflow-hidden w-20 h-20 bg-gray-200">
                                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-full h-full object-cover" />
                                </div>
                                <div className="mt-12">
                                    <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                                    <p className="text-gray-500 text-sm">{user.jobTitle || (user.role === 'EMPLOYER' ? 'Company' : 'Job Seeker')}</p>
                                    
                                    <div className="mt-6 pt-4 border-t border-gray-100 space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Profile Views</span>
                                            <span className="font-bold text-primary-600">124</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Connections</span>
                                            <span className="font-bold text-primary-600">45</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                          </>
                      ) : (
                          <div className="p-6 text-center">
                              <User size={48} className="mx-auto text-gray-300 mb-4"/>
                              <h3 className="font-bold text-gray-900 mb-2">Join the Community</h3>
                              <p className="text-sm text-gray-500 mb-4">Connect with professionals and find opportunities.</p>
                              <button onClick={() => navigate('/auth')} className="bg-primary-600 text-white w-full py-2 rounded-lg font-bold hover:bg-primary-700 transition">Login / Register</button>
                          </div>
                      )}
                  </div>
              </div>

              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                  {/* Create Post */}
                  {user && (
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                          <div className="flex gap-4">
                              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                              <form onSubmit={handleCreatePost} className="flex-1">
                                  <textarea 
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Start a post..." 
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                    rows={2}
                                  ></textarea>
                                  {newPostImage && (
                                      <div className="mt-2 relative w-fit">
                                          <img src={newPostImage} alt="Preview" className="h-32 rounded-lg object-cover" />
                                          <button type="button" onClick={() => setNewPostImage(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><User size={12}/></button>
                                      </div>
                                  )}
                                  <div className="flex justify-between items-center mt-3">
                                      <label className="cursor-pointer text-gray-500 hover:text-primary-600 transition flex items-center gap-2 text-sm font-medium p-2 hover:bg-gray-50 rounded-lg">
                                          <ImageIcon size={18} /> Media
                                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                      </label>
                                      <button 
                                        type="submit" 
                                        disabled={!newPostContent.trim() && !newPostImage}
                                        className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition disabled:opacity-50"
                                      >
                                          Post
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  )}

                  {/* Feed */}
                  <div className="space-y-4">
                      {filteredPosts.map(post => {
                          const isLiked = user ? post.likes.includes(user.id) : false;
                          const showComments = activeCommentPostId === post.id;

                          return (
                              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                  {/* Post Header */}
                                  <div className="p-4 flex items-center gap-3">
                                      <img src={post.authorAvatar || `https://ui-avatars.com/api/?name=${post.authorName}`} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                                      <div className="flex-1">
                                          <h4 className="font-bold text-gray-900 text-sm">{post.authorName}</h4>
                                          <p className="text-xs text-gray-500 flex items-center gap-1">
                                              {post.authorRole === 'EMPLOYER' && <Briefcase size={10} className="text-gray-400"/>}
                                              {post.authorRole === 'EMPLOYER' ? 'Company' : 'Job Seeker'} • {new Date(post.timestamp).toLocaleDateString()}
                                          </p>
                                      </div>
                                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={20}/></button>
                                  </div>

                                  {/* Post Content */}
                                  <div className="px-4 pb-2 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                      {post.content}
                                  </div>
                                  {post.image && (
                                      <div className="mt-2 w-full">
                                          <img src={post.image} alt="Post" className="w-full object-cover max-h-96" />
                                      </div>
                                  )}

                                  {/* Stats */}
                                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between text-xs text-gray-500">
                                      <span>{post.likes.length} Likes</span>
                                      <span>{post.comments.length} Comments</span>
                                  </div>

                                  {/* Actions */}
                                  <div className="px-2 py-1 flex justify-between">
                                      <button 
                                        onClick={() => user ? toggleLikePost(post.id) : navigate('/auth')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-gray-50 transition text-sm font-medium ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
                                      >
                                          <Heart size={18} className={isLiked ? "fill-current" : ""}/> Like
                                      </button>
                                      <button 
                                        onClick={() => setActiveCommentPostId(showComments ? null : post.id)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-600"
                                      >
                                          <MessageCircle size={18}/> Comment
                                      </button>
                                      <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-600">
                                          <Send size={18}/> Share
                                      </button>
                                  </div>

                                  {/* Comments Section */}
                                  {showComments && (
                                      <div className="bg-gray-50 p-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                                          {post.comments.map(comment => (
                                              <div key={comment.id} className="flex gap-3 mb-4">
                                                  <img src={comment.authorAvatar || `https://ui-avatars.com/api/?name=${comment.authorName}`} className="w-8 h-8 rounded-full bg-gray-200" />
                                                  <div className="bg-white p-3 rounded-xl rounded-tl-none border border-gray-200 shadow-sm flex-1">
                                                      <h5 className="font-bold text-xs text-gray-900 mb-1">{comment.authorName}</h5>
                                                      <p className="text-sm text-gray-700">{comment.content}</p>
                                                  </div>
                                              </div>
                                          ))}
                                          
                                          {user && (
                                              <div className="flex gap-2 mt-4">
                                                  <img src={user.avatar} className="w-8 h-8 rounded-full bg-gray-200" />
                                                  <div className="flex-1 relative">
                                                      <input 
                                                        type="text" 
                                                        value={commentInput}
                                                        onChange={(e) => setCommentInput(e.target.value)}
                                                        placeholder="Add a comment..."
                                                        className="w-full border border-gray-300 rounded-full pl-4 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                                                      />
                                                      <button 
                                                        onClick={() => handleSubmitComment(post.id)}
                                                        disabled={!commentInput.trim()}
                                                        className="absolute right-1 top-1 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50"
                                                      >
                                                          <Send size={14}/>
                                                      </button>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* Right Sidebar */}
              <div className="hidden lg:block lg:col-span-1 space-y-6">
                  {/* Search */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                      <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                          <input 
                            type="text" 
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                      </div>
                  </div>

                  {/* Trending */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp size={18}/> Trending Topics</h3>
                      <div className="space-y-3">
                          {['#RemoteWork', '#CareerTips', '#TechJobs', '#Kabul', '#InterviewPrep'].map(tag => (
                              <div key={tag} className="text-sm font-medium text-gray-600 hover:text-primary-600 cursor-pointer block">
                                  {tag}
                                  <span className="text-xs text-gray-400 block font-normal">2.4k posts</span>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Suggestions */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                      <h3 className="font-bold text-gray-900 mb-4">People you may know</h3>
                      <div className="space-y-4">
                          {suggestions.map(u => (
                              <div key={u.id} className="flex items-center gap-3">
                                  <img src={u.avatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover"/>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-sm text-gray-900 truncate">{u.name}</h4>
                                      <p className="text-xs text-gray-500 truncate">{u.role === 'EMPLOYER' ? 'Company' : u.jobTitle}</p>
                                  </div>
                                  <button onClick={() => navigate(u.role === 'EMPLOYER' ? `/companies/${u.id}` : `/profile/${u.id}`)} className="text-primary-600 p-1.5 hover:bg-primary-50 rounded-lg">
                                      <User size={18}/>
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
