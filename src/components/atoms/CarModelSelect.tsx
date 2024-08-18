import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";


interface CarModelSelectTypes {
    value?: string; // Updated to match the value type used in ClientTypeSelect
    onChange: (value: string) => void; // Callback now expects a string
}

const CarModelSelect = ({ value, onChange }:CarModelSelectTypes) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full border border-bluePrimary">
                <SelectValue placeholder="Modèle préféré" defaultValue={value} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="v1">Car 1</SelectItem>
                <SelectItem value="v2">Car 2</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default CarModelSelect;
