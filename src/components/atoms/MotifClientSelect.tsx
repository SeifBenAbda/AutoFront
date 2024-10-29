//This Component is Responsable to Select Why the Client is Actaully here 


import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";


interface MotifSelectTypes {
    value?: string; // Updated to match the value type used in ClientTypeSelect
    onChange: (value: string) => void; // Callback now expects a string
}

const MotifClientSelect = ({ value, onChange }:MotifSelectTypes) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full border border-highGrey2 bg-lightWhite text-highGrey2">
                <SelectValue placeholder="Motif" defaultValue={value} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Volonté d'acquisition">Volonté d'acquisition</SelectItem>
                <SelectItem value="Visite / Curiosité">Visite / Curiosité</SelectItem>
                <SelectItem value="Comparaison de Modèles">Comparaison de Modèles</SelectItem>
                <SelectItem value="Comparaison des Prix">Comparaison des Prix</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default MotifClientSelect;
