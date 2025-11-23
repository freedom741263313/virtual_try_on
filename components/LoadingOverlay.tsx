import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message = "Weaving new threads..." }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl transition-all duration-300">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-white font-medium tracking-wide animate-pulse">{message}</p>
    </div>
  );
};