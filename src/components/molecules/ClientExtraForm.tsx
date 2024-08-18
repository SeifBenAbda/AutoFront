
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
import CarModelSelect from "../atoms/CarModelSelect";
import MotifClientSelect from "../atoms/MotifClientSelect";
import ClientSourceSelect from "../atoms/ClientSourceSelect";
import PayementMethod from "../atoms/PayementMethod";


const ClientExtraForm: React.FC<any> = ({ form, formId }) => {
    const { register, control, watch } = form;


    return (
        <Form {...form} className="flex-1">
            <div className="pl-3 mt-2 font-oswald text-lg mb-2">Infos supplémentaires</div>
            <div className="w-full">
                {/* Old Car Input */}
                <FormCardContent form={form} label="Ancien Vehicule" name={`${formId}.oldCar`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Ancien Vehicule"
                        {...register(`${formId}.oldCar`)}
                    />
                </FormCardContent>


                {/* Prefered Car Select */}
                <FormCardContent form={form} label="Modèle préféré" name={`${formId}.carModel`}>
                <Controller
                        name={`${formId}.carModel`}
                        control={control}
                        render={({ field }) => (
                            <CarModelSelect
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        )}
                    />
                </FormCardContent>
                
                
                {/* Motif */}
                <FormCardContent form={form} label="Motif" name={`${formId}.motif`}>
                <Controller
                        name={`${formId}.motif`}
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
                <FormCardContent form={form} label="Source" name={`${formId}.source`}>
                <Controller
                        name={`${formId}.source`}
                        control={control}
                        render={({ field }) => (
                            <ClientSourceSelect
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        )}
                    />
                </FormCardContent>



                <div className="pl-3 mt-2 font-oswald text-lg mb-2">Paiements</div>
                
                {/* Moyen Paiement */}
                <FormCardContent form={form} label="Moyen de Payement" name={`${formId}.payementMethod`}>
                <Controller
                        name={`${formId}.payementMethod`}
                        control={control}
                        render={({ field }) => (
                            <PayementMethod
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            />
                        )}
                    />
                </FormCardContent>
                

                <FormCardContent form={form} label="Avance Payement" name={`${formId}.avancePayement`}>
                    <Input
                        className="border border-bluePrimary"
                        placeholder="Avance Payement"
                        {...register(`${formId}.avancePayement`)}
                    />
                </FormCardContent>

            </div>
        </Form>
    )

};


export default ClientExtraForm