import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { useCreateUser, useUpdatePassword, useUpdateUser, useUser } from "../../../context/userContext";
import Loading from "../../atoms/Loading";
import { useToast } from "../../../hooks/use-toast";
import { Toaster } from "../../../@/components/ui/toaster";
import { PasswordInputNew } from "../../molecules/Login/PasswordInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../@/components/ui/select";
import { User } from "../../../models/user.model";
import { useState } from "react";
import { Card, CardContent } from "../../../@/components/ui/card";
export const CreateUser = () => {
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
                    className: "bg-greenOne border border-greenOne rounded-md text-highBlue hover:text-highBlue",
                    title: "Nouvelle utilisateur !",
                });

                setTimeout(() => {
                    myToast.dismiss();
                }, 3000);
            } else {
                setMyToastCloseStyle("text-highBlue hover:text-highBlue");
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
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highBlue bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            <Card className="bg-highBlue w-full">
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
                            className="mt-1 p-2 mr-2 block border border-highBlue rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
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
                            className="mt-1 p-2 mr-2 block border border-highBlue rounded-md shadow-sm focus:ring-0 sm:text-sm font-oswald"
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
                            <SelectTrigger className="w-full border border-highBlue">
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
