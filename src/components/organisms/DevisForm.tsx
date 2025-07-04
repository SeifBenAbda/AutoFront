import { z } from "zod";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import { useEffect, useState } from "react";
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


  useEffect(() => {
    form.handleSubmit(
      (data) => {
      },
      (errors: FieldErrors<z.infer<typeof devisSchemaForCar>>) => {
      }
    )();
  }, []);

  const formState = form.formState;
  const { errors } = formState;

  const hasErrors = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return errors.clientForm ? Object.keys(errors.clientForm).length > 0 : false;
      case 1:
        return errors.clientForm ? Object.keys(errors.clientForm).length > 0 : false;
      case 2:
        return (errors.devisCarForm ? Object.keys(errors.devisCarForm).length > 0 : false) ||
          (errors.devisGeneralForm ? Object.keys(errors.devisGeneralForm).length > 0 : false);
      case 3:
        return errors.rappelForm ? Object.keys(errors.rappelForm).length > 0 : false;
      default:
        return false;
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    return !hasErrors(stepIndex);
  };

  function devisSteps() {
    return (
      <div className="flex flex-col space-y-4 p-4 font-oswald">
        {steps.map((step, index) => (
          <button
            key={index}
            className="relative w-full flex items-center group"
            onClick={() => setCurrentStep(index)}
          >
            {/* Line indicator or checkmark */}
            <div className="relative h-12 flex items-center">
              {isStepCompleted(index) ? (
                // Green checkmark for completed steps
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                // Original line indicator for non-completed steps
                <div
                  className={`h-0.5 ${currentStep === index
                    ? "w-6 bg-blueGrey font-bold"
                    : "w-3 bg-gray-300"
                    } transition-all duration-200`}
                />
              )}
            </div>

            {/* Step label */}
            <div className="ml-2 text-left flex items-center">
              <h4
                className={`text-normal ${isStepCompleted(index)
                  ? "font-medium text-green-600"
                  : currentStep === index
                    ? "font-medium text-blueGrey"
                    : hasErrors(index)
                      ? "font-normal text-red-500"
                      : "font-normal text-gray-500"
                  }`}
              >
                {step.label}
              </h4>

              {/* Error indicator */}
              {hasErrors(index) && !isStepCompleted(index) && (
                <div className="ml-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex  rounded-none justify-center space-x-4 p-4 bg-bgColorLight">
      <Card className="w-1/4 flex flex-col bg-bgColorLight border-transparent">
        {devisSteps()}
      </Card>

      <Card className="w-[70%]  flex flex-col bg-bgColorLight border-transparent p-0">
        <CardContent className="flex-1 flex justify-center items-center pt-2 p-2 ">
          {steps[currentStep].component}
        </CardContent>
      </Card>
    </div>
  );
};

export default DevisForm;