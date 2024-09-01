import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import React from "react";
import { devisSchema } from "../../shemas/devisFormShemas"; // Update import path to your new schema
import ClientDataForm from "../molecules/ClientDataForm";
import ClientExtraForm from "../molecules/ClientExtraForm";
import ClientAdresseForm from "../molecules/ClientAdresseForm";
import ClientRappelForm from "../molecules/ClientRappelForm";

interface DevisFormProps {
    form: UseFormReturn<z.infer<typeof devisSchema>>;
}

const DevisForm: React.FC<DevisFormProps> = ({ form }) => {
    return (
        <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4">
                <ClientDataForm form={form} formId="clientForm" />
            </div>

            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4">
                <ClientAdresseForm form={form} formId="clientForm" />
            </div>

            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4">
                <ClientExtraForm form={form} generalFormId="devisGeneralForm" formId="devisCarForm" />
            </div>

            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4">
                <ClientRappelForm form={form} formId="rappelForm" devisFormId="devisGeneralForm" />
            </div>
        </div>
    );
};

export default DevisForm;
