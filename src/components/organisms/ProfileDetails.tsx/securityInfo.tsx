import { useUpdatePassword, useUser } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../@/components/ui/card";
import Loading from "../../atoms/Loading";
import { Toaster } from "../../../@/components/ui/toaster";
import { Button } from "../../../@/components/ui/button";
import { PasswordInputNew } from "../../molecules/Login/PasswordInput";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

// Types
interface PasswordState {
  old: string;
  new: string;
  repeatNew: string;
}

interface PasswordVisibility {
  old: boolean;
  new: boolean;
  repeatNew: boolean;
}

export function Securite() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const { toast } = useToast();
  const { mutateAsync: updatePassword, isPending } = useUpdatePassword();
  
  // State management
  const [passwords, setPasswords] = useState<PasswordState>({
    old: "",
    new: "",
    repeatNew: ""
  });
  const [visibility, setVisibility] = useState<PasswordVisibility>({
    old: false,
    new: false,
    repeatNew: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toastCloseStyle, setToastCloseStyle] = useState("text-lightWhite hover:text-lightWhite");

  // Password visibility toggle handler
  const handleTogglePassword = useCallback((field: keyof PasswordVisibility) => {
    setVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  // Input change handler
  const handlePasswordChange = useCallback((field: keyof PasswordState, value: string) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Show toast message with auto-dismiss
  const showToast = useCallback(async (options: { 
    className: string, 
    title: string, 
    duration?: number,
    style?: string 
  }) => {
    const { className, title, duration = 2000, style } = options;
    
    if (style) setToastCloseStyle(style);
    
    const toastRef = toast({
      className,
      title,
    });

    await new Promise(resolve => setTimeout(() => {
      toastRef.dismiss();
      resolve(null);
    }, duration));
    
    return toastRef;
  }, [toast]);

  // Handle password update
  const handleSave = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      if (passwords.new === passwords.repeatNew) {
        await updatePassword({ newPassword: passwords.new });
        
        // Success toast
        await showToast({
          className: "bg-greenOne border border-greenOne rounded-md text-highBlue hover:text-highBlue",
          title: "Profil mis à jour avec succès.",
          style: "text-highBlue hover:text-highBlue"
        });
        
        // Logout warning toast
        await showToast({
          className: "bg-red-800 border border-red-800 rounded-md text-lightWhite hover:text-lightWhite",
          title: "Vous serez déconnecté dans quelques secondes.",
          duration: 5000,
          style: "text-highBlue hover:text-highBlue"
        });
        
        // Handle logout
        handleLogout(user.username ,navigate);
      } else {
        // Error toast
        await showToast({
          className: "bg-red-800 border border-red-800 rounded-md text-lightWhite hover:text-lightWhite",
          title: "Erreur dans les mots de passe",
          style: "text-highBlue hover:text-highBlue"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, passwords, updatePassword, showToast, handleLogout, navigate]);

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Overlay loading spinner */}
      {(isLoading || isPending) && (
        <motion.div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-bgColorLight/70 backdrop-blur-sm rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-bgColorLight p-6 rounded-lg shadow-xl flex flex-col items-center">
            <Loading />
            <p className="mt-4 text-lightWhite">Mise à jour en cours...</p>
          </div>
        </motion.div>
      )}

      <Toaster tostCloseStyle={toastCloseStyle} />
      
      <Card className="bg-whiteSecond p-0 rounded-lg shadow-md border border-whiteSecond">
        <CardHeader className="bg-gradient-to-r from-highBlue to-normalBlue p-4 md:p-5 relative border-b border-gray-700/30 rounded-t-lg">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-greenOne" />
            <CardTitle className="text-whiteSecond text-xl font-oswald">Sécurité</CardTitle>
          </div>
          <CardDescription className="text-whiteSecond">
            Mettez à jour votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        
        <div className="p-4 space-y-4">
          <div className="space-y-4">
    
            <div className="group transition-all duration-200 bg-normalGrey hover:bg-normalGrey/70 rounded-md p-3">
              <label className="text-sm font-medium text-highBlue mb-2 flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4 text-highBlue" />
                Nouveau mot de passe
              </label>
              <PasswordInputNew
                value={passwords.new}
                onChange={(e) => handlePasswordChange('new', e.target.value)}
                placeholder="Nouveau mot de passe"
                onTogglePassword={() => handleTogglePassword('new')}
                showPassword={visibility.new}
                id={2}
                className="bg-normalGrey border-highBlue focus-within:ring-1 focus-within:ring-transparent"
              />
            </div>

            <div className="group transition-all duration-200 bg-normalGrey hover:bg-normalGrey/70 rounded-md p-3">
              <label className="text-sm font-medium text-highBlue mb-2 flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4 text-highBlue" />
                Répéter le nouveau mot de passe
              </label>
              <PasswordInputNew
                value={passwords.repeatNew}
                onChange={(e) => handlePasswordChange('repeatNew', e.target.value)}
                placeholder="Répéter le nouveau mot de passe"
                onTogglePassword={() => handleTogglePassword('repeatNew')}
                showPassword={visibility.repeatNew}
                id={3}
                className="bg-normalGrey border-highBlue focus-within:ring-1 focus-within:ring-transparent"
              />
              
              {passwords.new && passwords.repeatNew && passwords.new !== passwords.repeatNew && (
                <motion.p 
                  className="text-red-400 text-sm mt-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Les mots de passe ne correspondent pas
                </motion.p>
              )}
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="bg-greenOne hover:bg-greenOne/90 text-highBlue font-medium px-6 py-5 h-auto 
                           shadow-lg shadow-greenOne/20 flex items-center gap-2 rounded-md transition-all"
                onClick={handleSave}
                disabled={isLoading || isPending || passwords.new !== passwords.repeatNew || !passwords.new}
              >
                <ShieldCheckIcon className="w-5 h-5" />
                Changer le mot de passe
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}