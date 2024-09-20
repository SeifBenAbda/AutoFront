import { CarRequest } from "@/types/devisTypes";

interface VehiculeDetaillsProps {
    carRequest: CarRequest;
    onUpdate: (updatedCarRequest: CarRequest) => void;
}



export function VehiculeDetaillsCard({ carRequest, onUpdate }: VehiculeDetaillsProps) {
    const handleChange = (field: keyof CarRequest, value: string | Date | undefined) => {
        onUpdate({
            ...carRequest,
            [field]: value,
        });
    };
    return (
        <div>
            Vehicule Component {carRequest.CarModel}
        </div>
    )
}