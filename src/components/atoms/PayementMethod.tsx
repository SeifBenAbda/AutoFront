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
            <SelectTrigger className="w-full border border-highGrey2 bg-lightWhite text-highGrey2">
                <SelectValue placeholder={value?.toString()} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem key="Leasing" value="Leasing">Leasing</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
                <SelectItem value="Comptant">Comptant</SelectItem>
                <SelectItem value="FCR">FCR</SelectItem>
            </SelectContent>
        </Select>

    );
};

export default PayementMethod;
