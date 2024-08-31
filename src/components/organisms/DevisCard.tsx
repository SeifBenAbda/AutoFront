import { Devis } from "@/types/devisTypes";
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import PayementMethod from "../atoms/PayementMethod";
import StatusDevisDropDown from "../atoms/StatusDevis";

interface DevisCardProps {
    devis: Devis;
    onUpdate: (updatedDevis: Devis) => void;
}

export function DevisCard({ devis, onUpdate }: DevisCardProps) {

    const handleChange = (field: keyof Devis, value: string | Date | undefined) => {
        onUpdate({
            ...devis,
            [field]: value,
        });
    };

    return (
        <Card className="pt-0 mb-5 mt-5 w-full border border-bluePrimary">
            <div className="flex flex-col">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-bluePrimary text-lg">Information Devis</CardTitle>
                </CardHeader>


                {/** Status Devis  */}

                <CardContent>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <StatusDevisDropDown
                        value={devis.StatusDevis}
                        onChange={(value) => handleChange("StatusDevis", value)}
                        isFiltring={false} 
                    />
                </CardContent>

                {/** Payement Type  */}

                <CardContent>
                    <label className="block text-sm font-medium text-gray-700">Type de Payement</label>
                    <PayementMethod
                        value={devis.PayementMethod}
                        onChange={(value) => handleChange("PayementMethod", value)}
                    />
                </CardContent>
            </div>
        </Card>
    );
}
