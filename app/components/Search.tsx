import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';

const SearchBar = () => {
  const [showInput, setShowInput] = useState(false);

  return (
    <>
      {!showInput && (
        <button
          className="rounded-full py-2 transition"
          onClick={() => setShowInput(true)}
        >
          {/* Inline hourglass SVG icon */}
          <BsSearch className='inline mx-2 text-xl font-bold text-gray-700 cursor-pointer'/>
        </button>
      )}
      {showInput && (
        <input
          type="text"
          placeholder="Search..."
          className="transition-all w-fit duration-900 px-4 py-2 border border-gray-200 rounded-full shadow focus:outline-none"
          autoFocus
          onBlur={() => setShowInput(false)}
        />
      )}
    </>
  );
};

export default SearchBar;
