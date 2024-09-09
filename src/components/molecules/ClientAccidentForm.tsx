import { Controller } from "react-hook-form";
import React from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../@/components/ui/form";
import FormCardContent from "./FormCardContent";
import { Input } from "../../@/components/ui/input";
import { Textarea } from "../../@/components/ui/textarea";

const ClientAccidentForm: React.FC<{ form: any; formId: string}> = ({ form, formId}) => {
    const { register, control } = form;

    return (
        <Form {...form} className="flex-1">
            <div className="pl-3 mb-2  font-oswald text-lg  text-white">Plus d'informations</div>
            <div className="w-full">
            <FormCardContent form={form} label="Voiture Ancienne" name={`${formId}.OldCar`}>
                    <Input
                        className="border border-darkGrey bg-lightWhite"
                        placeholder="Voiture Ancienne"
                        {...register(`${formId}.OldCar`)}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Immatriculation" name={`${formId}.Immatriculation`}>
                    <Input
                        className="border border-darkGrey bg-lightWhite"
                        placeholder="Immatriculation"
                        {...register(`${formId}.Immatriculation`)}
                    />
                </FormCardContent> 

                

            </div>
        </Form>
    );
};

export default ClientAccidentForm;
