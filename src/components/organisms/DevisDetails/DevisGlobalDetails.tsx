import { Label } from "../../../@/components/ui/label";
import { CardContent, CardTitle } from "../../../@/components/ui/card";
import { Devis, DevisFacture, DevisPayementDetails, DevisReserved } from "../../../types/devisTypes";
import StatusDevisDropDown from "../../../components/atoms/StatusDevis";
import PriorityDevisDropDown from "../../../components/atoms/PriorityDropDown";
import BanksLeasingDropDown from "../../../components/atoms/BanksLeasingDropDown";
import RegionDropDown from "../../../components/atoms/RegionDropDown";
import { Input } from "../../../@/components/ui/input";
import PayementMethod from "../../../components/atoms/PayementMethod";
import { DatePicker } from "../../../components/atoms/DataSelector";
import { getToken } from "../../../services/authService";
import { useState } from "react";
import { Checkbox } from "../../../@/components/ui/checkbox";


interface DevisGlobalDetailsProps {
    devis: Devis;
    isAdmin: boolean;
    onUpdate: (updatedDevis: Devis) => void;
}

export function DevisGlobalDetails({ devis, isAdmin, onUpdate }: DevisGlobalDetailsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const token = getToken();
    //fetching functions 
    interface CompteurCommande {
        UG: string;
        REF_COMPTEUR: string;
        COMPTEUR: number;
    }


    const handleChange = (field: keyof Devis, value: string | Date | undefined) => {
        onUpdate({
            ...devis,
            [field]: value,
        });
        if(devis.devisFacture.StatutBRD){
           handleDateBorderauChange(new Date());
        }
        if(devis.devisFacture.isLivraison){
            handleDateReservationChange(new Date());
        }
    };

    const fetchNumBonCommande = async (databaseName: string, refCompteur: string): Promise<number | undefined> => {
        try {
            const response = await fetch(`${API_URL}/compteur-commande`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ databaseName, refCompteur })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: CompteurCommande = await response.json();
            return data.COMPTEUR;
        } catch (error) {
            console.error('Failed to fetch Numéro Bon de Commande:', error);
            return undefined;
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);
        try {
            let updatedDevis: Devis = { ...devis, StatusDevis: newStatus };

            switch (newStatus) {
                case "Réservé": {
                    const compteur = await fetchNumBonCommande("Commer_2024_AutoPro", "BCW");
                    if (!compteur) {
                        throw new Error("Failed to fetch bon commande number");
                    }

                    updatedDevis = {
                        ...updatedDevis,
                        devisReserved: {
                            ...devis.devisReserved,
                            NumBonCommande: compteur.toString(),
                            DateReservation: new Date()
                        }
                    };
                    break;
                }

                case "Facturé": {
                    updatedDevis = {
                        ...updatedDevis,
                        devisFacture: {
                            ...devis.devisFacture,
                            DateFacturation: new Date()
                        }
                    };
                    break;
                }

                // Add other status cases if needed
            }

            // Additional status-dependent updates
            if (updatedDevis.devisFacture?.StatutBRD) {
                updatedDevis = {
                    ...updatedDevis,
                    devisFacture: {
                        ...updatedDevis.devisFacture,
                        DateBRD: new Date()
                    }
                };
            }

            if (updatedDevis.devisFacture?.isLivraison) {
                updatedDevis = {
                    ...updatedDevis,
                    devisReserved: {
                        ...updatedDevis.devisReserved,
                        DateReservation: new Date()
                    }
                };
            }

            onUpdate(updatedDevis);
        } catch (error) {
            console.error('Error updating status:', error);
            // You might want to add error handling UI here
        } finally {
            setIsLoading(false);
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

    const handleDateBorderauChange = (date: Date | undefined) => {
        onUpdate({
            ...devis,
            devisFacture: {
                ...devis.devisFacture,
                DateBRD: date || undefined
            }
        });
    };

    const handleDateFacturationChange = (date: Date | undefined) => {
        onUpdate({
            ...devis,
            devisFacture: {
                ...devis.devisFacture,
                DateFacturation: date || new Date()
            }
        });
    }

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

    const handleChangedevisFacture = (field: keyof DevisFacture, value: string | boolean) => {
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
                <CardTitle className="text-xl text-highGrey2  text-left w-full pl-3 pr-3 mb-2 flex flex-row justify-between items-center font-oswald">Informations générales</CardTitle>
                <div className="flex flex-col max-[700px]:flex-col sm:flex-col md:flex-row justify-between gap-4 mb-1">

                    <CardContent className="w-full">
                        <Label className="text-sm font-medium text-highGrey2">Status</Label>
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
                        <Label className="text-sm font-medium text-highGrey2">Priorité</Label>
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

                {devis.StatusDevis === "Réservé" && reservedSettings()}

                {devis.StatusDevis === "Facturé" && facturationSettings()}
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



            </>
        )
    }

    const reservedSettings = () => {
        return (
            <div className="flex gap-4 w-full">
                <CardContent className="w-1/2 flex flex-col overflow-hidden">
                    <Label
                        className="text-sm font-medium text-highGrey2 mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
                        title="Numéro Bon de Commande"
                    >
                        Numéro Bon de Commande
                    </Label>
                    <div

                        className="w-full p-2 border border-highGrey2 rounded-md sm:text-sm caret-highGrey2"
                    >
                        {devis.devisReserved?.NumBonCommande}
                    </div>
                </CardContent>

                {isAdmin ? (
                    <CardContent className="w-1/2">
                        <Label className="relative text-sm font-medium text-highGrey2">Date de Réservation</Label>
                        <DatePicker
                            value={devis.devisReserved?.DateReservation ?? new Date()}
                            onChange={handleDateReservationChange}
                            fromYear={new Date().getFullYear()}
                            toYear={new Date().getFullYear() + 1}
                        />
                    </CardContent>
                ) : (
                    <CardContent className="w-1/2">
                        <Label className="relative text-sm font-medium text-highGrey2">Date de Réservation</Label>
                        <div className="w-full p-2 border border-highGrey2 rounded-md sm:text-sm caret-highGrey2">
                            <span>{devis.devisReserved?.DateReservation ? new Date(devis.devisReserved.DateReservation).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                )}
            </div>
        )
    };


    const facturationSettings = () => {
        return (
            <>
                <CardTitle className="text-xl text-highGrey2  text-left w-full pl-3 pr-3 mb-2 flex flex-row justify-between items-center">
                    <span className="font-oswald">Facturation</span>
                    <div className="flex flex-row space-x-4">
                        <div className="flex flex-row items-center space-x-2 bg-blueCiel p-1 border border-blueCiel rounded-md">
                            <div className="text-sm font-normal ">Bordereau est validé</div>
                            <Checkbox
                                checked={devis.devisFacture?.StatutBRD}
                                onCheckedChange={(e) => handleChangedevisFacture("StatutBRD", e.valueOf())}
                                className=" border border-highGrey2 rounded-md h-5 w-5"
                                id="statusBrd" />
                        </div>

                        <div className="flex flex-row items-center space-x-2 bg-blueCiel p-1 border border-blueCiel rounded-md">
                            <div className="text-sm font-normal ">Véhicule est livré</div>
                            <Checkbox
                                checked={devis.devisFacture?.isLivraison}
                                onCheckedChange={(e) => handleChangedevisFacture("isLivraison", e.valueOf())}
                                className=" border border-highGrey2 rounded-md h-5 w-5"
                                id="vehiculeDelievered" />
                        </div>
                    </div>
                </CardTitle>
                <div className="flex gap-4 w-full">
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highGrey2 ">Numéro de Facture</Label>
                        <Input
                            type="text"
                            inputMode="numeric"  // Shows numeric keyboard on mobile
                            maxLength={10}      // Native length limit
                            pattern="[0-9]*"    // HTML5 validation
                            autoComplete="off"  // Prevents unwanted autocomplete
                            onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
                                // Most efficient way to block non-numeric input
                                const inputEvent = e as unknown as InputEvent;
                                if (!/^\d*$/.test(inputEvent.data || '')) {
                                    e.preventDefault();
                                }
                            }}
                            value={devis.devisFacture?.FactureNumero || ""}
                            onChange={(e) =>
                                handleChangedevisFacture("FactureNumero", e.target.value)
                            }
                            className=" p-2 mr-2  border border-highGrey2 rounded-md sm:text-sm "
                        />
                    </CardContent>
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highGrey2 ">Date de Facture</Label>
                        <DatePicker
                            value={devis.devisFacture?.DateFacturation ?? new Date()}
                            onChange={handleDateFacturationChange}
                            fromYear={new Date().getFullYear()}
                            toYear={new Date().getFullYear() + 1}
                        />
                    </CardContent>


                </div>
                {devis.devisFacture?.StatutBRD && bordoreauDetails()}
            </>
        )
    }

    const bordoreauDetails = () => {
        return (
            <div className="flex gap-4 w-full">
                <CardContent className="w-full">
                    <Label className=" relative text-sm font-medium text-highGrey2 ">Numéro de BRD</Label>
                    <Input
                        type="text"
                        inputMode="numeric"  // Shows numeric keyboard on mobile
                        maxLength={10}      // Native length limit
                        pattern="[0-9]*"    // HTML5 validation
                        autoComplete="off"  // Prevents unwanted autocomplete
                        value={devis.devisFacture.BRDNumero || ""}
                        onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
                            // Most efficient way to block non-numeric input
                            const inputEvent = e as unknown as InputEvent;
                            if (!/^\d*$/.test(inputEvent.data || '')) {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) => handleChangedevisFacture("BRDNumero", e.target.value)}
                        placeholder="Numero de BRD"
                        className="mt-1 p-2 mr-2 border border-highGrey2 rounded-md sm:text-sm"
                    />
                </CardContent>
                <CardContent className="w-full">
                    <Label className=" relative text-sm font-medium text-highGrey2 ">Date de BRD</Label>
                    <DatePicker
                        value={devis.devisFacture?.DateBRD ?? new Date()}
                        onChange={handleDateBorderauChange}
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 1}
                    />
                </CardContent>

            </div>
        )
    }


    return (
        <div className="p-4 relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-lightWhite bg-opacity-75 z-50">
                    <span className="ml-2 text-lg font-medium font-oswald text-highGrey2">Chargement du numéro de bon de commande...</span>
                </div>
            )}
            {globalDevisSettings()}
            {devis.StatusDevis !== "Annuler" && payementSettings()}
            {devis.StatusDevis !== "Annuler" && responsableSettings()}
        </div>
    )
}