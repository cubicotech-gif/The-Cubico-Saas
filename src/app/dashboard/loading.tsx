export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-white/5 rounded-lg" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/5 bg-[#0F1D32]"
          >
            <div className="w-4 h-4 bg-white/5 rounded mb-2" />
            <div className="h-7 w-10 bg-white/5 rounded mb-1" />
            <div className="h-3 w-16 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* List skeleton */}
      <div className="h-5 w-32 bg-white/5 rounded mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-[#0F1D32]"
          >
            <div className="w-9 h-9 rounded-lg bg-white/5 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-40 bg-white/5 rounded mb-1.5" />
              <div className="h-3 w-56 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
