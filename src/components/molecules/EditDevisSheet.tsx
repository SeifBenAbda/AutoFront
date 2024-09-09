import { useState, useEffect } from 'react';
import { CarRequest, Client, Devis, ItemRequest, Rappel } from "@/types/devisTypes";
import { Button } from "../../@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../../@/components/ui/sheet";
import { ClientCard } from "../organisms/ClientCard";
import { CarRequestCard } from '../organisms/CarRequestCard';
import { DevisCard } from '../organisms/DevisCard';
import { useUser } from '../../context/userContext'; // Import the useUser hook
import { useUpdateDevis } from '../../hooks/useDevis'; // Import the useUpdateDevis hook
import { RappelCard } from '../organisms/RappelsCard';

interface EditDevisSheetProps {
    allData: Devis;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Devis) => void;
}

export function EditDevisSheet({
    allData,
    isOpen,
    onClose,
    onSave,
}: EditDevisSheetProps) {
    const { user } = useUser(); // Get user from context
    const [client, setClient] = useState<Client>(allData.client!);
    const [carRequest, setCarRequest] = useState<CarRequest | null>(allData.carRequests?.[0] || null);
    const [itemRequests, setItemRequests] = useState<ItemRequest[]>(allData.itemRequests || []);
    const [devis, setDevis] = useState<Devis>(allData);
    const [rappels, setRappels] = useState<Rappel[]>(allData.rappels);

    const [showClientCard, setShowClientCard] = useState(true);
    const [showCarRequestCard, setShowCarRequestCard] = useState(true);
    const [showDevisCard, setShowDevisCard] = useState(true);
    const [showRapelCard, setShowRappelCard] = useState(true);

    const { mutate: updateDevis, isPending, isError, isSuccess } = useUpdateDevis();

    useEffect(() => {
        setShowClientCard(true);
        setShowCarRequestCard(true);
        setShowDevisCard(true);
        setShowRappelCard(true);
        setClient(allData.client!);
        setCarRequest(allData.carRequests?.[0] || null);
        setItemRequests(allData.itemRequests || []);
        setDevis(allData);
        setRappels(allData.rappels);
    }, [allData]);

    const handleClientUpdate = (updatedClient: Client) => {
        setClient(updatedClient);
        setDevis(prevDevis => ({
            ...prevDevis,
            client: updatedClient,
            UpdatedAt: new Date(), // Update timestamp
            UpdatedBy: user?.nomUser || "Unknown User" // Set user name or fallback
        }));
    };

    const handleCarRequestUpdate = (updatedCarRequest: CarRequest) => {
        setCarRequest(updatedCarRequest);
        setDevis(prevDevis => ({
            ...prevDevis,
            carRequests: updatedCarRequest ? [updatedCarRequest] : [],
            UpdatedAt: new Date(), // Update timestamp
            UpdatedBy: user?.nomUser || "Unknown User" // Set user name or fallback
        }));
    };

    const handleItemRequestUpdate = (updatedItemRequests: ItemRequest[]) => {
        setItemRequests(updatedItemRequests);
        setDevis(prevDevis => ({
            ...prevDevis,
            itemRequests: updatedItemRequests,
            UpdatedAt: new Date(), // Update timestamp
            UpdatedBy: user?.nomUser || "Unknown User" // Set user name or fallback
        }));
    };

    const handleDevisUpdate = (updatedDevis: Devis) => {
        setDevis(prevDevis => ({
            ...prevDevis,
            ...updatedDevis, // Spread the existing devis and updatedDevis fields
            UpdatedAt: new Date(), // Update timestamp
            UpdatedBy: user?.nomUser || "Unknown User" // Set user name or fallback
        }));
    };


    const handleRappelUpdate = (updatedRappels: Rappel[]) => {
        setRappels(updatedRappels); // Update the local rappels state
        setDevis(prevDevis => ({
            ...prevDevis,
            rappels: updatedRappels, // Update the rappels in the devis object
            UpdatedAt: new Date(), // Update timestamp
            UpdatedBy: user?.nomUser || "Unknown User" // Set user name or fallback
        }));
    };

    const handleSave = async () => {
        try {
            await updateDevis({
                database: "Commer_2024_AutoPro", // Replace with actual database name
                devisId: devis.DevisId!,
                clientId: client.id!,
                updatedDevis: devis,
                updatedClient: client,
                updatedItemRequestData: itemRequests.length > 0 ? itemRequests[0] : undefined,
                updatedCarRequestData: carRequest || undefined,
                updatedRappels:rappels || undefined
            });
            onSave(devis);
            onClose();
        } catch (error) {
            console.error('Failed to save updates:', error);
            // Handle error (e.g., show a notification)
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()} className='bg-lightWhite'>
                <SheetHeader>
                    <SheetTitle className='text-highGrey'>Consulter Devis N° {allData.DevisId}</SheetTitle>
                    <SheetDescription>
                        Apportez des modifications à Devis ici. Cliquez sur enregistrer lorsque vous avez terminé.
                    </SheetDescription>
                </SheetHeader>

                {/* Toggle Buttons */}
                <div className="flex flex-wrap gap-4 mb-4 mt-2">
                    <Button
                        className={`${showClientCard ? 'bg-greenOne hover:bg-greenOne' : 'bg-gray-200 text-highGrey hover:bg-gray-300'
                            } w-full md:w-auto`}
                        onClick={() => setShowClientCard(!showClientCard)}
                    >
                        Données client
                    </Button>
                    <Button
                        className={`${showCarRequestCard ? 'bg-greenOne hover:bg-greenOne' : 'bg-gray-200 text-highGrey hover:bg-gray-300'
                            } w-full md:w-auto`}
                        onClick={() => setShowCarRequestCard(!showCarRequestCard)}
                    >
                        Données Véhicule
                    </Button>

                    <Button
                        className={`${showDevisCard ? 'bg-greenOne hover:bg-greenOne' : 'bg-gray-200 text-highGrey hover:bg-gray-300'
                            } w-full md:w-auto`}
                        onClick={() => setShowDevisCard(!showDevisCard)}
                    >
                        Données Devis
                    </Button>

                    <Button
                        className={`${showRapelCard ? 'bg-greenOne hover:bg-greenOne' : 'bg-gray-200 text-highGrey hover:bg-gray-300'
                            } w-full md:w-auto`}
                        onClick={() => setShowRappelCard(!showRapelCard)}
                    >
                        Rappels
                    </Button>
                </div>

                {/* Conditionally Render Cards */}
                {showClientCard && (
                    <ClientCard client={client} onUpdate={handleClientUpdate} />
                )}
                {showCarRequestCard && carRequest && (
                    <CarRequestCard carRequest={carRequest} onUpdate={handleCarRequestUpdate} />
                )}
                {showDevisCard && (
                    <DevisCard devis={devis} onUpdate={handleDevisUpdate} />
                )}

                {showRapelCard && (
                    <RappelCard rappels={rappels} onUpdate={handleRappelUpdate} />
                )}

                <SheetFooter>
                    <Button onClick={handleSave} type="button" disabled={isPending} className='bg-greenOne border boorder-greenOne hover:bg-greenOne'>
                        {isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </Button>
                    <SheetClose asChild>
                        <Button type="button" onClick={onClose} className='bg-lightRed border boorder-lightRed mb-2 hover:bg-lightRed'>
                            Fermer
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
