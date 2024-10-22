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
                <CardTitle className="text-2xl text-highGrey font-oswald mt-4 mb-3">
                    Informations Client
                </CardTitle>
            </div>


            {/** Client Name  */}
            <CardContent>
                <label className="block text-sm font-medium text-highGrey">Nom</label>
                <Input
                    type="text"
                    value={client.nomClient || ""} // Directly bind to client prop
                    onChange={(e) => handleChange("nomClient", e.target.value)}
                    className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                />
            </CardContent>

            {/** CIN CLIENT  */}

            {client.clientType === "Particulier" ? (
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey">Cin</label>
                    <Input
                        type="text"
                        value={client.cin || ""} // Directly bind to client prop
                        onChange={(e) => handleChange("cin", e.target.value)}
                        className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>
            ) : (
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey">Matricule Fiscale</label>
                    <Input
                        type="text"
                        value={client.mtFiscale} // Directly bind to client prop
                        onChange={(e) => handleChange("mtFiscale", e.target.value)}
                        className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>
            )}


            {/** Client Tel  */}
            <CardContent className="w-full">
                <label className="block text-sm font-medium text-highGrey">Numéro de téléphone</label>
                <Input
                    type="text"
                    value={client.telClient} // Directly bind to client prop
                    onChange={(e) => handleChange("telClient", e.target.value)}
                    className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                />
            </CardContent>


            {client.clientType == "Particulier" && (
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-highGrey">Date de naissance</label>
                    <DatePicker
                        value={client.dateOfBirth}
                        onChange={handleDateChange}
                        fromYear={new Date().getFullYear() - 70}
                        toYear={new Date().getFullYear() - 18}
                    />
                </CardContent>)}


            {/** Client Adress  */}
            <CardContent className="w-full">
                <label className="block text-sm font-medium text-highGrey">Adresse</label>
                <Input
                    type="text"
                    value={client.adresse} // Directly bind to client prop
                    onChange={(e) => handleChange("adresse", e.target.value)}
                    className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                />
            </CardContent>
        </Card>
    )

}