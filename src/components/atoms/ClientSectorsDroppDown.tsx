import { forwardRef } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";
import useClientSectors from '../../hooks/useClientSectors';


interface ClientSectorsDropDownTypes {
    value?: string;
    onChange: (value: string) => void;
}

const ClientSectorsDropDown = forwardRef<HTMLButtonElement, ClientSectorsDropDownTypes>(
    ({ value, onChange }, ref) => {
        const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
        const { data: clientSectors, isLoading, error } = useClientSectors();

        if (isLoading){
            return (
                <div className="flex justify-center items-center h-10">
                    <div className="flex border-2 border-t-highBlue h-4 w-4 border-gray-200 rounded-full animate-spin"></div>
                </div>
            );
        }
        if (error) return <div className='text-lightRed'>Error: {error.message}</div>;

        return (
            <Select onValueChange={onChange}>
                <SelectTrigger ref={ref} className="w-full border border-normalGrey bg-normalGrey font-oswald text-highBlue">
                    <SelectValue placeholder={value ? value.toString() : "Non déterminé"} className={hoverItem}/>
                </SelectTrigger>
                <SelectContent className="bg-normalGrey border-normalGrey">
                    {clientSectors?.map((clientSector) => (
                        <SelectItem key={clientSector.SectorID} value={clientSector.SectorName} className={hoverItem}>
                            {clientSector.SectorName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

ClientSectorsDropDown.displayName = 'ClientSectorsDropDown'; // Add a displayName for better debugging

export default ClientSectorsDropDown;
