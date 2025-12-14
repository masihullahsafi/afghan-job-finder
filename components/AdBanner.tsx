import React from 'react';

export const AdBanner: React.FC<{ className?: string, label?: string }> = ({ className, label = "Advertisement" }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center p-6 text-gray-400 overflow-hidden relative group shadow-sm ${className}`}>
      <span className="absolute top-2 right-2 text-[10px] uppercase tracking-wider font-semibold text-gray-300 border border-gray-100 px-1 rounded bg-gray-50">
        {label}
      </span>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Ad Space</p>
        <p className="text-xs text-gray-400">Google AdSense / Banner</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full" />
    </div>
  );
};