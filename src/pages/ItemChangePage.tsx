
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
import { devisSchema, devisSchemaForItems } from "../shemas/devisFormShemas";
import { defaultFormCarDevis, defaultFormClient, defaultFormDevisGeneral,defaultItemRequestForm,defaultItemRequestList,defaultRappelList } from "../utils/defaultFormValues";
import { useCreateDevis } from "../hooks/useDevis";  // Adjust the path to your hooks
import { ItemRequest } from "@/types/devisTypes";
import { useUser } from "../context/userContext";
import ItemRequestForm from "../components/organisms/ItemRequestForm";

const ItemChangePage: React.FC = () => {
    const form = useForm<z.infer<typeof devisSchemaForItems>>({
        resolver: zodResolver(devisSchemaForItems),
        defaultValues: {
            clientForm: defaultFormClient,
            //devisCarForm: defaultFormCarDevis,
            //devisGeneralForm: defaultFormDevisGeneral,
            rappelForm: defaultRappelList, // Use the list of Rappel defaults here
            itemRequests:defaultItemRequestList
        }
    });

    const { mutateAsync: createDevis } = useCreateDevis();
    const { user } = useUser();
    const onSubmit = async (values: z.infer<typeof devisSchemaForItems>) => {
        console.log("hellpo")
        try {
            // Merge default values with form values


            const itemRequests: ItemRequest[] = values.itemRequests.map((itemRequest, index) => ({
                ...defaultItemRequestForm, // Apply default values
                ...itemRequest, // Override default values with form input
                RequestDate: new Date(), // Use form value if available, otherwise default
                CreatedBy: user!.nomUser, // Use form value if available, otherwise default or dynamic value
            }));

            const mergedValues = {
                database: "Commer_2024_AutoPro", // Replace with actual database name or use a variable
                client: { ...defaultFormClient, ...values.clientForm },
                //devis: { ...defaultFormDevisGeneral, ...values.devisGeneralForm ,TypeDevis:'OC'},
                //carRequestData: { ...defaultFormCarDevis, ...values.devisCarForm },
                itemRequestData: itemRequests
            };

            // Submit the merged data
           // await createDevis(mergedValues);
            // Optionally: redirect or show a success message
            console.log("hellpo")
            console.log(itemRequests)
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
                        <CardTitle className="text-greenFour">Devis</CardTitle>
                        <CardDescription>Devis pour Pieces</CardDescription>
                    </div>
                    <div className="mt-2 md:mt-2">
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            type="button"
                            className="bg-greenFour hover:bg-greenThree"
                        >
                            Valider Devis
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ItemRequestForm form={form}/>
                </CardContent>
            </div>
        </Card>
    );
};

export default ItemChangePage;
