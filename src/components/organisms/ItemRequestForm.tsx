import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import React from "react";
import { devisSchemaForItems } from "../../shemas/devisFormShemas"; 
import ClientDataForm from "../molecules/ClientDataForm";
import ClientAdresseForm from "../molecules/ClientAdresseForm";
import ClientRappelForm from "../molecules/ClientRappelForm";
import ArticleFormSection from "../molecules/ClientArticlesForm";
import ClientAccidentForm from "../molecules/ClientAccidentForm";

interface DevisFormProps {
    form: UseFormReturn<z.infer<typeof devisSchemaForItems>>;
}

const ItemRequestForm: React.FC<DevisFormProps> = ({ form }) => {
    return (
        <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-highGrey border border-highGrey rounded-xl p-2">
                <ClientDataForm form={form} formId="clientForm" />
            </div>

            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-highGrey border border-highGrey rounded-xl p-2">
                <ClientAdresseForm form={form} formId="clientForm" />
            </div>

            {/* Make only this section scrollable */}
            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-highGrey border border-highGrey rounded-xl p-2">
                <ArticleFormSection form={form} formId="itemRequests" />
            </div>

            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-highGrey border border-highGrey rounded-xl p-2">
                <ClientAccidentForm form={form} formId="itemChangeForm" />
            </div>

            
            <div className="w-full md:w-[48%] lg-custom:w-[23%] mb-4 bg-highGrey border border-highGrey rounded-xl p-2">
                <ClientRappelForm form={form} formId="rappelForm" devisFormId="devisGeneralForm" />
            </div>
        </div>
    );
};

export default ItemRequestForm;
