import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../@/components/ui/card";
import { Button } from "../@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { devisSchemaForItems } from "../shemas/devisFormShemas";
import { defaultFormClient, defaultGeneralItemChnageForm, defaultItemRequestList, defaultRappelList } from "../utils/defaultFormValues";
import { useCreateDevis } from "../hooks/useDevis";  
import { useUser } from "../context/userContext";
import ItemRequestForm from "../components/organisms/ItemRequestForm";
import Loading from "../components/atoms/Loading";
import ClientModal from "../components/atoms/ClientModal";  // Import the modal

const ItemChangePage: React.FC = () => {
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);  // Modal state
    const [selectedClient, setSelectedClient] = useState(defaultFormClient);  // Selected client state
    const { user } = useUser();
    
    // Initial form setup with selected client
    const form = useForm<z.infer<typeof devisSchemaForItems>>({
        resolver: zodResolver(devisSchemaForItems),
        defaultValues: {
            clientForm: selectedClient,  // Start with selectedClient state here
            rappelForm: defaultRappelList,
            itemRequests: defaultItemRequestList,
            itemChangeForm:defaultGeneralItemChnageForm
        }
    });

    const { mutateAsync: createDevis } = useCreateDevis();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (values: z.infer<typeof devisSchemaForItems>) => {
        setIsLoading(true); 
        try {
            const itemRequests = values.itemRequests.map(itemRequest => ({
                ...itemRequest,
                RequestDate: new Date(),
                CreatedBy: user!.nomUser,
            }));

            const mergedValues = {
                database: "Commer_2024_AutoPro",
                client: selectedClient, // Use the selected client data
                itemRequestData: itemRequests
            };

            // Submit the merged data
            console.log("Submitted Data: ", mergedValues);
            setIsLoading(false);
        } catch (error) {
            console.error("Error submitting form:", error);
            setIsLoading(false);
        }
    };

    const handleSelectClient = (client: any) => {
        setSelectedClient(client);  // Update selected client
        setIsClientModalOpen(false);  // Close modal
        form.reset({ clientForm: client });  // Update form with selected client
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <Loading />
                </div>
            )}

            <Card className="p-2 m-1 bg-veryGrey border border-veryGrey">
                <div className="flex flex-col">
                    <CardHeader className="ml-4 mr-4 flex flex-col md:flex-row md:items-center md:justify-between fixed top-[60px] left-0 right-0 bg-veryGrey z-10 p-4 border-b border-veryGrey">
                        <div className="flex-1">
                            <CardTitle className="text-darkGrey">Devis</CardTitle>
                            <CardDescription>Devis pour Changement des Pieces</CardDescription>
                        </div>
                        <div className="flex flex-row space-x-2 mt-2 md:mt-0 md:flex-1 md:justify-end">
                            <Button
                                onClick={() => setIsClientModalOpen(true)}  // Open modal on click
                                type="button"
                                disabled={isLoading}
                                className="bg-lightWhite hover:bg-lightWhite border border-darkGrey text-darkGrey"
                            >
                                Client existant
                            </Button>
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                type="button"
                                disabled={isLoading}
                                className="bg-greenOne hover:bg-greenOne"
                            >
                                Valider Devis
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="lg-custom:mt-[70px] md-custom:mt-[65px] sm-custom:mt-[80px] sm:mt-[120px] mt-[110px]">
                        <ItemRequestForm form={form} />
                    </CardContent>
                </div>
            </Card>

            {/* Modal for client selection */}
            <ClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
                onSelectClient={handleSelectClient}
                selectedClient={selectedClient}  // Replace with your client data
            />
        </div>
    );
};

export default ItemChangePage;
