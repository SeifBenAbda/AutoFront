import DevisForm from "../components/organisms/DevisForm";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../@/components/ui/card";
import { Button } from "../@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { devisSchema } from "../shemas/devisFormShemas";
import { defaultFormCarDevis, defaultFormClient, defaultFormDevisGeneral, defaultRappelForm } from "../utils/defaultFormValues";
import { useCreateDevis } from "../hooks/useDevis";  // Adjust the path to your hooks

const ItemChangePage: React.FC = () => {
    const form = useForm<z.infer<typeof devisSchema>>({
        resolver: zodResolver(devisSchema),
        defaultValues: {
            clientForm: defaultFormClient,
            devisCarForm: defaultFormCarDevis,
            devisGeneralForm: defaultFormDevisGeneral,
            rappelForm: defaultRappelForm
        }
    });

    const { mutateAsync: createDevis } = useCreateDevis();

    const onSubmit = async (values: z.infer<typeof devisSchema>) => {
        try {
            // Merge default values with form values
            const mergedValues = {
                database: "Commer_2024_AutoPro", // Replace with actual database name or use a variable
                client: { ...defaultFormClient, ...values.clientForm },
                devis: { ...defaultFormDevisGeneral, ...values.devisGeneralForm ,TypeDevis:'OC'},
                carRequestData: { ...defaultFormCarDevis, ...values.devisCarForm },
                itemRequestData: undefined
            };

            // Submit the merged data
            await createDevis(mergedValues);
            console.log("Form submitted successfully!");
            // Optionally: redirect or show a success message
        } catch (error) {
            console.error("Error submitting form:", error);
            // Optionally: show an error message
        }
    };

    return (
        <Card className="p-2 m-2">
            <div className="flex flex-col">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Devis</CardTitle>
                        <CardDescription>Devis pour Pieces</CardDescription>
                    </div>
                    <div className="mt-2 md:mt-2">
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            type="button"
                        >
                            Valider Devis
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    
                </CardContent>
            </div>
        </Card>
    );
};

export default ItemChangePage;
