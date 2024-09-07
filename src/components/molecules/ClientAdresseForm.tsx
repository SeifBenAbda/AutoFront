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
    const { register, control, watch } = form;


    return (
        <Form {...form} className="flex-1" autoComplete="off">
            <div className="pl-3 mt-2 font-oswald text-lg mb-2 text-white">Adresse du client</div>
            <div className="w-full">

                {/* Adresse */}
                <FormCardContent form={form} label="Adresse" name={`${formId}.adresse`}>
                    <Input
                        className="border border-greenFour bg-greenZero"
                        placeholder="Adresse"
                        {...register(`${formId}.adresse`)}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Ville" name={`${formId}.ville`}>
                    <Input
                        className="border border-greenFour bg-greenZero"
                        placeholder="Ville"
                        {...register(`${formId}.ville`)}
                    />
                </FormCardContent>

                {/* Region and Code Postal */}
                <div className="flex flex-col ">
                    <div className="flex-1">
                        <FormCardContent form={form} label="Region" name={`${formId}.region`}>
                            <Controller
                                name={`${formId}.region`}
                                control={control}
                                render={({ field }) => (
                                    <RegionDropDown
                                        value={field.value || ""}
                                        onChange={(value) => field.onChange(value)} isFiltring={false}                                    />
                                )}
                            />
                        </FormCardContent>
                    </div>
                    <div className="flex-1">
                        <FormCardContent form={form} label="Code Postal" name={`${formId}.postalCode`}>
                            <Input
                                className="border border-greenFour bg-greenZero"
                                placeholder="Code Postal"
                                {...register(`${formId}.postalCode`)}
                            />
                        </FormCardContent>
                    </div>
                </div>

                {/* Pays */}
                <FormCardContent form={form} label="Pays" name={`${formId}.pays`}>
                    <Input
                        className="border border-greenFour bg-greenZero"
                        placeholder="Pays"
                        {...register(`${formId}.pays`)}
                    />
                </FormCardContent>


                {/* Nore Infos about Adress */}
                <FormCardContent form={form} label="Plus d'informations Adresse" name={`${formId}.addressMoreInfos`}>
                    <Textarea
                        className="border border-greenFour bg-greenZero min-h-[70px]"
                        placeholder="Plus d'informations.."
                        {...register(`${formId}.addressMoreInfos`)}
                    />
                </FormCardContent>



            </div>
        </Form>
    );
};

export default ClientAdresseForm;
