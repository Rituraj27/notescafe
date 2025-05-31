'use client'; // since we'll use hooks

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import debounce from 'lodash.debounce'; // we'll use lodash debounce (very clean!)

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  // Debounced fetch suggestions
  const fetchSuggestions = debounce(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const { data } = await axios.get(
        `/api/search-suggestions?q=${searchTerm}`
      );
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error(error);
    }
  }, 300); // 300ms debounce

  useEffect(() => {
    fetchSuggestions(query);
    // Clean up debounce on unmount
    return () => fetchSuggestions.cancel();
  }, [query]);

  const handleSelect = (text) => {
    router.push(`/search?q=${text}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSelect(query);
  };

  return (
    <div className='relative w-full max-w-xl mx-auto'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          className=' p-2 rounded-l-3xl md:w-[350px] sm:w-[150px] w-[90px] h-[34px] relative z-10 focus:outline-none focus:border-sky-600 pl-4 text-xs placeholder:text-[8px] sm:placeholder:text-[15px] border '
          placeholder='Search notes...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className='absolute bg-white border w-full mt-2 rounded-md shadow-lg z-50'>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion._id}
              onClick={() => handleSelect(suggestion.title)}
              className='p-3 text-black hover:bg-gray-100 cursor-pointer'
            >
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
