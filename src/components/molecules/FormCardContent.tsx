import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormField,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../@/components/ui/form";
import { Input } from "../../@/components/ui/input";
import { z } from "zod";
import { formSchema } from "../../shemas/devisFormShemas";
import { CardContent } from "../../@/components/ui/card";




interface FormCardProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    content: string;
    children?: React.ReactNode;
}

const FormCardContent: React.FC<FormCardProps> = ({ form, content, children }) => {

    
    return (
        <CardContent>
            <FormField
                control={form.control}
                name="nomClient"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom Client</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormDescription>{content}</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {children}
        </CardContent>
    );
};

export default FormCardContent;
