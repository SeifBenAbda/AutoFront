import { z } from "zod";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import React, { useState } from "react";
import { devisSchemaForCar } from "../../shemas/devisFormShemas";
import ClientDataForm from "../molecules/ClientDataForm";
import ClientExtraForm from "../molecules/ClientExtraForm";
import ClientAdresseForm from "../molecules/ClientAdresseForm";
import ClientRappelForm from "../molecules/ClientRappelForm";
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";

interface DevisFormProps {
    form: UseFormReturn<z.infer<typeof devisSchemaForCar>>;
}

const DevisForm: React.FC<DevisFormProps> = ({ form }) => {
    const [currentStep, setCurrentStep] = useState(0);


    // Map of step components
    const steps = [
        { label: "Information du client", component: <ClientDataForm form={form} formId="clientForm" /> },
        { label: "Adresse du client", component: <ClientAdresseForm form={form} formId="clientForm" /> },
        { label: "Infos supplémentaires", component: <ClientExtraForm form={form} generalFormId="devisGeneralForm" formId="devisCarForm" /> },
        { label: "Client Rappel", component: <ClientRappelForm form={form} formId="rappelForm"  /> }
    ];


    const hasErrors = (stepIndex: number) => {
        switch (stepIndex) {
            case 0:
                return !!form.formState.errors.clientForm; // Checks if there are any errors in `clientForm`
            case 1:
                return !!form.formState.errors.clientForm; // Checks if there are any errors in `clientForm`    
            case 2:
                return !!form.formState.errors.devisCarForm || !!form.formState.errors.devisGeneralForm; // Checks if there are any errors in `clientForm`        
            // Add more cases here if you have more steps
            default:
                return false; // Return false if no step matches or there are no errors
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                    <Card className="bg-highGrey h-full flex flex-col border border-highGrey rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-base text-whiteSecond">Etape {currentStep + 1} sur {steps.length}</CardTitle>
                        </CardHeader>
                        <div className="flex-1">
                            {steps.map((step, index) => (
                                <CardContent key={index}>
                                    <Button
                                        onClick={() => setCurrentStep(index)}
                                        className={`font-oswald w-full ${currentStep === index ? "bg-lightGreen hover:bg-lightGreen text-highGrey" : "bg-lightWhite hover:bg-lightWhite text-highGrey"}}`}
                                    >
                                        {step.label} {hasErrors(index) && (
                                            <span className="text-lightRed">*</span>
                                        )}
                                    </Button>
                                </CardContent>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-3 flex">
                    <Card className="bg-highGrey border rounded-lg border-highGrey flex-1 flex flex-col">
                        <CardContent className="flex-1 flex justify-center items-center p-6">
                            {steps[currentStep].component}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DevisForm;
