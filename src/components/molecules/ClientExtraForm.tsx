
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
import MotifClientSelect from "../atoms/MotifClientSelect";
import ClientSourceSelect from "../atoms/ClientSourceSelect";
import PayementMethod from "../atoms/PayementMethod";
import CarsDropDown from "../atoms/CarsDropDown";
import { DatePicker } from "../atoms/DataSelector";


const ClientExtraForm: React.FC<any> = ({   form, formId ,generalFormId }) => {
    const { register, control, watch } = form ;

    return (
        <Form {...form} className="flex-1">
            <div className="pl-3 mt-2 font-oswald text-lg mb-2">Infos supplémentaires</div>
            <div className="w-full">
                {/* Old Car Input */}
                <FormCardContent form={form} label="Ancien Vehicule" name={`${formId}.OldCar`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Ancien Vehicule"
                        {...register(`${formId}.OldCar`)}
                    />
                </FormCardContent>


                {/* Prefered Car Select */}
                <FormCardContent form={form} label="Modèle préféré" name={`${formId}.carModel`}>
                    <Controller
                        name={`${formId}.CarModel`}
                        control={control}
                        render={({ field }) => (
                            <CarsDropDown
                                value={field.value} // Pass the current model value
                                onChange={(value) => field.onChange(value)}
                                isFiltring={false}
                            />
                        )}
                    />
                </FormCardContent>


                {/* Motif */}
                <FormCardContent form={form} label="Motif" name={`${generalFormId}.Motivation`}>
                    <Controller
                        name={`${generalFormId}.Motivation`}
                        control={control}
                        render={({ field }) => (
                            <MotifClientSelect
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        )}
                    />
                </FormCardContent>


                {/* Source */}
                <FormCardContent form={form} label="Source" name={`${generalFormId}.Source`}>
                    <Controller
                        name={`${generalFormId}.Source`}
                        control={control}
                        render={({ field }) => (
                            <ClientSourceSelect
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        )}
                    />
                </FormCardContent>

                <FormCardContent form={form} label="Date de livraison prévue" name={`${generalFormId}.ScheduledLivDate`}>
                    <Controller
                        name={`${generalFormId}.ScheduledLivDate`}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear()+2}
                            />
                        )}
                    />
                </FormCardContent>

                      

                <div className="pl-3 mt-2 font-oswald text-lg mb-2">Paiements</div>

                {/* Moyen Paiement */}
                <FormCardContent form={form} label="Moyen de Payement" name={`${generalFormId}.PayementMethod`}>
                    <Controller
                        name={`${generalFormId}.PayementMethod`}
                        control={control}
                        render={({ field }) => (
                            <PayementMethod
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        )}
                    />
                </FormCardContent>
            </div>
        </Form>
    )

};


export default ClientExtraForm