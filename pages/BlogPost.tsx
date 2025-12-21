
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { SEO } from '../components/SEO';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { UserRole } from '../types';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, allUsers } = useAppContext();
  const post = posts.find(p => p._id === id);

  if (!post) return <div className="p-20 text-center">Article not found</div>;
  const authorProfile = allUsers.find(u => u._id === post.authorId);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <SEO title={post.title} />
      <div className="h-96 w-full relative"><img src={post.image} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 p-12 flex flex-col justify-end"><h1 className="text-4xl font-bold text-white max-w-4xl">{post.title}</h1></div></div>
      <div className="container mx-auto p-12 bg-white rounded-xl shadow-sm max-w-4xl -mt-12 relative z-10"><div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div></div>
    </div>
  );
};
