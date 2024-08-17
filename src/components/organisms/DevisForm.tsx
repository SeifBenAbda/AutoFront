import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import React from "react";
import { formSchema } from "../../shemas/devisFormShemas";
import { Button } from "../../@/components/ui/button";
import ClientDataForm from "../molecules/ClientDataForm";

const DevisForm: React.FC = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            form1: { nomClient: "", telClient: "", email: "", socialReason: "", postalCode: "", pays: "" ,dateOfBirth:"" ,clientType:"pp"},
            //form2: { nomClient: "" },
            //form3: { nomClient: "" },
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("All Form Values:", values);
        console.log("Date of Birth:", values.form1.dateOfBirth);
        console.log("Nom Client:", values.form1.nomClient);
    };

    return (
        <main className="flex flex-wrap lg:flex-row md:flex-row sm:flex-col w-full lg:space-y-0 lg:space-x-4 md:space-x-4">
            <ClientDataForm form={form} formId="form1" />
            {/* Uncomment if you have these forms */}
            {/* <FormMain form={form} formId="form2" /> */}
            {/* <FormMain form={form} formId="form3" /> */}
            <div className="w-full flex justify-center mt-4">
                <Button onClick={() => form.handleSubmit(onSubmit)()} type="button">
                    Submit All Forms
                </Button>
            </div>
        </main>
    );
};

export default DevisForm;
