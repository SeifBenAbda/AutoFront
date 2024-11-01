import { Label } from "../../@/components/ui/label";
import { Button } from "../../@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../@/components/ui/dialog";
import { Input } from "../../@/components/ui/input";
import { Devis } from "../../types/devisTypes";
import DevisDetails from "./DevisDetaills";
import { DialogPortal } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface DialogDevisDetailsProps {
    allData: Devis;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Devis) => void;
}

export function DialogDevisDetails({
    allData,
    isOpen,
    onClose,
    onSave
}: DialogDevisDetailsProps) {
    return (
        <Dialog open={isOpen} >
            <DialogTitle></DialogTitle>
            <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh] overflow-y-auto bg-highGrey2 border border-highGrey2">
                <DevisDetails devis={allData} onDevisCancel={onClose} />
            </DialogContent>
        </Dialog>
    );
}