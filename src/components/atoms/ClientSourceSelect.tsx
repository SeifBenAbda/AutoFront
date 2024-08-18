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
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full border border-bluePrimary">
                <SelectValue placeholder="Source" defaultValue={value} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="phone">Téléphone</SelectItem>
                <SelectItem value="ShowRoom">ShowRoom</SelectItem>
                <SelectItem value="prospection">Prospection</SelectItem>
                <SelectItem value="email">Email</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default ClientSourceSelect;
