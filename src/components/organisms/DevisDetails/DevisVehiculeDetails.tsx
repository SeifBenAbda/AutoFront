import { CarRequest, Devis } from "../../../types/devisTypes";
import { CardContent, CardTitle } from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Textarea } from "../../../@/components/ui/textarea";
import { DatePicker } from "../../../components/atoms/DataSelector"
import { Label } from "../../../@/components/ui/label";
import CarsDropDown from "../../../components/atoms/CarsDropDown";
import { params } from "../../../utils/params";

interface DevisVehiculeDetailsProps {
    carRequest: CarRequest;
    devis: Devis;
    onUpdate: (updatedCarRequest: CarRequest) => void;
    onUpdateDevis: (updatedDevis: Devis) => void;
    isAdmin?: boolean;
}

export function DevisVehiculeDetails({ carRequest, devis, onUpdate, onUpdateDevis, isAdmin }: DevisVehiculeDetailsProps) {

    const handleChange = (field: keyof CarRequest, value: string | Date | undefined) => {
        onUpdate({
            ...carRequest,
            [field]: value,
        });
    };

    const handleChangeDevis = (field: keyof Devis, value: string | Date | undefined) => {
        onUpdateDevis({
            ...devis,
            [field]: value,
        });
    };

    const handleDateLivraisonChange = (date: Date | undefined) => {
        onUpdateDevis({
            ...devis,
            devisFacture: {
                ...devis.devisFacture,
                DateLivraison: date || new Date()
            }
        });
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-0 pt-4 pl-6 pr-6">
                <CardContent className="w-full">
                    <Label className="relative text-sm font-medium text-highBlue ">Véhicule</Label>
                    {isAdmin ? (
                        <div className="mt-1 block">
                        <CarsDropDown
                            value={carRequest.CarModel || ""}
                            onChange={(value) => handleChange("CarModel", value)}
                            isFiltring={false}
                        />
                        </div>

                    ) : (
                        <div className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}>
                            {carRequest.CarModel}
                        </div>
                    )}

                </CardContent>
                <CardContent className="w-full">
                    <Label className="relative text-sm font-medium text-highBlue ">Couleur du véhicule</Label>
                    <Input
                        type="text"
                        value={carRequest.CarColor || ""}
                        onChange={(e) => handleChange("CarColor", e.target.value)}
                        placeholder="Couleur du véhicule"
                        className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                    />
                </CardContent>

                <CardContent className="w-full">
                    <Label className="relative text-sm font-medium text-highBlue ">Dernier véhicule possédé</Label>
                    <Input
                        type="text"
                        value={carRequest.OldCar || ""}
                        onChange={(e) => handleChange("OldCar", e.target.value)}
                        placeholder="Dernier véhicule possédé"
                        className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                    />
                </CardContent>

                {(devis.StatusDevis === "Facturé" && devis.devisFacture.isLivraison) && (
                    <div className="col-span-2">
                        <CardTitle className="text-xl text-highBlue font-oswald text-left w-full pl-3 mb-2">Informations après-vente</CardTitle>
                        <div className="flex gap-4 w-full">
                            <CardContent className="w-full">
                                <Label className="relative text-sm font-medium text-highBlue ">Immatriculation</Label>
                                <Input
                                    maxLength={30}
                                    value={carRequest.Immatriculation || ""}
                                    onChange={(e) => handleChange("Immatriculation", e.target.value)}
                                    placeholder="Numéro d'immatriculation"
                                    className={`p-2 mr-2 rounded-md sm:text-sm ${params.inputBoxStyle}`}
                                />
                            </CardContent>

                            <CardContent className="w-full">
                                <Label className="relative text-sm font-medium text-highBlue ">Date de Livraison</Label>
                                <DatePicker
                                    value={devis.devisFacture.DateLivraison}
                                    onChange={handleDateLivraisonChange}
                                    fromYear={new Date().getFullYear()}
                                    toYear={new Date().getFullYear() + 1}
                                />
                            </CardContent>
                        </div>
                    </div>
                )}
            </div>
            <div className="pl-6 pr-6 mt-2">
                <CardTitle className="text-xl text-highBlue font-oswald text-left w-full mb-2 ml-3 mr-3 ">Plus d'Informations</CardTitle>
                <CardContent className="w-full">
                    <Textarea
                        maxLength={200}
                        value={carRequest.CarNotes || ""}
                        onChange={(e) => handleChange("CarNotes", e.target.value)}
                        className={`rounded-md  focus:ring-0 sm:text-sm overflow-y-auto max-h-[100px] ${params.inputBoxStyle}`}
                    />
                </CardContent>
            </div>
        </>
    );
}
