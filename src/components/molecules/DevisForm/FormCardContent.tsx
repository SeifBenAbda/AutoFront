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
                render={({ field }) => (
                    <FormItem className="w-full">
                        <div className="flex justify-between w-full p-1 flex-col">
                            <FormLabel
                                className={`${className ? className : 'text-white mb-1'}`}
                            >
                                {label}
                            </FormLabel>
                        </div>
                        <FormControl className="w-full">
                            {children}
                        </FormControl>
                        {/* Remove FormMessage to avoid displaying the error message */}
                    </FormItem>
                )}
            />
        </CardContent>
    );
};

export default FormCardContent;
