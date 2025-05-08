import { forwardRef } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";

interface UserTypeDropDownProps {
    value?: string;
    onChange: (value: string) => void;
}

const UserTypeDropDown = forwardRef<HTMLButtonElement, UserTypeDropDownProps>(
    ({ value, onChange }, ref) => {
        const hoverItem = "cursor-pointer focus:bg-lightWhite hover:rounded-md";
        const userTypes = ["ADMIN", "MANAGER", "NORMAL"];

        return (
            <Select onValueChange={onChange}>
                <SelectTrigger ref={ref} className="w-full border border-normalGrey bg-normalGrey font-oswald text-highBlue">
                    <SelectValue placeholder={value ? value.toString() : "Non déterminé"} className={hoverItem}/>
                </SelectTrigger>
                <SelectContent className="bg-normalGrey border-normalGrey">
                    {userTypes.map((userType) => (
                        <SelectItem key={userType} value={userType} className={hoverItem}>
                            {userType}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

UserTypeDropDown.displayName = 'UserTypeDropDown'; // Add a displayName for better debugging

export default UserTypeDropDown;
