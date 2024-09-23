import { Devis } from "../types/devisTypes";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../@/components/ui/resizable";
import { useState } from "react";
import DevisDetails from "../components/organisms/DevisDetaills";
import DevisData from "../components/organisms/DevisDataCard";

export function CarsTrackingPage() {
    const [selectedDevis, setSelectedDevis] = useState<Devis | null>(null);

    const handleDevisClick = (devis: Devis) => {
        setSelectedDevis(devis); // Update the selected devis
    };

  

    return (
        <section className="flex-1 flex flex-col ml-4 max-h-[88vh] overflow-hidden"> 
            {/* Ensures no scrolling on the entire page */}
            <div className="w-full bg-lightWhite border border-transparent rounded-md h-full">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="w-full rounded-lg border md:min-w-[450px] h-full"
                >
                    {/* DevisData panel */}
                    <ResizablePanel defaultSize={25} maxSize={50} minSize={25} className="h-full">
                        <div className="flex w-full h-full overflow-auto">
                            {/* Overflow only within DevisData */}
                            <DevisData onDevisClick={handleDevisClick} />
                        </div>
                    </ResizablePanel>

                    <ResizableHandle className="bg-lightWhite border-none border" />

                    {/* DevisDetails panel */}
                    <ResizablePanel defaultSize={75} minSize={50} className="h-full">
                        <div className="flex w-full h-full items-center justify-center bg-highGrey">
                            <DevisDetails devis={selectedDevis} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </section>
    );
}
