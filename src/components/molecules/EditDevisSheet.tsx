import { useState, useEffect } from 'react';
import { Client, Devis } from "@/types/devisTypes";
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
    const [client, setClient] = useState<Client>(allData.client);

    // Synchronize the state with incoming props
    useEffect(() => {
        setClient(allData.client);
    }, [allData]);

    const handleClientUpdate = (updatedClient: Client) => {
        setClient(updatedClient);
    };

    const handleSave = () => {
        onSave({
            ...allData,
            client: client,
        });
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
                <ClientCard client={client} onUpdate={handleClientUpdate} />
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
