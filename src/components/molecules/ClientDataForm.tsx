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
import { DatePicker } from "../atoms/DataSelector";
import ClientGender from "../atoms/ClientGender";
import TypeClient from "../atoms/ClientTypeSelect";

const ClientDataForm: React.FC<any> = ({ form, formId }) => {
    const { register, control, watch } = form;

    // Watch the clientType field
    const clientType = watch(`${formId}.clientType`);
    const clientGender = watch(`${formId}.clientGender`);

    return (
        <Form {...form} className="flex-1">
            <div className="w-full">
                {/* Toggle Informations */}
                <div className="flex space-x-4">
                    <FormCardContent form={form} label="M. ou Mme" name={`${formId}.clientGender`}>
                        <Controller
                            name={`${formId}.clientGender`}
                            control={control}
                            render={({ field }) => (
                                <ClientGender
                                    option1="Monsieur"
                                    option2="Madame"
                                    onChange={(selected: string) => {
                                        field.onChange(selected);
                                        form.setValue(`${formId}.clientGender`, selected);
                                    }}
                                    defaultValue={clientGender}
                                />
                            )}
                        />
                    </FormCardContent>

                    <FormCardContent form={form} label="Type Client" name={`${formId}.clientType`}>
                        <Controller
                            name={`${formId}.clientType`}
                            control={control}
                            render={({ field }) => (
                                <TypeClient
                                    option1="Particulier"
                                    option2="Entreprise"
                                    onChange={(selected: string) => {
                                        form.setValue(`${formId}.clientType`, selected);
                                    }}
                                    defaultValue={clientType}
                                />
                            )}
                        />
                    </FormCardContent>
                </div>

                {/* Nom Client */}
                <FormCardContent form={form} label="Nom et prénom" name={`${formId}.nomClient`}>
                    <Input
                        className="border border-darkGrey bg-lightWhite"
                        placeholder="Nom et prénom Client"
                        {...register(`${formId}.nomClient`)}
                    />
                </FormCardContent>

                {/* Phone and CIN */}
                <div className="flex space-x-4 text-whiteSecond">
                    <FormCardContent form={form} label="Cin" name={`${formId}.cin`} className="flex-1">
                        <Input
                            className="border border-darkGrey bg-lightWhite text-highGrey"
                            placeholder="Cin"
                            {...register(`${formId}.cin`)}
                        />
                    </FormCardContent>

                    <FormCardContent form={form} label="Numéro de téléphone" name={`${formId}.telClient`} className="flex-1">
                        <Input
                            className="border border-darkGrey bg-lightWhite text-highGrey"
                            placeholder="Numéro de téléphone"
                            {...register(`${formId}.telClient`)}
                        />
                    </FormCardContent>
                </div>

                
                <div className="flex space-x-4 text-whiteSecond">

                    <FormCardContent form={form} label="Email" name={`${formId}.email`} className="flex-1">
                        <Input
                            className="border border-darkGrey bg-lightWhite text-highGrey"
                            placeholder="Email"
                            {...register(`${formId}.email`)}
                        />
                    </FormCardContent>
                    <FormCardContent form={form} label="Profession / Secteur Activite" name={`${formId}.socialReason`} className="flex-1">
                        <Input
                            className="border border-darkGrey bg-lightWhite text-highGrey"
                            placeholder="Profession / Secteur Activite"
                            {...register(`${formId}.socialReason`)}
                        />
                    </FormCardContent>
                </div>

                <FormCardContent form={form} label="Matricule Fiscale" name={`${formId}.mtFiscale`}>
                    <Controller
                        name={`${formId}.mtFiscale`}
                        control={control}
                        render={({ field }) => (
                            <Input
                                className="border border-darkGrey bg-lightWhite"
                                placeholder="Matricule Fiscale"
                                {...register(`${formId}.mtFiscale`)}
                            />
                        )}
                    />
                </FormCardContent>

                {/* Conditionally render Date of Birth */}
                {clientType !== "Entreprise" && (
                    <FormCardContent form={form} label="Date de naissance" name={`${formId}.dateOfBirth`}>
                        <Controller
                            name={`${formId}.dateOfBirth`}
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    fromYear={new Date().getFullYear() - 70}
                                    toYear={new Date().getFullYear() - 18}
                                />
                            )}
                        />
                    </FormCardContent>
                )}
            </div>
        </Form>
    );
};

export default ClientDataForm;
