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
    const optionStyle = "text-highBlue cursor-pointer";
    const selectedOptionStyle = "text-highBlue cursor-pointer font-oswald font-bold";
    return (
       
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                <SelectValue className={selectedOptionStyle} placeholder={value ? value.toString() : "Comptant"} />
            </SelectTrigger>
            <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">
                <SelectItem className={optionStyle} key="Leasing" value="Leasing">Leasing</SelectItem>
                <SelectItem className={optionStyle} value="Banque">Banque</SelectItem>
                <SelectItem  className={optionStyle}value="Comptant">Comptant</SelectItem>
                <SelectItem  className={optionStyle} value="FCR">FCR</SelectItem>
            </SelectContent>
        </Select>

    );
};

export default PayementMethod;
