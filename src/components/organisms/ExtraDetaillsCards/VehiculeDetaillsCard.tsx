import { Input } from "../../../@/components/ui/input";
import { Card, CardContent, CardTitle } from "../../../@/components/ui/card";
import { CarRequest, Devis } from "../../../types/devisTypes";
import { Textarea } from "../../../@/components/ui/textarea";
import { DatePicker } from "../../../components/atoms/DataSelector";

interface VehiculeDetaillsProps {
    carRequest: CarRequest;
    devis: Devis;
    onUpdate: (updatedCarRequest: CarRequest) => void;
    onUpdateDevis: (updatedDevis: Devis) => void;
}



export function VehiculeDetaillsCard({ carRequest, devis, onUpdate, onUpdateDevis }: VehiculeDetaillsProps) {
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
        <Card className="bg-lightWhite border border-lightWhite flex flex-col overflow-y-auto">
            <div className="flex justify-center w-full">
                <CardTitle className="text-2xl text-highGrey2 font-oswald mt-4 mb-3">
                    Véhicule {carRequest.CarModel}
                </CardTitle>
            </div>
            <div className="flex flex-row justify-between">
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey2">Couleur du véhicule</label>
                    <Input
                        type="text"
                        value={carRequest.CarColor || ""}
                        onChange={(e) =>
                            handleChange("CarColor", e.target.value)
                        }
                        placeholder="Couleur du véhicule"
                        className="mt-1 p-2 mr-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey2">Dernier véhicule possédé</label>
                    <Input
                        type="text"
                        value={carRequest.OldCar || ""}
                        onChange={(e) =>
                            handleChange("OldCar", e.target.value)
                        }
                        placeholder="Dernier véhicule possédé"
                        className="mt-1 p-2 mr-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>
            </div>


            <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full pl-3 mb-2">Plus d'Informations</CardTitle>
            <CardContent className="w-full">
                <Textarea
                    maxLength={200}
                    value={carRequest.CarNotes || ""}
                    onChange={(e) =>
                        handleChange("CarNotes", e.target.value)
                    }
                    className="mt-1 p-2 mr-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm overflow-y-auto max-h-[100px]"
                />
            </CardContent>


            {devis.StatusDevis === "Facture" &&

                <>
                    <CardTitle className="text-xl text-highGrey2 font-oswald text-left w-full pl-3 mb-2">Informations après-vente</CardTitle>
                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-highGrey2">Immatriculation</label>
                        <Input
                            maxLength={30}
                            value={carRequest.Immatriculation || ""}
                            onChange={(e) =>
                                handleChange("Immatriculation", e.target.value)
                            }
                            className="mt-1 p-2 mr-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm overflow-y-auto max-h-[100px]"
                        />
                    </CardContent>


                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-highGrey2">Date de Livraison</label>
                        <DatePicker
                            value={devis.ScheduledLivDate}
                            onChange={(value)=>handleChangeDevis("ScheduledLivDate",value)}
                            fromYear={new Date().getFullYear()}
                            toYear={new Date().getFullYear()+1}
                        />
                    </CardContent>
                </>
            }

        </Card>
    )
}