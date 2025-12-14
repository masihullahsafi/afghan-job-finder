
import React from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({ 
  isOpen, onClose, title, message, type = 'info', onConfirm, confirmText = 'OK', cancelText = 'Cancel' 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-600" size={32} />;
      case 'error': return <AlertCircle className="text-red-600" size={32} />;
      case 'warning': return <AlertTriangle className="text-yellow-600" size={32} />;
      default: return <Info className="text-blue-600" size={32} />;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-100 text-green-900';
      case 'error': return 'bg-red-50 border-red-100 text-red-900';
      case 'warning': return 'bg-yellow-50 border-yellow-100 text-yellow-900';
      default: return 'bg-blue-50 border-blue-100 text-blue-900';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className={`p-6 text-center ${getColorClass()} border-b`}>
           <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
             {getIcon()}
           </div>
           <h3 className="text-xl font-bold mb-2">{title}</h3>
           <p className="text-sm opacity-90 leading-relaxed">{message}</p>
        </div>
        <div className="p-4 bg-white flex gap-3 justify-center">
           {onConfirm ? (
             <>
               <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition flex-1">
                 {cancelText}
               </button>
               <button onClick={() => { onConfirm(); onClose(); }} className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition flex-1">
                 {confirmText}
               </button>
             </>
           ) : (
             <button onClick={onClose} className="px-8 py-2.5 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition w-full shadow-lg shadow-gray-200">
               {confirmText}
             </button>
           )}
        </div>
      </div>
    </div>
  );
};
