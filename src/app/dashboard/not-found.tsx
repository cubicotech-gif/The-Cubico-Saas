import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-full bg-surface-800 border border-white/10 flex items-center justify-center mb-4">
        <FileQuestion size={24} className="text-surface-400" />
      </div>
      <h2 className="text-lg font-display font-semibold text-white mb-2">
        Page not found
      </h2>
      <p className="text-sm text-surface-500 font-body mb-6 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B4A] hover:bg-[#ff7f61] text-white font-body font-medium text-sm rounded-xl transition-all"
      >
        <ArrowLeft size={14} />
        Back to Dashboard
      </Link>
    </div>
  );
}
