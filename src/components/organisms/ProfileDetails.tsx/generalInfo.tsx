import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useUpdateUser } from "../../../context/userContext";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/use-toast";

// UI Components
import { Card } from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Button } from "../../../@/components/ui/button";
import { Label } from "../../../@/components/ui/label";
import { Toaster } from "../../../@/components/ui/toaster";
import Loading from "../../../components/atoms/Loading";

// Icons
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
    LucideIcon
} from "lucide-react";

// Types
interface ProfileFormData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    position: string;
}

interface ProfileFieldProps {
    icon: LucideIcon;
    label: string;
    name?: keyof ProfileFormData;
    value?: string;
    editable?: boolean;
    formData?: ProfileFormData;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    editMode?: boolean;
}

export default function General() {
    const { user, setUser } = useUser();
    const [editMode, setEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [myToastCloseStyle, setMyToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite");
    
    const { mutateAsync: updateUser, isPending } = useUpdateUser();
    const navigate = useNavigate();
    const { handleLogout } = useAuth();
    const { toast } = useToast();

    // Initialize form data from user
    const [formData, setFormData] = useState<ProfileFormData>({
        username: user?.username.trim() || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        position: user?.position || ""
    });

    // Handle input changes
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    // Toggle edit mode
    const toggleEditMode = () => {
        if (editMode) {
            // Reset form data when canceling edit
            setFormData({
                username: user?.username.trim() || "",
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber || "",
                position: user?.position || ""
            });
        }
        setEditMode(!editMode);
    };

    // Save changes
    const handleSave = async () => {
        if (user && setUser) {
            const updatedUser = {
                ...user,
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                position: formData.position,
                actifDepuis: new Date()
            };

            setUser(updatedUser);
            setIsLoading(true);

            await updateUser({ updatedUser, newUserName: formData.username }).then(() => {
                if (user.username.trim() != formData.username.trim()) {
                    setMyToastCloseStyle("text-lightWhite hover:text-lightWhite");
                    
                    const myToast = toast({
                        className: "bg-lightRed border rounded-md text-lightWhite hover:text-lightWhite",
                        title: "Vous serez déconnecté dans quelques secondes.",
                    });

                    setTimeout(() => {
                        myToast.dismiss();
                        handleLogout(navigate);
                    }, 3000);
                } else {
                    setMyToastCloseStyle("text-highBlue hover:text-highBlue");
                    toast({
                        className: "bg-greenOne border border-greenOne rounded-md text-highBlue hover:text-highBlue",
                        title: "Profil mis à jour avec succès.",
                    });
                }

                setIsLoading(false);
                setEditMode(false);
            });
        }
    };

    // Format date for display
    const formatDate = (dateString?: Date | null): string => {
        if (!dateString) return "Inconnu";
        return new Date(dateString).toLocaleDateString();
    };

    // Profile field component with memoization
    const ProfileField = memo(({ 
        icon, 
        label, 
        value, 
        name, 
        editable = true, 
        formData, 
        onChange, 
        editMode 
    }: ProfileFieldProps) => {
        const Icon = icon;
        const inputValue = name && formData ? formData[name] : "";

        return (
            <div className="relative group">
                <Label className="block text-sm text-highBlue font-oswald mb-1 transition-all group-hover:text-normalBlue">
                    {label}
                </Label>
                <div className="relative">
                    <div className="absolute left-3 top-2.5 h-5 w-5 text-highBlue pointer-events-none">
                        <Icon className="h-full w-full" />
                    </div>
                    {editMode && editable && name && formData && onChange ? (
                        <Input
                            type="text"
                            name={name}
                            value={inputValue}
                            onChange={onChange}
                            placeholder={label}
                            className="pl-14 p-2 block border border-normalGrey bg-white rounded-md 
                                shadow-sm focus:ring-highBlue focus:border-highBlue sm:text-sm font-oswald transition-all"
                        />
                    ) : (
                        <div className="bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center transition-all group-hover:border-highBlue">
                            {editable && name ? formData?.[name] || "Non spécifié" : value || "Non spécifié"}
                        </div>
                    )}
                </div>
            </div>
        );
    }, (prevProps, nextProps) => {
        if (prevProps.editMode !== nextProps.editMode) return false;
        
        if (prevProps.name && nextProps.name &&
                prevProps.formData && nextProps.formData &&
                prevProps.formData[prevProps.name] !== nextProps.formData[nextProps.name]) {
            return false;
        }
        
        return true;
    });

    // User info mini card
    const userInfosMiniCard = () => {
        return (
            <div className="mt-4 w-full bg-white p-4 rounded-lg border border-white">
                <div className="text-center">
                    <h3 className="text-xl font-bold text-highBlue">{formData.firstName} {formData.lastName}</h3>
                    <p className="text-highBlue font-oswald text-lg">{formData.position || "Position non spécifiée"}</p>
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center text-highGrey text-sm">
                        <Users className="w-4 h-4 mr-2 text-greenOne" />
                        <span>{user?.role}</span>
                    </div>

                    <div className="flex items-center text-highGrey text-sm">
                        <Mail className="w-4 h-4 mr-2 text-greenOne" />
                        <span>{formData.email}</span>
                    </div>

                    {formData.phoneNumber && (
                        <div className="flex items-center text-highGrey text-sm">
                            <Phone className="w-4 h-4 mr-2 text-greenOne" />
                            <span>{formData.phoneNumber}</span>
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
        )
    }

    return (
        <div className="relative">
            {/* Loading overlay */}
            {(isLoading || isPending) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-highBlue bg-opacity-50 border rounded-md">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            {/* Main content */}
            <Card className="bg-whiteSecond border border-normalGrey w-full shadow-md rounded-lg overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-highBlue to-normalBlue p-6 relative">
                    <div className="flex justify-end">
                        {editMode ? (
                            <div className="flex gap-2">
                                <Button
                                    className="bg-greenOne hover:bg-lightGreen text-white font-medium shadow-md transition-all"
                                    onClick={handleSave}
                                >
                                    <Check className="w-5 h-5 mr-1" /> Sauvegarder
                                </Button>
                                <Button
                                    className="bg-white hover:bg-lightGrey text-highBlue font-medium shadow-md transition-all"
                                    onClick={toggleEditMode}
                                >
                                    <X className="w-5 h-5 mr-1" /> Annuler
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="bg-white hover:bg-greenOne text-highBlue hover:text-white font-medium shadow-md transition-all"
                                onClick={toggleEditMode}
                            >
                                <Edit className="w-5 h-5 mr-1" /> Modifier
                            </Button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg bg-veryGrey flex items-center justify-center">
                                    {user?.profilePictureUrl ? (
                                        <img
                                            src={user.profilePictureUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
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

                            {/* User info card */}
                            {userInfosMiniCard()}
                        </div>

                        {/* Profile Information Section */}
                        <div className="flex-1 space-y-6">
                            <div className="bg-white p-5 rounded-lg shadow-md border border-white">
                                <h2 className="text-lg font-oswald text-highBlue mb-4 flex items-center">
                                    <User className="mr-2 text-highBlue" />
                                    Informations personnelles
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileField
                                        icon={User}
                                        label="Prénom"
                                        name="firstName"
                                        formData={formData}
                                        onChange={handleChange}
                                        editMode={editMode}
                                    />
                                    <ProfileField
                                        icon={User}
                                        label="Nom"
                                        name="lastName"
                                        formData={formData}
                                        onChange={handleChange}
                                        editMode={editMode}
                                    />
                                    <ProfileField
                                        icon={User}
                                        label="Nom d'utilisateur"
                                        name="username"
                                        formData={formData}
                                        onChange={handleChange}
                                        editMode={editMode}
                                    />
                                    <ProfileField
                                        icon={Mail}
                                        label="Email"
                                        name="email"
                                        formData={formData}
                                        onChange={handleChange}
                                        editMode={editMode}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow-md border border-white">
                                <h2 className="text-lg font-oswald text-highBlue mb-4 flex items-center">
                                    <Briefcase className="mr-2 text-highBlue" />
                                    Informations professionnelles
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileField
                                        icon={Phone}
                                        label="Téléphone"
                                        name="phoneNumber"
                                        formData={formData}
                                        onChange={handleChange}
                                        editMode={editMode}
                                    />
                                    <ProfileField
                                        icon={Briefcase}
                                        label="Poste"
                                        name="position"
                                        formData={formData}
                                        onChange={handleChange}
                                        editMode={editMode}
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-lg shadow-md border border-white">
                                <h2 className="text-lg font-oswald text-highBlue mb-4 flex items-center">
                                    <Calendar className="mr-2 text-highBlue" />
                                    Informations du compte
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileField
                                        icon={Calendar}
                                        label="Dernière connexion"
                                        value={formatDate(user?.lastLogin)}
                                        editable={false}
                                        formData={formData}
                                        editMode={editMode}
                                    />
                                    <ProfileField
                                        icon={Calendar}
                                        label="Date d'inscription"
                                        value={formatDate(user?.dateJoined)}
                                        editable={false}
                                        formData={formData}
                                        editMode={editMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}