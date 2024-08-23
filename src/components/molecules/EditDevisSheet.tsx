// EditDevisSheet.tsx
import { useEffect, useState } from "react";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { Label } from "../../@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "../../@/components/ui/sheet";

interface EditDevisSheetProps {
    allData: any; // Replace `any` with a more specific type if possible
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void; // Define the shape of the data if possible
}

export function EditDevisSheet({
    //numero,
    allData, // Destructure other data here
    isOpen,
    onClose,
    onSave,
}: EditDevisSheetProps) {
    const [localNumero, setLocalNumero] = useState(allData.numero);
    // Define states for other data if needed

    useEffect(() => {
        setLocalNumero(allData.numero); // Update localNumero when numero prop changes
    }, [allData]);

    const handleSave = () => {
        onSave({
            numero: localNumero,
            // Include other data in the payload
        });
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Consulter Devis N° {allData.numero}</SheetTitle>
                    <SheetDescription>
                        Apportez des modifications à Devis ici. Cliquez sur enregistrer lorsque vous avez terminé.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numero" className="text-right">
                            Numero
                        </Label>
                        <Input
                            id="numero"
                            value={localNumero}
                            onChange={(e) => setLocalNumero(e.target.value)}
                        />
                    </div>
                    {/* Render other fields based on `otherData` */}
                </div>
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
