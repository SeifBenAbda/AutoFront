import { useEffect, useState } from "react";
import { Card, CardContent } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import { Input } from "../../@/components/ui/input";
import { useCreateUser, useUpdatePassword, useUpdateUser, useUser } from "../../context/userContext";
import useAuth from "../../hooks/useAuth";
import Loading from "../atoms/Loading";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { ToastAction } from "../../@/components/ui/toast";
import { Toaster } from "../../@/components/ui/toaster";
import { PasswordInputNew } from "../molecules/Login/PasswordInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../@/components/ui/select";
import { User } from "../../models/user.model";



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
                    setMyToastCloseStyle("text-highGrey2 hover:text-highGrey2")
                    toast({
                        className: "bg-greenOne border border-greenOne rounded-md text-highGrey2 hover:text-highGrey2 ",
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
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highGrey2 bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            {/* Main content that remains in the background */}
            <Card className="bg-highGrey2 w-full">

                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">
                        Nom d'utilisateur
                    </label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom d'utilisateur"
                        className="mt-1 p-2 mr-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
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
    const { mutateAsync: updatePassword, isPending, isError, isSuccess } = useUpdatePassword();
    const [isLoading, setIsLoading] = useState(false);

    const [myToastCloseStyle, setMyToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite")


    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const { toast } = useToast();


    const [showPasswordOld, setShowPasswordOld] = useState(false);
    const [showPasswordNew, setShowPasswordNew] = useState(false);
    const [showPasswordRepeatNew, setShowPasswordRepeatNew] = useState(false);
    const handleTogglePassword = (id: number) => {
        switch (id) {
            case 1:
                setShowPasswordOld(!showPasswordOld);
                break;
            case 2:
                setShowPasswordNew(!showPasswordNew);
                break;
            case 3:
                setShowPasswordRepeatNew(!showPasswordRepeatNew);
                break;
            default:
                setShowPasswordOld(!showPasswordOld);
        }
    };
    const handleSave = async () => {
        if (user) {
            setIsLoading(true);
            if (oldPassword === user.password && newPassword === repeatNewPassword) {


                await updatePassword({ newPassword }).then(async (e) => {
                    setIsLoading(false);
                    setMyToastCloseStyle("text-highGrey2 hover:text-highGrey2")
                    const firstToast = toast({
                        className: "bg-greenOne border border-greenOne rounded-md text-highGrey2 hover:text-highGrey2",
                        title: "Profil mis à jour avec succès.",
                    });

                    await new Promise(resolve => setTimeout(() => {
                        firstToast.dismiss();
                        resolve(null);
                    }, 2000));

                    // Second toast
                    setMyToastCloseStyle("text-highGrey2 hover:text-highGrey2")
                    const secondToast = toast({
                        className: "bg-red-800 border border-red-800 rounded-md text-lightWhite hover:text-lightWhite",
                        title: "Vous serez déconnecté dans quelques secondes.",
                    });

                    await new Promise(resolve => setTimeout(() => {
                        secondToast.dismiss();
                        resolve(null);
                    }, 5000));

                    // Handle logout
                    handleLogout(navigate);
                });
            } else {
                setIsLoading(false);
                setMyToastCloseStyle("text-highGrey2 hover:text-highGrey2")
                const secondToast = toast({
                    className: "bg-red-800 border border-red-800 rounded-md text-lightWhite hover:text-lightWhite",
                    title: "Erreur dans les mots de passe",
                });
                await new Promise(resolve => setTimeout(() => {
                    secondToast.dismiss();
                    resolve(null);
                }, 2000));
            }

        }
    };

    return (
        <div className="relative">
            {/* Overlay loading spinner */}
            {(isLoading || isPending) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highGrey2 bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />
            <Card className="bg-highGrey2 w-full">
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">Ancien mot de passe</label>
                    <PasswordInputNew
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Ancien mot de passe"
                        onTogglePassword={() => handleTogglePassword(1)}
                        showPassword={showPasswordOld}
                        id={1}
                    />
                </CardContent>
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">Nouveau mot de passe</label>
                    <PasswordInputNew
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nouveau mot de passe"
                        onTogglePassword={() => handleTogglePassword(2)}
                        showPassword={showPasswordNew}
                        id={2}
                    />
                </CardContent>
                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">Répéter le nouveau mot de passe</label>
                    <PasswordInputNew
                        value={repeatNewPassword}
                        onChange={(e) => setRepeatNewPassword(e.target.value)}
                        placeholder="Répéter le nouveau mot de passe"
                        onTogglePassword={() => handleTogglePassword(3)}
                        showPassword={showPasswordRepeatNew}
                        id={3}
                    />
                </CardContent>
                <Button className="m-2 ml-4 bg-greenOne hover:bg-greenOne" onClick={handleSave}>
                    Changer le mot de passe
                </Button>
            </Card>
        </div>
    );
}


const CreateUser = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [groupe, setGroupe] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { mutateAsync: createUser, isPending, isError, isSuccess } = useCreateUser();
    const [myToastCloseStyle, setMyToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite");
    
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleCreate = async () => {
        if (!username || !name || !password || !groupe) {
            toast({
                className: "bg-red-800 border border-red-800 rounded-md text-lightWhite hover:text-lightWhite",
                title: "Veuillez remplir tous les champs",
            });
            return;
        }

        // Construct the user object directly
        const newUser: User = {
            username: username,
            nomUser: name,
            password: password,
            groupe: groupe,
            actifDepuis: new Date(),
            userCodeSte: "1",
            isActif: true,
        };

        setIsLoading(true);

        try {
            // Use mutateAsync with the new user object
            await createUser({ user: newUser });
            
            // Check success condition after API call
            if (newUser.username.trim() === username.trim()) {
                setMyToastCloseStyle("text-lightWhite hover:text-lightWhite");

                const myToast = toast({
                    className: "bg-greenOne border border-greenOne rounded-md text-highGrey2 hover:text-highGrey2",
                    title: "Nouvelle utilisateur !",
                });

                setTimeout(() => {
                    myToast.dismiss();
                }, 3000);
            } else {
                setMyToastCloseStyle("text-highGrey2 hover:text-highGrey2");
                toast({
                    className: "bg-red-800 border rounded-md text-lightWhite hover:text-lightWhite",
                    title: "Erreur creation !",
                });
            }
        } catch (error) {
            // Handle any errors from the mutation
            toast({
                className: "bg-red-800 border rounded-md text-lightWhite hover:text-lightWhite",
                title: "Erreur lors de la création de l'utilisateur !",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highGrey2 bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            <Card className="bg-highGrey2 w-full">
                <div className="flex flex-row justify-between w-full">
                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">
                            Nom d'utilisateur
                        </label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nom d'utilisateur"
                            className="mt-1 p-2 mr-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
                        />
                    </CardContent>
                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">
                            Nom Complet
                        </label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nom Complet"
                            className="mt-1 p-2 mr-2 block border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
                        />
                    </CardContent>
                </div>

                <div className="flex flex-row justify-between w-full">
                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">
                            Mot de passe
                        </label>
                        <PasswordInputNew
                            onTogglePassword={handleTogglePassword}
                            showPassword={showPassword}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                            id={1}
                        />
                    </CardContent>
                    <CardContent className="w-full">
                        <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">
                            Groupe
                        </label>
                        <Select value={groupe} onValueChange={setGroupe}>
                            <SelectTrigger className="w-full border border-highGrey2">
                                <SelectValue placeholder="Sélectionner un groupe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="COMPT">Commerciale</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </div>
                <Button className="m-2 ml-4 bg-greenOne hover:bg-greenOne" onClick={handleCreate}>
                    Créer l'utilisateur
                </Button>
            </Card>
        </div>
    );
};


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
    const steps = user?.groupe === "ADMIN" ? adminSteps : userSteps;

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return <General />;
            case 1:
                return <Securite />;
            case 2:
                return user?.groupe === "ADMIN" ? <CreateUser /> : null;
            case 3:
                return user?.groupe === "ADMIN" ? <Support /> : null;
            case 4:
                return user?.groupe === "ADMIN" ? <Historique /> : null;
            default:
                return null;
        }
    };

    // Ensure activeStep stays within bounds when switching user types
    useEffect(() => {
        if (user?.groupe !== "ADMIN" && activeStep >= userSteps.length) {
            setActiveStep(0);
        }
    }, [user?.groupe, activeStep]);

    return (
        <div className="flex flex-col pl-24 w-full relative">
            <h1 className="text-4xl text-highGrey2 font-oswald mb-4">Profil</h1>

            <div className="flex justify-start w-full">
                <Card className="w-11/12 bg-lightWhite">
                    <div className="flex flex-row">
                        <CardContent className="flex flex-col w-1/5 text-start items-start">
                            {steps.map((step, index) => (
                                <Button
                                    key={index}
                                    onClick={() => setActiveStep(index)}
                                    className={`mt-2 mb-2 w-full font-oswald ${
                                        activeStep === index 
                                            ? "bg-greenOne hover:bg-greenOne text-highGrey2" 
                                            : "text-lightWhite"
                                    }`}
                                >
                                    {step}
                                </Button>
                            ))}
                        </CardContent>

                        <CardContent className="mt-2 pl-24 w-full">
                            {renderStepContent()}
                        </CardContent>
                    </div>
                </Card>
            </div>
        </div>
    );
}