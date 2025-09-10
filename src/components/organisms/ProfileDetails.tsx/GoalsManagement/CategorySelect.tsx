import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../@/components/ui/select";
import { GoalCategory } from "./types";

interface CategorySelectProps {
    value?: string;
    onChange: (value: string) => void;
    categories: GoalCategory[];
    placeholder?: string;
}

function CategorySelect({ value, onChange, categories, placeholder = 'Catégorie' }: CategorySelectProps) {
    return (
        <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="bg-normalGrey border-normalGrey h-10 text-highBlue font-oswald">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-normalGrey border-normalGrey max-h-60">
                {categories.filter(c => c.IsActive).map(cat => (
                    <SelectItem key={cat.CategoryId} value={cat.CategoryName}>
                        {cat.CategoryName}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export default CategorySelect;
