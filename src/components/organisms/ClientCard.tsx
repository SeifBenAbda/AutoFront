import { Client } from "@/types/devisTypes";
import { DatePicker } from "../atoms/DataSelector";
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import { Input } from "../../@/components/ui/input";

interface ClientCardProps {
    client: Client;
    onUpdate: (updatedClient: Client) => void;
}

export function ClientCard({ client, onUpdate }: ClientCardProps) {
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
        <Card className="pt-0 mb-5 mt-5 w-full border border-highGrey bg-highGrey">
            <div className="flex flex-col">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                    <CardTitle className="flex items-center text-whiteSecond text-lg space-x-8">
                        <div className="text-lg ">Information Client</div>
                        <div className={`border rounded-lg text-center text-sm p-2 ${client.clientType === "Particulier" ? "bg-whiteSecond text-highGrey border-whiteSecond" 
                            : "border-greenOne bg-greenOne text-lightWhite"}`}>
                            {client.clientType}
                        </div>
                    </CardTitle>
                </CardHeader>

                {/** Client Name  */}
                <CardContent>
                    <label className="block text-sm font-medium text-whiteSecond">Nom</label>
                    <Input
                        type="text"
                        value={client.nomClient || ""} // Directly bind to client prop
                        onChange={(e) => handleChange("nomClient", e.target.value)}
                        className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                {/** CIN CLIENT  */}

                {client.clientType === "Particulier" ? (
                    <CardContent>
                        <label className="block text-sm font-medium text-whiteSecond">Cin</label>
                        <Input
                            type="text"
                            value={client.cin || ""} // Directly bind to client prop
                            onChange={(e) => handleChange("cin", e.target.value)}
                            className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                        />
                    </CardContent>
                ) : (
                    <CardContent>
                        <label className="block text-sm font-medium text-whiteSecond">Matricule Fiscale</label>
                        <Input
                            type="text"
                            value={client.mtFiscale} // Directly bind to client prop
                            onChange={(e) => handleChange("mtFiscale", e.target.value)}
                            className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                        />
                    </CardContent>
                )}


                {/** Client Tel  */}
                <CardContent>
                    <label className="block text-sm font-medium text-whiteSecond">Numéro de téléphone</label>
                    <Input
                        type="text"
                        value={client.telClient} // Directly bind to client prop
                        onChange={(e) => handleChange("telClient", e.target.value)}
                        className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>


                {client.clientType =="Particulier" && (
                <CardContent>
                    <label className="block text-sm font-medium text-whiteSecond">Date de naissance</label>
                    <DatePicker
                        value={client.dateOfBirth}
                        onChange={handleDateChange}
                        fromYear={new Date().getFullYear() - 70}
                        toYear={new Date().getFullYear() - 18}
                    />
                </CardContent>)}


                {/** Client Adress  */}
                <CardContent>
                    <label className="block text-sm font-medium text-whiteSecond">Adresse</label>
                    <Input
                        type="text"
                        value={client.adresse} // Directly bind to client prop
                        onChange={(e) => handleChange("adresse", e.target.value)}
                        className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>
            </div>
        </Card>
    );
}
