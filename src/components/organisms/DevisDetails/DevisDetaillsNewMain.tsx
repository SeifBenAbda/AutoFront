import React, { useState, useEffect, ReactNode } from "react";
import { CarRequest, Client, Devis, Rappel } from "../../../types/devisTypes";
import { UserRoundCog, FileText, Edit3, Car, BellRing, Files } from "lucide-react";
import { useUser } from "../../../context/userContext";
import { DevisGlobalDetails } from "./DevisGlobalDetails";
import { Button } from "../../../@/components/ui/button";
import { useUpdateDevis } from "../../../hooks/useDevis";
import { DevisClientDetails } from "./DevisClientDetails";
import { DevisVehiculeDetails } from "./DevisVehiculeDetails";
import { set } from "date-fns";
import { DevisRappelsDetails } from "./DevisRappelsDetails";
import { DevisDoucmentDetails } from "./DevisDoucmentDetails";

interface DevisDetailsNewMainProps {
    devis: Devis;
    isOpen: boolean;
    onClose: () => void;
    isAdmin : boolean;
    onSave: (data: Devis) => void;
}

type StepCircleProps = {
    isActive: boolean;
    stepIcon: React.ElementType;
    stepLabel: string;
    onClick: () => void;
};

interface StepConfig {
    label: string;
    component: ReactNode;
}

const StepCircle = ({ isActive, onClick, stepIcon: Icon, stepLabel }: StepCircleProps) => (
    <div className="flex flex-col items-center min-w-[60px]">
        <div
            onClick={onClick}
            className={`
                w-14 h-14 rounded-full 
                border-2 border-dashed 
                flex items-center justify-center 
                cursor-pointer ${isActive ? "border-highBlue" : "border-gray-400"
                }`}
        >
            {isActive ? (
                <div className="w-10 h-10 rounded-full bg-blueCiel flex items-center justify-center">
                    <Icon className="text-highBlue h-6 w-6" />
                </div>
            ) : (
                <Icon className="text-gray-700 h-6 w-6" />
            )}
        </div>
        <span className={`mt-2 text-base font-oswald text-highBlue ${isActive ? "font-semibold" : ""}`}>
            {stepLabel}
        </span>
    </div>
);

const DevisDetailsNewMain: React.FC<DevisDetailsNewMainProps> = ({ devis, isOpen, onClose, isAdmin, onSave }) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const { user } = useUser();
    const [myDevis, setDevis] = useState<Devis | null>(devis);
    const [rappels, setRappels] = useState<Rappel[]>(devis?.rappels || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [client, setClient] = useState<Client>(devis.client!);
    const [carRequest, setCarRequest] = useState<CarRequest | null>(devis.carRequests?.[0] || null);
    const [myToastCloseStyle, setMyToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite");

    const { mutateAsync: updateDevis } = useUpdateDevis();
    const totalSteps = [
        { icon: FileText, label: "Devis" },
        { icon: UserRoundCog, label: "Client" },
        { icon: Car, label: "Véhicule" },
        { icon: BellRing, label: "Rappels" },
        { icon: Files, label: "Documents" },
    ];

    const handleClientUpdate = (updatedClient: Client) => {
        setClient(updatedClient);
        setDevis(prevDevis => prevDevis ? ({
            ...prevDevis,
            client: updatedClient,
            UpdatedAt: new Date(),
            UpdatedBy: user?.nomUser || "Unknown User"
        }) : null);
    };

    const handleDevisUpdate = (updatedDevis: Devis) => {
        setDevis(prevDevis => ({
            ...prevDevis,
            ...updatedDevis, // Spread the existing devis and updatedDevis fields
            UpdatedAt: new Date(), // Update timestamp
            UpdatedBy: user?.nomUser || "Unknown User" // Set user name or fallback
        }));
    };


    const handleCarRequestUpdate = (updatedCarRequest: CarRequest) => {
        setCarRequest(updatedCarRequest);
        setDevis(prevDevis => prevDevis ? ({
            ...prevDevis,
            carRequests: updatedCarRequest ? [updatedCarRequest] : [],
            UpdatedAt: new Date(),
            UpdatedBy: user?.nomUser || "Unknown User"
        }) : null);
    };

    const handleRappelUpdate = (updatedRappels: Rappel[]) => {
        setRappels(updatedRappels);
        setDevis(prevDevis => prevDevis ? ({
            ...prevDevis,
            rappels: updatedRappels,
            UpdatedAt: new Date(),
            UpdatedBy: user?.nomUser || "Unknown User"
        }) : null);
    };



    const handleSave = async () => {

        setLoading(true);
        try {
            updateDevis({
                database: "Commer_2024_AutoPro",
                devisId: devis!.DevisId!,
                clientId: myDevis!.client?.id!,
                updatedDevis: myDevis!,
                updatedClient: myDevis!.client,
                updatedItemRequestData: undefined,
                updatedCarRequestData: myDevis!.carRequests?.[0] || undefined,
                updatedRappels: rappels || undefined,
                updatedDevisFacture: myDevis!.devisFacture || undefined,
                updatedDevisReserved: myDevis!.devisReserved || undefined,
                updatedDevisPayementDetails: myDevis!.devisPayementDetails || undefined
            }).then(() => { onSave(myDevis!); setLoading(false); onClose(); });
        } catch (error) {
            console.error('Failed to save updates:', error);

        }

    };

    const steps: StepConfig[] = myDevis ? [
        { label: 'Devis', component: <DevisGlobalDetails devis={myDevis} onUpdate={handleDevisUpdate} isAdmin={isAdmin} /> },
        { label: 'Client', component: <DevisClientDetails client={myDevis.client!} onUpdate={handleClientUpdate} /> },
        { label: 'Vehicule', component: <DevisVehiculeDetails carRequest={myDevis.carRequests?.[0] || null} onUpdate={handleCarRequestUpdate} devis={myDevis} onUpdateDevis={handleDevisUpdate} /> },
        { label: 'Rappels', component: <DevisRappelsDetails rappels={myDevis.rappels} onUpdate={handleRappelUpdate} devisId={devis?.DevisId || 0} /> },
        { label: 'Documents', component: <DevisDoucmentDetails devis={myDevis} /> },
    ] : [];

    useEffect(() => {
        setActiveStep(0);
    }, [devis]);

    const StepIndicator = () => (
        <div className="sticky top-0 z-10 bg-lightWhite flex items-center justify-center space-x-2 overflow-x-auto scrollbar-hide pl-4 pr-4 py-2">
            {totalSteps.map((step, index) => (
                <React.Fragment key={index}>
                    <StepCircle
                        isActive={index === activeStep}
                        onClick={() => setActiveStep(index)}
                        stepIcon={step.icon}
                        stepLabel={step.label}
                    />
                    {index < totalSteps.length - 1 && (
                        <div className="w-10 h-1 border-t-2 border-dashed border-gray-400 mb-5" />
                    )}
                </React.Fragment>
            ))}
        </div>
    );


    const Loading = () => (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-20 flex items-center justify-center">
            <div className="spinner-border text-white w-12 h-12 border-4 border-t-4 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );


    return (
        <div className="relative flex flex-col space-y-2 pt-2">
            {/* Display Loading overlay if loading state is true */}
            {loading && <Loading />}

            <StepIndicator />

            <div className="overflow-y-auto h-auto">
                {steps[activeStep]?.component}
            </div>

            {/* Sticky Bottom Button */}
            {steps[activeStep]?.label !== "Documents" && (
                <div className="sticky bottom-0 bg-transprent p-2 pr-7 pl-7">
                    <Button onClick={handleSave} className="w-full py-2 text-white bg-highBlue rounded-md">
                        Enregistrer
                    </Button>
                </div>
            )}
        </div>
    );
};


export default DevisDetailsNewMain;

