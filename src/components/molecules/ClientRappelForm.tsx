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
import { DatePicker } from "../atoms/DataSelector";
import PriorityDevisDropDown from "../atoms/PriorityDropDown";

const ClientRappelForm: React.FC<{ form: any; formId: string ,devisFormId:string }> = ({ form, formId , devisFormId}) => {
    const { register, control } = form;
    const rappelCount = 3; // Adjust based on your needs

    return (
        <Form {...form} className="flex-1">
            <div className="pl-3 mt-2 font-oswald text-lg mb-2">Rappels</div>
            <div className="w-full">

                {[...Array(rappelCount)].map((_, index) => (
                    <React.Fragment key={index}>
                        {/* Rappel Date */}
                        <FormCardContent form={form} label={`Date Rappel N°${index + 1}`} name={`${formId}[${index}].RappelDate`}>
                            <Controller
                                name={`${formId}[${index}].RappelDate`}
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        fromYear={new Date().getFullYear()}
                                        toYear={new Date().getFullYear() + 1}
                                    />
                                )}
                            />
                        </FormCardContent>
                    </React.Fragment>
                ))}

                {/* Priority */}
                <FormCardContent form={form} label="Priorité" name={`${devisFormId}.PriorityDevis`}>
                    <Controller
                        name={`${devisFormId}.PriorityDevis`}
                        control={control}
                        render={({ field }) => (
                            <PriorityDevisDropDown
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                isFiltring={false}
                            />
                        )}
                    />
                </FormCardContent>

            </div>
        </Form>
    );
};

export default ClientRappelForm;
