import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-9xl font-bold text-primary-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="mt-8 bg-primary-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-primary-700 transition"
      >
        <Home size={20} /> Go Home
      </button>
    </div>
  );
};