import React from 'react';
import { useAppContext } from '../AppContext';

const SearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
  } = useAppContext();
  
  return (
    <div className="">
      <input
        type="text"
        placeholder="Search Contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border-2 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-800 placeholder:text-neutral-500"
      />
    </div>
  );
};

export default SearchBar;