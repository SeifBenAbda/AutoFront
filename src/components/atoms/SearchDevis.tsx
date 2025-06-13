import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchValue: string) => void;
  searchValue?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  searchValue: externalSearchValue, 
  placeholder = "Rechercher un devis..." 
}) => {
  const [internalSearchValue, setInternalSearchValue] = useState(externalSearchValue || '');

  // Keep internal state in sync with external props
  useEffect(() => {
    if (externalSearchValue !== undefined) {
      setInternalSearchValue(externalSearchValue);
    }
  }, [externalSearchValue]);

  const handleSearch = () => {
    onSearch(internalSearchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      
      <input
        type="text"
        value={internalSearchValue}
        onChange={(e) => setInternalSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="pl-4 pr-4 py-2 w-full md:w-64 bg-normalGrey text-highBlue 
        placeholder-gray-400 rounded-md focus:outline-none focus:ring-0 focus:ring-offset-0 
        focus:border-transparent focus:shadow-none"
        style={{ outline: 'none' }}
      />
      <button 
        onClick={handleSearch}
        className="absolute inset-y-0 right-0 px-3 flex items-center text-highBlue hover:text-blue-700"
        aria-label="Search"
      >
        <SearchIcon size={18} />
      </button>
    </div>
  );
};

export default SearchBar;
