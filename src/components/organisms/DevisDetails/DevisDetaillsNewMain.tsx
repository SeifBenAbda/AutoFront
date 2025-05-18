import React, { useState, useEffect, ReactNode } from "react";
import { CarRequest, Client, Devis, Rappel } from "../../../types/devisTypes";
import { UserRoundCog, FileText, Car, BellRing, Files } from "lucide-react";
import { useUser } from "../../../context/userContext";
import { DevisGlobalDetails } from "./DevisGlobalDetails";
import { useUpdateDevis } from "../../../hooks/useDevis";
import { DevisClientDetails } from "./DevisClientDetails";
import { DevisVehiculeDetails } from "./DevisVehiculeDetails";
import { DevisRappelsDetails } from "./DevisRappelsDetails";
import { DevisDoucmentDetails } from "./DevisDoucmentDetails";
import { databaseName, getErrorBanqueSelection, getModificationErros, isErrorBanqueSelection } from "../../../utils/shared_functions";
import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent, CardTitle } from "../../../@/components/ui/card";
import { useGenerateBcInterne } from "../../../hooks/useUploadFiles";
import { useNavigate } from "react-router-dom";
import Loading from "../../../components/atoms/Loading";
import { Button } from "../../../@/components/ui/button";
import { Toaster } from "../../../@/components/ui/toaster";

interface DevisDetailsNewMainProps {
    devis: Devis;
    isOpen: boolean;
    onClose: () => void;
    isAdmin: boolean;
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
    <div className="flex items-center space-x-4 w-full">
        <div
            onClick={onClick}
            className={`
        flex-shrink-0 
        w-14 h-14 
        rounded-full 
        border-2 border-dashed 
        flex items-center justify-center 
        cursor-pointer 
        ${isActive ? "border-highBlue" : "border-gray-400"}
      `}
        >
            {isActive ? (
                <div className="w-10 h-10 rounded-full bg-blueCiel flex items-center justify-center">
                    <Icon className="text-highBlue h-6 w-6" />
                </div>
            ) : (
                <Icon className="text-gray-700 h-6 w-6" />
            )}
        </div>
        <span
            className={`
        flex-grow 
        text-base 
        font-oswald 
        text-highBlue 
        text-left 
        min-w-0 
        truncate 
        ${isActive ? "font-semibold" : ""}
      `}
        >
            {stepLabel}
        </span>
    </div>
);
const DevisDetailsNewMain: React.FC<DevisDetailsNewMainProps> = ({ devis, isOpen, onClose, isAdmin, onSave }) => {
    const generationBcInterneAvailable = devis.StatusDevis !== "En attente" && devis.StatusDevis!=="En Cours" && devis.StatusDevis !== "Annulé" ;
    const [activeStep, setActiveStep] = useState<number>(0);
    const { user } = useUser();
    const [myDevis, setDevis] = useState<Devis | null>(devis);
    const [rappels, setRappels] = useState<Rappel[]>(devis?.rappels || []);
    const [loading, setLoading] = useState<boolean>(false);
    const [client, setClient] = useState<Client>(devis.client!);
    const [carRequest, setCarRequest] = useState<CarRequest | null>(devis.carRequests?.[0] || null);
    const [myToastCloseStyle, setMyToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite");
    const { toast } = useToast();
    const { mutateAsync: updateDevis } = useUpdateDevis();
    const navigate = useNavigate();
    const { mutateAsync: generateBcInterne } = useGenerateBcInterne(devis.DevisId!, navigate);
    const totalSteps = [

        { icon: UserRoundCog, label: "Client" },
        { icon: Car, label: "Véhicule" },
        { icon: FileText, label: "Devis" },
        { icon: BellRing, label: "Rappels" },
        { icon: Files, label: "Documents" },
    ];

    const handleClientUpdate = (updatedClient: Client) => {
        setClient(updatedClient);
        setDevis(prevDevis => prevDevis ? ({
            ...prevDevis,
            client: updatedClient,
            UpdatedAt: new Date(),
            UpdatedBy: user?.username || "Unknown User"
        }) : null);
    };

    const handleDevisUpdate = (updatedDevis: Devis) => {
        setDevis(prevDevis => ({
            ...prevDevis,
            ...updatedDevis, // Spread the existing devis and updatedDevis fields
            UpdatedAt: new Date(), // Update timestamp
            UpdatedBy: user?.username || "Unknown User" // Set user name or fallback
        }));
    };


    const handleCarRequestUpdate = (updatedCarRequest: CarRequest) => {
        setCarRequest(updatedCarRequest);
        setDevis(prevDevis => prevDevis ? ({
            ...prevDevis,
            carRequests: updatedCarRequest ? [updatedCarRequest] : [],
            UpdatedAt: new Date(),
            UpdatedBy: user?.username || "Unknown User"
        }) : null);
    };

    const handleRappelUpdate = (updatedRappels: Rappel[]) => {
        setRappels(updatedRappels);
        setDevis(prevDevis => prevDevis ? ({
            ...prevDevis,
            rappels: updatedRappels,
            UpdatedAt: new Date(),
            UpdatedBy: user?.username || "Unknown User"
        }) : null);
    };



    const handleSave = async () => {
        const errorMsg = getModificationErros(myDevis!)
        if (errorMsg != "") {
            setMyToastCloseStyle("text-lightWhite hover:text-lightWhite");
            const secondToast = toast({
                className: "bg-lightRed border border-lightRed rounded-md text-lightWhite hover:text-lightWhite ",
                title: errorMsg
            });
            await new Promise(resolve => setTimeout(() => {
                secondToast.dismiss();
                resolve(null);
            }, 5000));
        } else {
            setLoading(true);
            try {
                await updateDevis({
                    database: databaseName,
                    devisId: devis!.DevisId!,
                    clientId: myDevis!.client?.id!,
                    updatedDevis: myDevis!,
                    updatedClient: myDevis!.client,
                    updatedItemRequestData: undefined,
                    updatedCarRequestData: myDevis!.carRequests?.[0] || undefined,
                    updatedRappels: rappels || undefined,
                    updatedDevisFacture: myDevis!.devisFacture || undefined,
                    updatedDevisReserved: myDevis!.devisReserved || undefined,
                    updatedDevisPayementDetails: myDevis!.devisPayementDetails || undefined,
                    updatedDevisGesteCommerciale: myDevis!.gesteCommer || undefined
                });
                onSave(myDevis!);
                onClose();
            } catch (error) {
                console.error('Failed to save updates:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGenerateBcInterne = async () => {
        setLoading(true);
        try {
            await generateBcInterne({
                database: databaseName,
                devisId: devis.DevisId!,
                navigate: navigate,
            });
            
            toast({
                className: "bg-lightGreen border border-lightGreen rounded-md text-lightWhite hover:text-lightWhite ",
                title: "BC Interne généré avec succès"
            });
        } catch (error) {
            console.error('Error generating BC Interne:', error);
            toast({
                className: "bg-lightRed border border-lightRed rounded-md text-lightWhite hover:text-lightWhite ",
                title: "Erreur lors de la génération du BC Interne"
            });
        } finally {
            setLoading(false);
        }
    };

    const steps: StepConfig[] = myDevis ? [

        { label: 'Client', component: <DevisClientDetails client={myDevis.client!} onUpdate={handleClientUpdate} /> },
        { label: 'Vehicule', component: <DevisVehiculeDetails carRequest={myDevis.carRequests?.[0] || null} onUpdate={handleCarRequestUpdate} devis={myDevis} onUpdateDevis={handleDevisUpdate} isAdmin={isAdmin} /> },
        { label: 'Devis', component: <DevisGlobalDetails devis={myDevis} onUpdate={handleDevisUpdate} isAdmin={isAdmin} /> },
        { label: 'Rappels', component: <DevisRappelsDetails rappels={myDevis.rappels} onUpdate={handleRappelUpdate} devisId={devis?.DevisId || 0} devis={myDevis} onUpdateDevis={handleDevisUpdate} /> },
        { label: 'Documents', component: <DevisDoucmentDetails devis={myDevis} /> },
    ] : [];

    useEffect(() => {
        setActiveStep(0);
    }, [devis]);

    const StepIndicator = () => (
        <div className=" bg-bgColorLight flex flex-col items-center justify-start space-y-4 overflow-y-auto scrollbar-hide pl-4 pr-4 py-2">
            {totalSteps.map((step, index) => (
                <StepCircle
                    key={index}
                    isActive={index === activeStep}
                    onClick={() => setActiveStep(index)}
                    stepIcon={step.icon}
                    stepLabel={step.label}
                />
            ))}
        </div>
    );


    const devisNotes = () => {
        return (
            <div className="flex flex-col w-full pl-5 pr-4 pt-2">
                <Card className="bg-normalGrey border border-normalGrey p-2">
                    <CardTitle className="text-highBlue text-center font-oswald text-lg">Notes</CardTitle>
                    <CardContent className="p-2">
                        <div className="text-highBlue font-oswald text-sm">
                            {isErrorBanqueSelection(myDevis!.devisPayementDetails.BankAndLeasing) &&
                                <div className="text-lightRed">
                                    {getErrorBanqueSelection()}
                                </div>
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }


    return (
        <div className="relative flex flex-row space-x-2 pt-2">
            {/* Display Loading overlay if loading state is true */}



            {loading && <Loading />}

            <div className="flex flex-col w-1/4">
                <Toaster toastExtraStlye="mr-2" tostCloseStyle={myToastCloseStyle} />
                <StepIndicator />
                <div className="sticky bottom-0 bg-transprent p-2 pr-4 pl-5 mt-4 space-y-2">
                    { generationBcInterneAvailable && (
                        <Button onClick={handleGenerateBcInterne} className="w-full py-2 text-white bg-greenOne hover:bg-greenOne rounded-md">
                        Générer BC Interne
                    </Button>)}
                    <Button onClick={handleSave} className="w-full py-2 text-white bg-highBlue rounded-md">
                        Enregistrer
                    </Button>
                </div>
                {/*devisNotes()*/}
            </div>

            <div className="flex flex-col w-3/4 overflow-y-auto h-auto">
                {steps[activeStep]?.component}
            </div>

            {/* 
                {steps[activeStep]?.label !== "Documents" && (
                    <div className="sticky bottom-0 bg-transparent p-2 pr-7 pl-7 w-full">
                        <Button onClick={handleSave} className="w-full py-2 text-white bg-highBlue rounded-md">
                            Enregistrer
                        </Button>
                    </div>
                )}    
            */}
        </div>
    );
};


export default DevisDetailsNewMain;

