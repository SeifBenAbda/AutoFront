import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";


interface ClientTypeProps {
    value?: string; // Updated to match the value type used in ClientTypeSelect
    onChange: (value: string) => void; // Callback now expects a string
}

const ClientTypeSelect = ({ value, onChange }:ClientTypeProps) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Type de Client" defaultValue={value} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="pp">Persone Physique</SelectItem>
                <SelectItem value="pm">Persone Morale</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default ClientTypeSelect;
