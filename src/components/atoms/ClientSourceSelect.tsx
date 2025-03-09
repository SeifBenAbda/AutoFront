import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";


interface ClientSourceSelectTypes {
    value?: string; // Updated to match the value type used in ClientTypeSelect
    onChange: (value: string) => void; // Callback now expects a string
}

const ClientSourceSelect = ({ value, onChange }:ClientSourceSelectTypes) => {
    const optionStyle = "text-highBlue cursor-pointer";
    const selectedOptionStyle = "text-highBlue cursor-pointer font-oswald font-bold";
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                <SelectValue className={selectedOptionStyle} placeholder="Source" defaultValue={value} />
            </SelectTrigger>
            <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">
                <SelectItem className={optionStyle} value="Web">Web</SelectItem>
                <SelectItem className={optionStyle} value="Téléphone">Téléphone</SelectItem>
                <SelectItem className={optionStyle} value="ShowRoom">ShowRoom</SelectItem>
                <SelectItem className={optionStyle} value="Prospection">Prospection</SelectItem>
                <SelectItem className={optionStyle} value="Email">Email</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default ClientSourceSelect;
