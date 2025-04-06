import { Search } from 'lucide-react';

export default function Searching() {
  return (
    <div className='flex items-center'>
      <input
        type='text'
        placeholder='Search your notes...'
        className='border-white text-white border-2 p-2 rounded-l-3xl xl:w-[380px] md:max-w-[320px] sm:max-w-[150px] max-w-[80px] h-[40px] relative z-10 focus:outline-none  focus:border-sky-600 pl-4 text-xs placeholder:text-[8px] sm:placeholder:text-[10px] '
      />
      <div className='bg-gray-400 py-[10px] px-[10px] rounded-r-3xl cursor-pointer'>
        <Search className='h-5 text-white' />
      </div>
    </div>
  );
}
