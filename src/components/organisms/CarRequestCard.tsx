import { CarRequest } from "@/types/devisTypes";
import { DatePicker } from "../atoms/DataSelector";
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import { Input } from "../../@/components/ui/input";
import { Textarea } from "../../@/components/ui/textarea";

interface CarRequestCardProps {
    carRequest: CarRequest;
    onUpdate: (updatedCarRequest: CarRequest) => void;
}

export function CarRequestCard({ carRequest, onUpdate }: CarRequestCardProps) {

    const handleChange = (field: keyof CarRequest, value: string | Date | undefined) => {
        onUpdate({
            ...carRequest,
            [field]: value,
        });
    };

    return (
        <Card className="pt-0 mb-5 mt-5 w-full border border-bluePrimary">
            <div className="flex flex-col">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-bluePrimary text-lg">Information Véhicule</CardTitle>
                </CardHeader>
                {/** Type Car  */}
                {carRequest === undefined ? (<CardContent>Pas D'Informations</CardContent>) :
                    (
                        <>
                            <CardContent>
                                <label className="block text-sm font-medium text-gray-700">Modele du véhicule</label>
                                <Input
                                    type="text"
                                    value={carRequest.CarModel} // Directly bind to client prop
                                    onChange={(e) => handleChange("CarModel", e.target.value)}
                                    className="mt-1 p-2 block w-full border border-bluePrimary rounded-md shadow-sm focus:ring-0 sm:text-sm"
                                />
                            </CardContent>

                            {/** Color Car  */}

                            <CardContent>
                                <label className="block text-sm font-medium text-gray-700">Couleur du véhicule</label>
                                <Input
                                    type="text"
                                    value={carRequest.CarColor} // Directly bind to client prop
                                    onChange={(e) => handleChange("CarColor", e.target.value)}
                                    className="mt-1 p-2 block w-full border border-bluePrimary rounded-md shadow-sm focus:ring-0 sm:text-sm"
                                />
                            </CardContent>


                            {/** Old Car  */}

                            {
                                carRequest.OldCar !== null && (<CardContent>
                                    <label className="block text-sm font-medium text-gray-700">Dernier véhicule possédé</label>
                                    <Input
                                        type="text"
                                        value={carRequest.OldCar} // Directly bind to client prop
                                        onChange={(e) => handleChange("OldCar", e.target.value)}
                                        className="mt-1 p-2 block w-full border border-bluePrimary rounded-md shadow-sm focus:ring-0 sm:text-sm"
                                    />
                                </CardContent>)
                            }

                            {/** Car Notes  */}


                            <CardContent>
                                <label className="block text-sm font-medium text-gray-700">Dernier véhicule possédé</label>
                                <Textarea
                                    className="border border-bluePrimary min-h-[70px]"
                                    placeholder="Plus d'informations.."
                                    value={carRequest.CarNotes} // Directly bind to client prop
                                    onChange={(e) => handleChange("CarNotes", e.target.value)}
                                />
                            </CardContent>
                        </>
                    )






                }
            </div>
        </Card>
    );
}
