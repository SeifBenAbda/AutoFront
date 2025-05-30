import { Client, Devis } from "../../../types/devisTypes";
import { CardContent, CardTitle } from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";

import { Textarea } from "../../../@/components/ui/textarea";
import { params } from "../../../utils/params";
import PhoneInput from "../../../components/atoms/PhoneInput";

import ClientSectorsDropDown from "../../../components/atoms/ClientSectorsDropDown";
interface DevisClientDetailsProps {
    devis: Devis;
    client: Client;
    onUpdate: (updatedClient: Client) => void;
}

export function DevisClientDetails({ client, onUpdate, devis }: DevisClientDetailsProps) {
    const isEditingOpen = devis.StatusDevis == "En Cours" || devis.devisFacture == null;


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
            <CardTitle className="text-xl text-highBlue pt-4 pl-6 pr-6 font-oswald">Informations Client</CardTitle>
            <div className="grid grid-cols-2 gap-0 pt-2 pl-3  pr-6">
                {/* First Row */}

                <CardContent className="flex flex-col ">
                    <Label className="relative text-sm font-medium text-highBlue ">Nom</Label>
                    {isEditingOpen ? (
                        <Input
                            type="text"
                            value={client.nomClient || ""}
                            onChange={(e) => handleChange("nomClient", e.target.value)}
                            className={`mt-1 p-2 w-full rounded-md shadow-sm focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                        />

                    ) : (
                        <div className={`mt-1 p-2 w-full rounded-md shadow-sm sm:text-sm ${params.inputBoxStyle}`}>
                            {client.nomClient || "N/A"}
                        </div>
                    )}
                </CardContent>

                {client.clientType === "Particulier" ? (
                    <CardContent className="flex flex-col">
                        <Label className="relative text-sm font-medium text-highBlue ">Cin</Label>
                        {isEditingOpen ? (
                            <Input
                                type="text"
                                value={client.cin || ""}
                                onChange={(e) => handleChange("cin", e.target.value)}
                                className={`mt-1 p-2 w-full  rounded-md shadow-sm focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                            />
                        ) : (
                            <div className={`mt-1 p-2 w-full  rounded-md shadow-sm sm:text-sm ${params.inputBoxStyle}`}>
                                {client.cin || "N/A"}
                            </div>
                        )}
                    </CardContent>
                ) : (
                    <CardContent className="flex flex-col">
                        <Label className="relative text-sm font-medium text-highBlue ">Matricule Fiscale</Label>
                        {isEditingOpen ? (
                            <Input
                                type="text"
                                value={client.mtFiscale || ""}
                                onChange={(e) => handleChange("mtFiscale", e.target.value)}
                                className={`mt-1 p-2 w-full  rounded-md shadow-sm focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                            />
                        ) : (
                            <div className={`mt-1 p-2 w-full  rounded-md shadow-sm sm:text-sm ${params.inputBoxStyle}`}>
                                {client.mtFiscale || "N/A"}
                            </div>
                        )}
                    </CardContent>
                )}

                {/* Second Row */}
                <CardContent className="flex flex-col">
                    <Label className="relative text-sm font-medium text-highBlue ">Numéro de téléphone</Label>
                    {isEditingOpen ? (
                        <PhoneInput
                            value={client.telClient}
                            onChange={(value) => handleChange("telClient", value)}
                            className={`mt-1 p-2 w-full  rounded-md shadow-sm focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                        />
                    ) : (
                        <div className={`mt-1 p-2 w-full  rounded-md shadow-sm sm:text-sm ${params.inputBoxStyle}`}>
                            {client.telClient || "N/A"}
                        </div>
                    )}
                </CardContent>
                <CardContent className="flex flex-col">
                    <Label className="relative text-sm font-medium text-highBlue ">Numéro de téléphone 2</Label>
                    {isEditingOpen ? (
                        <PhoneInput
                            value={client.telClient2}
                            onChange={(value) => handleChange("telClient2", value)}
                            className={`mt-1 p-2 w-full  rounded-md shadow-sm focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                        />
                    ) : (
                        <div className={`mt-1 p-2 w-full  rounded-md shadow-sm sm:text-sm ${params.inputBoxStyle}`}>
                            {client.telClient2 || "N/A"}
                        </div>
                    )}
                </CardContent>

                {/* 
                
                    {client.clientType === "Particulier" && (
                    <CardContent className="flex flex-col p-2">
                        <Label className="text-sm font-oswald text-highBlue mb-1">Date de naissance</Label>
                        <DatePicker
                            value={client.dateOfBirth}
                            onChange={handleDateChange}
                            fromYear={new Date().getFullYear() - 70}
                            toYear={new Date().getFullYear() - 18}
                        />
                    </CardContent>
                )}
                */}

                {/* Address Ville + Region + Code Postale + Pays 

                <CardContent className="flex flex-col p-2 w-full">
                    <Label className="text-sm font-oswald text-highBlue">Pays</Label>
                    <Input
                        type="text"
                        value={client.pays}
                        onChange={(e) => handleChange("pays", e.target.value)}
                        className="mt-1 p-2 w-full border border-highBlue rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>


                <CardContent className="flex flex-col p-2 w-full">
                    <Label className="text-sm font-oswald text-highBlue">Ville</Label>
                    <Input
                        type="text"
                        value={client.ville}
                        onChange={(e) => handleChange("ville", e.target.value)}
                        className="mt-1 p-2 w-full border border-highBlue rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                <CardContent className="flex flex-col p-2 w-full">
                    <Label className="text-sm font-oswald text-highBlue mb-1">Region</Label>
                    <RegionDropDown
                        value={client.region}
                        onChange={(value) => handleChange("region", value)}
                        isFiltring={false}
                    />
                </CardContent>

                <CardContent className="flex flex-col p-2 w-full">
                    <Label className="text-sm font-oswald text-highBlue">Code Postal</Label>
                    <Input
                        type="text"
                        value={client.postalCode}
                        onChange={(e) => handleChange("postalCode", e.target.value)}
                        className="mt-1 p-2 w-full border border-highBlue rounded-md shadow-sm focus:ring-0 sm:text-sm"
                    />
                </CardContent>

                    */}


                <CardContent className="flex flex-col ">
                    <Label className="relative text-sm font-medium text-highBlue ">Email</Label>
                    {isEditingOpen ? (
                        <Input
                            value={client.email}
                            type="email"
                            onChange={(e) => handleChange("email", e.target.value)}
                            className={`mt-1 p-2 w-full  rounded-md shadow-sm focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                        />
                    ) : (
                        <div className={`mt-1 p-2 w-full  rounded-md shadow-sm sm:text-sm ${params.inputBoxStyle}`}>
                            {client.email || "N/A"}
                        </div>
                    )}
                </CardContent>
                <CardContent className="flex flex-col ">
                    <Label className="relative text-sm font-medium text-highBlue ">Profession</Label>
                    {isEditingOpen ? (
                        <ClientSectorsDropDown
                            value={client.socialReason || ""}
                            onChange={(value) => handleChange("socialReason", value)}
                        />
                    ) : (
                        <div className={`mt-1 p-2 w-full  rounded-md shadow-sm sm:text-sm ${params.inputBoxStyle}`}>
                            {client.socialReason || "N/A"}
                        </div>
                    )}
                </CardContent>
            </div>

            <CardContent className="flex flex-col pl-6 pr-8 w-full pt-2">
                <Label className="relative text-sm font-medium text-highBlue ">Adresse</Label>
                {isEditingOpen ? (
                    <Textarea
                        value={client.adresse}
                        onChange={(e) => handleChange("adresse", e.target.value)}
                        className={`mt-1 p-2 w-full  rounded-md shadow-sm focus:ring-0 sm:text-sm ${params.inputBoxStyle}`}
                    />
                ) : (
                    <div className={`mt-1 p-2 w-full  rounded-md shadow-sm sm:text-sm ${params.inputBoxStyle}`}>
                        {client.adresse || "N/A"}
                    </div>
                )}
            </CardContent>
        </>
    )

}
