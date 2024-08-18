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
import { Input } from "../../@/components/ui/input";
import FormCardContent from "./FormCardContent";
import RegionDropDown from "./RegionDropDown";
import { Separator } from "../../@/components/ui/separator";
import { DatePicker } from "../atoms/DataSelector";
import ClientGender from "../atoms/ClientGender";
import TypeClient from "../atoms/ClientTypeSelect";

const ClientDataForm: React.FC<any> = ({ form, formId }) => {
    const { register, control, watch } = form;

    // Watch the value of the clientType and clientGender fields
    const clientType = watch(`${formId}.clientType`);
    const clientGender = watch(`${formId}.clientGender`);

    return (
        <Form {...form} className="flex-1">
            <div className="pl-3 mt-2 font-oswald text-lg mb-2">Données du client</div>
            <div className="w-full">
                {/* Toggle Informations */}
                <div className="flex space-x-4">
                    <FormCardContent form={form} label="M. ou Mme" name={`${formId}.clientGender`}>
                        <ClientGender
                            option1="Monsieur"
                            option2="Madame"
                            onChange={(selected: string) => {
                                // Update the form field value
                                form.setValue(`${formId}.clientGender`, selected);
                                console.log("Selected Gender : " + selected);
                            }}
                        />
                    </FormCardContent>

                    <FormCardContent form={form} label="Type Client" name={`${formId}.clientType`}>
                        <TypeClient
                            option1="Particulier"
                            option2="Entreprise"
                            onChange={(selected: string) => {
                                // Update the form field value
                                form.setValue(`${formId}.clientType`, selected);
                                console.log("Selected Type : " + selected);
                            }}
                        />
                    </FormCardContent>
                </div>

                {/* Nom Client */}
                <FormCardContent form={form} label="Nom" name={`${formId}.nomClient`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Nom du Client"
                        {...register(`${formId}.nomClient`)}
                    />
                </FormCardContent>

                {/* Cin Client */}
                <FormCardContent form={form} label="Cin" name={`${formId}.cin`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Cin"
                        {...register(`${formId}.cin`)}
                    />
                </FormCardContent>

                {/* Matricule Fiscale Client */}
                <FormCardContent form={form} label="Matricule Fiscale" name={`${formId}.mtFiscale`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Matricule Fiscale"
                        {...register(`${formId}.mtFiscale`)}
                    />
                </FormCardContent>

                {/* Tel Client */}
                <FormCardContent form={form} label="Numéro de téléphone" name={`${formId}.telClient`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Numéro de téléphone"
                        {...register(`${formId}.telClient`)}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Email" name={`${formId}.email`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Email"
                        {...register(`${formId}.email`)}
                    />
                </FormCardContent>

                {/* Raison Sociale */}
                <FormCardContent form={form} label="Profession / Secteur Activite" name={`${formId}.socialReason`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Profession / Secteur Activite"
                        {...register(`${formId}.socialReason`)}
                    />
                </FormCardContent>


                {/* Date of Birthday */}                
                <FormCardContent form={form} label="Date de naissance" name={`${formId}.dateOfBirth`}>
                    <Controller
                        name={`${formId}.dateOfBirth`}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                fromYear={new Date().getFullYear()-70}
                                toYear={new Date().getFullYear()-18}
                            />
                        )}
                    />
                </FormCardContent>
            </div>
        </Form>
    );
};

export default ClientDataForm;
