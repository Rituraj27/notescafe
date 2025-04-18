// src/app/loading.js

export default function Loading() {
  return (
    <main>
      {/* Hero Skeleton */}
      <header className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-400 px-[10vw] animate-pulse">
        <div className="space-y-4">
          <div className="h-12 w-[300px] bg-gray-300 rounded" />
          <div className="h-16 w-[400px] bg-gray-300 rounded" />
          <div className="h-12 w-[300px] bg-gray-300 rounded" />
          <div className="flex justify-between items-center mt-4">
            <div className="h-5 w-[180px] bg-gray-300 rounded" />
            <div className="h-8 w-[120px] bg-gray-400 rounded-full" />
          </div>
        </div>
      </header>

      {/* NoteCard Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#2d303c] rounded-xl shadow-md overflow-hidden"
            >
              <div className="w-full h-[200px] bg-gray-300 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
                <div className="h-8 w-1/2 bg-blue-200 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
