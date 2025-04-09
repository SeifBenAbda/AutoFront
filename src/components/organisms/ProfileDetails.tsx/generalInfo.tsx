import { useState } from "react";
import { useUpdateUser, useUser } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent } from "../../../@/components/ui/card";
import Loading from "../../../components/atoms/Loading";
import { Toaster } from "../../../@/components/ui/toaster";
import { Input } from "../../../@/components/ui/input";
import { Button } from "../../../@/components/ui/button";


export default function General() {
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
                    setMyToastCloseStyle("text-highBlue hover:text-highBlue")
                    toast({
                        className: "bg-greenOne border border-greenOne rounded-md text-highBlue hover:text-highBlue ",
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
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highBlue bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            {/* Main content that remains in the background */}
            <Card className="bg-highBlue w-full">

                <CardContent className="w-full">
                    <label className="block text-sm font-medium text-lightWhite mt-2 ml-1">
                        Nom d'utilisateur
                    </label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom d'utilisateur"
                        className="mt-1 p-2 mr-2 block border border-highBlue rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
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