import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";

interface NumberCarsDropDownProps {
    value?: string;
    onChange: (value: string) => void;
    isFiltring?: boolean;
}

const NumberCarsDropDown = ({ value, onChange, isFiltring = false }: NumberCarsDropDownProps) => {
    const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
    
    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-normalGrey bg-normalGrey font-oswald text-highBlue">
                <SelectValue placeholder={value ? value.toString() : "Nombre de voitures"} className={hoverItem} />
            </SelectTrigger>
            <SelectContent className="bg-normalGrey border-normalGrey">
                {isFiltring && (
                    <SelectItem key="Tous" value="Tous" className={hoverItem}>
                        Tous les nombres
                    </SelectItem>
                )}
                {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={String(i + 1)} value={String(i + 1)} className={hoverItem}>
                        {i + 1}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default NumberCarsDropDown;
