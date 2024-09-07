import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import React from "react";
import { devisSchema, devisSchemaForItems } from "../../shemas/devisFormShemas"; // Update import path to your new schema
import ClientDataForm from "../molecules/ClientDataForm";
import ClientAdresseForm from "../molecules/ClientAdresseForm";
import ClientRappelForm from "../molecules/ClientRappelForm";
import ClientItemChangeForm from "../molecules/ClientItemChangeForm";
import ClientExtraForm from "../molecules/ClientExtraForm";

interface DevisFormProps {
    form: UseFormReturn<z.infer<typeof devisSchemaForItems>>;
}

const ItemRequestForm: React.FC<DevisFormProps> = ({ form }) => {
    return (
        <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-greenFour border border-greenFour rounded-xl p-2">
                <ClientDataForm form={form} formId="clientForm" />
            </div>

            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-greenFour border border-greenFour rounded-xl p-2">
                <ClientAdresseForm form={form} formId="clientForm" />
            </div>
            

            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-greenFour border border-greenFour rounded-xl p-2">
                <ClientItemChangeForm form={form} formId="itemRequests"  />
            </div>

            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-greenFour border border-greenFour rounded-xl p-2">
                <ClientRappelForm form={form} formId="rappelForm" devisFormId="devisGeneralForm" />
            </div>
        </div>
    );
};

export default ItemRequestForm;
