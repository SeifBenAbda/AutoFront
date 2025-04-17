import React, { useState, useEffect } from "react";
import { Devis, DevisPayementDetails, DevisReserved, Rappel } from "../../../types/devisTypes";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../../../@/components/ui/dialog";
import { CircleX } from "lucide-react";
import DevisDetailsNewMain from "./DevisDetaillsNewMain";
import phoneIcon from '../../../images/phone.png';
import clientIcon from '../../../images/client.png';
import reminderIcon from '../../../images/reminder_new.png';
import carIcon from '../../../images/car.png';
import { useUser } from "../../../context/userContext";
type DevisDetailsPageProps = {
    allData: Devis;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Devis) => void;
};

// Create custom components for each state
const ClientInfo = ({ geneder, name, phone }: { geneder: string; name: string; phone: string }) => (
    <div className="flex items-center space-x-8 px-3 py-1 justify-center">
        <div className="flex flex-row space-x-2">
            <img src={clientIcon} alt="Agent" className="w-5 h-5" />
            <span className="text-highBlue font-oswald">{geneder} {name}</span>
        </div>
        <div className="flex flex-row space-x-2">
            <img src={phoneIcon} alt="Phone" className="w-5 h-5" />
            <span className="text-highBlue font-oswald">{phone}</span>
        </div>
    </div>
);

const VehicleModel = ({ model }: { model: string }) => (
    <div className="flex items-center space-x-2 px-3 py-1 justify-center">
        <img src={carIcon} alt="Car" className="w-7 h-7" />
        <span className="text-highBlue font-oswald">{model}</span>
    </div>
);

const ReminderInfo = ({ rappels }: { rappels: Rappel[] | undefined }) => {
    const closestReminder = getClosestUpcomingReminder(rappels);

    const formatReminderDate = (date: string): string => {
        const reminderDate = new Date(date);
        const today = new Date();

        // Set time of today to midnight for comparison purposes
        today.setHours(0, 0, 0, 0);
        reminderDate.setHours(0, 0, 0, 0);

        if (reminderDate.getTime() === today.getTime()) {
            return "Aujourd'hui !"; // Same day as today
        }

        // Otherwise, format the date as "le [date]"
        return `${reminderDate.toLocaleDateString("fr-FR")}`; // French date format
    };

    return (
        <div className="flex items-center space-x-2 justify-center">
            {closestReminder ? (
                <>
                    <div className="flex flex-row">
                        <img src={reminderIcon} alt="reminderCal" className="w-5 h-5" />
                        <span className="text-highBlue font-oswald min-w-[30%]">
                            {formatReminderDate(closestReminder.RappelDate!.toString())}
                        </span>
                    </div>
                    <span className="text-highBlue font-oswald max-w-[60%]">
                        {closestReminder.RappelContent}
                    </span>

                </>
            ) : (
                <span className="text-highBlue font-oswald">Aucun rappel à venir</span>
            )}
        </div>
    );
};


function getPriorityClassName(devisPriority: string) {
    switch (devisPriority) {
        case "Normale":
            return "bg-lightGreen border border-whiteSecond text-highGrey";
        case "Moyenne":
            return "bg-yellow-400 border border-yellow-400 text-highBlue";
        case "Haute":
            return "bg-red-400 border border-red-400 text-lightWhite";
    }
}

const getClosestUpcomingReminder = (rappels: Rappel[] | undefined): Rappel | null => {
    // Filter out reminders with undefined dates or content
    const validReminders = rappels?.filter(
        reminder => reminder.RappelDate && reminder.RappelContent
    ) || [];

    if (validReminders.length === 0) return null;

    const now = new Date().getTime();

    // Find the closest upcoming reminder
    return validReminders.reduce((closest, current) => {
        const currentDate = new Date(current.RappelDate!).getTime();
        const closestDate = closest ? new Date(closest.RappelDate!).getTime() : 0;

        if (currentDate >= now && (!closest || currentDate < closestDate)) {
            return current;
        }
        return closest;
    }, null as Rappel | null);
};

export function DevisDetailsPage({
    allData,
    isOpen,
    onClose,
    onSave
}: DevisDetailsPageProps) {
    const [currentComponent, setCurrentComponent] = useState<'client' | 'reminder' | 'vehicle'>('client');
    const [direction, setDirection] = useState('center'); // 'right' | 'center' | 'left'
    const { user } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);

    // Determine if the user is an admin
    useEffect(() => {
        if (user?.role === 'ADMIN') {
            setIsAdmin(true);
        }
    }, [user]);

    useEffect(() => {
        if (isOpen) {
            const timer = setInterval(() => {
                // Start exit animation
                setDirection('left');

                // Change component and reset position after exit animation
                setTimeout(() => {
                    setCurrentComponent((prev) => {
                        if (prev === 'client') return 'reminder';
                        if (prev === 'reminder') return 'vehicle';
                        return 'client'; // Loop back to 'client' after 'vehicle'
                    });

                    setDirection('right');

                    // Trigger entrance animation
                    requestAnimationFrame(() => {
                        setDirection('center');
                    });
                }, 600);
            }, 9000);

            return () => clearInterval(timer);
        }
    }, [isOpen]);


    const getTextPosition = () => {
        switch (direction) {
            case 'right':
                return 'translate-x-full opacity-0';
            case 'left':
                return '-translate-x-full opacity-0';
            default:
                return 'translate-x-0 opacity-100';
        }
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent
                style={{ transform: 'none' }}
                className="flex flex-col h-[92vh] !fixed !inset-y-0 !right-0 !left-auto w-full 
                text-start min-[1300px]:w-[75%] sm-custom:w-[90%] md-custom:w-[90%]  max-[550px]:w-[78%] max-[788px]:w-[85%] min-[900px]:w-[75%] 
                min-[1040px]:w-[75%] p-0 m-4 mt-14 rounded-lg border-bgColorLight bg-bgColorLight  !max-w-none duration-500 
                data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
            >
                <DialogTitle className="pt-4 pl-2 flex flex-row justify-between items-center space-x-4 mr-2">
                    <div className={`font-medium font-oswald text-sm rounded-md px-2 py-1 ${getPriorityClassName(allData.PriorityDevis)}`}>
                        Priorité {allData.PriorityDevis}
                    </div>
                    <div className="font-oswald text-2xl flex-1 text-center pr-8">Devis N° {allData.DevisId}</div>
                    <CircleX className="h-7 w-7 cursor-pointer" onClick={onClose} />
                </DialogTitle>

                <hr className="bg-highBlue w-full" />

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto px-2">
                    <div className="text-center flex min-h-12 border border-blueCiel items-center justify-center bg-blueCiel rounded-md relative">
                        <div className={`w-full px-2 transform transition-all duration-500 ease-in-out ${getTextPosition()}`}>
                            {currentComponent === 'client' ? (
                                <ClientInfo
                                    geneder={allData.client?.clientGender ?? ""}
                                    name={allData.client?.nomClient ?? ""}
                                    phone={allData.client?.telClient ?? ""}
                                />
                            ) : currentComponent === 'reminder' ? (
                                <ReminderInfo rappels={allData.rappels} />
                            ) : (
                                <VehicleModel model={allData.carRequests?.[0]?.CarModel ?? ""}
                                />
                            )}
                        </div>
                    </div>
                    <DevisDetailsNewMain
                        devis={allData}
                        isOpen={isOpen}
                        onClose={onClose}
                        onSave={onSave}
                        isAdmin={isAdmin}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );

}