import { Client } from "../../../types/devisTypes";
import { Card, CardContent, CardTitle } from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { DatePicker } from "../../../components/atoms/DataSelector";
import { Label } from "../../../@/components/ui/label";
import RegionDropDown from "../../../components/atoms/RegionDropDown";
import { Textarea } from "../../../@/components/ui/textarea";
interface DevisClientDetailsProps {
    client: Client;
    onUpdate: (updatedClient: Client) => void;
}


export function DevisClientDetails({ client, onUpdate }: DevisClientDetailsProps) {

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
        <>
            <div className="grid grid-cols-2 gap-0 pt-2 pl-6 pr-6">
                {/* First Row */}
                <CardContent className="flex flex-col p-2">
                    <Label className="text-sm font-oswald text-highGrey2">Nom</Label>
                    <Input
                        type="text"
                        value={client.nomClient || ""}
                        onChange={(e) => handleChange("nomClient", e.target.value)}
                        className="mt-1 p-2 w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                {client.clientType === "Particulier" ? (
                    <CardContent className="flex flex-col p-2">
                        <Label className="text-sm font-oswald text-highGrey2">Cin</Label>
                        <Input
                            type="text"
                            value={client.cin || ""}
                            onChange={(e) => handleChange("cin", e.target.value)}
                            className="mt-1 p-2 w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                        />
                    </CardContent>
                ) : (
                    <CardContent className="flex flex-col p-2">
                        <Label className="text-sm font-oswald text-highGrey2">Matricule Fiscale</Label>
                        <Input
                            type="text"
                            value={client.mtFiscale}
                            onChange={(e) => handleChange("mtFiscale", e.target.value)}
                            className="mt-1 p-2 w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                        />
                    </CardContent>
                )}

                {/* Second Row */}
                <CardContent className="flex flex-col p-2">
                    <Label className="text-sm font-oswald text-highGrey2">Numéro de téléphone</Label>
                    <Input
                        type="text"
                        value={client.telClient}
                        onChange={(e) => handleChange("telClient", e.target.value)}
                        className="mt-1 p-2 w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                {client.clientType === "Particulier" && (
                    <CardContent className="flex flex-col p-2">
                        <Label className="text-sm font-oswald text-highGrey2 mb-1">Date de naissance</Label>
                        <DatePicker
                            value={client.dateOfBirth}
                            onChange={handleDateChange}
                            fromYear={new Date().getFullYear() - 70}
                            toYear={new Date().getFullYear() - 18}
                        />
                    </CardContent>
                )}

                {/* Address Ville + Region + Code Postale + Pays */}

                <CardContent className="flex flex-col p-2 w-full">
                    <Label className="text-sm font-oswald text-highGrey2">Pays</Label>
                    <Input
                        type="text"
                        value={client.pays}
                        onChange={(e) => handleChange("pays", e.target.value)}
                        className="mt-1 p-2 w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>


                <CardContent className="flex flex-col p-2 w-full">
                    <Label className="text-sm font-oswald text-highGrey2">Ville</Label>
                    <Input
                        type="text"
                        value={client.ville}
                        onChange={(e) => handleChange("ville", e.target.value)}
                        className="mt-1 p-2 w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                <CardContent className="flex flex-col p-2 w-full">
                    <Label className="text-sm font-oswald text-highGrey2 mb-1">Region</Label>
                    <RegionDropDown
                        value={client.region}
                        onChange={(value) => handleChange("region", value)}
                        isFiltring={false}
                    />
                </CardContent>

                <CardContent className="flex flex-col p-2 w-full">
                    <Label className="text-sm font-oswald text-highGrey2">Code Postal</Label>
                    <Input
                        type="text"
                        value={client.postalCode}
                        onChange={(e) => handleChange("postalCode", e.target.value)}
                        className="mt-1 p-2 w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>


            </div>
            <CardContent className="flex flex-col pl-8 pr-8 w-full pt-2">
                <Label className="text-sm font-oswald text-highGrey2">Adresse</Label>
                <Textarea

                    value={client.adresse}
                    onChange={(e) => handleChange("adresse", e.target.value)}
                    className="mt-1 p-2 w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                />
            </CardContent>
        </>
    )

}