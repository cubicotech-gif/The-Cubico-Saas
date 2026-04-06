export default function OrdersLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-36 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-white/5 rounded-lg" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 h-10 bg-[#0F1D32] border border-white/5 rounded-lg" />
        <div className="h-10 w-72 bg-[#0F1D32] border border-white/5 rounded-lg" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-[#0F1D32]"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-44 bg-white/5 rounded mb-1.5" />
              <div className="h-3 w-60 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
