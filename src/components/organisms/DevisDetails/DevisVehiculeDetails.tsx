import { CarRequest, Devis } from "../../../types/devisTypes";
import { CardContent, CardTitle } from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Textarea } from "../../../@/components/ui/textarea";
import { DatePicker } from "../../../components/atoms/DataSelector"
import { Label } from "../../../@/components/ui/label";

interface DevisVehiculeDetailsProps {
    carRequest: CarRequest;
    devis: Devis;
    onUpdate: (updatedCarRequest: CarRequest) => void;
    onUpdateDevis: (updatedDevis: Devis) => void;
}

export function DevisVehiculeDetails({ carRequest, devis, onUpdate, onUpdateDevis }: DevisVehiculeDetailsProps) {
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

    return (
        <>
            <div className="grid grid-cols-2 gap-4 p-4">
                <CardContent className="w-full">
                    <Label className="block text-sm font-oswald text-highGrey2">Couleur du véhicule</Label>
                    <Input
                        type="text"
                        value={carRequest.CarColor || ""}
                        onChange={(e) => handleChange("CarColor", e.target.value)}
                        placeholder="Couleur du véhicule"
                        className="mt-1 p-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                <CardContent className="w-full">
                    <Label className="block text-sm font-oswald text-highGrey2">Dernier véhicule possédé</Label>
                    <Input
                        type="text"
                        value={carRequest.OldCar || ""}
                        onChange={(e) => handleChange("OldCar", e.target.value)}
                        placeholder="Dernier véhicule possédé"
                        className="mt-1 p-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                {devis.StatusDevis === "Facturé" && (
                    <div className="col-span-2">
                        <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full pl-3 mb-2">Informations après-vente</CardTitle>
                        <CardContent className="w-full">
                            <Label className="block text-sm font-oswald text-highGrey2">Immatriculation</Label>
                            <Input
                                maxLength={30}
                                value={carRequest.Immatriculation || ""}
                                onChange={(e) => handleChange("Immatriculation", e.target.value)}
                                placeholder="Numéro d'immatriculation"
                                className="mt-1 p-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                            />
                        </CardContent>

                        <CardContent className="w-full">
                            <Label className="block text-sm font-oswald text-highGrey2">Date de Livraison</Label>
                            <DatePicker
                                value={devis.ScheduledLivDate}
                                onChange={(value: Date | undefined) => handleChangeDevis("ScheduledLivDate", value)}
                                fromYear={new Date().getFullYear()}
                                toYear={new Date().getFullYear() + 1}
                            />
                        </CardContent>
                    </div>
                )}
            </div>
            <div className="pl-4 pr-4">
                <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full mb-2 ml-3 mr-3 ">Plus d'Informations</CardTitle>
                <CardContent className="w-full">
                    <Textarea
                        maxLength={200}
                        value={carRequest.CarNotes || ""}
                        onChange={(e) => handleChange("CarNotes", e.target.value)}
                        placeholder="Notes sur le véhicule"
                        className="block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm overflow-y-auto max-h-[100px]"
                    />
                </CardContent>
            </div>
        </>
    );
}
