import { Devis } from "@/types/devisTypes";

interface DocumentsCardProps {
    devis: Devis;
    onUpdate: (updatedDevis: Devis) => void;
}


export function DocumentsDetaillsCard ({ devis, onUpdate } :DocumentsCardProps ) {
   
    const handleChange = (field: keyof Devis, value: string | Date | undefined) => {
        onUpdate({
            ...devis,
            [field]: value,
        });
    };
   
    return (
        <div>
            Devis Documents {devis.DevisId}
        </div>
    )
}

