import { Input } from '../../@/components/ui/input';
import React, { useState } from 'react';
import { Button } from '../../@/components/ui/button';
import CloseIcon from '@mui/icons-material/Close';

interface SearchBarProps {
  onSearch: (searchValue: string) => void;
  searchValue: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchValue }) => {
  const [inputValue, setInputValue] = useState(searchValue);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(inputValue);
  };

  const handleClearClick = () => {
    setInputValue(''); // Clear input field
    onSearch(""); // Trigger search with empty query
  };

  return (
    <div className="flex space-x-2 items-center w-full">
      <div className="relative flex-grow">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Rechercher Devis.."
          className="border-normalGrey rounded-md bg-normalGrey w-full pr-10 text-base"
        />
        {inputValue && (
          <button
            onClick={handleClearClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-highBlue"
          >
            <CloseIcon fontSize="small" />
          </button>
        )}
      </div>
      <Button
        onClick={handleSearchClick}
        className="bg-highBlue hover:bg-highBlue text-white rounded-md ml-2"
      >
        Rechercher
      </Button>
    </div>
  );
};

export default SearchBar;
