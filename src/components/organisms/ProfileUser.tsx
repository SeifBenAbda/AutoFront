import { useState } from "react";
import { Card, CardContent } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { useUser } from "../../context/userContext";

const steps = ["General", "Sécurité", "Support", "Historique"];

function General() {
    const { user, setUser } = useUser(); // Use setUser to update user state
    const [name, setName] = useState(user?.nomUser || ""); // Local state to handle name changes

    const handleSave = () => {
        if (user && setUser) {
            setUser({ ...user, nomUser: name }); // Update the user's name
        }
    };

    return (
        <Card className="bg-highGrey w-full">
            <CardContent>
                <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">Nom</label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Entrez votre nom"
                    className="mt-1 p-2 mr-2 block border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                />
                <Button className="mt-2" onClick={handleSave}>
                    Sauvegarder
                </Button>
            </CardContent>
        </Card>
    );
}

function Securite() { return <div></div>; }
function Support() { return <div></div>; }
function Historique() { return <div></div>; }

export function ProfileUser() {
    const [activeStep, setActiveStep] = useState(0);

    const renderStepContent = () => {
        switch (activeStep) {
            case 0: return <General />;
            case 1: return <Securite />;
            case 2: return <Support />;
            case 3: return <Historique />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col pl-24 w-full">
            <h1 className="text-4xl text-highGrey font-oswald mb-4">Profile</h1>

            <div className="flex justify-start w-full">
                <Card className="w-11/12">
                    <div className="flex flex-row">
                        {/* Stepper Buttons - Vertically aligned */}
                        <CardContent className="flex flex-col w-1/5 text-start items-start">
                            {steps.map((step, index) => (
                                <Button
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className={`mt-2 mb-2 w-full font-oswald ${activeStep === index ? 'bg-greenOne hover:bg-greenOne text-highGrey' : 'text-lightWhite'}`}
                                >
                                    {step}
                                </Button>
                            ))}
                        </CardContent>

                        {/* Step Content - Rendered on the right */}
                        <CardContent className="mt-2 pl-24 w-full">
                            {renderStepContent()}
                        </CardContent>
                    </div>
                </Card>
            </div>
        </div>
    );
}
