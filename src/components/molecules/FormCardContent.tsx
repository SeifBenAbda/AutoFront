import React from "react";
import {
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../@/components/ui/form";

import { CardContent } from "../../@/components/ui/card";


const FormCardContent: React.FC<any> = ({ form, name, label, children }) => {
    return (
        <CardContent className="flex flex-1">
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>{label}</FormLabel>
                        <FormControl className="w-full">
                            {children}
                        </FormControl>
                        <FormMessage>
                            {form.formState.errors[name]?.message as string}
                        </FormMessage>
                    </FormItem>
                )}
            />
        </CardContent>
    );
};

export default FormCardContent;
