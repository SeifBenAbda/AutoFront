
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
import { Textarea } from "../../@/components/ui/textarea";
import PriorityDevisDropDown from "../atoms/PriorityDropDown";


const ClientRappelForm: React.FC<any> = ({ form, formId }) => {
    const { register, control, watch } = form;


    return (
        <Form {...form} className="flex-1">
            <div className="pl-3 mt-2 font-oswald text-lg mb-2">Rappels</div>
            <div className="w-full">


                {/* Rappel 1 Date */}
                <FormCardContent form={form} label="Date Rappel N°1" name={`${formId}.rp1`}>
                    <Controller
                        name={`${formId}.rp1`}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear()+1}
                            />
                        )}
                    />
                </FormCardContent>


                {/* Rappel 2 Date */}
                <FormCardContent form={form} label="Date Rappel N°2" name={`${formId}.rp2`}>
                    <Controller
                        name={`${formId}.rp2`}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear()+1}
                            />
                        )}
                    />
                </FormCardContent>



                {/* Rappel 3 Date */}
                <FormCardContent form={form} label="Date Rappel N°3" name={`${formId}.rp3`}>
                    <Controller
                        name={`${formId}.rp3`}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear()+1}
                            />
                        )}
                    />
                </FormCardContent>

                {/* Nore Infos about Adress */}
                <FormCardContent form={form} label="Notes" name={`${formId}.rappelNotes`}>
                    <Textarea
                        className="border border-bluePrimary min-h-[70px]"
                        placeholder="Notes.."
                        {...register(`${formId}.rappelNotes`)}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Priorité" name={`${form}.PriorityDevis`}>
                    <Controller
                        name={`${form}.PriorityDevis`}
                        control={control}
                        render={({ field }) => (
                            <PriorityDevisDropDown
                                value={field.value}
                                onChange={(value) => field.onChange(value)} isFiltring={false}                            />
                        )}
                    />
                </FormCardContent>

                
            </div>
        </Form>
    )

};


export default ClientRappelForm