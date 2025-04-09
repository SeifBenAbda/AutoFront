import { useUpdatePassword, useUser } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent } from "../../../@/components/ui/card";
import Loading from "../../../components/atoms/Loading";
import { Toaster } from "../../../@/components/ui/toaster";
import { Button } from "../../../@/components/ui/button";
import { PasswordInputNew } from "../../../components/molecules/Login/PasswordInput";
import { useState } from "react";


export function Securite() {
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
                    setMyToastCloseStyle("text-highBlue hover:text-highBlue")
                    const firstToast = toast({
                        className: "bg-greenOne border border-greenOne rounded-md text-highBlue hover:text-highBlue",
                        title: "Profil mis à jour avec succès.",
                    });

                    await new Promise(resolve => setTimeout(() => {
                        firstToast.dismiss();
                        resolve(null);
                    }, 2000));

                    // Second toast
                    setMyToastCloseStyle("text-highBlue hover:text-highBlue")
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
                setMyToastCloseStyle("text-highBlue hover:text-highBlue")
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
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highBlue bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />
            <Card className="bg-highBlue w-full">
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