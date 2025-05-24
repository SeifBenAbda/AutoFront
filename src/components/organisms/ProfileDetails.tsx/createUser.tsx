import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { useCreateUser } from "../../../context/userContext";
import Loading from "../../atoms/Loading";
import { useToast } from "../../../hooks/use-toast";
import { Toaster } from "../../../@/components/ui/toaster";
import { PasswordInputNew } from "../../molecules/Login/PasswordInput";
import { User } from "../../../models/user.model";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "../../../@/components/ui/switch";
import { Label } from "../../../@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../@/components/ui/tabs";
import { CheckCircle2, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import UserTypeDropDown from "../../atoms/UserTypeDropDown";

export const CreateUser = () => {
    // Form state management
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<User>>({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        position: "",
        profilePictureUrl: "",
        isActive: true,
        role: "",
        password: "", // Extra field for password
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("account");
    const textInputStyle = "bg-normalGrey text-highGrey pl-14 p-2 h-10 border border-normalGrey rounded-md font-oswald flex items-center relative";

    // Hooks
    const { toast } = useToast();
    const { mutateAsync: createUser } = useCreateUser();
    const [myToastCloseStyle, setMyToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite");

    // Handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });

        // Clear error when field is edited
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    // Handle switch toggle for isActive
    const handleSwitchChange = (checked: boolean) => {
        setFormData({
            ...formData,
            isActive: checked,
        });
    };

    // Handle select change
    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when field is edited
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Validate the current step
    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.username?.trim()) newErrors.username = "Le nom d'utilisateur est requis";
            if (!formData.firstName?.trim()) newErrors.firstName = "Le prénom est requis";
            if (!formData.lastName?.trim()) newErrors.lastName = "Le nom est requis";
            if (!formData.email?.trim()) newErrors.email = "L'email est requis";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide";
        } else if (step === 2) {
            if (!formData.role?.trim()) newErrors.role = "Le rôle est requis";
            if (!formData.password?.trim()) newErrors.password = "Le mot de passe est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Navigate between steps
    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    // Handle form submission
    const handleCreate = async () => {
        if (!validateStep()) {
            return;
        }

        setIsLoading(true);

        try {
            // Create a proper User object from the form data
            const newUser: User = {
                username: formData.username!,
                firstName: formData.firstName!,
                lastName: formData.lastName!,
                email: formData.email!,
                phoneNumber: formData.phoneNumber,
                position: formData.position,
                profilePictureUrl: formData.profilePictureUrl,
                isActive: formData.isActive ?? true,
                dateJoined: new Date(),
                role: formData.role!,
                // Additional properties that might be needed by your API
                password: formData.password as string,
            };

            await createUser({ password: formData.password as string, user: newUser });

            setMyToastCloseStyle("text-lightWhite hover:text-lightWhite");
            const myToast = toast({
                className: "bg-greenOne border border-greenOne rounded-md text-whiteSecond",
                title: "Utilisateur créé avec succès!",
                description: `${formData.firstName} ${formData.lastName} a été ajouté(e).`
            });

            setTimeout(() => {
                myToast.dismiss();
                // Reset form
                setFormData({
                    username: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    position: "",
                    profilePictureUrl: "",
                    isActive: true,
                    role: "",
                    password: "",
                });
                setStep(1);
            }, 3000);
        } catch (error) {
            toast({
                className: "bg-red-600 border border-red-600 rounded-md text-white",
                title: "Erreur lors de la création",
                description: "Une erreur s'est produite. Veuillez réessayer."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-lg">
                    <Loading />
                </div>
            )}

            <Toaster tostCloseStyle={myToastCloseStyle} />

            <Card className="bg-whiteSecond border border-normalGrey/10 w-full shadow-md rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-highBlue to-normalBlue p-4 md:p-5 relative">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-whiteSecond text-xl flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-greenOne" />
                            Créer un nouvel utilisateur
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                            {[1, 2].map((s) => (
                                <div
                                    key={s}
                                    className={`h-2 w-2 rounded-full ${s === step ? 'bg-emerald-500' :
                                        s < step ? 'bg-emerald-500' : 'bg-slate-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </CardHeader>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {step === 1 && (
                            <CardContent className="pt-6">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 space-x-2 bg-white border border-transparent">
                                        <TabsTrigger value="account" className="data-[state=active]:bg-greenOne border h-10 rounded-md font-oswald">
                                            Informations du compte
                                        </TabsTrigger>
                                        <TabsTrigger value="profile" className="data-[state=active]:bg-greenOne border h-10 rounded-md font-oswald">
                                            Profil personnel
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="account" className="mt-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="username" className="text-highBlue">
                                                    Nom d'utilisateur <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    placeholder="Nom d'utilisateur"
                                                    className={`${textInputStyle} ${errors.username ? 'border-red-500' : ''}`}
                                                />
                                                {errors.username && (
                                                    <p className="text-red-500 text-xs">{errors.username}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-highBlue">
                                                    Email <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="email@example.com"
                                                    className={`${textInputStyle} ${errors.email ? 'border-red-500' : ''}`}
                                                />
                                                {errors.email && (
                                                    <p className="text-red-500 text-xs">{errors.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="profile" className="mt-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName" className="text-highBlue">
                                                    Prénom <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    placeholder="Prénom"
                                                    className={`${textInputStyle} ${errors.firstName ? 'border-red-500' : ''}`}
                                                />
                                                {errors.firstName && (
                                                    <p className="text-red-500 text-xs">{errors.firstName}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="lastName" className="text-highBlue">
                                                    Nom <span className="text-red-500">*</span>
                                                </Label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Nom"
                                                    className={`${textInputStyle} ${errors.lastName ? 'border-red-500' : ''}`}
                                                />
                                                {errors.lastName && (
                                                    <p className="text-red-500 text-xs">{errors.lastName}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber" className="text-highBlue">
                                                    Téléphone
                                                </Label>
                                                <Input
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={handleChange}
                                                    placeholder="21345678"
                                                    className={`${textInputStyle}`}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="position" className="text-highBlue">
                                                    Poste
                                                </Label>
                                                <Input
                                                    id="position"
                                                    name="position"
                                                    value={formData.position}
                                                    onChange={handleChange}
                                                    placeholder="ex: Développeur, Commercial..."
                                                    className={`${textInputStyle}`}
                                                />
                                            </div>
                                        </div>

                                    </TabsContent>
                                </Tabs>

                                <div className="flex justify-end mt-6">
                                    <Button
                                        onClick={nextStep}
                                        className="bg-greenOne font-oswald hover:bg-greenOne text-white"
                                    >
                                        Suivant
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        )}

                        {step === 2 && (
                            <CardContent className="pt-6">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="role" className="text-highBlue">
                                                Rôle <span className="text-red-500">*</span>
                                            </Label>
                                            <UserTypeDropDown
                                                value={formData.role}
                                                onChange={(value) => handleSelectChange('role', value)}
                                            />
                                            {errors.role && (
                                                <p className="text-red-500 text-xs">{errors.role}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-highBlue">
                                                Mot de passe <span className="text-red-500">*</span>
                                            </Label>
                                            <PasswordInputNew
                                                onTogglePassword={handleTogglePassword}
                                                showPassword={showPassword}
                                                value={formData.password as string}
                                                onChange={(e) => handleChange({
                                                    ...e,
                                                    target: {
                                                        ...e.target,
                                                        name: 'password'
                                                    }
                                                } as React.ChangeEvent<HTMLInputElement>)}
                                                placeholder="Mot de passe"
                                                id={1}
                                                className={`${textInputStyle} ${errors.password ? 'border-red-500' : ''}`}
                                            />
                                            {errors.password && (
                                                <p className="text-red-500 text-xs">{errors.password}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="isActive"
                                            checked={formData.isActive}
                                            onCheckedChange={handleSwitchChange}
                                        />
                                        <Label htmlFor="isActive" className="text-highBlue">
                                            Compte actif
                                        </Label>
                                    </div>

                                    <motion.div
                                        className="bg-normalGrey rounded-lg p-4 border border-normalGrey"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="text-highBlue font-medium mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-greenOne" />
                                            Récapitulatif
                                        </h3>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                            <div>
                                                <span className="text-slate-600">Utilisateur:</span>
                                                <span className="text-highBlue ml-1">{formData.username}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-600">Nom complet:</span>
                                                <span className="text-highBlue ml-1">{formData.firstName} {formData.lastName}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-600">Email:</span>
                                                <span className="text-highBlue ml-1">{formData.email}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-600">Rôle:</span>
                                                <span className="text-highBlue ml-1">{formData.role}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex justify-between mt-6">
                                    <Button
                                        onClick={prevStep}
                                        variant="outline"
                                        className="border-slate-700 text-highBlue hover:bg-transparent hover:text-highBlue"
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Retour
                                    </Button>
                                    <Button
                                        onClick={handleCreate}
                                        className="bg-greenOne hover:bg-greenOne text-white"
                                    >
                                        Créer l'utilisateur
                                    </Button>
                                </div>
                            </CardContent>
                        )}
                    </motion.div>
                </AnimatePresence>
            </Card>
        </div>
    );
};
