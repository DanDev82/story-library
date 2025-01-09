import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="mt-6">
      <label htmlFor="search" className="block text-lg font-medium mb-2">Search Stories</label>
      <input
        id="search"
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by title"
        className="w-full p-2 border rounded-lg"
      />
    </div>
  );
};

export default SearchBar;
