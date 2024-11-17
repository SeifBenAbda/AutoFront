import { Label } from "../../../@/components/ui/label";
import { CardContent, CardTitle } from "../../../@/components/ui/card";
import { Devis, DevisFacture, DevisPayementDetails, DevisReserved } from "../../../types/devisTypes";
import StatusDevisDropDown from "../../../components/atoms/StatusDevis";
import MotifClientSelect from "../../../components/atoms/MotifClientSelect";
import PriorityDevisDropDown from "../../../components/atoms/PriorityDropDown";
import BanksLeasingDropDown from "../../../components/atoms/BanksLeasingDropDown";
import RegionDropDown from "../../../components/atoms/RegionDropDown";
import { Input } from "../../../@/components/ui/input";
import PayementMethod from "../../../components/atoms/PayementMethod";
import { DatePicker } from "../../../components/atoms/DataSelector";
import { useEffect } from "react";


interface DevisGlobalDetailsProps {
    devis: Devis;
    isAdmin: boolean;
    onUpdate: (updatedDevis: Devis) => void;
}

export function DevisGlobalDetails({ devis, isAdmin, onUpdate }: DevisGlobalDetailsProps) {


    //fetching functions 
    const fetchNumBonCommande = async () => {
        try {
            const response = await fetch('/your-endpoint'); // Replace with your actual endpoint
            const numBonCommande = response?.json();
            handleChangedevisReserved("NumBonCommande", await numBonCommande || "");
        } catch (error) {
            console.error('Failed to fetch Numéro Bon de Commande:', error);
        }
    };

    const handleChange = (field: keyof Devis, value: string | Date | undefined) => {
        onUpdate({
            ...devis,
            [field]: value,
        });
    };

    const handleStatusChange = (value: string) => {
        handleChange("StatusDevis", value);

        if (value === "Réservé") {
           // fetchNumBonCommande();
        }
    };


    const handleDateReservationChange = (date: Date | undefined) => {
        onUpdate({
            ...devis,
            devisReserved: {
                ...devis.devisReserved,
                DateReservation: date || null
            }
        });
    };

    const handleChangedevisReserved = (field: keyof DevisReserved, value: string) => {
        onUpdate({
            ...devis,
            devisReserved: {
                ...devis.devisReserved,
                [field]: value,
            },
        });
    }

    const handleChangedevisPayementDetails = (field: keyof DevisPayementDetails, value: string) => {
        onUpdate({
            ...devis,
            devisPayementDetails: {
                ...devis.devisPayementDetails,
                [field]: value,
            },
        });
    }

    const handleChangedevisFacture = (field: keyof DevisFacture, value: string) => {
        onUpdate({
            ...devis,
            devisFacture: {
                ...devis.devisFacture,
                [field]: value,
            },
        });
    }


    const TruncatedDropdownField = ({ label, children }: any) => (
        <div className="relative group">
            <Label
                className="text-sm font-medium text-highGrey2 mb-1 block truncate"
                title={label}
            >
                {label}
            </Label>
            <span className="absolute bottom-full left-0 mb-1 hidden w-max px-2 py-1 bg-black text-white text-xs rounded group-hover:block z-10">
                {label}
            </span>
            <div className="w-full">
                {children}
            </div>
        </div>
    );

    const globalDevisSettings = () => {
        return (
            <>
                <div className="flex flex-col max-[700px]:flex-col sm:flex-col md:flex-row justify-between gap-4">
                    <CardContent className="w-full">
                        <Label className="text-sm font-oswald text-highGrey2">Status</Label>
                        <StatusDevisDropDown
                            value={devis.StatusDevis}
                            onChange={(value) => handleStatusChange(value)}
                            isFiltring={false}
                        />
                    </CardContent>

                    {/** 
                 <CardContent className="w-full">
                    <Label className="text-sm font-oswald text-highGrey2">Motif</Label>
                    <MotifClientSelect
                        value={devis.Motivation}
                        onChange={(value) => handleChange("Motivation", value)}
                    />
                    </CardContent>
                */}

                    <CardContent className="w-full">
                        <Label className="text-sm font-oswald text-highGrey2">Priorité</Label>
                        <PriorityDevisDropDown
                            value={devis.PriorityDevis}
                            onChange={(value) => handleChange("PriorityDevis", value)}
                            isFiltring={false}
                        />
                    </CardContent>


                </div>
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
            </>
        );
    };




    const payementSettings = () => {
        return (
            <>
                <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full pl-3 mb-2 mt-2">Paiements</CardTitle>
                <div className="flex md:gap-4 lg:gap-4 w-full sm:flex-col md:flex-row min-[400px]:flex-col">
                    <CardContent className="sm:w-full w-1/2 min-[400px]:w-full">
                        <TruncatedDropdownField label="Type de paiement">

                            <PayementMethod
                                value={devis.devisPayementDetails.PaymentMethod}
                                onChange={(value) => handleChangedevisPayementDetails("PaymentMethod", value)}
                            />
                        </TruncatedDropdownField>
                    </CardContent>

                    <CardContent className="sm:w-full w-1/2 flex flex-col overflow-hidden min-[400px]:w-full">
                        <TruncatedDropdownField label=" Montant (DT)">

                            <Input
                                type="text"
                                value={devis.devisPayementDetails.TotalTTC || ""}
                                onChange={(e) => handleChangedevisPayementDetails("TotalTTC", e.target.value)}
                                className="w-full p-2 border border-highGrey2 rounded-md sm:text-sm"
                            />
                        </TruncatedDropdownField>
                    </CardContent>
                </div>



                {/* Conditionally render additional payment details based on PayementMethod */}
                {(devis.devisPayementDetails.PaymentMethod === "Banque" || devis.devisPayementDetails.PaymentMethod === "Leasing") && (
                    <div className="flex md:gap-4 lg:gap-4  w-full sm:flex-col md:flex-row min-[400px]:flex-col">
                        <CardContent className="w-1/2 sm:w-full min-[400px]:w-full">
                            <TruncatedDropdownField label="Banque et Leasing">
                                <BanksLeasingDropDown
                                    value={devis.devisPayementDetails.BankAndLeasing}
                                    onChange={(value) => handleChangedevisPayementDetails("BankAndLeasing", value)}
                                />
                            </TruncatedDropdownField>
                        </CardContent>

                        <CardContent className="w-1/2 sm:w-full min-[400px]:w-full">
                            <TruncatedDropdownField label="Region Banque ou Leasing">
                                <RegionDropDown
                                    value={devis.devisPayementDetails.BankRegion || ""}
                                    onChange={(value) => handleChangedevisPayementDetails("BankRegion", value)}
                                    isFiltring={false}
                                />
                            </TruncatedDropdownField>
                        </CardContent>
                    </div>

                )}

                {devis.StatusDevis === "Facturé" && (
                    <CardContent className="w-full">
                        <Label className=" text-sm font-medium text-highGrey2">Numéro de Facture</Label>
                        <Input
                            type="text"
                            value={devis.devisFacture.FactureNumero || ""}
                            onChange={(e) =>
                                handleChangedevisFacture("FactureNumero", e.target.value)
                            }
                            className="mt-1 p-2 mr-2  border border-highGrey2   sm:text-sm"
                        />
                    </CardContent>
                )}

                {devis.StatusDevis === "Réservé" &&

                    (<div className="flex gap-4 w-full">
                        <CardContent className="sm:w-full w-1/2 flex flex-col overflow-hidden">
                            <Label
                                className="text-sm font-medium text-highGrey2 mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
                                title="Numéro Bon de Commande" // Full text here
                            >
                                Numéro Bon de Commande
                            </Label>
                            <Input
                                type="text"
                                value={devis.devisReserved?.NumBonCommande ?? ""}
                                onChange={(e) => handleChangedevisReserved("NumBonCommande", e.target.value)}
                                className="w-full p-2 border border-highGrey2 rounded-md sm:text-sm caret-highGrey2"
                            />
                        </CardContent>

                        {isAdmin && (
                            <CardContent>
                                <Label className="relative text-sm font-medium text-highGrey2">Date de Réservation</Label>
                                <DatePicker
                                    value={devis.devisReserved?.DateReservation ?? new Date()}
                                    onChange={handleDateReservationChange}
                                    fromYear={new Date().getFullYear()}
                                    toYear={new Date().getFullYear() + 1}
                                />
                            </CardContent>
                        )}

                    </div>)}



            </>
        )
    }

    const responsableSettings = () => {
        return (
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
                        <Label className=" relative text-sm font-medium text-highGrey2 ">Tél. Responsable</Label>
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

                {devis.StatusDevis === "Réservé" && (<CardContent>
                    <Label className=" relative text-sm font-medium text-highGrey2 ">Date de Réservation</Label>
                    <DatePicker
                        value={devis.devisReserved?.DateReservation ?? new Date()}
                        onChange={handleDateReservationChange}
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 1}
                    />
                </CardContent>)}

            </>
        )
    }


    return (
        <div className="p-4">
            {globalDevisSettings()}
            {devis.StatusDevis !== "Annuler" && payementSettings()}
            {devis.StatusDevis !== "Annuler" && responsableSettings()}
        </div>
    )
}