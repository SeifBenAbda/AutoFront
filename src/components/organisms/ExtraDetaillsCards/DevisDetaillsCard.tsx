import { Card, CardTitle } from "../../../@/components/ui/card";
import { Devis } from "@/types/devisTypes";

interface DevisCardProps {
    devis: Devis;
    onUpdate: (updatedDevis: Devis) => void;
}


export function DevisDetaillsCard({ devis, onUpdate }: DevisCardProps) {

    const handleChange = (field: keyof Devis, value: string | Date | undefined) => {
        onUpdate({
            ...devis,
            [field]: value,
        });
    };

    return (
        <Card className="bg-lightWhite border border-lightWhite items-center flex flex-col">

            <CardTitle className="text-lg text-highGrey font-oswald">Devis N° {devis.DevisId}</CardTitle>
        </Card>
    )
}

