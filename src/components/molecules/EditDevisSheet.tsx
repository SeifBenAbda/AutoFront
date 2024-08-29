import { useState, useEffect } from 'react';
import { CarRequest, Client, Devis, ItemRequest } from "@/types/devisTypes";
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
    const [client, setClient] = useState<Client>(allData.client);
    const [carRequest, setCarRequest] = useState<CarRequest | null>(allData.carRequests?.[0] || null);
    const [itemRequests, setItemRequests] = useState<ItemRequest[]>(allData.itemRequests || []);
    const [devis, setDevis] = useState<Devis>(allData);

    const [showClientCard, setShowClientCard] = useState(true);
    const [showCarRequestCard, setShowCarRequestCard] = useState(true);
    const [showDevisCard, setShowDevisCard] = useState(true);

    useEffect(() => {
        setShowClientCard(true);
        setShowCarRequestCard(true);
        setShowDevisCard(true);
        setClient(allData.client);
        setCarRequest(allData.carRequests?.[0] || null);
        setItemRequests(allData.itemRequests || []);
        setDevis(allData);
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

    const handleSave = () => {
        onSave(devis);
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <SheetHeader>
                    <SheetTitle>Consulter Devis N° {allData.DevisId}</SheetTitle>
                    <SheetDescription>
                        Apportez des modifications à Devis ici. Cliquez sur enregistrer lorsque vous avez terminé.
                    </SheetDescription>
                </SheetHeader>

                {/* Toggle Buttons */}
                <div className="flex flex-wrap gap-4 mb-4 mt-2">
                    <Button
                        className={`${showClientCard ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 text-bluePrimary hover:bg-gray-300'
                            } w-full md:w-auto`}
                        onClick={() => setShowClientCard(!showClientCard)}
                    >
                        Données client
                    </Button>
                    <Button
                        className={`${showCarRequestCard ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 text-bluePrimary hover:bg-gray-300'
                            } w-full md:w-auto`}
                        onClick={() => setShowCarRequestCard(!showCarRequestCard)}
                    >
                        Données Véhicule
                    </Button>

                    <Button
                        className={`${showDevisCard ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 text-bluePrimary hover:bg-gray-300'
                            } w-full md:w-auto`}
                        onClick={() => setShowDevisCard(!showDevisCard)}
                    >
                        Données Devis
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

                <SheetFooter>
                    <Button onClick={handleSave} type="button">
                        Enregistrer les modifications
                    </Button>
                    <SheetClose asChild>
                        <Button type="button" onClick={onClose}>
                            Fermer
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
