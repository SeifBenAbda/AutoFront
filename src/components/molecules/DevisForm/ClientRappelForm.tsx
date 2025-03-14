import { Controller } from "react-hook-form";
import React from "react";
import {
    Form,
} from "../../../@/components/ui/form";
import FormCardContent from "./FormCardContent";
import { DatePicker } from "../../atoms/DateSelector";
import { Textarea } from "../../../@/components/ui/textarea";

const ClientRappelForm: React.FC<{ form: any; formId: string }> = ({ form, formId }) => {
    const { register, control } = form;
    const rappelCount = 1; // Adjust based on your needs

    return (
        <Form {...form} className="flex-1">
            <div className="w-full">
                

                {[...Array(rappelCount)].map((_, index) => (
                    <div key={index}>
                        {/* Rappel Date */}
                        <FormCardContent form={form} label={`Date Rappel N°${index + 1}`} name={`${formId}[${index}].RappelDate`} >
                            <Controller
                                name={`${formId}[${index}].RappelDate`}
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        value={field.value}
                                        onChange={(value)=> {
                                            console.log(value);
                                            field.onChange(value)
                                        }}
                                        fromYear={new Date().getFullYear()}
                                        toYear={new Date().getFullYear() + 1}
                                    />
                                )}
                            />
                        </FormCardContent>

                        <FormCardContent form={form} label="Contenu de rappel" name={`${formId}[${index}].RappelContent`} className="flex-1 text-highBlue">
                            <Textarea
                                className="border border-normalGrey font-oswald bg-normalGrey min-h-[70px] text-highBlue"
                                placeholder="Contenu de rappel.."
                                name={`${formId}[${index}].RappelContent`}
                                {...register(`${formId}[${index}].RappelContent`)}
                            />
                        </FormCardContent>
                    </div>
                ))}

            </div>
        </Form>
    );
};

export default ClientRappelForm;
