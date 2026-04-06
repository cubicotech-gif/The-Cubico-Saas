export default function OrderDetailLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-28 bg-white/5 rounded mb-4" />
      <div className="mb-6">
        <div className="h-8 w-56 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-white/5 rounded-lg" />
      </div>

      {/* Status timeline skeleton */}
      <div className="rounded-xl border border-white/5 bg-[#0F1D32] p-6 mb-6">
        <div className="h-4 w-28 bg-white/5 rounded mb-5" />
        <div className="hidden sm:flex items-center justify-between">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="w-8 h-8 rounded-full bg-white/5" />
              <div className="h-3 w-14 bg-white/5 rounded mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Details grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-white/5 bg-[#0F1D32] p-5">
            <div className="h-4 w-32 bg-white/5 rounded mb-4" />
            <div className="space-y-3">
              <div><div className="h-3 w-16 bg-white/5 rounded mb-1" /><div className="h-4 w-40 bg-white/5 rounded" /></div>
              <div><div className="h-3 w-16 bg-white/5 rounded mb-1" /><div className="h-4 w-36 bg-white/5 rounded" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat skeleton */}
      <div className="rounded-xl border border-white/5 bg-[#0F1D32] p-5">
        <div className="h-4 w-24 bg-white/5 rounded mb-4" />
        <div className="h-48 bg-white/[0.02] rounded-lg" />
      </div>
    </div>
  );
}
