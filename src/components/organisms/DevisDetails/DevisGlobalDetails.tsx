import { Label } from "../../../@/components/ui/label";
import { CardContent, CardTitle } from "../../../@/components/ui/card";
import { Devis } from "../../../types/devisTypes";
import StatusDevisDropDown from "../../../components/atoms/StatusDevis";
import MotifClientSelect from "../../../components/atoms/MotifClientSelect";
import PriorityDevisDropDown from "../../../components/atoms/PriorityDropDown";
import BanksLeasingDropDown from "../../../components/atoms/BanksLeasingDropDown";
import RegionDropDown from "../../../components/atoms/RegionDropDown";
import { Input } from "../../../@/components/ui/input";
import PayementMethod from "../../../components/atoms/PayementMethod";
import { DatePicker } from "../../../components/atoms/DataSelector";


interface DevisGlobalDetailsProps {
    devis: Devis;
    onUpdate: (updatedDevis: Devis) => void;
}

export function DevisGlobalDetails({ devis, onUpdate }: DevisGlobalDetailsProps) {
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


    const TruncatedDropdownField = ({ label, children }:any) => (
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
            <div className="flex flex-col max-[700px]:flex-col sm:flex-col md:flex-row justify-between gap-4">
                <CardContent className="w-full">
                    <Label className="text-sm font-oswald text-highGrey2">Status</Label>
                    <StatusDevisDropDown
                        value={devis.StatusDevis}
                        onChange={(value) => handleChange("StatusDevis", value)}
                        isFiltring={false}
                    />
                </CardContent>
    
                <CardContent className="w-full">
                    <Label className="text-sm font-oswald text-highGrey2">Motif</Label>
                    <MotifClientSelect
                        value={devis.Motivation}
                        onChange={(value) => handleChange("Motivation", value)}
                    />
                </CardContent>
    
                <CardContent className="w-full">
                    <Label className="text-sm font-oswald text-highGrey2">Priorité</Label>
                    <PriorityDevisDropDown
                        value={devis.PriorityDevis}
                        onChange={(value) => handleChange("PriorityDevis", value)}
                        isFiltring={false}
                    />
                </CardContent>
            </div>
        );
    };
    
    


    const payementSettings = () => {
        return (
            <>
                <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full pl-3 mb-2">Paiements</CardTitle>
                <CardContent className="w-full">
                    <Label className=" text-sm font-medium text-highGrey2 mb-1">Type de paiement</Label>
                    <PayementMethod
                        value={devis.PayementMethod}
                        onChange={(value) => handleChange("PayementMethod", value)}
                    />
                </CardContent>



                {/* Conditionally render additional payment details based on PayementMethod */}
                {(devis.PayementMethod === "Banque" || devis.PayementMethod === "Leasing") && (
                    <div className="flex gap-4 w-full">
                    <CardContent className="w-1/2">
                      <TruncatedDropdownField label="Banque et Leasing">
                        <BanksLeasingDropDown
                          value={devis.BankAndLeasing}
                          onChange={(value) => handleChange("BankAndLeasing", value)}
                        />
                      </TruncatedDropdownField>
                    </CardContent>
                
                    <CardContent className="w-1/2">
                      <TruncatedDropdownField label="Region Banque ou Leasing">
                        <RegionDropDown
                          value={devis.BankRegion || ""}
                          onChange={(value) => handleChange("BankRegion", value)}
                          isFiltring={false}
                        />
                      </TruncatedDropdownField>
                    </CardContent>
                  </div>

                )}

                <div className="flex gap-4 w-full">
                    <CardContent className="w-1/2 flex flex-col overflow-hidden">
                        <Label
                            className="text-sm font-medium text-highGrey2 mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
                            title="Numéro Bon de Commande" // Full text here
                        >
                            Numéro Bon de Commande
                        </Label>
                        <Input
                            type="text"
                            value={devis.NumBc || ""}
                            onChange={(e) => handleChange("NumBc", e.target.value)}
                            className="w-full p-2 border border-highGrey2 rounded-md sm:text-sm caret-highGrey2"
                        />
                    </CardContent>

                    <CardContent className="w-1/2 flex flex-col overflow-hidden">
                        <Label className="text-sm font-medium text-highGrey2 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                            Montant (DT)
                        </Label>
                        <Input
                            type="text"
                            value={devis.MontantDevis || ""}
                            onChange={(e) => handleChange("MontantDevis", e.target.value)}
                            className="w-full p-2 border border-highGrey2 rounded-md sm:text-sm"
                        />
                    </CardContent>
                </div>


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

                <CardContent>
                    <Label className=" relative text-sm font-medium text-highGrey2 ">Date de Réservation</Label>
                    <DatePicker
                        value={devis.ReservationDate || new Date()}
                        onChange={handleDateChange}
                        fromYear={new Date().getFullYear()}
                        toYear={new Date().getFullYear() + 1}
                    />
                </CardContent>

            </>
        )
    }


    return (
        <div className="p-4">
            {globalDevisSettings()}
            {devis.StatusDevis !== "Annuler" && devis.StatusDevis !== "En Cours" && devis.StatusDevis !== "En Attente" && payementSettings()}
            {devis.StatusDevis == "Réservé" && responsableSettings()}
        </div>
    )
}