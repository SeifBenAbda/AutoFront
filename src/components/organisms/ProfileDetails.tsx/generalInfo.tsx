import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useUpdateUser } from "../../../context/userContext";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/use-toast";

import { Card } from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Button } from "../../../@/components/ui/button";
import { Label } from "../../../@/components/ui/label";
import { Toaster } from "../../../@/components/ui/toaster";
import Loading from "../../../components/atoms/Loading";

import {
    User,
    UserCircle,
    Calendar,
    Users,
    Phone,
    Mail,
    Briefcase,
    Edit,
    Check,
    X,
    Camera,
    Signpost
} from "lucide-react";

export default function General() {
    const { user, setUser } = useUser();
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [myToastCloseStyle, setMyToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite");
    const textInputStyle = "bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative";
    const labelStyle = "block text-sm text-highBlue font-oswald mb-1";

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [username, setUsername] = useState(user?.username || "");
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
    const [email, setEmail] = useState(user?.email || "");
    const [position, setPosition] = useState(user?.position || "");
    const [role, setRole] = useState(user?.role || "");
    const [isActive, setIsActive] = useState(user?.isActive || false);
    const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePictureUrl || "");
    const [dateJoined, setDateJoined] = useState(user?.dateJoined || null);
    const [lastLogin, setLastLogin] = useState(user?.lastLogin || null);

    const { mutateAsync: updateUser, isPending } = useUpdateUser();
    const navigate = useNavigate();
    const { handleLogout } = useAuth();
    const { toast } = useToast();

    const formatDate = (dateString?: Date | null): string => {
        if (!dateString) return "Inconnu";
        return new Date(dateString).toLocaleDateString();
    };

    const UserInfosMiniCard = () => (
        <div className="mt-4 w-full bg-white p-4 rounded-lg border border-white">
            <div className="text-center">
                <h3 className="text-xl  text-highBlue font-oswald">{user?.firstName}</h3>
            </div>
            <div className="mt-4 space-y-2 font-oswald">
                <div className="flex items-center text-highGrey text-sm">
                    <Users className="w-4 h-4 mr-2 text-highBlue" />
                    <span>{user?.role}</span>
                </div>
                <div className="flex items-center text-highGrey text-sm">
                    <Mail className="w-4 h-4 mr-2 text-highBlue" />
                    <span>{user?.email}</span>
                </div>
                {user?.phoneNumber && (
                    <div className="flex items-center text-highGrey text-sm">
                        <Phone className="w-4 h-4 mr-2 text-highBlue" />
                        <span>{user?.phoneNumber}</span>
                    </div>
                )}
            </div>
            <div className="mt-4 pt-3 border-t border-normalGrey">
                {user?.isActive ? (
                    <div className="flex items-center justify-center bg-lightGreen text-highGreen px-3 py-1 rounded-md text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-greenOne mr-1"></span>
                        Compte actif
                    </div>
                ) : (
                    <div className="flex items-center justify-center bg-lightRed text-white px-3 py-1 rounded-md text-sm font-oswald">
                        <span className="w-2 h-2 rounded-full bg-white mr-1 font-oswald"></span>
                        Compte inactif
                    </div>
                )}
            </div>
        </div>
    );

    const handleSave = async () => {
        if (user && setUser) {
            const updatedUser = {
                ...user,
                firstName: firstName,
                lastName: lastName
            };
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
                    const myToast = toast({
                        className: "bg-lightGreen border border-lightGreen rounded-md text-highBlue hover:text-highBlue ",
                        title: "Profil mis à jour avec succès.",
                    });
                    setTimeout(() => {
                        myToast.dismiss();
                    }, 3000); // 3000 milliseconds = 3 seconds
                    setEditMode(false);
                }



                setIsLoading(false);
            });
        }
    };

    const userDetails = () => (
        <div className="flex-1 space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-md border border-white">
                <h2 className="text-lg font-oswald text-highBlue mb-4 flex items-center">
                    <User className="mr-2 text-highBlue" />
                    Informations personnelles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                        <Label className={labelStyle}>Prénom</Label>
                        {editMode ? (
                            <Input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Prénom"
                                className={textInputStyle}
                            />
                        ) : (
                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                {firstName=="null"? "Non spécifié": firstName}
                            </div>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <Label className={labelStyle}>Nom</Label>
                        {editMode ? (
                            <Input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Nom"
                                className={textInputStyle}
                            />
                        ) : (
                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                {lastName=="null"? "Non spécifié":lastName}
                            </div>
                        )}
                    </div>

                    {/* Username */}
                    <div>
                        <Label className={labelStyle}>Nom d'utilisateur</Label>
                        {editMode ? (
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nom d'utilisateur"
                                className={textInputStyle}
                            />
                        ) : (
                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                {username || "Non spécifié"}
                            </div>
                        )}
                    </div>

                    <div>
                        <Label className={labelStyle}>Email</Label>
                        {editMode ? (
                            <Input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className={textInputStyle}
                            />
                        ) : (
                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                {email=="null"? "Non spécifié": email}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md border border-white">
                <h2 className="text-lg font-oswald text-highBlue mb-4 flex items-center">
                    <Briefcase className="mr-2 text-highBlue" />
                    Informations professionnelles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className={labelStyle}>Téléphone</Label>
                        {editMode ? (
                            <Input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Téléphone"
                                className={textInputStyle}
                            />
                        ) : (
                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                {phoneNumber=="null"? "Non spécifié": phoneNumber}
                            </div>
                        )}
                    </div>
                    <div>
                        <Label className={labelStyle}>Position</Label>
                        {editMode ? (
                            <Input
                                type="text"
                                value={position}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Position"
                                className={textInputStyle}
                            />
                        ) : (
                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                <Signpost className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                {position == "null"? "Non spécifié": position}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-md border border-white">
                <h2 className="text-lg font-oswald text-highBlue mb-4 flex items-center">
                    <Calendar className="mr-2 text-highBlue" />
                    Informations du compte
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label className={labelStyle}>Dernière connexion</Label>
                        <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                            {formatDate(lastLogin)}
                        </div>
                    </div>
                    <div>
                        <Label className={labelStyle}>Date d'inscription</Label>
                        <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                            {formatDate(dateJoined)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


    return (
        <div className="relative">
            {(isLoading || isPending) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highBlue bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            <Card className="bg-whiteSecond border border-normalGrey w-full shadow-md rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-highBlue to-normalBlue p-6 relative">
                    <div className="flex justify-end">
                        {editMode ? (
                            <div className="flex gap-2">
                                <Button className="bg-greenOne hover:bg-lightGreen text-white font-medium shadow-md transition-all" onClick={handleSave}>
                                    <Check className="w-5 h-5 mr-1" /> Sauvegarder
                                </Button>
                                <Button className="bg-white hover:bg-lightGrey text-highBlue font-medium shadow-md transition-all" onClick={() => { setEditMode(false); }}>
                                    <X className="w-5 h-5 mr-1" /> Annuler
                                </Button>
                            </div>
                        ) : (
                            <Button className="bg-white hover:bg-greenOne text-highBlue hover:text-white font-medium shadow-md transition-all" onClick={() => { setEditMode(true); }}>
                                <Edit className="w-5 h-5 mr-1" /> Modifier
                            </Button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-veryGrey flex items-center justify-center">
                                    {user?.profilePictureUrl ? (
                                        <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle className="w-32 h-32 text-lightGrey" />
                                    )}
                                </div>
                                {editMode && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-highBlue bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                        <div className="bg-white p-2 rounded-full">
                                            <Camera className="w-6 h-6 text-greenOne" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <UserInfosMiniCard />
                        </div>

                        {userDetails()}
                    </div>
                </div>
            </Card>
        </div>
    );
}
