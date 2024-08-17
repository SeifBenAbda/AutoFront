import { UseFormReturn, Controller } from "react-hook-form";
import React from "react";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../@/components/ui/form";
import { Input } from "../../@/components/ui/input";
import FormCardContent from "./FormCardContent";
import RegionDropDown from "./RegionDropDown";
import { formSchema } from "../../shemas/devisFormShemas";
import { Separator } from "../../@/components/ui/separator";
import { DatePicker } from "../atoms/DataSelector";
import ClientTypeSelect from "../atoms/ClientTypeSelect";


import { useDevisCompteur } from '../../context/devisCompteurContext'





interface FormMainProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    formId: string;
}

const ClientDataForm: React.FC<FormMainProps> = ({ form, formId }) => {
    const { register, control, watch } = form;
    const { devisCompteur } = useDevisCompteur();
    // Watch the value of the clientType field
    const clientType = watch(`${formId}.clientType`);

    return (
        <Form {...form} className="flex-1">
            <div className="w-full lg:w-[30%] md:w-[35%]">
                <FormCardContent form={form} label="Type de Client" name={formId}>
                    <Controller
                        name={`${formId}.clientType`}
                        control={control}
                        render={({ field }) => (
                            <ClientTypeSelect
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        )}
                    />
                </FormCardContent>
                


                
                <FormCardContent form={form} label="test" name={formId}>
                    <h1>{devisCompteur}</h1>
                </FormCardContent>


                {/* Nom Client */}
                <FormCardContent form={form} label="Nom" name={formId}>
                    <Input
                        placeholder="Nom du Client"
                        {...register(`${formId}.nomClient`)}
                    />
                </FormCardContent>

                {clientType !== "pp" && (
                    <FormCardContent form={form} label="Cin" name={formId}>
                        <Input
                            placeholder="Cin"
                            {...register(`${formId}.cin`)} // Changed to `cin` to match the placeholder
                        />
                    </FormCardContent>
                )}

                {/* Tel Client */}
                <FormCardContent form={form} label="Numero Tel" name={formId}>
                    <Input
                        placeholder="Tel Client"
                        {...register(`${formId}.telClient`)}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Email" name={formId}>
                    <Input
                        placeholder="Email"
                        {...register(`${formId}.email`)}
                    />
                </FormCardContent>

                {/* Raison Sociale */}
                <FormCardContent form={form} label="Profession / Secteur Activite" name={formId}>
                    <Input
                        placeholder="Profession / Secteur Activite"
                        {...register(`${formId}.socialReason`)}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Date de naissance" name={formId}>
                    <Controller
                        name={`${formId}.dateOfBirth`}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </FormCardContent>

                <br />
                <Separator />
                <br />

                {/* Adresse */}
                <FormCardContent form={form} label="Adresse" name={formId}>
                    <Input
                        placeholder="Adresse"
                        {...register(`${formId}.adresse`)}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Ville" name={formId}>
                    <Input
                        placeholder="Ville"
                        {...register(`${formId}.ville`)}
                    />
                </FormCardContent>

                {/* Region and Code Postal */}
                <div className="flex lg:flex-row md:flex-col sm:flex-col">
                    <div className="flex-1 lg:w-[60%]">
                        <FormCardContent form={form} label="Region" name={formId}>
                            <RegionDropDown />
                        </FormCardContent>
                    </div>
                    <div className="flex-1 lg:w-[40%]">
                        <FormCardContent form={form} label="Code Postal" name={formId}>
                            <Input
                                placeholder="Code Postal"
                                {...register(`${formId}.postalCode`)}
                            />
                        </FormCardContent>
                    </div>
                </div>

                {/* Pays */}
                <FormCardContent form={form} label="Pays" name={formId}>
                    <Input
                        placeholder="Pays"
                        {...register(`${formId}.pays`)}
                    />
                </FormCardContent>
            </div>
        </Form>
    );
};

export default ClientDataForm;
