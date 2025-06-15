import { CarRequest, Devis } from "../../../types/devisTypes";
import { CardContent, CardTitle } from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Textarea } from "../../../@/components/ui/textarea";
import { Label } from "../../../@/components/ui/label";
import CarsDropDown from "../../../components/atoms/CarsDropDown";
import { params } from "../../../utils/params";
import { useUser } from "../../../context/userContext";
interface DevisVehiculeDetailsProps {
    carRequest: CarRequest;
    devis: Devis;
    onUpdate: (updatedCarRequest: CarRequest) => void;
    onUpdateDevis: (updatedDevis: Devis) => void;
    isAdmin?: boolean;
}

export function DevisVehiculeDetails({ carRequest, devis, onUpdate, onUpdateDevis, isAdmin }: DevisVehiculeDetailsProps) {
    const { user } = useUser();
    const isEditingOpen = (devis.StatusDevis == "En Cours" || devis.devisFacture==null) && (devis.AssignedTo === "" || devis.AssignedTo=== user?.username || isAdmin);
    const handleChange = (field: keyof CarRequest, value: string | Date | undefined) => {
        onUpdate({
            ...carRequest,
            [field]: value,
        });
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-0 pt-4 pl-6 pr-6">
                <CardContent className="w-full">
                    <Label className="relative text-sm font-medium text-highBlue ">Véhicule</Label>
                    {isAdmin ? (
                        <div className="mt-1 block">
                        <CarsDropDown
                            value={carRequest?.CarModel || ""}
                            onChange={(value) => handleChange("CarModel", value)}
                            isFiltring={false}
                        />
                        </div>

                    ) : (
                        <div className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}>
                            {carRequest?.CarModel || ""}
                        </div>
                    )}

                </CardContent>
                <CardContent className="w-full">
                    <Label className="relative text-sm font-medium text-highBlue ">Couleur du véhicule</Label>
                    {isEditingOpen ? (
                        <Input
                            type="text"
                            value={carRequest?.CarColor || ""}
                            onChange={(e) => handleChange("CarColor", e.target.value)}
                            placeholder="Couleur du véhicule"
                            className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                        />
                    ) : (
                        <div className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}>
                            {carRequest?.CarColor || ""}
                        </div>
                    )}
                </CardContent>

                <CardContent className="w-full">
                    <Label className="relative text-sm font-medium text-highBlue ">Dernier véhicule possédé</Label>
                    {isEditingOpen ? (
                        <Input
                            type="text"
                            value={carRequest?.OldCar || ""}
                            onChange={(e) => handleChange("OldCar", e.target.value)}
                            placeholder="Dernier véhicule possédé"
                            className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                        />
                    ) : (
                        <div className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}>
                            {carRequest?.OldCar || ""}
                        </div>
                    )}
                </CardContent>

            </div>
            <div className="pl-6 pr-6 mt-2">
                <CardTitle className="text-xl text-highBlue font-oswald text-left w-full mb-2 ml-3 mr-3 ">Plus d'Informations</CardTitle>
                <CardContent className="w-full">
                    {isEditingOpen ? (
                        <Textarea
                            maxLength={200}
                            value={carRequest?.CarNotes || ""}
                            onChange={(e) => handleChange("CarNotes", e.target.value)}
                            className={`rounded-md  focus:ring-0 sm:text-sm overflow-y-auto max-h-[100px] ${params.inputBoxStyle}`}
                        />
                    ) : (
                        <div className={`mt-1 p-2 block rounded-md  focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}>
                            {carRequest?.CarNotes || "N/A"}
                        </div>
                    )}
                </CardContent>
            </div>
        </>
    );
}
