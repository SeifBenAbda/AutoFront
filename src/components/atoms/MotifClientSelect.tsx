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
    const optionStyle = "text-highBlue cursor-pointer";
    const selectedOptionStyle = "text-highBlue cursor-pointer font-oswald font-bold";
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                <SelectValue className={selectedOptionStyle} placeholder="Motif" defaultValue={value} />
            </SelectTrigger>
            <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">
                <SelectItem className={optionStyle} value="Volonté d'acquisition">Volonté d'acquisition</SelectItem>
                <SelectItem className={optionStyle} value="Visite / Curiosité">Visite / Curiosité</SelectItem>
                <SelectItem className={optionStyle} value="Comparaison de Modèles">Comparaison de Modèles</SelectItem>
                <SelectItem className={optionStyle} value="Comparaison des Prix">Comparaison des Prix</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default MotifClientSelect;
