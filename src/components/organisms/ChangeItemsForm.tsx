import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import React from "react";
import { devisSchema } from "../../shemas/devisFormShemas";
import ClientDataForm from "../molecules/ClientDataForm";
import ClientExtraForm from "../molecules/ClientExtraForm";
import ClientAdresseForm from "../molecules/ClientAdresseForm";
import ClientRappelForm from "../molecules/ClientRappelForm";

interface DevisFormProps {
    form: UseFormReturn<z.infer<typeof devisSchema>>;
}

const ChangeItemsForm: React.FC<DevisFormProps> = ({ form }) => {
    return (
        <div className="flex flex-wrap justify-between">
            
        </div>
    );
};

export default ChangeItemsForm;
