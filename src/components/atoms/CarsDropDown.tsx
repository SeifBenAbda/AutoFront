import { forwardRef } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";
import useCarModels from '../../hooks/useCars';
import Loading from './Loading';

interface CarsDropDownTypes {
    value?: string;
    onChange: (value: string) => void;
    isFiltring: boolean;
}

const CarsDropDown = forwardRef<HTMLButtonElement, CarsDropDownTypes>(
    ({ value, onChange, isFiltring }, ref) => {
        const { data: carModels, isLoading, error } = useCarModels();

        if (isLoading){
            return (
                <div className="flex justify-center items-center h-10">
                    <div className="flex border-2 border-t-highBlue h-4 w-4 border-gray-200 rounded-full animate-spin"></div>
                </div>
            );
        }
        if (error) return <div className='text-lightRed'>Error: {error.message}</div>;


        const optionStyle = "text-highBlue cursor-pointer";
        const selectedOptionStyle = "text-highBlue cursor-pointer font-oswald font-bold";
        return (
            <Select onValueChange={onChange}>
                <SelectTrigger ref={ref} className="w-full border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                    <SelectValue className={selectedOptionStyle} placeholder={value ? value.toString() : "Tous types de voitures"} />
                </SelectTrigger>
                <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">
                    {isFiltring && (
                        <SelectItem className={optionStyle} key="Tous types de voitures" value="Tous types de voitures" >
                            Tous types de voitures
                        </SelectItem>
                    )}
                    {carModels?.map((car) => (
                        <SelectItem className={optionStyle} key={car.carId} value={car.carName}>
                            {car.carName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

CarsDropDown.displayName = 'CarsDropDown'; // Add a displayName for better debugging

export default CarsDropDown;
