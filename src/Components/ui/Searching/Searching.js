// "use client";
import { Search } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Searching() {
  const { theme } = useTheme();
  return (
    <div className='flex items-center pl-[10px]'>
      <input
        style={{
          borderColor: theme === 'dark' ? '#fff' : '#000',
          color: theme === 'dark' ? '#fff' : '#000',
        }}
        type='text'
        placeholder='Search your notes...'
        className=' border-1 p-2 rounded-l-3xl md:w-[350px] sm:w-[150px] w-[90px] h-[34px] relative z-10 focus:outline-none  focus:border-sky-600 pl-4 text-xs placeholder:text-[8px] sm:placeholder:text-[15px] '
      />
      <div className='bg-[#020202] border-black border-1 py-[4px] px-[8px] rounded-r-3xl cursor-pointer'>
        <Search className=' text-white pr-[5px]' />
      </div>
    </div>
  );
}
