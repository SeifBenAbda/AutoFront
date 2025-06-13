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
import { state } from "../utils/shared_functions";
import { useToast } from "../hooks/use-toast";
import { Toaster } from "../@/components/ui/toaster";



type DevisPageProps = {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
};

const DevisPage: React.FC<DevisPageProps> = ({ isLoading, setIsLoading }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();

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
        setIsLoading(true);
        try {
            const rappelData: Rappel[] = values.rappelForm.map((rappel) => ({
                ...defaultRappelForm,
                ...rappel,
                RappelDate: rappel.RappelDate ?? defaultRappelForm.RappelDate,
                CreatedBy: user!.username,
            }));

            const mergedValues = {
                database: state.databaseName,
                client: { ...defaultFormClient, ...values.clientForm },
                devis: { ...defaultFormDevisGeneral, ...values.devisGeneralForm, TypeDevis: "OC", CreatedBy: user!.username },
                carRequestData: { ...defaultFormCarDevis, ...values.devisCarForm },
                devisPayementDetails: { ...defaultFormPayementDetails, ...values.devisPayementForm },
                itemRequestData: undefined,
                rappelData
            };

            const result = await createDevis(mergedValues);
            if (result && result.statusCode === 409) {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: result.error || "Une erreur est survenue lors de la création du devis",
                    duration: 2000, // 3 seconds
                });
                return;
            }
            
            navigate("/carTracking");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de la création du devis",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden">
            <Toaster tostCloseStyle={""} />
            <Card className="h-full p-2 m-1 bg-bgColorLight border border-bgColorLight overflow-auto">
                <div className="flex flex-col">
                    {/* Rest of your component... */}
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

                    <CardContent className="flex-grow mt-4">
                        <DevisForm form={form} />
                    </CardContent>
                </div>
            </Card>
        </div>
    );
};

export default DevisPage;
