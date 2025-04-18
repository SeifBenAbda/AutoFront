import { useEffect, useState } from "react";
import { Card } from "../../@/components/ui/card";
import General from "./ProfileDetails.tsx/generalInfo";
import { Securite } from "./ProfileDetails.tsx/securityInfo";
import { CreateUser } from "./ProfileDetails.tsx/createUser";
import { useUser } from "../../context/userContext";



function Support() {
    return <div></div>;
}

function Historique() {
    return <div></div>;
}

export function ProfileUser() {
    const [activeStep, setActiveStep] = useState(0);
    const { user } = useUser();
    
    // Define steps based on user group
    const adminSteps = ["Générale", "Sécurité", "Nouveau Utilisateur", "Support", "Historique"];
    const userSteps = ["Générale", "Sécurité"];
    
    // Use appropriate steps array based on user group
    const steps = user?.role === "ADMIN" ? adminSteps : userSteps;

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <General />;
            case 1:
                return <Securite />;
            case 2:
                return user?.role === "ADMIN" ? <CreateUser /> : null;
            case 3:
                return user?.role === "ADMIN" ? <Support /> : null;
            case 4:
                return user?.role === "ADMIN" ? <Historique /> : null;
            default:
                return null;
        }
    };

    // Ensure activeStep stays within bounds when switching user types
    useEffect(() => {
        if (user?.role !== "ADMIN" && activeStep >= userSteps.length) {
            setActiveStep(0);
        }
    }, [user?.role, activeStep]);

    return (
        <div className="flex flex-col pl-24 w-full relative">
            <h1 className="text-4xl text-highBlue font-oswald mb-4">Profil</h1>

            <Card className="w-11/12 bg-transparent border-none shadow-none">
                {/* Horizontal Steps */}
                <div className="flex flex-row justify-start pt-1">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            onClick={() => setActiveStep(index)}
                            className={`mr-2 cursor-pointer font-oswald relative p-2 bg-transparent border-transparent text-highBlue`}
                        >
                            {step}
                            {activeStep === index && (
                                <div className="absolute rounded-md bottom-0 left-0 right-0 h-1 bg-greenOne" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step content under the buttons */}
                <div className="mt-4 pt-0">
                    {renderStepContent()}
                </div>
            </Card>
        </div>
    );
}