import { Controller } from "react-hook-form";
import React from "react";
import {
    Form,
} from "../../../@/components/ui/form";
import { Input } from "../../../@/components/ui/input";
import FormCardContent from "./FormCardContent";
import ClientGender from "../../atoms/ClientGender";
import TypeClient from "../../atoms/ClientTypeSelect";
import { NumericInputForm } from "../../../components/atoms/NumericInputForm";
import ClientSectorsDropDown from "../../atoms/ClientSectorsDropDown";

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

                {/* Nom et Prenom + Profession */}
                <div className="flex space-x-4 text-whiteSecond">
                    <FormCardContent form={form} label="Nom et prénom" name={`${formId}.nomClient`} className="flex-1 text-highBlue">
                        <Input
                            className={`border font-oswald bg-normalGrey text-highBlue ${form.formState.errors[formId]?.telClient
                                    ? "border-red-500"
                                    : "border-normalGrey"
                                }`}
                            placeholder="Nom et prénom Client"
                            {...register(`${formId}.nomClient`)}
                        />
                    </FormCardContent>

                    <FormCardContent form={form} label="Profession / Secteur Activite" name={`${formId}.socialReason`} className="flex-1 text-highBlue">
                        <div className={`${form.formState.errors[formId]?.socialReason
                                ? "border border-red-500 rounded-md"
                                : ""
                            }`}>
                            <Controller
                                name={`${formId}.socialReason`}
                                control={control}
                                render={({ field }) => (
                                    <ClientSectorsDropDown
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}

                                    />
                                )}
                            />
                        </div>
                    </FormCardContent>
                </div>

                {/* Numero de tel + Email */}
                <div className="flex space-x-4 text-whiteSecond">
                    <FormCardContent form={form} label="Numéro de téléphone" name={`${formId}.telClient`} className="flex-1 text-highBlue">
                        <NumericInputForm
                            className={`border font-oswald bg-normalGrey text-highBlue ${form.formState.errors[formId]?.telClient
                                    ? "border-red-500"
                                    : "border-normalGrey"
                                }`}
                            placeholder="Numéro de téléphone"
                            {...register(`${formId}.telClient`)}
                            maxLength={8}
                        />
                    </FormCardContent>

                    <FormCardContent form={form} label="Numéro de téléphone 2" name={`${formId}.telClient2`} className="flex-1 text-highBlue">
                        <NumericInputForm
                            className="border border-normalGrey font-oswald bg-normalGrey text-highBlue"
                            placeholder="Numéro de téléphone 2"
                            {...register(`${formId}.telClient2`)}
                            maxLength={8}
                        />
                    </FormCardContent>

                </div>

                <div className="text-whiteSecond">
                    <FormCardContent form={form} label="Email" name={`${formId}.email`} className="flex-1 text-highBlue">
                        <Input
                            className="border border-normalGrey font-oswald bg-normalGrey text-highBlue"
                            placeholder="Email"
                            {...register(`${formId}.email`)}
                        />
                    </FormCardContent>
                </div>

                {/* Comment Cin */}
                {/*
                <div className="flex space-x-4 text-whiteSecond">
                    <FormCardContent form={form} label="Cin" name={`${formId}.cin`} className="flex-1">
                        <Input
                            className="border border-highBlue bg-bgColorLight text-highBlue"
                            placeholder="Cin"
                            {...register(`${formId}.cin`)}
                        />
                    </FormCardContent>
                </div>
                */}

                {/* Conditionally render Date of Birth */}

                {/*
                {clientType !== "Entreprise" && (
                    <div className="text-whiteSecond">
                        <FormCardContent form={form} label="Date de naissance" name={`${formId}.dateOfBirth`} className="flex-1">
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
                    </div>
                )}
                */}
            </div>
        </Form>
    );
};

export default ClientDataForm;
