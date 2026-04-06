'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <h2 className="text-lg font-display font-semibold text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-surface-500 font-body mb-6 max-w-sm">
        We ran into an issue loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-medium text-sm rounded-xl transition-all"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}
