import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";


interface PayementMethodTypes {
    value?: string; // Updated to match the value type used in ClientTypeSelect
    onChange: (value: string) => void; // Callback now expects a string
}

const PayementMethod = ({ value, onChange }: PayementMethodTypes) => {
    return (
       
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-highBlue bg-lightWhite text-highBlue">
                <SelectValue placeholder={value ? value.toString() : "Comptant"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem key="Leasing" value="Leasing">Leasing</SelectItem>
                <SelectItem value="Banque">Banque</SelectItem>
                <SelectItem value="Comptant">Comptant</SelectItem>
                <SelectItem value="FCR">FCR</SelectItem>
            </SelectContent>
        </Select>

    );
};

export default PayementMethod;
