import React, { useState } from "react";
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
import { defaultFormCarDevis, defaultFormClient, defaultFormDevisGeneral, defaultRappelForm, defaultRappelList } from "../utils/defaultFormValues";
import { useCreateDevis } from "../hooks/useDevis";
import { useUser } from "../context/userContext";
import Loading from "../components/atoms/Loading";
import { useNavigate } from "react-router-dom";
import { Rappel } from "@/types/devisTypes";

const DevisPage: React.FC = () => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof devisSchemaForCar>>({
        resolver: zodResolver(devisSchemaForCar),
        defaultValues: {
            clientForm: defaultFormClient,
            devisCarForm: defaultFormCarDevis,
            devisGeneralForm: defaultFormDevisGeneral,
            rappelForm: defaultRappelList,
        },
    });

    const { mutateAsync: createDevis } = useCreateDevis();

    const onSubmit = async (values: z.infer<typeof devisSchemaForCar>) => {
        setIsLoading(true);
        try {
            const rappelData: Rappel[] = values.rappelForm.map((rappel) => ({
                ...defaultRappelForm,
                ...rappel,
                RappelDate: rappel.RappelDate ?? defaultRappelForm.RappelDate,
                CreatedBy: user!.nomUser,
            }));

            const mergedValues = {
                database: "Commer_2024_AutoPro",
                client: { ...defaultFormClient, ...values.clientForm },
                devis: { ...defaultFormDevisGeneral, ...values.devisGeneralForm, TypeDevis: "OC", CreatedBy: user!.nomUser },
                carRequestData: { ...defaultFormCarDevis, ...values.devisCarForm },
                itemRequestData: undefined,
                rappelData,
            };

            await createDevis(mergedValues);
            setIsLoading(false);
            navigate("/carTracking");
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-500">
                    <Loading />
                </div>
            )}
            <Card className="h-full p-2 m-1 bg-lightWhite border border-lightWhite overflow-auto">
                <div className="flex flex-col h-full">
                    {/* Sticky CardHeader */}
                    <CardHeader className="sticky top-0 left-0 right-0 bg-lightWhite z-10 p-4 border-b border-lightWhite flex flex-col md:flex-row md:items-center md:justify-between ml-4 mr-4">
                        <div>
                            <CardTitle className="text-darkGrey">Devis</CardTitle>
                            <CardDescription>Devis pour voiture</CardDescription>
                        </div>
                        <div className="mt-2 md:mt-0">
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                type="button"
                                disabled={isLoading}
                                className="bg-greenOne hover:bg-greenOne"
                            >
                                Valider Devis
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Scrollable CardContent */}
                    <CardContent className="flex-grow overflow-y-scroll mt-4">
                        <DevisForm form={form} />
                    </CardContent>
                </div>
            </Card>
        </div>
    );
};

export default DevisPage;
