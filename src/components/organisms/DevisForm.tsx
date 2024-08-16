import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../@/components/ui/form";
import { Button } from "../../@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../@/components/ui/card";
import FormCardContent from "../molecules/FormCardContent";
import { formSchema } from "../../shemas/devisFormShemas";


const DevisForm: React.FC = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nomClient: "", // Ensure this matches your schema field
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Devis</CardTitle>
                <CardDescription>Devis pour voiture</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormCardContent form={form} content="Your Content Here" />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </Card>
    );
};

export default DevisForm;
