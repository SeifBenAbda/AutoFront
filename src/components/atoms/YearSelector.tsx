import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";

interface YearSelectorProps {
    value: number;
    onValueChange: (year: number) => void;
    startYear?: number;
    endYear?: number;
    placeholder?: string;
    className?: string;
    showAllOption?: boolean;
    allOptionLabel?: string;
}

function YearSelector({
    value,
    onValueChange,
    startYear,
    endYear,
    placeholder = "Année",
    className = "w-32",
    showAllOption = true,
    allOptionLabel = "Toutes les années"
}: YearSelectorProps) {
    const currentYear = new Date().getFullYear();
    const defaultStartYear = startYear || currentYear;
    const defaultEndYear = endYear || currentYear + 1;
    
    // Generate array of years from startYear to endYear
    const years = [];
    for (let year = defaultStartYear; year <= defaultEndYear; year++) {
        years.push(year);
    }
    
    return (
        <Select 
            value={value > 0 ? value.toString() : "all"} 
            onValueChange={(selectedValue) => 
                onValueChange(selectedValue === "all" ? 0 : parseInt(selectedValue))
            }
        >
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {showAllOption && (
                    <SelectItem value="all">{allOptionLabel}</SelectItem>
                )}
                {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default YearSelector;
