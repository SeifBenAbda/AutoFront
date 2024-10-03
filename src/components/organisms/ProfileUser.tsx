import { useEffect, useState } from "react";
import { Card, CardContent } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { useUpdateUser, useUser } from "../../context/userContext";
import useAuth from "../../hooks/useAuth";
import Loading from "../atoms/Loading";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { ToastAction } from "../../@/components/ui/toast";
import { Toaster } from "../../@/components/ui/toaster";

const steps = ["Générale", "Sécurité", "Support", "Historique"];

function General() {
    const { user, setUser } = useUser();
    const [name, setName] = useState(user?.nomUser || "");
    const [username, setUsername] = useState(user?.username.trim() || "");
    const { mutateAsync: updateUser, isPending, isError, isSuccess } = useUpdateUser();
    const [isLoading, setIsLoading] = useState(false);

    const [myToastCloseStyle, setMyToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite")


    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const { toast } = useToast()
    const handleSave = async () => {
        if (user && setUser) {
            const updatedUser = { ...user, nomUser: name, actifDepuis: new Date() };
            setUser(updatedUser);
            setIsLoading(true);

            await updateUser({ updatedUser, newUserName: username }).then((e) => {
                if (user.username.trim() != username.trim()) {
                    setMyToastCloseStyle("text-lightWhite hover:text-lightWhite")

                    const myToast = toast({
                        className: "bg-red-800 border rounded-md text-lightWhite hover:text-lightWhite",
                        title: "Vous serez déconnecté dans quelques secondes.",
                    });


                    // Wait for 3 seconds before logging out
                    setTimeout(() => {
                        myToast.dismiss();
                        handleLogout(navigate);
                    }, 3000); // 3000 milliseconds = 3 seconds

                } else {
                    setMyToastCloseStyle("text-highGrey hover:text-highGrey")
                    toast({
                        className: "bg-greenOne border border-greenOne rounded-md text-highGrey hover:text-highGrey ",
                        title: "Profil mis à jour avec succès.",
                    });
                }



                setIsLoading(false);
            });
        }
    };



    return (
        <div className="relative">
            {/* Overlay loading spinner */}
            {(isLoading || isPending) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highGrey bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            {/* Main content that remains in the background */}
            <Card className="bg-highGrey w-full">

                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">
                        Nom d'utilisateur
                    </label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom d'utilisateur"
                        className="mt-1 p-2 mr-2 block border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
                    />
                </CardContent>



                <div className="flex flex-row justify-between w-full">
                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">
                            Dernière date de connexion
                        </label>
                        <div className="bg-lightWhite text-center p-2 h-10 border rounded-md mt-1 font-oswald cursor-not-allowed">
                            {user?.actifDepuis != null ? new Date(user?.actifDepuis).toLocaleDateString() : "Inconnu"}
                        </div>
                    </CardContent>

                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">Groupe</label>
                        <div className="bg-lightWhite text-center p-2 h-10 border rounded-md mt-1 font-oswald cursor-not-allowed">
                            {user?.groupe}
                        </div>
                    </CardContent>
                </div>
                <Button className="m-2 ml-4 bg-greenOne hover:bg-greenOne" onClick={handleSave}>
                    Sauvegarder
                </Button>
            </Card>
        </div>
    );
}
function Securite() {
    const { user, setUser } = useUser(); // Use setUser to update user state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");

    const handleSave = () => {
        if (user && setUser) {
            if (oldPassword === user.password && newPassword === repeatNewPassword) {
                setUser({ ...user, password: newPassword });
            }
        }
    };

    return (
        <Card className="bg-highGrey w-full">
            <CardContent className="w-full">
                <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">Ancien mot de passe</label>
                <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Ancien mot de passe"
                    className="mt-1 p-2 mr-2 block border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
                />
            </CardContent>
            <CardContent className="w-full">
                <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">Nouveau mot de passe</label>
                <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    className="mt-1 p-2 mr-2 block border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
                />
            </CardContent>
            <CardContent className="w-full">
                <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">Répéter le nouveau mot de passe</label>
                <Input
                    type="password"
                    value={repeatNewPassword}
                    onChange={(e) => setRepeatNewPassword(e.target.value)}
                    placeholder="Répéter le nouveau mot de passe"
                    className="mt-1 p-2 mr-2 block border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
                />
            </CardContent>
            <Button className="m-2 ml-4 bg-greenOne hover:bg-greenOne" onClick={handleSave}>
                Changer le mot de passe
            </Button>
        </Card>
    );
}

function Support() {
    return <div></div>;
}

function Historique() {
    return <div></div>;
}

export function ProfileUser() {
    const [activeStep, setActiveStep] = useState(0);

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <General />;
            case 1:
                return <Securite />;
            case 2:
                return <Support />;
            case 3:
                return <Historique />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col pl-24 w-full relative">
            <h1 className="text-4xl text-highGrey font-oswald mb-4">Profil</h1>

            <div className="flex justify-start w-full">
                <Card className="w-11/12">
                    <div className="flex flex-row">
                        <CardContent className="flex flex-col w-1/5 text-start items-start">
                            {steps.map((step, index) => (
                                <Button
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className={`mt-2 mb-2 w-full font-oswald ${activeStep === index ? "bg-greenOne hover:bg-greenOne text-highGrey" : "text-lightWhite"
                                        }`}
                                >
                                    {step}
                                </Button>
                            ))}
                        </CardContent>

                        <CardContent className="mt-2 pl-24 w-full">{renderStepContent()}</CardContent>
                    </div>
                </Card>
            </div>
        </div>
    );
}
