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
        <Card className="pt-0 mb-5 mt-5 w-full border border-bluePrimary">
            <div className="flex flex-col">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <CardTitle className="text-bluePrimary text-lg">Information Client</CardTitle>
                </CardHeader>
                <CardContent>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <Input
                        type="text"
                        value={client.nomClient} // Directly bind to client prop
                        onChange={(e) => handleChange("nomClient", e.target.value)}
                        className="mt-1 p-2 block w-full border border-bluePrimary rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>
                <CardContent>
                    <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                    <DatePicker
                        value={client.dateOfBirth}
                        onChange={handleDateChange}
                        fromYear={new Date().getFullYear() - 70}
                        toYear={new Date().getFullYear() - 18}
                    />
                </CardContent>
            </div>
        </Card>
    );
}
