import { forwardRef } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";
import useRegions from '../../hooks/useRegion';
import Loading from './Loading';

interface RegionsDropDownTypes {
    value?: string;
    onChange: (value: string) => void;
    isFiltring: boolean;
}

const RegionDropDown = forwardRef<HTMLButtonElement, RegionsDropDownTypes>(
    ({ value, onChange, isFiltring }, ref) => {
        const { data: regions, isLoading, error } = useRegions();

        if (isLoading) return <div className='pl-1 text-white'>Loading</div>;
        if (error) return <div className='text-lightRed'>Error: {error.message}</div>;

        return (
            <Select onValueChange={onChange}>
                <SelectTrigger ref={ref} className="w-full border border-darkGrey bg-lightWhite text-darkGrey">
                    <SelectValue placeholder={value ? value.toString() : "Toutes les régions"} />
                </SelectTrigger>
                <SelectContent>
                    {isFiltring && (
                        <SelectItem key="Toutes les régions" value="Toutes les régions">
                            Toutes les régions
                        </SelectItem>
                    )}
                    {regions?.map((region) => (
                        <SelectItem key={region.RegionID} value={region.RegionName}>
                            {region.RegionName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

RegionDropDown.displayName = 'RegionDropDown'; // Add a displayName for better debugging

export default RegionDropDown;
