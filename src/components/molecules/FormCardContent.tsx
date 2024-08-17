import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../@/components/ui/form";

import { z } from "zod";
import { formSchema } from "../../shemas/devisFormShemas";
import { CardContent } from "../../@/components/ui/card";

interface FormCardProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    name: string; // Adjust the type based on your `formSchema`
    label: string;
    children?: React.ReactNode;
}

const FormCardContent: React.FC<FormCardProps> = ({ form, name, label, children }) => {
    return (
        <CardContent className="flex flex-1">
            <FormField
                control={form.control}
                name={name as string}
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
