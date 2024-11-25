import React, { ReactNode, useEffect, useState } from 'react';
import { CarRequest, Client, Devis, Rappel } from '../../types/devisTypes';
import emptyIcon from '../../images/empty.png';
import clientIcon from '../../images/client.png';
import agentIcon from '../../images/agent.png';
import phoneIcon from '../../images/phone.png';
import calendarIcon from '../../images/calendar.png';
import calendarUpdateIcon from '../../images/calendar_update.png';
import reminderIcon from '../../images/reminder_new.png';
import { Button } from '../../@/components/ui/button';
import useDevis, { useUpdateDevis } from '../../hooks/useDevis'
import { useUser } from '../../context/userContext';
import { DevisDetaillsCard } from './ExtraDetaillsCards/DevisDetaillsCard';
import { VehiculeDetaillsCard } from './ExtraDetaillsCards/VehiculeDetaillsCard';
import { RappelsDetaillsCard } from './ExtraDetaillsCards/RappelsDetaillsCard';
import { DocumentsDetaillsCard } from './ExtraDetaillsCards/DocumentsDetaillsCard';
import { ClientDetaillsCard } from './ExtraDetaillsCards/ClientDetaillsCard';

interface DevisDetailsProps {
    devis: Devis | null; // The selected Devis, or null if none is selected
    onDevisCancel: () => void;
}

interface StepConfig {
    label: string;
    component: ReactNode;
}


const DevisDetails: React.FC<DevisDetailsProps> = ({ devis, onDevisCancel }) => {
    const [currentPriority, setPriority] = useState(devis?.PriorityDevis || 'Normale');
    const [loading, setLoading] = useState<boolean>(false);

    const activeNormalStyle = 'font-oswald bg-greenOne border border-greenOne rounded-md text-lightWhite hover:bg-greenOne';
    const activeMoyenneStyle = 'font-oswald bg-yellow-500 border border-yellow-500 rounded-md text-lightWhite hover:bg-yellow-500';
    const activeHauteStyle = 'font-oswald bg-lightRed border border-lightRed rounded-md text-lightWhite hover:bg-lightRed';
    const normalStyle = 'font-oswald bg-lightWhite border border-lightWhite rounded-md text-highGrey hover:bg-lightWhite';


    const { user } = useUser();
    const [activeStep, setActiveStep] = useState<number>(0);
    const [myDevis, setDevis] = useState<Devis | null>(devis);
    const [rappels, setRappels] = useState<Rappel[]>(devis?.rappels || []);
    const [client, setClient] = useState<Client | null>(devis?.client || null);
    const [carRequest, setCarRequest] = useState<CarRequest | null>(devis?.carRequests?.[0] || null);



    const { mutateAsync: updateDevis } = useUpdateDevis();


    const activeStyling = "bg-greenOne border border-greenOne rounded-md hover:bg-greenOne"
    const defaultStyling = "bg-transparent border border-lightWhite rounded-md hover:bg-transparent"
    useEffect(() => {
        if (devis) {
            setPriority(devis.PriorityDevis || 'Normale');
            setClient(devis!.client!);
            setCarRequest(devis!.carRequests?.[0]);
            //setItemRequests(devis!.itemRequests || []);
            setDevis(devis!);
            setRappels(devis!.rappels);
            setActiveStep(0)

        } else {
            setDevis(null);
        }

    }, [devis]); // Trigger effect when 'devis' changes


    const handleDevisUpdate = (updatedDevis: Devis) => {
        setDevis(prevDevis => ({
            ...prevDevis,
            ...updatedDevis, // Spread the existing devis and updatedDevis fields
            UpdatedAt: new Date(), // Update timestamp
            UpdatedBy: user?.nomUser || "Unknown User" // Set user name or fallback
        }));
    };

    const handleClientUpdate = (updatedClient: Client) => {
        setDevis(prevDevis => prevDevis ? ({
            ...prevDevis,
            client: updatedClient,
            UpdatedAt: new Date(),
            UpdatedBy: user?.nomUser || "Unknown User"
        }) : null);
    };

    const handleCarRequestUpdate = (updatedCarRequest: CarRequest) => {
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


    const updatePriority = (priority: "Normale" | "Moyenne" | "Haute") => {
        setPriority(priority)
        setDevis(prevDevis => prevDevis ? ({
            ...prevDevis,
            PriorityDevis: priority,
            UpdatedAt: new Date(),
            UpdatedBy: user?.nomUser || "Unknown User"
        }) : null);
    }

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
            }).then(() => { setLoading(false) });
        } catch (error) {
            console.error('Failed to save updates:', error);

        }

    };

    const steps: StepConfig[] = myDevis ? [
        { label: 'Devis', component: <DevisDetaillsCard devis={myDevis} onUpdate={handleDevisUpdate} /> },
        { label: 'Client', component: <ClientDetaillsCard client={myDevis.client!} onUpdate={handleClientUpdate} /> },
        { label: 'Vehicule', component: <VehiculeDetaillsCard carRequest={myDevis.carRequests?.[0] || null} onUpdate={handleCarRequestUpdate} devis={myDevis} onUpdateDevis={handleDevisUpdate} /> },
        { label: 'Rappels', component: <RappelsDetaillsCard rappels={myDevis.rappels || []} onUpdate={handleRappelUpdate} devisId={myDevis.DevisId!} /> },
        { label: 'Documents', component: <DocumentsDetaillsCard devis={myDevis}  /> },
    ] : [];

    function getClosestFutureDate(): Rappel | null {
        const now = new Date();

        // Check if devis and devis.rappels are defined
        if (!myDevis || !myDevis.rappels) {
            return devis?.rappels[0]! // or handle this case as needed
        }

        // Filter out dates that are before today
        const futureRappels = myDevis.rappels.filter(rappel => {
            const rappelDate = new Date(rappel.RappelDate!);
            return rappelDate >= now; // Only keep dates that are today or in the future
        });

        if (futureRappels.length === 0) {
            return myDevis.rappels[0]; // No future dates available
        }

        // Find the closest future date
        return futureRappels.reduce((closest, current) => {
            const closestDate = new Date(closest.RappelDate!);
            const currentDate = new Date(current.RappelDate!);

            const closestDiff = Math.abs(now.getTime() - closestDate.getTime());
            const currentDiff = Math.abs(now.getTime() - currentDate.getTime());

            return currentDiff < closestDiff ? current : closest;
        }, futureRappels[0]);
    }




    if (!devis) {
        return (
            <div className="items-center justify-center flex flex-col space-y-2">
                <img src={emptyIcon} alt="Empty" className="w-48 h-48" />
            </div>
        );
    }

    const renderPriorities = () => {
        return (
            <div className="flex flex-row space-x-2">
                <Button
                    className={`${currentPriority === 'Normale' ? activeNormalStyle : normalStyle
                        }`}
                    onClick={() => updatePriority('Normale')}
                >
                    Normale
                </Button>
                <Button
                    className={`${currentPriority === 'Moyenne' ? activeMoyenneStyle : normalStyle
                        }`}
                    onClick={() => updatePriority('Moyenne')}
                >
                    Moyenne
                </Button>
                <Button
                    className={`${currentPriority === 'Haute' ? activeHauteStyle : normalStyle
                        }`}
                    onClick={() => updatePriority('Haute')}
                >
                    Haute
                </Button>
            </div>
        );
    };

    const renderApplyChangesButton = () => {
        return (
            <Button onClick={handleSave} className="bg-greenOne border border-greenOne hover:bg-greenOne rounded-md">
                Appliquer
            </Button>
        );
    };


    const renderCancelButton = () => {
        return (
            <Button onClick={onDevisCancel} className="bg-lightRed border border-lightRed hover:bg-lightRed rounded-md">
                Fermer
            </Button>
        );
    };

    const renderTopHeader = () => {
        return (
            <div className="flex flex-row justify-between w-full p-2">
                {renderPriorities()}
                <div className='flex flex-row space-x-2'>
                    {renderApplyChangesButton()}
                    {renderCancelButton()}
                </div>
            </div>
        );
    };

    const renderGeneralData = () => {
        return (
            <div className='flex flex-row justify-between w-full p-2 mt-2 ml-4'>
                {/** Client and Rappel Date */}
                <div className='flex flex-col space-y-2'>
                    {renderClientInfos()}
                    {renderDevisGeneralInfo()}
                </div>

                <div className='flex flex-col space-y-2 mr-6'>
                    {renderAdditionalInfos()}
                    {renderDates()}
                </div>
            </div>
        )
    }

    const renderAdditionalInfos = () => {
        return (
            <div className='flex flex-row space-x-2'>
                <img src={agentIcon} alt="Agent" className="w-7 h-7" />
                <span className='text-lightWhite font-oswald text-lg'>{devis.UpdatedBy === "" ? devis.CreatedBy : devis.UpdatedBy}</span>
            </div>
        )
    }

    const renderDates = () => {
        return (
            <div className='flex flex-col space-y-2'>
                <div className='flex flex-row space-x-2'>
                    <img src={calendarUpdateIcon} alt="CalendarUpdate" className="w-7 h-7" />
                    <span className='text-lightWhite font-oswald text-lg'>Dernière actualisation : {new Date(myDevis?.UpdatedAt!).toLocaleDateString()}</span>
                </div>
                <div className='flex flex-row space-x-2'>
                    <img src={reminderIcon} alt="Reminder" className="w-7 h-7" />
                    <span className='text-lightWhite font-oswald text-lg'>Prochain Rappel : {new Date(getClosestFutureDate()!.RappelDate!).toLocaleDateString()}</span>
                </div>

            </div>
        )
    }

    const renderDevisGeneralInfo = () => {
        return (
            <div className='flex flex-col'>
                <div className='flex flex-row space-x-2'>
                    <img src={calendarIcon} alt="Calendar" className="w-8 h-8" />
                    <span className='text-lightWhite font-oswald text-lg'>Date Creation : {new Date(myDevis?.DateCreation!).toLocaleDateString()}</span>
                </div>
            </div>
        )
    }

    const renderClientInfos = () => {
        return (
            <div className='flex flex-col space-y-2'>
                <div className='flex flex-row space-x-2 items-center'>
                    <img src={clientIcon} alt="Client" className="w-8 h-8" />
                    <span className='text-whiteSecond font-oswald text-lg'>
                        {devis.client!.clientType == "Entreprise" ? "" : devis.client!.clientGender} {devis.client!.nomClient}
                    </span>
                </div>
                <div className='flex flex-row space-x-4 items-center'>
                    <img src={phoneIcon} alt="Phone" className="w-6 h-6" />
                    <span className='text-whiteSecond font-oswald text-lg'>{devis.client!.telClient}</span>
                </div>
            </div>
        )
    }

    const renderExtraDetails = () => {
        return (
            <div className="flex flex-col space-y-2 m-2">
                <div className="flex flex-row justify-around">
                    {steps.map((step, index) => (
                        <Button
                            key={index}
                            onClick={() => setActiveStep(index)}
                            className={`w-full ml-2 mb-2 p-2 rounded ${activeStep === index ? activeStyling : defaultStyling} text-white`}
                        >
                            {step.label}
                        </Button>
                    ))}
                </div>
                <div className='overflow-y-auto h-[55vh]'>
                    {steps[activeStep]?.component}
                </div>
            </div>
        )
    }

    return (
        <div className="justify-start h-[83vh] w-full relative">  {/* Added relative here */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1b2a4d]/80 z-50">
                    <div className="text-white font-bold">Veuillez patienter...</div>
                </div>
            )}
            {/* Top Devis Details to Change Priority and apply changes Button */}
            {renderTopHeader()}
            <hr className='border-lightWhite' />
            {renderGeneralData()}
            <hr className='border-lightWhite' />
            {renderExtraDetails()}
        </div>
    );
};

export default DevisDetails;
