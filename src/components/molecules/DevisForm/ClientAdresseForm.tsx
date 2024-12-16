import React from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../@/components/ui/form";
import { Input } from "../../../@/components/ui/input";
import FormCardContent from "./FormCardContent";
import RegionDropDown from "../../atoms/RegionDropDown";
import { Textarea } from "../../../@/components/ui/textarea";
import { Controller } from "react-hook-form";
import { NumericInputForm } from "../../../components/atoms/NumericInputForm";

const ClientAdresseForm: React.FC<any> = ({ form, formId }) => {
    const { register, control } = form;

    return (
        <Form {...form} className="flex-1" autoComplete="off">
            <div className="w-full space-y-4">
                {/* Adresse */}
                <div className="text-whiteSecond">
                <FormCardContent form={form} label="Adresse" name={`${formId}.adresse`} className="flex-1">
                    <Input
                        className="border border-highBlue bg-lightWhite text-highBlue"
                        placeholder="Adresse"
                        {...register(`${formId}.adresse`)}
                    />
                </FormCardContent>
                </div>

                {/* Ville and Region */}
                <div className="flex flex-col md:flex-row gap-4 text-whiteSecond">
                    <div className="flex-1">
                        <FormCardContent form={form} label="Ville" name={`${formId}.ville`} className="flex-1">
                            <Input
                                className="border border-highBlue bg-lightWhite text-highBlue"
                                placeholder="Ville"
                                {...register(`${formId}.ville`)}
                            />
                        </FormCardContent>
                    </div>
                    <div className="flex-1">
                        <FormCardContent form={form} label="Region" name={`${formId}.region`} className="flex-1">
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
                <div className="flex flex-col md:flex-row gap-4 text-whiteSecond">
                    <div className="flex-1">
                        <FormCardContent form={form} label="Code Postal" name={`${formId}.postalCode`} className="flex-1">
                            <NumericInputForm
                                className="border border-highBlue bg-lightWhite text-highBlue"
                                placeholder="Code Postal"
                                {...register(`${formId}.postalCode`)}
                                maxLength={5}
                            />
                        </FormCardContent>
                    </div>
                    <div className="flex-1">
                        <FormCardContent form={form} label="Pays" name={`${formId}.pays`} className="flex-1">
                            <Input
                                className="border border-highBlue bg-lightWhite text-highBlue"
                                placeholder="Pays"
                                {...register(`${formId}.pays`)}
                            />
                        </FormCardContent>
                    </div>
                </div>

                {/* Plus d'informations Adresse */}
                <div className="text-whiteSecond">
                <FormCardContent form={form} label="Plus d'informations Adresse" name={`${formId}.addressMoreInfos`} className="flex-1 text-whiteSecond">
                    <Textarea
                        className="border border-highBlue bg-lightWhite min-h-[70px] text-highBlue"
                        placeholder="Plus d'informations.."
                        {...register(`${formId}.addressMoreInfos`)}
                    />
                </FormCardContent>
                </div>
            </div>
        </Form>
    );
};

export default ClientAdresseForm;
