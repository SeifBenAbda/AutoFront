import React from "react";
import DevisForm from "../components/organisms/DevisForm";
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
import { devisSchemaForCar } from "../shemas/devisFormShemas";
import { defaultFormCarDevis, defaultFormClient, defaultFormDevisGeneral, defaultFormPayementDetails, defaultRappelForm, defaultRappelList } from "../utils/defaultFormValues";
import { useCreateDevis } from "../hooks/useDevis";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { Rappel } from "@/types/devisTypes";
import { databaseName } from "../utils/shared_functions";

type DevisPageProps = {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void; // Add setIsLoading prop
};

const DevisPage: React.FC<DevisPageProps> = ({ isLoading, setIsLoading }) => {
    const { user } = useUser();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof devisSchemaForCar>>({
        resolver: zodResolver(devisSchemaForCar),
        defaultValues: {
            clientForm: defaultFormClient,
            devisCarForm: defaultFormCarDevis,
            devisGeneralForm: defaultFormDevisGeneral,
            rappelForm: defaultRappelList,
            devisPayementForm : defaultFormPayementDetails
        },
    });

    const { mutateAsync: createDevis } = useCreateDevis();

    const onSubmit = async (values: z.infer<typeof devisSchemaForCar>) => {
        setIsLoading(true); // Update isLoading via the prop
        try {
            const rappelData: Rappel[] = values.rappelForm.map((rappel) => ({
                ...defaultRappelForm,
                ...rappel,
                RappelDate: rappel.RappelDate ?? defaultRappelForm.RappelDate,
                CreatedBy: user!.nomUser,
            }));

            const mergedValues = {
                database: databaseName,
                client: { ...defaultFormClient, ...values.clientForm },
                devis: { ...defaultFormDevisGeneral, ...values.devisGeneralForm, TypeDevis: "OC", CreatedBy: user!.nomUser },
                carRequestData: { ...defaultFormCarDevis, ...values.devisCarForm },
                devisPayementDetails: { ...defaultFormPayementDetails, ...values.devisPayementForm },
                itemRequestData: undefined,
                rappelData,
            };

            await createDevis(mergedValues);
            navigate("/carTracking");
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false); // Update isLoading via the prop
        }
    };

    return (
        <div className="relative overflow-hidden">
            <Card className="h-full p-2 m-1 bg-bgColorLight border border-bgColorLight overflow-auto">
                <div className="flex flex-col">
                    {/* Sticky CardHeader */}
                    <CardHeader className="sticky top-0 left-0 right-0 bg-bgColorLight z-10 p-4 border-b border-bgColorLight flex flex-col md:flex-row md:items-center md:justify-between ml-4 mr-4">
                        <div>
                            <CardTitle className="text-darkGrey">Devis</CardTitle>
                            <CardDescription>Devis pour voiture</CardDescription>
                        </div>
                        <div className="mt-2 md:mt-0">
                            <Button
                                onClick={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
                                type="button"
                                disabled={isLoading}
                                className="bg-greenOne hover:bg-greenOne"
                            >
                                Valider Devis
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Scrollable CardContent */}
                    <CardContent className="flex-grow  mt-4">
                        <DevisForm form={form} />
                    </CardContent>
                </div>
            </Card>
        </div>
    );
};

export default DevisPage;
