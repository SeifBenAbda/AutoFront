import { Controller, useWatch } from "react-hook-form";
import React, { useEffect } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../@/components/ui/form";
import { Input } from "../../../@/components/ui/input";
import FormCardContent from "./FormCardContent";
import MotifClientSelect from "../../atoms/MotifClientSelect";
import ClientSourceSelect from "../../atoms/ClientSourceSelect";
import PayementMethod from "../../atoms/PayementMethod";
import CarsDropDown from "../../atoms/CarsDropDown";
import PriorityDevisDropDown from "../../atoms/PriorityDropDown";
import RegionDropDown from "../../atoms/RegionDropDown";
import BanksLeasingDropDown from "../../atoms/BanksLeasingDropDown";
import { Textarea } from "../../../@/components/ui/textarea";

interface ClientExtraFormProps {
    form: any; // Keep the any type since that's what you're using
    formId: string;
    generalFormId: string;
    payementFormId: string;
}

const ClientExtraForm: React.FC<ClientExtraFormProps> = ({
    form,
    formId,
    generalFormId,
    payementFormId
}) => {
    const { register, control } = form;

    // Watch for changes in the PaymentMethod field
    const paymentMethod = useWatch({
        control,
        name: `${payementFormId}.PaymentMethod`
    });

    // Reset bank fields when payment method changes to Comptant or FCR
    // Modify your useEffect to properly reset the fields
    useEffect(() => {
        if (paymentMethod === "Comptant" || paymentMethod === "FCR") {
            form.unregister(`${payementFormId}.BankRegion`);
            form.unregister(`${payementFormId}.BankAndLeasing`);
        }
    }, [paymentMethod, form, payementFormId]);

    const showBankFields = paymentMethod === "Banque" || paymentMethod === "Leasing";

    return (
        <Form {...form} className="flex-1">
            <div className="w-full space-y-4">
                {/* Old Car and Preferred Model */}
                <div className="flex flex-col md:flex-row gap-4 text-whiteSecond">
                    <div className="flex-1">
                        <FormCardContent form={form} label="Ancien Vehicule" name={`${formId}.OldCar`}>
                            <Input
                                className="border border-lightWhite bg-lightWhite text-highBlue"
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

                {/* More Infos */}
                <FormCardContent form={form} label="Plus d'informations véhicule" name={`${formId}.CarNotes`}>
                    <Textarea
                        className="border border-lightWhite bg-lightWhite text-highBlue"
                        placeholder="Plus d'informations véhicule"
                        {...register(`${formId}.CarNotes`)}
                    />
                </FormCardContent>
                <div className="pl-3 mt-2 font-oswald text-lg mb-2 text-white">Paiements</div>

                {/* Payment Method */}
                <div className="text-whiteSecond">
                    <FormCardContent form={form} label="Moyen de Payement" name={`${payementFormId}.PaymentMethod`} className="flex-1">
                        <Controller
                            name={`${payementFormId}.PaymentMethod`}
                            control={control}
                            defaultValue="Comptant"
                            render={({ field }) => (
                                <PayementMethod
                                    value={field.value}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        // If switching to Comptant or FCR, ensure bank fields are cleared
                                        if (value === "Comptant" || value === "FCR") {
                                            form.unregister(`${payementFormId}.BankRegion`);
                                            form.unregister(`${payementFormId}.BankAndLeasing`);
                                        }
                                    }}
                                />
                            )}
                        />
                    </FormCardContent>
                </div>
                {/* Bank and Region fields */}
                {showBankFields && (
                    <div className="flex flex-col md:flex-row gap-4 text-whiteSecond">
                        <FormCardContent form={form} label="Banque et Leasing" name={`${payementFormId}.BankAndLeasing`} className="flex-1">
                            <Controller
                                name={`${payementFormId}.BankAndLeasing`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <BanksLeasingDropDown
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            // Ensure the form value is updated
                                            form.setValue(`${payementFormId}.BankAndLeasing`, value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }}
                                    />
                                )}
                            />
                        </FormCardContent>

                        <FormCardContent form={form} label="Region Banque ou Leasing" name={`${payementFormId}.BankRegion`} className="flex-1">
                            <Controller
                                name={`${payementFormId}.BankRegion`}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <RegionDropDown
                                        value={field.value}
                                        onChange={(value) => {
                                            field.onChange(value);
                                            // Ensure the form value is updated
                                            form.setValue(`${payementFormId}.BankRegion`, value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }}
                                        isFiltring={false}
                                    />
                                )}
                            />
                        </FormCardContent>
                    </div>
                )}
            </div>
        </Form>
    );
};

export default ClientExtraForm;