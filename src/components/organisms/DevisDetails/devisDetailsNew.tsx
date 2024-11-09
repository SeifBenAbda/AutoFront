import { Devis } from "@/types/devisTypes";
import { Dialog, DialogContent, DialogTitle } from "../../../@/components/ui/dialog";

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
                lg-custom:w-[35%]
                max-[500px]:w-[80%]  /* Reset to full at 500px */
                max-[788px]:w-[80%]
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
                <DialogTitle className="pt-4 pl-2">
                    <div className="font-oswald text-2xl">Devis N° {allData.DevisId}</div>

                </DialogTitle>
                <hr className="bg-highGrey2 w-full" />
                {/* Content goes here */}
            </DialogContent>
        </Dialog>
    );

}
