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
import Loading from "../../atoms/Loading";

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
import { PhoneInput } from "../../atoms/PhoneInput";
import UserTypeDropDown from "../../atoms/UserTypeDropDown";

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
        <div className="mt-4 w-full bg-white p-6 rounded-xl border border-normalGrey/20 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-highBlue font-oswald">{user?.firstName || "User"}</h3>
                <p className="text-sm text-highGrey/70 mt-1">{user?.username || ""}</p>
            </div>

            <div className="space-y-3 font-oswald">
                <div className="flex items-center text-highGrey text-sm p-2 rounded-lg hover:bg-normalGrey/10 transition-colors">
                    <div className="bg-lightBlue/10 p-1.5 rounded-full mr-3">
                        <Users className="w-4 h-4 text-highBlue" />
                    </div>
                    <span className="flex-1">{user?.role || "Role non défini"}</span>
                </div>

                <div className="flex items-center text-highGrey text-sm p-2 rounded-lg hover:bg-normalGrey/10 transition-colors">
                    <div className="bg-lightBlue/10 p-1.5 rounded-full mr-3">
                        <Mail className="w-4 h-4 text-highBlue" />
                    </div>
                    <span className="flex-1 truncate">{user?.email || "Email non défini"}</span>
                </div>

                {user?.phoneNumber && (
                    <div className="flex items-center text-highGrey text-sm p-2 rounded-lg hover:bg-normalGrey/10 transition-colors">
                        <div className="bg-lightBlue/10 p-1.5 rounded-full mr-3">
                            <Phone className="w-4 h-4 text-highBlue" />
                        </div>
                        <span className="flex-1">{user.phoneNumber}</span>
                    </div>
                )}
            </div>

            <div className="mt-5 pt-4 border-t border-normalGrey/30">
                {user?.isActive ? (
                    <div className="flex items-center justify-center bg-lightGreen/20 text-highGreen px-4 py-2 rounded-full text-sm font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-greenOne animate-pulse mr-2"></span>
                        Compte actif
                    </div>
                ) : (
                    <div className="flex items-center justify-center bg-lightRed/20 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span>
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
                        handleLogout(user.username,navigate);
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
                                {firstName == "null" ? "Non spécifié" : firstName}
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
                                {lastName == "null" ? "Non spécifié" : lastName}
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
                                {email == "null" ? "Non spécifié" : email}
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
                            <PhoneInput
                                value={phoneNumber}
                                onChange={(value) => setPhoneNumber(value)}
                                placeholder="Téléphone"
                                className={textInputStyle}
                            />
                        ) : (
                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                {phoneNumber == "null" ? "Non spécifié" : phoneNumber}
                            </div>
                        )}
                    </div>
                    <div>
                        <Label className={labelStyle}>Position</Label>
                        {editMode && user?.position!=="NORMAL" ? (
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
                                {position == "null" ? "Non spécifié" : position}
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
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highBlue bg-opacity-50 rounded-xl">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            <Card className="bg-whiteSecond border border-normalGrey/10 w-full shadow-md rounded-xl overflow-hidden">
                {/* Compact header with profile info */}
                <div className="bg-gradient-to-r from-highBlue to-normalBlue p-4 md:p-5 relative">
                    <div className="flex items-center gap-4">
                        {/* Smaller profile photo */}
                        <div className="relative group">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-veryGrey flex items-center justify-center">
                                {user?.profilePictureUrl ? (
                                    <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle className="w-12 h-12 md:w-16 md:h-16 text-lightGrey" />
                                )}
                            </div>
                            {editMode && (
                                <div className="absolute inset-0 flex items-center justify-center bg-highBlue bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                                    <div className="bg-white p-1 rounded-full shadow-md">
                                        <Camera className="w-4 h-4 text-greenOne" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Compact user details */}
                        <div className="text-white flex-1">
                            <h1 className="text-xl font-bold font-oswald">{user?.firstName} {user?.lastName}</h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-white/80 text-sm font-oswald">{user?.username}</p>
                                <span className="hidden md:inline text-white/50">•</span>
                                <div className="text-xs bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium inline-flex items-center">
                                    <Users className="w-3 h-3 mr-1" /> {user?.role}
                                </div>
                                {user?.isActive ? (
                                    <div className="text-xs bg-lightGreen/30 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-medium inline-flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-greenOne animate-pulse mr-1"></span>
                                        Actif
                                    </div>
                                ) : (
                                    <div className="text-xs bg-lightRed/30 backdrop-blur-sm text-white px-2 py-0.5 rounded-full font-medium inline-flex items-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
                                        Inactif
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Edit buttons */}
                        <div>
                            {editMode ? (
                                <div className="flex flex-col md:flex-row gap-2">
                                    <Button size="sm" className="bg-greenOne hover:bg-lightGreen text-white font-medium shadow-md transition-all" onClick={handleSave}>
                                        <Check className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">Sauvegarder</span>
                                    </Button>
                                    <Button size="sm" className="bg-white hover:bg-lightGrey text-highBlue font-medium shadow-md transition-all" onClick={() => setEditMode(false)}>
                                        <X className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">Annuler</span>
                                    </Button>
                                </div>
                            ) : (
                                <Button size="sm" className="bg-white/20 hover:bg-white text-white hover:text-highBlue font-medium shadow-md backdrop-blur-sm transition-all" onClick={() => setEditMode(true)}>
                                    <Edit className="w-4 h-4 md:mr-1" /> <span className="hidden md:inline">Modifier</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content with collapsible sections */}
                <div className="p-4">
                    {/* Quick info strip */}
                    <div className="flex flex-wrap gap-3 mb-4 text-sm">
                        <div className="flex items-center text-highGrey bg-normalGrey/20 px-3 py-1 rounded-md">
                            <Mail className="w-4 h-4 mr-2 text-highBlue" />
                            <span>{user?.email || "Email non défini"}</span>
                        </div>
                        {user?.phoneNumber && (
                            <div className="flex items-center text-highGrey bg-normalGrey/20 px-3 py-1 rounded-md">
                                <Phone className="w-4 h-4 mr-2 text-highBlue" />
                                <span>{user.phoneNumber}</span>
                            </div>
                        )}
                        <div className="flex items-center text-highGrey bg-normalGrey/20 px-3 py-1 rounded-md">
                            <Calendar className="w-4 h-4 mr-2 text-highBlue" />
                            <span>Inscrit: {formatDate(dateJoined)}</span>
                        </div>
                    </div>

                    {/* User details in accordion style */}
                    <div className="space-y-3">
                        {/* Personal Information */}
                        <div className="border border-normalGrey/20 rounded-lg overflow-hidden">
                            <div className="bg-white p-3 cursor-pointer hover:bg-normalGrey/5">
                                <h2 className="text-md font-oswald text-highBlue flex items-center">
                                    <User className="mr-2 text-highBlue w-5 h-5" />
                                    Informations personnelles
                                </h2>
                            </div>
                            <div className="p-3 bg-white border-t border-normalGrey/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* First Name & Last Name in more compact format */}
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
                                            <div className="bg-normalGrey text-highGrey pl-10 p-2 h-9 text-sm border border-normalGrey rounded-md font-oswald flex items-center relative">
                                                <User className="absolute left-2 top-2 h-4 w-4 text-highBlue" />
                                                {firstName == "null" ? "Non spécifié" : firstName}
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
                                            <div className="bg-normalGrey text-highGrey pl-10 p-2 h-9 text-sm border border-normalGrey rounded-md font-oswald flex items-center relative">
                                                <User className="absolute left-2 top-2 h-4 w-4 text-highBlue" />
                                                {lastName == "null" ? "Non spécifié" : lastName}
                                            </div>
                                        )}
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <Label className={labelStyle}>Nom d'utilisateur</Label>
                                            <div className="bg-normalGrey text-highGrey pl-10 p-2 h-9 text-sm border border-normalGrey rounded-md font-oswald flex items-center relative">
                                                <User className="absolute left-2 top-2 h-4 w-4 text-highBlue" />
                                                {username || "Non spécifié"}
                                            </div>
                                    </div>

                                    {/* Email */}
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
                                            <div className="bg-normalGrey text-highGrey pl-10 p-2 h-9 text-sm border border-normalGrey rounded-md font-oswald flex items-center relative">
                                                <Mail className="absolute left-2 top-2 h-4 w-4 text-highBlue" />
                                                {email == "null" ? "Non spécifié" : email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Information (collapsed by default) */}
                        <div className="border border-normalGrey/20 rounded-lg overflow-hidden">
                            <div className="bg-white p-3 cursor-pointer hover:bg-normalGrey/5">
                                <h2 className="text-md font-oswald text-highBlue flex items-center">
                                    <Briefcase className="mr-2 text-highBlue w-5 h-5" />
                                    Informations professionnelles
                                </h2>
                            </div>
                            <div className="p-3 bg-white border-t border-normalGrey/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Rest of professional details */}
                                    <div>
                                        <Label className={labelStyle}>Téléphone</Label>
                                        {editMode ? (
                                            <PhoneInput
                                                value={phoneNumber}
                                                onChange={(value) => setPhoneNumber(value)}
                                                placeholder="Téléphone"
                                                className={textInputStyle}
                                            />
                                        ) : (
                                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                                {phoneNumber == "null" ? "Non spécifié" : phoneNumber}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label className={labelStyle}>Position</Label>
                                        {editMode ? (
                                            <UserTypeDropDown
                                                value={position}
                                                onChange={(value) => setPosition(value)}
                                            />
                                        ) : (
                                            <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative">
                                                <Signpost className="absolute left-3 top-2.5 h-5 w-5 text-highBlue" />
                                                {position == "null" ? "Non spécifié" : position}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Information (collapsed by default) */}
                        <div className="border border-normalGrey/20 rounded-lg overflow-hidden">
                            <div className="bg-white p-3 cursor-pointer hover:bg-normalGrey/5">
                                <h2 className="text-md font-oswald text-highBlue flex items-center">
                                    <Calendar className="mr-2 text-highBlue w-5 h-5" />
                                    Informations du compte
                                </h2>
                            </div>
                            <div className="p-3 bg-white border-t border-normalGrey/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Rest of account details */}
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
                    </div>
                </div>
            </Card>
        </div>
    );
}
