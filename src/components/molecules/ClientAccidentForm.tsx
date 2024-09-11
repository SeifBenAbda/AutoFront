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
                        className="border border-highGrey bg-lightWhite"
                        placeholder="Voiture Ancienne"
                        {...register(`${formId}.OldCar`)}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Immatriculation" name={`${formId}.Immatriculation`}>
                    <Input
                        className="border border-highGrey bg-lightWhite"
                        placeholder="Immatriculation"
                        {...register(`${formId}.Immatriculation`)}
                    />
                </FormCardContent> 

                <div className="pl-3 mb-2  font-oswald text-lg  text-white">Voiture accidentée</div>

                <FormCardContent form={form} label="Nom Expert" name={`${formId}.NomExpert`}>
                    <Input
                        className="border border-highGrey bg-lightWhite"
                        placeholder="Nom Expert"
                        {...register(`${formId}.NomExpert`)}
                    />
                </FormCardContent> 



                <FormCardContent form={form} label="Email Expert" name={`${formId}.MailExpert`}>
                    <Input
                        className="border border-highGrey bg-lightWhite"
                        placeholder="Email Expert"
                        {...register(`${formId}.MailExpert`)}
                    />
                </FormCardContent> 



                <FormCardContent form={form} label="Tel Expert" name={`${formId}.PhoneExpert`}>
                    <Input
                        className="border border-highGrey bg-lightWhite"
                        placeholder="Tel Expert"
                        {...register(`${formId}.PhoneExpert`)}
                    />
                </FormCardContent> 

                <FormCardContent form={form} label="Commentaire N°1" name={`${formId}.CommentOne`}>
                    <Textarea
                        className="border border-highGrey bg-lightWhite min-h-[70px]"
                        placeholder="Commentaire N°1"
                        {...register(`${formId}.CommentOne`)}
                    />
                </FormCardContent>


                <FormCardContent form={form} label="Commentaire N°2" name={`${formId}.CommentTwo`}>
                    <Textarea
                        className="border border-highGrey bg-lightWhite min-h-[70px]"
                        placeholder="Commentaire N°2"
                        {...register(`${formId}.CommentTwo`)}
                    />
                </FormCardContent>


                <FormCardContent form={form} label="Commentaire N°3" name={`${formId}.CommentThree`}>
                    <Textarea
                        className="border border-highGrey bg-lightWhite min-h-[70px]"
                        placeholder="Commentaire N°3"
                        {...register(`${formId}.CommentThree`)}
                    />
                </FormCardContent>

            </div>
        </Form>
    );
};

export default ClientAccidentForm;
