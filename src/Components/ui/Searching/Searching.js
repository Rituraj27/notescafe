import { Search } from 'lucide-react';

export default function Searching() {
  return (
    <div className='flex items-center'>
      <input
        type='text'
        placeholder='Search your notes...'
        className='border-white text-white border-1 p-2 rounded-l-3xl md:w-[400px] sm:w-[150px] w-[90px] h-[34px] relative z-10 focus:outline-none  focus:border-sky-600 pl-4 text-xs placeholder:text-[8px] sm:placeholder:text-[10px] '
      />
      <div className='bg-gray-700 py-[5px] px-[10px] rounded-r-3xl cursor-pointer'>
        <Search className=' text-white pr-[5px]' />
      </div>
    </div>
  );
}
