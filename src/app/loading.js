// src/app/loading.js

export default function Loading() {
  return (
    <main>
      {/* Hero Skeleton */}
      <header className='h-[70vh] md:h-screen w-full flex items-center sm:justify-between justify-center bg-[linear-gradient(90deg,_rgba(255,49,49,1)_0%,_rgba(255,145,77,1)_100%)] overflow-hidden relative px-[10vw]'>
        {/* Left side - Image skeleton */}
        <div className='relative w-[300px] sm:w-[700px] md:w-[900px] h-[500px] sm:h-[400px] md:h-[1000px] -ml-[15vw] hidden sm:block'>
          <div className='w-full h-full bg-gray-200/30 animate-pulse rounded-lg'></div>
        </div>

        {/* Right side - Text skeleton */}
        <div className='space-y-4'>
          {/* First line */}
          <div className='flex gap-5'>
            <div className='h-[133px] w-[200px] bg-gray-200/30 animate-pulse rounded'></div>
            <div className='h-[133px] w-[200px] bg-gray-200/30 animate-pulse rounded'></div>
          </div>

          {/* Second line */}
          <div className='h-[166px] w-[400px] bg-gray-200/30 animate-pulse rounded'></div>

          {/* Third line */}
          <div className='flex gap-5 -mt-[112px]'>
            <div className='h-[125px] w-[150px] bg-gray-200/30 animate-pulse rounded'></div>
            <div className='h-[125px] w-[150px] bg-gray-200/30 animate-pulse rounded'></div>
          </div>

          {/* Bottom section */}
          <div className='flex justify-between items-center -mt-9'>
            <div className='h-[18px] w-[200px] bg-gray-200/30 animate-pulse rounded'></div>
            <div className='h-[40px] w-[120px] bg-gray-200/30 animate-pulse rounded-3xl'></div>
          </div>
        </div>
      </header>

      {/* NoteCard Grid Skeleton */}
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className='bg-white dark:bg-[#2d303c] rounded-xl shadow-md overflow-hidden'
            >
              <div className='w-full h-[200px] bg-gray-300 animate-pulse' />
              <div className='p-4 space-y-2'>
                <div className='h-4 w-3/4 bg-gray-300 rounded animate-pulse' />
                <div className='h-8 w-1/2 bg-blue-200 rounded-md animate-pulse' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
