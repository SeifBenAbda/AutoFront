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
    console.log("fasakh")
    setInputValue(''); // Clear input field
    onSearch(""); // Trigger search with empty query
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center border border-white rounded-md  bg-white">
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Rechercher Client..."
        className="flex-1 border-none  rounded-md outline-none pl-2"
      />
      {inputValue && (
        <Button
        onClick={handleClearClick}
        className="border-none bg-transparent hover:bg-transparent"
      >
        <CloseIcon className="text-bluePrimary" />
      </Button>
        
      )}
      </div>
      <Button
        onClick={handleSearchClick}
        className="ml-2 px-4 py-2 bg-bluePrimary text-white rounded"
      >
        Rechercher
      </Button>
    </div>
  );
};

export default SearchBar;
