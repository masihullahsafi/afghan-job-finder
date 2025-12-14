import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-primary-600">
      <Loader2 size={48} className="animate-spin mb-4" />
      <p className="text-gray-500 font-medium">Loading...</p>
    </div>
  );
};