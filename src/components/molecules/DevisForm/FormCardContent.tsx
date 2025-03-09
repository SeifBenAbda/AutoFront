import React from "react";
import {
    FormField,
    FormControl,
    FormItem,
    FormLabel,
} from "../../../@/components/ui/form";

import { CardContent } from "../../../@/components/ui/card";

const FormCardContent: React.FC<any> = ({ form, name, label, children, className }) => {
    return (
        <CardContent className="flex flex-1">
            <FormField
                control={form.control}
                name={name}
                render={({ field, fieldState: { error } }) => (
                    <FormItem className="w-full">
                        <div className="flex justify-between w-full p-1 flex-col">
                            <FormLabel
                                className={`${className ? className : 'text-highBlue mb-1'}`}
                            >
                                {label} 
                                {error && <span className="text-red-500 ml-1">*</span>}
                            </FormLabel>
                        </div>
                        <FormControl className="w-full">
                            {children}
                        </FormControl>
                    </FormItem>
                )}
            />
        </CardContent>
    );
};

export default FormCardContent;
