import { Label } from "../../../@/components/ui/label";
import { CardContent, CardTitle } from "../../../@/components/ui/card";
import { Devis, DevisFacture, DevisGesteCommer, DevisPayementDetails, DevisReserved } from "../../../types/devisTypes";
import StatusDevisDropDown from "../../../components/atoms/StatusDevis";
import PriorityDevisDropDown from "../../../components/atoms/PriorityDropDown";
import BanksLeasingDropDown from "../../../components/atoms/BanksLeasingDropDown";
import RegionDropDown from "../../../components/atoms/RegionDropDown";
import { Input } from "../../../@/components/ui/input";
import PayementMethod from "../../../components/atoms/PayementMethod";
import { DatePicker } from "../../../components/atoms/DataSelector";
import { getToken } from "../../../services/authService";
import { useEffect, useState } from "react";
import { Checkbox } from "../../../@/components/ui/checkbox";
import { NumericInput } from "../../../components/atoms/NumericInput";
import { useUser } from "../../../context/userContext";
import { params } from "../../../utils/params";

interface DevisGlobalDetailsProps {
    devis: Devis;
    isAdmin: boolean;
    onUpdate: (updatedDevis: Devis) => void;
}

export function DevisGlobalDetails({ devis, isAdmin, onUpdate }: DevisGlobalDetailsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [devisBcNumber, setDevisBcNumber] = useState<number | undefined>(0);
    const API_URL = import.meta.env.VITE_API_URL;
    const token = getToken();
    const { user } = useUser();

    useEffect(() => {
        if (devis.DevisId) {
            setIsLoading(true);
            const fetchData = async () => {
                const bc_num = await fetchNumBonCommande("Commer_2024_AutoPro", "BCW", devis.DevisId ? devis.DevisId : 0);
                setDevisBcNumber(bc_num);
            };
            fetchData().then(() => setIsLoading(false));
        }
    }, [devis.DevisId]);


    const handleChange = (field: keyof Devis, value: string | Date | undefined | boolean) => {
        const updatedDevis = {
            ...devis,
            [field]: value,
        };
        
        onUpdate(updatedDevis);
    };



    const fetchNumBonCommande = async (databaseName: string, refCompteur: string, devisId: number): Promise<number | undefined> => {
        try {
            const response = await fetch(`${API_URL}/compteur-commande`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ databaseName, refCompteur, devisId })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: number = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch Numéro Bon de Commande:', error);
            return undefined;
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        //  setIsLoading(true);
        try {
            let updatedDevis: Devis = { ...devis, StatusDevis: newStatus };

            switch (newStatus) {
                case "Réservé": {
                    //const counter = await fetchNumBonCommande("Commer_2024_AutoPro", "BCW", devis.DevisId ? devis.DevisId : 0);
                    //setDevisBcNumber(counter);
                    updatedDevis = {
                        ...updatedDevis,
                        devisReserved: {
                            ...devis.devisReserved,
                            ReservedBy: user?.nomUser,
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

            if (updatedDevis.StatusDevis === "Annulé" || updatedDevis.StatusDevis === "En Cours") {
                updatedDevis = {
                    ...updatedDevis,
                    devisReserved: {
                        ...devis.devisReserved,
                        CanceledBy: user?.nomUser
                    }
                };
            }

            onUpdate(updatedDevis);
        } catch (error) {
            console.error('Error updating status:', error);
            // You might want to add error handling UI here
        } finally {
            // setIsLoading(false);
        }
    };

    const handleDateLivrasonChange = (date: Date | undefined) => {
        onUpdate({
            ...devis,
            devisFacture: {
                ...devis.devisFacture,
                DateLivraison: date || new Date()
            }
        });
    }


    const handleDateReservationChange = (date: Date | undefined) => {
        onUpdate({
            ...devis,
            devisReserved: {
                ...devis.devisReserved,
                DateReservation: date || new Date()
            }
        });
    };

    const handleDateBorderauChange = (date: Date | undefined) => {
        onUpdate({
            ...devis,
            devisFacture: {
                ...devis.devisFacture,
                DateBRD: date || new Date()
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

    const handleChangedevisGesteCommer = (field: string, value: string) => {
        const updatedDevis = {
            ...devis,
            gesteCommer: {
                ...devis.gesteCommer,
                [field]: value,
            },
        };

        if ((field === "RemiseAccepte" || field === "VoucherAccepte") && updatedDevis.devisPayementDetails.TotalTTC !== 0) {
            const parseNumber = (value: string) => {
                const parsedValue = parseFloat(value.replace(/\s/g, '').replace(',', '.'));
                return isNaN(parsedValue) ? 0 : parsedValue;
            };

            const remise = parseNumber(updatedDevis.gesteCommer.RemiseAccepte || "0");
            const voucher = parseNumber(updatedDevis.gesteCommer.VoucherAccepte || "0");
            const totalTTC = parseNumber(updatedDevis.devisPayementDetails.TotalTTC?.toString() || "0");
            const totalAPRem = totalTTC - (remise + voucher);

            updatedDevis.devisPayementDetails.TotalAPRem = totalAPRem >= 0 ? totalAPRem : totalTTC;
        }

        onUpdate(updatedDevis);
    };




    const TruncatedDropdownField = ({ label, children }: any) => (
        <div className="relative group">
            <Label
                className="text-sm font-medium text-highBlue mb-1 block truncate"
                title={label}
            >
                {label}
            </Label>
            <span className="absolute bottom-full left-0 mb-1 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
                <CardTitle className="text-xl text-highBlue text-left w-full pl-3 pr-3 mb-2 flex items-center justify-between">
                    <span className="font-oswald">Informations générales</span>
                    <div className="flex items-center">
                        {checkBoxes()}
                    </div>
                </CardTitle>
                <div className="flex flex-col max-[700px]:flex-col sm:flex-col md:flex-row justify-between gap-4 mb-1">

                    <CardContent className="w-full">
                        <Label className="text-sm font-medium text-highBlue">Status</Label>
                        <StatusDevisDropDown
                            value={devis.StatusDevis}
                            onChange={(value) => handleStatusChange(value)}
                            isFiltring={false}
                        />
                    </CardContent>

                    {/** 
                 <CardContent className="w-full">
                    <Label className="text-sm font-oswald text-highBlue">Motif</Label>
                    <MotifClientSelect
                        value={devis.Motivation}
                        onChange={(value) => handleChange("Motivation", value)}
                    />
                    </CardContent>
                */}

                    <CardContent className="w-full">
                        <Label className="text-sm font-medium text-highBlue">Priorité</Label>
                        <PriorityDevisDropDown
                            value={devis.PriorityDevis}
                            onChange={(value) => handleChange("PriorityDevis", value)}
                            isFiltring={false}
                        />
                    </CardContent>


                </div>
                {devis.StatusDevis === "Annulé" && (
                    <CardContent className="w-full">
                        <Label className=" text-sm font-medium text-highBlue">Raison de l'annulation</Label>
                        <Input
                            type="text"
                            value={devis.ReasonAnnulation || ""}
                            onChange={(e) =>
                                handleChange("ReasonAnnulation", e.target.value)
                            }
                            placeholder="Raison de l'annulation"
                            className="mt-1 p-2 mr-2  border border-normalGrey bg-normalGrey rounded-md  sm:text-sm"
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
                <CardTitle className="text-xl text-highBlue  text-left w-full pl-3 pr-3 mb-2 flex flex-row justify-between items-center">
                    <span className="font-oswald">Paiements</span>

                </CardTitle>
                <div className="flex flex-row w-full gap-4 flex-wrap">
                    <CardContent className="flex-1 min-w-[200px]">
                        <Label className="relative text-sm font-medium text-highBlue">Type de paiement</Label>
                        <PayementMethod
                            value={devis.devisPayementDetails.PaymentMethod}
                            onChange={(value) => handleChangedevisPayementDetails("PaymentMethod", value)}
                        />
                    </CardContent>

                    <CardContent className="flex-1 min-w-[200px]">
                        <Label className="relative text-sm font-medium text-highBlue">Total TTC</Label>
                        <NumericInput
                            value={devis.devisPayementDetails?.TotalTTC || ""}
                            onChange={(value) => handleChangedevisPayementDetails("TotalTTC", value.toString())}
                            className={params.inputBoxStyle}
                        />
                    </CardContent>

                    {devis.isGesteCommerciale && (
                        <CardContent className="flex-1 min-w-[200px]">
                            <Label className="relative text-sm font-medium text-highBlue">Total TTC après remise</Label>
                            <div className={`w-full p-2 rounded-md sm:text-sm caret-highBlue ${params.inputBoxStyle}`}>
                                <span>{devis.devisPayementDetails.TotalAPRem}</span>
                            </div>
                        </CardContent>
                    )}
                </div>

                {/* Conditionally render additional payment details based on PayementMethod */}
                {(devis.devisPayementDetails.PaymentMethod === "Banque" || devis.devisPayementDetails.PaymentMethod === "Leasing") && (
                    <div className="flex md:gap-4 lg:gap-4  w-full sm:flex-col md:flex-row min-[400px]:flex-col">
                        <CardContent className="w-1/2 sm:w-full min-[400px]:w-full">
                            <Label className="relative text-sm font-medium text-highBlue">Banque et Leasing</Label>
                            <BanksLeasingDropDown
                                value={devis.devisPayementDetails.BankAndLeasing}
                                onChange={(value) => handleChangedevisPayementDetails("BankAndLeasing", value)}
                            />
                        </CardContent>

                        <CardContent className="w-1/2 sm:w-full min-[400px]:w-full">
                            <Label className="relative text-sm font-medium text-highBlue">Region Banque ou Leasing</Label>
                            <RegionDropDown
                                value={devis.devisPayementDetails.BankRegion || ""}
                                onChange={(value) => handleChangedevisPayementDetails("BankRegion", value)}
                                isFiltring={false}
                            />
                        </CardContent>
                    </div>
                )}
                
            </>
        )
    }

    const responsableSettings = () => {
        return (
            <>
               
                <div className="flex gap-4 w-full">
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Nom Responsable</Label>
                        <Input
                            type="text"
                            value={devis.Responsable || ""}
                            onChange={(e) =>
                                handleChange("Responsable", e.target.value)
                            }
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>

                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Tél. Responsable</Label>
                        <Input
                            type="text"
                            value={devis.ResponsableNum || ""}
                            onChange={(e) =>
                                handleChange("ResponsableNum", e.target.value)
                            }
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>
                </div>
            </>
        )
    }

    const reservedSettings = () => {
        return (
            <div className="flex gap-4 w-full">
                {devisBcNumber !== 0 && (
                    <CardContent className="w-1/2 flex flex-col overflow-hidden">
                        <Label
                            className="text-sm font-medium text-highBlue mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
                            title="Numéro Bon de Commande"
                        >
                            Numéro Bon de Commande
                        </Label>
                        <div
                            className={`w-full p-2 rounded-md sm:text-sm caret-highBlue ${params.inputBoxStyle}`}
                        >
                            {devisBcNumber}
                        </div>
                    </CardContent>)}

                {isAdmin ? (
                    <CardContent className={`${devisBcNumber === 0 ? 'w-full' : 'w-1/2'} `}>
                        <Label className="relative text-sm font-medium text-highBlue">Date de Réservation</Label>
                        <DatePicker
                            value={devis.devisReserved?.DateReservation ?? new Date()}
                            onChange={handleDateReservationChange}
                            fromYear={new Date().getFullYear()}
                            toYear={new Date().getFullYear() + 1}
                            styling={params.inputBoxStyle}
                        />
                    </CardContent>
                ) : (
                    <CardContent className={`${devisBcNumber === 0 ? 'w-full' : 'w-1/2'} `}>
                        <Label className="relative text-sm font-medium text-highBlue">Date de Réservation</Label>
                        <div className={`w-full p-2 rounded-md sm:text-sm caret-highBlue ${params.inputBoxStyle}`}>
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
                <CardTitle className="text-xl text-highBlue  text-left w-full pl-3 pr-3 mb-2 flex flex-row justify-between items-center">
                    <span className="font-oswald">Facturation</span>

                </CardTitle>
                <div className="flex gap-4 w-full">
                    <CardContent className="w-full">
                        <div>
                            <Label className=" relative text-sm font-medium text-highBlue ">Numéro de Facture</Label>
                            {devis.devisFacture?.FactureNumero == null || devis.devisFacture?.FactureNumero.length < 5 && <span className="text-lightRed font-oswald">*</span>}
                        </div>
                        <NumericInput
                            value={devis.devisFacture?.FactureNumero || ""}
                            onChange={(value) => handleChangedevisFacture("FactureNumero", value.toString())}
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Date de Facture</Label>
                        <DatePicker
                            value={devis.devisFacture?.DateFacturation ?? new Date()}
                            onChange={handleDateFacturationChange}
                            fromYear={new Date().getFullYear()}
                            toYear={new Date().getFullYear() + 1}
                            styling={params.inputBoxStyle}
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
                    <Label className=" relative text-sm font-medium text-highBlue ">Numéro de BRD</Label>
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
                        //placeholder="Numero de BRD"
                        className={`mt-1 p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                    />
                </CardContent>
                <CardContent className="w-full">
                    <Label className=" relative text-sm font-medium text-highBlue ">Date de BRD</Label>
                    <DatePicker
                        value={devis.devisFacture?.DateBRD ?? new Date()}
                        onChange={handleDateBorderauChange}
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 1}
                        styling={params.inputBoxStyle}
                    />
                </CardContent>
            </div>
        )
    }

    const gesteCommercialSettings = () => {
        return (
            <>
                <CardTitle className="text-xl text-left w-full pl-3 pr-3 mb-2 flex flex-row justify-between items-center font-oswald">Geste Commercial</CardTitle>
                <div className="flex gap-4 w-full">
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Demande Remise</Label>
                        <NumericInput
                            value={devis.gesteCommer?.DemandeRemise || ""}
                            onChange={(value) => handleChangedevisGesteCommer("DemandeRemise", value.toString())}
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Remise acceptée (DT)</Label>
                        <NumericInput
                            value={devis.gesteCommer?.RemiseAccepte || ""}
                            onChange={(value) => handleChangedevisGesteCommer("RemiseAccepte", value.toString())}
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>
                </div>

                <div className="flex gap-4 w-full">
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Demande de Franchise</Label>
                        <NumericInput
                            value={devis.gesteCommer?.DemandeDeFranchise || ""}
                            onChange={(value) => handleChangedevisGesteCommer("DemandeDeFranchise", value.toString())}
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Franchise acceptée (Jours)</Label>
                        <NumericInput
                            value={devis.gesteCommer?.FranchiseAccepte || ""}
                            onChange={(value) => handleChangedevisGesteCommer("FranchiseAccepte", value.toString())}
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>
                </div>

                <div className="flex gap-4 w-full">
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Voucher</Label>
                        <NumericInput
                            value={devis.gesteCommer?.Voucher || ""}
                            onChange={(value) => handleChangedevisGesteCommer("Voucher", value.toString())}
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>
                    <CardContent className="w-full">
                        <Label className=" relative text-sm font-medium text-highBlue ">Voucher accepté</Label>
                        <NumericInput
                            value={devis.gesteCommer?.VoucherAccepte || ""}
                            onChange={(value) => handleChangedevisGesteCommer("VoucherAccepte", value.toString())}
                            className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                        />
                    </CardContent>
                </div>
            </>
        )
    }

    const checkBoxes = () => {
        return (
            <div className="flex flex-row space-x-4">
                <div className="flex flex-row items-center space-x-2 bg-blueCiel p-1 border border-blueCiel rounded-md">
                    <div className="text-sm font-normal ">Bordereau est validé</div>
                    <Checkbox
                        checked={devis.devisFacture?.StatutBRD}
                        onCheckedChange={(e) => handleChangedevisFacture("StatutBRD", e.valueOf())}
                        className=" border border-highBlue rounded-md h-5 w-5"
                        id="statusBrd" />
                </div>


                <div className="flex flex-row items-center space-x-2 bg-blueCiel p-1 border border-blueCiel rounded-md">
                    <div className="text-sm font-normal ">Véhicule est livré</div>
                    <Checkbox
                        checked={devis.devisFacture?.isLivraison}
                        onCheckedChange={(e) => handleChangedevisFacture("isLivraison", e.valueOf())}
                        className=" border border-highBlue rounded-md h-5 w-5"
                        id="vehiculeDelievered" />
                </div>
                <div className="flex flex-row items-center space-x-2 bg-blueCiel p-1 border border-blueCiel rounded-md">
                    <div className="text-sm font-normal ">Geste Commercial</div>
                    <Checkbox
                        checked={devis.isGesteCommerciale}
                        onCheckedChange={(e) => handleChange("isGesteCommerciale", e.valueOf())}
                        className=" border border-highBlue rounded-md h-5 w-5"
                        id="isGesteCommerciale" />
                </div>
            </div>
        )
    }


    return (
        <div className="p-4 pt-3 relative">
            {globalDevisSettings()}
            {isLoading && (
                <div className="absolute inset-0 flex items-start justify-center bg-bgColorLight bg-opacity-75 z-50 pt-10">
                    <div className="flex items-center justify-center min-h-[calc(100vh/1.4)]">
                        <svg className="animate-spin h-5 w-5 text-highBlue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <span className="ml-2 text-lg font-medium font-oswald text-highBlue">Veuillez Patienter...</span>
                    </div>
                </div>
            )}
            {devis.StatusDevis !== "Annulé" && payementSettings()}
            {devis.StatusDevis !== "Annulé" && (devis.devisPayementDetails.PaymentMethod=="Banque" || devis.devisPayementDetails.PaymentMethod=="Leasing") && responsableSettings()}
            {devis.isGesteCommerciale && gesteCommercialSettings()}
        </div>
    )
}