import React from 'react';

const SearchBar = ({ 
  searchQuery, 
  setSearchQuery
}: { 
  searchQuery: string, 
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}) => {
  return (
    <div className="">
      <input
        type="text"
        placeholder="Search Contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full border-2 shadow-lg rounded-lg px-2 py-1 text-lg focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-neutral-500"
      />
    </div>
  );
};

export default SearchBar;