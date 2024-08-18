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

const PayementMethod = ({ value, onChange }:CarModelSelectTypes) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full border border-bluePrimary">
                <SelectValue placeholder="Modèle préféré" defaultValue={value} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="leasing">Leasing</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="comptant">Comptant</SelectItem>
                <SelectItem value="fcr">FCR</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default PayementMethod;
