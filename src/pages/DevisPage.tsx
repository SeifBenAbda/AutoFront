import React, { useEffect, useState } from "react";
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
import { devisSchema, devisSchemaForCar } from "../shemas/devisFormShemas";
import { defaultFormCarDevis, defaultFormClient, defaultFormDevisGeneral, defaultRappelForm, defaultRappelList } from "../utils/defaultFormValues";
import { useCreateDevis } from "../hooks/useDevis"; // Adjust the path to your hooks
import { useUser } from "../context/userContext";
import Loading from "../components/atoms/Loading"; // Adjust the path to your Loading component
import { useNavigate } from "react-router-dom";
import { Rappel } from "@/types/devisTypes";


// Custom error component
const MissingFieldsComponent: React.FC<{ message: string }> = ({ message }) => (
    <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {message}
    </div>
);
const DevisPage: React.FC = () => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(false); // Alert state

    const form = useForm<z.infer<typeof devisSchemaForCar>>({
        resolver: zodResolver(devisSchemaForCar),
        defaultValues: {
            clientForm: defaultFormClient,
            devisCarForm: defaultFormCarDevis,
            devisGeneralForm: defaultFormDevisGeneral,
            rappelForm: defaultRappelList // Use the list of Rappel defaults here
        }
    });

    const { errors } = form.formState; // Extract errors from form state
    const { mutateAsync: createDevis } = useCreateDevis();


    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [errors]);

    const onSubmit = async (values: z.infer<typeof devisSchemaForCar>) => {
        setIsLoading(true); // Show loading
        try {

            const rappelData: Rappel[] = values.rappelForm.map((rappel, index) => ({
                ...defaultRappelForm, // Apply default values
                ...rappel, // Override default values with form input
                RappelDate: rappel.RappelDate ?? defaultRappelForm.RappelDate, // Use form value if available, otherwise default
                CreatedBy: user!.nomUser, // Use form value if available, otherwise default or dynamic value
            }));


            // Merge default values with form values
            const mergedValues = {
                database: "Commer_2024_AutoPro", // Replace with actual database name or use a variable
                client: { ...defaultFormClient, ...values.clientForm },
                devis: { ...defaultFormDevisGeneral, ...values.devisGeneralForm, TypeDevis: 'OC', CreatedBy: user!.nomUser },
                carRequestData: { ...defaultFormCarDevis, ...values.devisCarForm },
                itemRequestData: undefined,
                rappelData: rappelData,// Integrate rappelForm directly
            };

            // Submit the merged data
            await createDevis(mergedValues);
            setIsLoading(false); // Hide loading
            navigate('/carTracking');
            // Optionally: redirect or show a success message
        } catch (error) {
            console.error("Error submitting form:", error);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000); // Hide alert after 5 seconds
            // Optionally: show an error message
        } finally {
            setIsLoading(false); // Hide loading
        }
    };



    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <Loading /> {/* Adjust this component to fit your loading design */}
                </div>
            )}
            <Card className="p-2 m-1 bg-veryGrey border border-veryGrey">
                <div className="flex flex-col">
                    {/* Fixed CardHeader, with enough margin to avoid overlap with the main Header */}
                    <CardHeader className="ml-4 mr-4 flex flex-col md:flex-row md:items-center md:justify-between fixed top-[60px] left-0 right-0 bg-veryGrey z-10 p-4 border-b border-veryGrey ">
                        <div>
                            <CardTitle className="text-greenFour">Devis</CardTitle>
                            <CardDescription>Devis pour voiture</CardDescription>
                        </div>
                        <div className="mt-2 md:mt-0">
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                type="button"
                                disabled={isLoading} // Disable button when loading
                                className="bg-greenFour hover:bg-greenThree"
                            >
                                Valider Devis
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Add margin to the content area to compensate for the fixed header */}
                    <CardContent className="lg-custom:mt-[70px] md-custom:mt-[65px] sm-custom:mt-[80px] sm:mt-[120px] mt-[110px]"> {/* 160px accounts for the combined height of the Header (64px) and CardHeader */}
                        <DevisForm form={form} />
                    </CardContent>
                </div>
            </Card>
        </div>

    );
};

export default DevisPage;
