export default function ProfileLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-8 w-24 bg-white/5 rounded-lg mb-2" />
        <div className="h-4 w-56 bg-white/5 rounded-lg" />
      </div>

      <div className="rounded-xl border border-white/5 bg-[#0F1D32] p-6 max-w-xl">
        <div className="mb-5 pb-5 border-b border-white/5">
          <div className="h-3 w-10 bg-white/5 rounded mb-1.5" />
          <div className="h-4 w-48 bg-white/5 rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-white/5 rounded mb-1.5" />
              <div className="h-10 bg-white/[0.02] border border-white/5 rounded-lg" />
            </div>
          ))}
          <div className="h-10 w-32 bg-white/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
