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
import PriorityDevisDropDown from "../atoms/PriorityDropDown";

const ClientExtraForm: React.FC<any> = ({ form, formId, generalFormId }) => {
    const { register, control } = form;

    return (
        <Form {...form} className="flex-1">
            <div className="w-full space-y-4">
                {/* Old Car and Preferred Model */}
                <div className="flex flex-col md:flex-row gap-4 text-whiteSecond">
                    <div className="flex-1">
                        <FormCardContent form={form} label="Ancien Vehicule" name={`${formId}.OldCar`}>
                            <Input
                                className="border border-lightWhite bg-lightWhite text-highGrey"
                                placeholder="Ancien Vehicule"
                                {...register(`${formId}.OldCar`)}
                            />
                        </FormCardContent>
                    </div>
                    <div className="flex-1">
                        <FormCardContent form={form} label="Modèle préféré" name={`${formId}.CarModel`} className="flex-1">
                            <Controller
                                name={`${formId}.CarModel`}
                                control={control}
                                render={({ field }) => (
                                    <CarsDropDown
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        isFiltring={false}
                                    />
                                )}
                            />
                        </FormCardContent>
                    </div>
                </div>

                {/* Motif and Source */}
                <div className="flex flex-col md:flex-row gap-4 text-whiteSecond">
                    <div className="flex-1">
                        <FormCardContent form={form} label="Motif" name={`${generalFormId}.Motivation`} className="flex-1">
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
                    </div>
                    <div className="flex-1">
                        <FormCardContent form={form} label="Source" name={`${generalFormId}.Source`} className="flex-1">
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
                    </div>
                </div>

                {/* Delivery Date */}
                {/*
                <FormCardContent form={form} label="Date de livraison prévue" name={`${generalFormId}.ScheduledLivDate`}>
                    <Controller
                        name={`${generalFormId}.ScheduledLivDate`}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear() + 2}
                            />
                        )}
                    />
                </FormCardContent>
                */}
                {/* Priority */}
                <FormCardContent form={form} label="Priorité" name={`${generalFormId}.PriorityDevis`}>
                    <Controller
                        name={`${generalFormId}.PriorityDevis`}
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

                <div className="pl-3 mt-2 font-oswald text-lg mb-2 text-white">Paiements</div>

                {/* Payment Method */}
                <div className="text-whiteSecond">
                <FormCardContent form={form} label="Moyen de Payement" name={`${generalFormId}.PayementMethod`} className="flex-1">
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

                
            </div>
        </Form>
    );
};

export default ClientExtraForm;
