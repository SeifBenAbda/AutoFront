import { forwardRef } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";
import useBanksAndLeasing from '../../hooks/useBanks';


interface BanksLeasingDropDownTypes {
    value?: string;
    onChange: (value: string) => void;
}

const BanksLeasingDropDown = forwardRef<HTMLButtonElement, BanksLeasingDropDownTypes>(
    ({ value, onChange }, ref) => {
        const { data: banksLeasing, isLoading, error } = useBanksAndLeasing();

        if (isLoading){
            return (
                <div className="flex justify-center items-center h-10">
                    <div className="flex border-2 border-t-highGrey2 h-4 w-4 border-gray-200 rounded-full animate-spin"></div>
                </div>
            );
        }
        if (error) return <div className='text-lightRed'>Error: {error.message}</div>;

        return (
            <Select onValueChange={onChange}>
                <SelectTrigger ref={ref} className="w-full border border-highGrey2 bg-lightWhite text-highGrey2">
                    <SelectValue placeholder={value ? value.toString() : banksLeasing![0].name} />
                </SelectTrigger>
                <SelectContent>
                    {banksLeasing?.map((bankLeasing) => (
                        <SelectItem key={bankLeasing.id} value={bankLeasing.name}>
                            {bankLeasing.name}<span className='ml-1 mr-1'>-</span>({bankLeasing.type})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

BanksLeasingDropDown.displayName = 'BanksLeasingDropDown'; // Add a displayName for better debugging

export default BanksLeasingDropDown;
