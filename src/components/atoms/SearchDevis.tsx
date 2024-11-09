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
    <div className="flex items-center w-full"> {/* Added pr-4 to add padding-right */}
      <div className="flex items-center flex-1 border border-highGrey2 rounded-md bg-white ml-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Rechercher Client..."
          className="flex-1 border-none rounded-l-md outline-none px-2 py-1"
        />
        {inputValue && (
          <Button
            onClick={handleClearClick}
            className="border-none bg-transparent hover:bg-transparent p-2"
          >
            <CloseIcon className="text-highGrey2" />
          </Button>
        )}
      </div>
      <Button
        onClick={handleSearchClick}
        className="bg-highGrey2 hover:bg-highGrey2 text-white rounded-md  ml-2" // Added ml-2 to add left margin
      >
        Rechercher
      </Button>
    </div>
  );
};

export default SearchBar;
