import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import React, { useState } from "react";
import { devisSchemaForItems } from "../../shemas/devisFormShemas";
import ClientDataForm from "../molecules/ClientDataForm";
import ClientAdresseForm from "../molecules/ClientAdresseForm";
import ClientRappelForm from "../molecules/ClientRappelForm";
import ArticleFormSection from "../molecules/ClientArticlesForm";
import ClientAccidentForm from "../molecules/ClientAccidentForm";
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";

interface DevisFormProps {
    form: UseFormReturn<z.infer<typeof devisSchemaForItems>>;
}

const ItemRequestForm: React.FC<DevisFormProps> = ({ form }) => {
    const [currentStep, setCurrentStep] = useState(0);

    // Map of step components
    const steps = [
        { label: "Information du client", component: <ClientDataForm form={form} formId="clientForm" /> },
        { label: "Adresse du client", component: <ClientAdresseForm form={form} formId="clientForm" /> },
        { label: "Articles demandés", component: <ArticleFormSection form={form} formId="itemRequests" /> },
        { label: "Détails de l'accident", component: <ClientAccidentForm form={form} formId="itemChangeForm" /> },
        { label: "Client Rappel", component: <ClientRappelForm form={form} formId="rappelForm" devisFormId="devisGeneralForm" /> }
    ];

    const hasErrors = (stepIndex: number) => {
        switch (stepIndex) {
            case 0:
                return !!form.formState.errors.clientForm; // Errors in client form
            case 1:
                return !!form.formState.errors.clientForm; // Errors in address form
            case 2:
                return !!form.formState.errors.itemRequests; // Errors in item request form
            case 3:
                return !!form.formState.errors.itemChangeForm; // Errors in accident form
            case 4:
                return !!form.formState.errors.rappelForm; // Errors in rappel form
            default:
                return false;
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
                                        className={`font-oswald w-full ${currentStep === index ? "bg-lightGreen hover:bg-lightGreen text-highGrey" : "bg-lightWhite hover:bg-lightWhite text-highGrey"}`}
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

export default ItemRequestForm;
