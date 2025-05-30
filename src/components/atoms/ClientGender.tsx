import { forwardRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../@/components/ui/select";

interface ClientGenderProps {
  option1?: string;
  option2?: string;
  defaultValue?: string;
  onChange?: (selected: string) => void;
}

const ClientGender = forwardRef<HTMLButtonElement, ClientGenderProps>(
  ({ option1 = "Monsieur", option2 = "Madame", defaultValue, onChange }, ref) => {
    const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
    
    const handleChange = (value: string) => {
      if (onChange) {
        onChange(value);
      }
    };

    return (
      <Select onValueChange={handleChange} defaultValue={defaultValue || option1}>
        <SelectTrigger ref={ref} className="w-full border border-normalGrey bg-normalGrey font-oswald text-highBlue">
          <SelectValue placeholder={defaultValue || option1} />
        </SelectTrigger>
        <SelectContent className="bg-normalGrey border-normalGrey">
          <SelectItem value={option1} className={hoverItem}>
            {option1}
          </SelectItem>
          <SelectItem value={option2} className={hoverItem}>
            {option2}
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }
);

ClientGender.displayName = 'ClientGender';

export default ClientGender;
