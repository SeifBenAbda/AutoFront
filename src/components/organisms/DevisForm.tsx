import { z } from "zod";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import React, { useState } from "react";
import { devisSchemaForCar } from "../../shemas/devisFormShemas";
import ClientDataForm from "../molecules/DevisForm/ClientDataForm";
import ClientExtraForm from "../molecules/DevisForm/ClientExtraForm";
import ClientAdresseForm from "../molecules/DevisForm/ClientAdresseForm";
import ClientRappelForm from "../molecules/DevisForm/ClientRappelForm";
import { Card, CardContent } from "../../@/components/ui/card";

interface DevisFormProps {
    form: UseFormReturn<z.infer<typeof devisSchemaForCar>>;
}

const DevisForm: React.FC<DevisFormProps> = ({ form }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { label: "Information du client", component: <ClientDataForm form={form} formId="clientForm" /> },
        { label: "Adresse du client", component: <ClientAdresseForm form={form} formId="clientForm" /> },
        { label: "Infos supplémentaires", component: <ClientExtraForm form={form} generalFormId="devisGeneralForm" formId="devisCarForm" payementFormId="devisPayementForm" /> },
        { label: "Client Rappel", component: <ClientRappelForm form={form} formId="rappelForm" /> }
    ];

    const hasErrors = (stepIndex: number) => {
        switch (stepIndex) {
            case 0:
                return !!form.formState.errors.clientForm;
            case 1:
                return !!form.formState.errors.clientForm;   
            case 2:
                return !!form.formState.errors.devisCarForm || !!form.formState.errors.devisGeneralForm;
            case 3:
                return !!form.formState.errors.rappelForm;
            default:
                return false;
        }
    };

    function devisSteps() {
        return (
            <div className="flex flex-col space-y-8 p-4">
              {steps.map((step, index) => (
                <button 
                  key={index} 
                  className="relative w-full flex flex-col items-start"
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-start w-full">
                    {/* Circle Container */}
                    <div className="relative shrink-0">
                      {hasErrors(index) ? (
                        // Double circle for error state
                        <>
                          <div className="w-8 h-8 rounded-full border-2 border-red-400 absolute" />
                          <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-red-400" />
                        </>
                      ) : (
                        // Single green circle for success state
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
        
                      {/* Connecting Line */}
                      {index < steps.length - 1 && (
                        <div 
                          className={`absolute left-1/2 transform -translate-x-1/2 w-0.5 h-16 top-8
                            ${hasErrors(index) ? 'bg-red-400' : 'bg-green-500'}`}
                        />
                      )}
                    </div>
        
                    {/* Text Container */}
                    <div className="ml-4 text-left">
                      <span className="text-xs text-gray-500 block">Étape {index + 1}</span>
                      <h4 className="text-sm font-medium">{step.label}</h4>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          );
    }
    

    return (
        <div className="flex  rounded-none">
            <Card className="w-1/4 flex flex-col bg-bgColorLight  border-transparent">
                
                {devisSteps()}
            </Card>

            <Card className="w-3/4  flex flex-col bg-bgColorLight border-transparent p-0">
                <CardContent className="flex-1 flex justify-center items-center pt-2 bg-whiteSecond p-2 border border-whiteSecond shadow-sm rounded-md">
                    {steps[currentStep].component}
                </CardContent>
            </Card>
        </div>
    );
};

export default DevisForm;
