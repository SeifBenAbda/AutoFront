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
import { formSchema } from "../shemas/devisFormShemas";
import { useDevisCompteur } from '../context/devisCompteurContext';
import useDevisCompteurFetcher from "../hooks/useDevisCompteur";
import ChangeItemsForm from "../components/organisms/ChangeItemsForm";
import  {defaultDevisFormValues}  from "../utils/defaultFormValues";
const ItemChangePage: React.FC = () => {
    const { devisCompteur } = useDevisCompteur();
    useDevisCompteurFetcher(); // Initialize fetching and WebSocket subscription

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            devisForm: defaultDevisFormValues,
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("All Form Values:", values);
        console.log("Date of Birth:", values.devisForm.dateOfBirth);
        console.log("Nom Client:", values.devisForm.nomClient);
    };

    return (
        <Card className="p-2 m-2">
            <div className="flex flex-col">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Devis N° {devisCompteur.devisNumber}</CardTitle>
                        <CardDescription>Devis pour voiture</CardDescription>
                    </div>
                    <div className="mt-2 md:mt-2">
                        <Button
                            onClick={() => form.handleSubmit(onSubmit)()}
                            type="button"
                        >
                            Valider Devis
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ChangeItemsForm form={form} />
                </CardContent>
            </div>
        </Card>
    );
};

export default ItemChangePage;
