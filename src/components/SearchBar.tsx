import React from 'react';

const SearchBar = ({ query, setQuery }: { query: string, setQuery: React.Dispatch<React.SetStateAction<string>> }) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-semibold py-2">
        Search Contact
      </h2>
      <input
        type="text"
        placeholder="Search Contacts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-2 shadow-lg rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
};

export default SearchBar;