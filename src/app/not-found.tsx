import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-4 text-center">
      <p className="text-brand-400 text-sm font-body font-medium tracking-widest uppercase mb-4">
        404
      </p>
      <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
        Page not found
      </h1>
      <p className="text-surface-400 font-body mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl transition-colors font-body"
      >
        Back to Home
      </Link>
    </div>
  );
}
