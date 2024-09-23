import StatusDevisDropDown from "../../../components/atoms/StatusDevis";
import { Card, CardContent, CardTitle } from "../../../@/components/ui/card";
import { Devis } from "@/types/devisTypes";
import PayementMethod from "../../../components/atoms/PayementMethod";
import { Input } from "../../../@/components/ui/input";
import BanksLeasingDropDown from "../../../components/atoms/BanksLeasingDropDown";
import { Textarea } from "../../../@/components/ui/textarea";
import MotifClientSelect from "../../../components/atoms/MotifClientSelect";

interface DevisCardProps {
    devis: Devis;
    onUpdate: (updatedDevis: Devis) => void;
}

export function DevisDetaillsCard({ devis, onUpdate }: DevisCardProps) {

    const handleChange = (field: keyof Devis, value: string | Date | undefined) => {
        onUpdate({
            ...devis,
            [field]: value,
        });
    };

    return (

        <Card className="bg-lightWhite border border-lightWhite flex flex-col overflow-y-scroll">

            {/* Centered Devis N° */}
            <div className="flex justify-center w-full">
                <CardTitle className="text-2xl text-highGrey font-oswald mt-4 mb-3">
                    Devis N° {devis.DevisId}
                </CardTitle>
            </div>

            {/* Status DropDown */}
            <div className="flex flex-row justify-between">
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey">Status</label>
                    <StatusDevisDropDown
                        value={devis.StatusDevis}
                        onChange={(value) => handleChange("StatusDevis", value)}
                        isFiltring={false}
                    />
                </CardContent>

                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey">Motif</label>
                    <MotifClientSelect
                        value={devis.Motivation}
                        onChange={(value) => handleChange("Motivation", value)}
                    />
                </CardContent>
            </div>

            {/* Conditionally render ReasonAnnulation based on StatusDevis */}
            {devis.StatusDevis === "Annuler" && (
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey">Raison de l'annulation</label>
                    <Input
                        type="text"
                        value={devis.ReasonAnnulation || ""}
                        onChange={(e) =>
                            handleChange("ReasonAnnulation", e.target.value)
                        }
                        placeholder="Raison de l'annulation"
                        className="mt-1 p-2 mr-2 block border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>
            )}

            {devis.StatusDevis === "Facture" && (
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey">Numero de Facture</label>
                    <Input
                        type="text"
                        value={devis.NumFacture || ""}
                        onChange={(e) =>
                            handleChange("NumFacture", e.target.value)
                        }
                        className="mt-1 p-2 mr-2 block border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>
            )}

            {/* Payement Type */}
            {devis.StatusDevis !== "Annuler" &&
                <>
                    <CardTitle className="text-xl text-highGrey font-oswald text-left w-full pl-3 mb-2">Paiements</CardTitle>

                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-highGrey mb-1">Type de Payement</label>
                        <PayementMethod
                            value={devis.PayementMethod}
                            onChange={(value) => handleChange("PayementMethod", value)}
                        />
                    </CardContent>

                    {/* Conditionally render additional payment details based on PayementMethod */}
                    {(devis.PayementMethod === "Bank" || devis.PayementMethod === "Leasing") && (
                        <CardContent className="w-full mb-2">
                            {/* Add the fields related to Bank or Leasing payment details here */}
                            <label className="block text-sm font-medium text-highGrey mb-1">Banque et Leasing</label>
                            <BanksLeasingDropDown
                                value={devis.BankAndLeasing}
                                onChange={(value) => handleChange("BankAndLeasing", value)}
                            />
                        </CardContent>
                    )}

                    <CardTitle className="text-xl text-highGrey font-oswald text-left w-full pl-3 mb-2">Plus d'Informations</CardTitle>
                    <CardContent className="w-full">
                        <Textarea
                            maxLength={200}
                            value={devis.Comments || ""}
                            onChange={(e) =>
                                handleChange("Comments", e.target.value)
                            }
                            className="mt-1 p-2 mr-2 block border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm overflow-y-auto max-h-[100px]"
                        />
                    </CardContent>
                </>}

        </Card>

    )
}
