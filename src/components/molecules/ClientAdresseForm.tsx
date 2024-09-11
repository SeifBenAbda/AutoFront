import React from "react";
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
import RegionDropDown from "../atoms/RegionDropDown";
import { Textarea } from "../../@/components/ui/textarea";
import { Controller } from "react-hook-form";

const ClientAdresseForm: React.FC<any> = ({ form, formId }) => {
    const { register, control } = form;

    return (
        <Form {...form} className="flex-1" autoComplete="off">
            <div className="w-full space-y-4">
                {/* Adresse */}
                <FormCardContent form={form} label="Adresse" name={`${formId}.adresse`}>
                    <Input
                        className="border border-highGrey bg-lightWhite"
                        placeholder="Adresse"
                        {...register(`${formId}.adresse`)}
                    />
                </FormCardContent>

                {/* Ville and Region */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <FormCardContent form={form} label="Ville" name={`${formId}.ville`}>
                            <Input
                                className="border border-highGrey bg-lightWhite"
                                placeholder="Ville"
                                {...register(`${formId}.ville`)}
                            />
                        </FormCardContent>
                    </div>
                    <div className="flex-1">
                        <FormCardContent form={form} label="Region" name={`${formId}.region`}>
                            <Controller
                                name={`${formId}.region`}
                                control={control}
                                render={({ field }) => (
                                    <RegionDropDown
                                        value={field.value || ""}
                                        onChange={(value) => field.onChange(value)}
                                        isFiltring={false}
                                    />
                                )}
                            />
                        </FormCardContent>
                    </div>
                </div>

                {/* Code Postal and Pays */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <FormCardContent form={form} label="Code Postal" name={`${formId}.postalCode`}>
                            <Input
                                className="border border-highGrey bg-lightWhite"
                                placeholder="Code Postal"
                                {...register(`${formId}.postalCode`)}
                            />
                        </FormCardContent>
                    </div>
                    <div className="flex-1">
                        <FormCardContent form={form} label="Pays" name={`${formId}.pays`}>
                            <Input
                                className="border border-highGrey bg-lightWhite"
                                placeholder="Pays"
                                {...register(`${formId}.pays`)}
                            />
                        </FormCardContent>
                    </div>
                </div>

                {/* Plus d'informations Adresse */}
                <FormCardContent form={form} label="Plus d'informations Adresse" name={`${formId}.addressMoreInfos`}>
                    <Textarea
                        className="border border-highGrey bg-lightWhite min-h-[70px]"
                        placeholder="Plus d'informations.."
                        {...register(`${formId}.addressMoreInfos`)}
                    />
                </FormCardContent>
            </div>
        </Form>
    );
};

export default ClientAdresseForm;
