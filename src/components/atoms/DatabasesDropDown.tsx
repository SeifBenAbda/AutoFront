import { state } from "../../utils/shared_functions"; 
import { forwardRef } from 'react';

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "../../@/components/ui/select";



const DatabasesDropDown = forwardRef<HTMLButtonElement>(
(any, ref) => {
    const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
    const databases = state.databasesAccess;
    const currentDatabase = state.databaseName;
    const handleChange = (selectedValue: string) => {
        state.databaseName = selectedValue;
        window.location.href = '/dashboard';
    };
    
    if (!databases || databases.length === 0) {
        return (
            <div className="flex justify-center items-center h-10">
                <div className="text-lightRed">Aucune base de données disponible</div>
            </div>
        );
    }

    return (
        <Select onValueChange={handleChange} defaultValue={currentDatabase}>
            <SelectTrigger ref={ref} className="w-[240px] border-normalGrey/10  bg-gradient-to-r from-highBlue to-normalBlue font-oswald text-whiteSecond">
                <SelectValue placeholder={currentDatabase} className={hoverItem}/>
            </SelectTrigger>
            <SelectContent className="bg-normalGrey border-normalGrey">
                {databases.map((database, index) => (
                    <SelectItem key={index} value={database} className={hoverItem}>
                        {database}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
);

DatabasesDropDown.displayName = 'DatabasesDropDown';

export default DatabasesDropDown;
