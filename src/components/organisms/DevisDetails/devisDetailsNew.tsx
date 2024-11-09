import { Devis } from "@/types/devisTypes";
import { Dialog, DialogContent, DialogTitle } from "../../../@/components/ui/dialog";
import { CircleX } from "lucide-react";

type DevisDetailsPageProps = {
    allData: Devis;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Devis) => void;
};

export function DevisDetailsPage({
    allData,
    isOpen,
    onClose,
    onSave
}: DevisDetailsPageProps) {
    return (
        <Dialog open={isOpen}>

            <DialogContent
                style={{ transform: 'none' }}  // Override default transform
                className="
                flex flex-col
                !fixed !inset-y-0 !right-0 !left-auto
                w-full 
                text-start
                sm-custom:w-[60%] 
                md-custom:w-[60%] 
                min-[1300px]:w-[35%]
                max-[550px]:w-[70%]  /* Reset to full at 500px */
                max-[788px]:w-[60%]
                min-[900px]:w-[50%]
                min-[1040px]:w-[45%]
                h-[92vh]
                p-0
                m-4
                mt-14
                rounded-lg
                border-whiteSecond
                bg-whiteSecond 
                overflow-y-auto 
                shadow-lg
                !max-w-none
                duration-500
                data-[state=open]:animate-in
                data-[state=closed]:animate-out
                data-[state=closed]:slide-out-to-right
                data-[state=open]:slide-in-from-right
              "
            >
                <DialogTitle className="pt-4 pl-2 flex flex-row justify-between">
                    <div className="font-oswald text-2xl">Devis N° {allData.DevisId}</div>
                    <CircleX className="h-7 w-7 mr-2 cursor-pointer" onClick={onClose} />
                </DialogTitle>
                <hr className="bg-highGrey2 w-full" />
                {/* Content goes here */}
            </DialogContent>
        </Dialog>
    );

}
