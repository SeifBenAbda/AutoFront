import StatusDevisDropDown from "../../../components/atoms/StatusDevis";
import { Card, CardContent, CardTitle } from "../../../@/components/ui/card";
import { Devis } from "@/types/devisTypes";
import PayementMethod from "../../../components/atoms/PayementMethod";
import { Input } from "../../../@/components/ui/input";
import BanksLeasingDropDown from "../../../components/atoms/BanksLeasingDropDown";
import { Textarea } from "../../../@/components/ui/textarea";
import MotifClientSelect from "../../../components/atoms/MotifClientSelect";
import RegionDropDown from "../../../components/atoms/RegionDropDown";
import { Label } from "../../../@/components/ui/label";
import { DatePicker } from "../../../components/atoms/DataSelector";

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

    const handleDateChange = (date: Date | undefined) => {
        onUpdate({
            ...devis,
            ReservationDate: date || devis.ReservationDate,
        });
    };

    return (

        <Card className="bg-lightWhite border border-lightWhite flex flex-col ">

            {/* Centered Devis N° */}
            <div className="flex justify-center w-full">
                <CardTitle className="text-2xl text-highGrey2 font-oswald mt-4 mb-3">
                    Devis N° {devis.DevisId}
                </CardTitle>
            </div>

            {/* Status DropDown */}
            <div className="flex flex-row justify-between">
                <CardContent className="w-full">
                    <Label className=" text-sm font-medium text-highGrey2">Status</Label>
                    <StatusDevisDropDown
                        value={devis.StatusDevis}
                        onChange={(value) => handleChange("StatusDevis", value)}
                        isFiltring={false}
                    />
                </CardContent>

                <CardContent className="w-full">
                    <Label className=" text-sm font-medium text-highGrey2">Motif</Label>
                    <MotifClientSelect
                        value={devis.Motivation}
                        onChange={(value) => handleChange("Motivation", value)}
                    />
                </CardContent>
            </div>

            {/* Conditionally render ReasonAnnulation based on StatusDevis */}
            {devis.StatusDevis === "Annuler" && (
                <CardContent className="w-full">
                    <Label className=" text-sm font-medium text-highGrey2">Raison de l'annulation</Label>
                    <Input
                        type="text"
                        value={devis.ReasonAnnulation || ""}
                        onChange={(e) =>
                            handleChange("ReasonAnnulation", e.target.value)
                        }
                        placeholder="Raison de l'annulation"
                        className="mt-1 p-2 mr-2  border border-highGrey2 rounded-md  sm:text-sm"
                    />
                </CardContent>
            )}

            {devis.StatusDevis === "Facture" && (
                <CardContent className="w-full">
                    <Label className=" text-sm font-medium text-highGrey2">Numero de Facture</Label>
                    <Input
                        type="text"
                        value={devis.NumFacture || ""}
                        onChange={(e) =>
                            handleChange("NumFacture", e.target.value)
                        }
                        className="mt-1 p-2 mr-2  border border-highGrey2   sm:text-sm"
                    />
                </CardContent>
            )}

            {/* Payement Type */}
            {devis.StatusDevis !== "Annuler" && devis.StatusDevis !== "En Cours" && devis.StatusDevis !== "En Attente" &&
                <>
                    <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full pl-3 mb-2">Paiements</CardTitle>

                    <CardContent className="w-full">
                        <Label className=" text-sm font-medium text-highGrey2 mb-1">Type de Payement</Label>
                        <PayementMethod
                            value={devis.PayementMethod}
                            onChange={(value) => handleChange("PayementMethod", value)}
                        />
                    </CardContent>

                    {/* Conditionally render additional payment details based on PayementMethod */}
                    {(devis.PayementMethod === "Bank" || devis.PayementMethod === "Leasing") && (
                        <div className="flex gap-4 w-full">
                            <CardContent className="w-1/2 ">
                                <Label className=" text-sm font-medium text-highGrey2 mb-1">Banque et Leasing</Label>
                                <BanksLeasingDropDown
                                    value={devis.BankAndLeasing}
                                    onChange={(value) => handleChange("BankAndLeasing", value)}
                                />
                            </CardContent>

                            <CardContent className="w-1/2">
                                <Label className=" text-sm font-medium text-highGrey2 mb-1">Region Banque ou Leasing</Label>
                                <RegionDropDown
                                    value={devis.BankRegion || ""}
                                    onChange={(value) => handleChange("BankRegion", value)}
                                    isFiltring={false}
                                />
                            </CardContent>
                        </div>
                    )}

                    <div className="flex gap-4 w-full">
                        <CardContent className="w-1/2 ">
                            <Label className=" text-sm font-medium text-highGrey2 ">Numero Commande</Label>
                            <Input
                                type="text"
                                value={devis.NumBc || ""}
                                onChange={(e) =>
                                    handleChange("NumBc", e.target.value)
                                }
                                className=" p-2 mr-2  border border-highGrey2 rounded-md sm:text-sm caret-highGrey2"
                            />
                        </CardContent>

                        <CardContent className="w-1/2 ">
                            <Label className=" relative text-sm font-medium text-highGrey2 ">Montant (DT)</Label>
                            <Input
                                type="text"
                                value={devis.MontantDevis || ""}
                                onChange={(e) =>
                                    handleChange("MontantDevis", e.target.value)
                                }
                                className=" p-2 mr-2  border border-highGrey2 rounded-md sm:text-sm "
                            />
                        </CardContent>

                    </div>



                </>}



            {/* NEW FIELDS : Responsable */}
            {devis.StatusDevis == "Reserver" && (
                <>
                    <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full pl-3 mb-2 ">Responsable</CardTitle>
                    <div className="flex gap-4 w-full">
                        <CardContent className="w-full">
                            <Label className=" relative text-sm font-medium text-highGrey2 ">Nom Responsable</Label>
                            <Input
                                type="text"
                                value={devis.Responsable || ""}
                                onChange={(e) =>
                                    handleChange("Responsable", e.target.value)
                                }
                                className=" p-2 mr-2  border border-highGrey2 rounded-md sm:text-sm "
                            />
                        </CardContent>

                        <CardContent className="w-full">
                            <Label className=" relative text-sm font-medium text-highGrey2 ">Tel. Responsable</Label>
                            <Input
                                type="text"
                                value={devis.ResponsableNum || ""}
                                onChange={(e) =>
                                    handleChange("ResponsableNum", e.target.value)
                                }
                                className=" p-2 mr-2  border border-highGrey2 rounded-md sm:text-sm "
                            />
                        </CardContent>
                    </div>

                    <CardContent>
                        <Label className=" relative text-sm font-medium text-highGrey2 ">Date de Reservation</Label>
                        <DatePicker
                            value={devis.ReservationDate || new Date()}
                            onChange={handleDateChange}
                            fromYear={new Date().getFullYear()}
                            toYear={new Date().getFullYear() + 1}
                        />
                    </CardContent>

                </>
            )}

            {/* End New Fields */}

            <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full pl-3 ">Plus d'Informations</CardTitle>
            <CardContent className="w-full">
                <Textarea
                    maxLength={200}
                    value={devis.Comments || ""}
                    onChange={(e) =>
                        handleChange("Comments", e.target.value)
                    }
                    className="p-2 mr-2  border border-highGrey2 rounded-md  sm:text-sm overflow-y-auto max-h-[100px]"
                />
            </CardContent>


        </Card>

    )
}
