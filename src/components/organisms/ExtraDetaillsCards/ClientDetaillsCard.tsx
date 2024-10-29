import { Input } from "../../../@/components/ui/input";
import { Card, CardContent, CardTitle } from "../../../@/components/ui/card";
import { Client } from "../../../types/devisTypes";
import { DatePicker } from "../../../components/atoms/DataSelector";

interface ClientCardProps {
    client: Client;
    onUpdate: (updatedClient: Client) => void;
}



export function ClientDetaillsCard({ client, onUpdate }: ClientCardProps) {

    const handleDateChange = (date: Date | undefined) => {
        onUpdate({
            ...client,
            dateOfBirth: date || client.dateOfBirth,
        });
    };

    const handleChange = (field: keyof Client, value: string | Date | undefined) => {
        onUpdate({
            ...client,
            [field]: value,
        });
    };

    return (
        <Card className="bg-lightWhite border border-lightWhite flex flex-col overflow-y-scroll">


            <div className="flex justify-center w-full">
                <CardTitle className="text-2xl text-highGrey2 font-oswald mt-4 mb-3">
                    Informations Client
                </CardTitle>
            </div>


            <div className="grid grid-cols-2 gap-4 p-4">
                {/* First Row */}
                <CardContent className="p-2">
                    <label className="block text-sm font-medium text-highGrey2">Nom</label>
                    <Input
                        type="text"
                        value={client.nomClient || ""}
                        onChange={(e) => handleChange("nomClient", e.target.value)}
                        className="mt-1 p-2 block w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                {client.clientType === "Particulier" ? (
                    <CardContent className="p-2">
                        <label className="block text-sm font-medium text-highGrey2">Cin</label>
                        <Input
                            type="text"
                            value={client.cin || ""}
                            onChange={(e) => handleChange("cin", e.target.value)}
                            className="mt-1 p-2 block w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                        />
                    </CardContent>
                ) : (
                    <CardContent className="p-2">
                        <label className="block text-sm font-medium text-highGrey2">Matricule Fiscale</label>
                        <Input
                            type="text"
                            value={client.mtFiscale}
                            onChange={(e) => handleChange("mtFiscale", e.target.value)}
                            className="mt-1 p-2 block w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                        />
                    </CardContent>
                )}

                {/* Second Row */}
                <CardContent className="p-2">
                    <label className="block text-sm font-medium text-highGrey2">Numéro de téléphone</label>
                    <Input
                        type="text"
                        value={client.telClient}
                        onChange={(e) => handleChange("telClient", e.target.value)}
                        className="mt-1 p-2 block w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                {client.clientType === "Particulier" && (
                    <CardContent className="p-2">
                        <label className="block text-sm font-medium text-highGrey2">Date de naissance</label>
                        <DatePicker
                            value={client.dateOfBirth}
                            onChange={handleDateChange}
                            fromYear={new Date().getFullYear() - 70}
                            toYear={new Date().getFullYear() - 18}
                        />
                    </CardContent>
                )}
            </div>

            {/* Full-width Address Section */}
            <div className="px-4 pb-4">
                <CardContent className="p-2">
                    <label className="block text-sm font-medium text-highGrey2">Adresse</label>
                    <Input
                        type="text"
                        value={client.adresse}
                        onChange={(e) => handleChange("adresse", e.target.value)}
                        className="mt-1 p-2 block w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>
            </div>
        </Card>
    )

}