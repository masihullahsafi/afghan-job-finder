
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Heart, MessageCircle, Send, User, MoreVertical, Image as ImageIcon, Briefcase, TrendingUp, Search } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { fileToBase64 } from '../services/geminiService';
import { CommunityPost } from '../types';

export const Community: React.FC = () => {
  const { user, t, communityPosts, addCommunityPost, toggleLikePost, addComment, allUsers } = useAppContext();
  const navigate = useNavigate();
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      const post: CommunityPost = {
          _id: Date.now().toString(),
          authorId: user._id,
          authorName: user.name,
          authorAvatar: user.avatar,
          authorRole: user.role,
          content: newPostContent,
          likes: [],
          comments: [],
          timestamp: new Date().toISOString()
      };
      addCommunityPost(post);
      setNewPostContent('');
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-4 pb-20">
      <SEO title="Community" />
      <div className="container mx-auto px-4 max-w-4xl">
          {user && (
              <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-xl mb-6 shadow-sm"><textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} className="w-full border p-2 rounded" placeholder="What's on your mind?" /><button className="bg-primary-600 text-white px-4 py-2 rounded mt-2">Post</button></form>
          )}
          <div className="space-y-4">
              {communityPosts.map(post => (
                  <div key={post._id} className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-4"><img src={post.authorAvatar} className="w-10 h-10 rounded-full" /><div><h4 className="font-bold text-sm">{post.authorName}</h4></div></div>
                      <p className="text-sm text-gray-800">{post.content}</p>
                      <div className="mt-4 flex gap-4"><button onClick={() => toggleLikePost(post._id)} className={`text-sm flex items-center gap-1 ${user && post.likes.includes(user._id) ? 'text-red-500' : 'text-gray-500'}`}><Heart size={16}/> {post.likes.length}</button></div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
