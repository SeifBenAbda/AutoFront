import React, { useEffect, useState } from 'react';
import { Toggle } from "../../@/components/ui/toggle";

interface ClientGenderProps {
  option1: string;
  option2: string;
  defaultValue: string;
  onChange?: (selected: string) => void;
}

const ClientGender: React.FC<ClientGenderProps> = ({ option1, option2, onChange ,defaultValue}) => {
  const [selected, setSelected] = useState<string>(option1);


  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue === "Madame" ? option2 : option1);
    }
  }, [defaultValue, option1, option2,selected]);

  const handleToggle = () => {
    const newSelected = selected === option1 ? option2 : option1;
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <Toggle
      aria-label="Toggle gender"
      data-state={selected === "Entreprise" ? "on" : "off"}  // Dynamically set data-state
      onClick={handleToggle}
      className={`relative w-full font-oswald bg-whiteSecond text-highGrey hover:bg-whiteSecond hover:text-highGrey border 
      data-[state=on]:border-lightRed data-[state=on]:bg-lightRed data-[state=on]:text-whiteSecond  
      ${selected === "Madame" ? "border-lightRed bg-lightRed text-whiteSecond" : "border-whiteSecond bg-whiteSecond text-highGrey"}`}
    >
      {selected}
    </Toggle>
  );
};

export default ClientGender;


