import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { Label } from "../../../../@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../../@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../../../@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../@/components/ui/table";
import {
    Plus,
    Edit,
    Trash2,
    Activity,
    FileText,
    RotateCcw,
    Loader,
} from "lucide-react";
import StatusDevisDropDown from "../../../atoms/StatusDevis";
import { StatusTabProps } from "./types";
import { textInputStyle, labelStyle, buttonStyle } from "./constants";
import { useState } from "react";
import { useUpdateGoalStatus } from "../../../../hooks/useGoalsManagement";
import { useToast } from "../../../../hooks/use-toast";
import React from "react";

// Data model
interface GoalStatus {
    StatusId: number;
    StatusName: string;
    Description: string;
    StatusKey: string;
    IsActive: boolean;
    CreatedAt: string;
}

// Edit Status Dialog Component
const EditStatusDialog = ({
    status,
    isOpen,
    onClose,
    onSave
}: {
    status: GoalStatus | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedStatus: GoalStatus) => void;
}) => {
    const [formData, setFormData] = useState<Partial<GoalStatus>>({});
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const updateMutation = useUpdateGoalStatus();

    React.useEffect(() => {
        if (status) {
            setFormData({
                Description: status.Description
            });
            setSuccessMsg('');
            setErrorMsg('');
        }
    }, [status]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        setIsLoading(true);

        if (!status) {
            setErrorMsg("Erreur: statut non trouvé.");
            setIsLoading(false);
            return;
        }

        try {
            await updateMutation.mutateAsync({
                statusId: status.StatusId,
                data: {
                    Description: formData.Description || ''
                }
            });

            setSuccessMsg('Description modifiée avec succès.');
            toast({
                title: "Succès",
                description: "Description du statut modifiée avec succès"
            });
            
            setTimeout(() => {
                setSuccessMsg('');
                setIsLoading(false);
                onClose();
                if (status) {
                    onSave({ ...status, ...formData as GoalStatus });
                }
            }, 1200);
        } catch (error) {
            console.error('Error updating status:', error);
            setErrorMsg("Une erreur est survenue lors de la modification.");
            toast({
                title: "Erreur",
                description: "Erreur lors de la modification du statut",
                variant: "destructive"
            });
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-xl border-0 shadow-2xl">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl text-highBlue font-oswald flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Edit className="w-5 h-5 text-blue-600" />
                        </div>
                        <span>Modifier la description</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isLoading && (
                        <div className="flex justify-center items-center my-10">
                            <Loader className="h-8 w-8 animate-spin text-highBlue" />
                        </div>
                    )}
                    
                    {!isLoading && (
                        <>
                            <div className="space-y-6">
                                {/* Display current status info as readonly */}
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-600 font-oswald">Nom du statut</Label>
                                            <div className="text-gray-900 font-medium font-oswald">{status?.StatusName}</div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold text-gray-600 font-oswald">Clé du statut</Label>
                                            <div className="text-gray-900 font-medium font-oswald">{status?.StatusKey}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Editable description field */}
                                <div className="space-y-2">
                                    <Label className={`${labelStyle} flex items-center space-x-2`}>
                                        <FileText className="w-4 h-4" />
                                        <span>Description</span>
                                    </Label>
                                    <Input
                                        id="Description"
                                        name="Description"
                                        value={formData.Description || ''}
                                        onChange={handleChange}
                                        className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                        placeholder="Description du statut"
                                        onFocus={(e) => {
                                            const len = e.target.value.length;
                                            e.target.setSelectionRange(len, len);
                                        }}
                                    />
                                </div>
                            </div>

                            {successMsg && (
                                <div className="bg-green-50 border border-green-300 text-green-800 rounded-md p-3 text-sm mt-2">
                                    {successMsg}
                                </div>
                            )}
                            {errorMsg && (
                                <div className="bg-red-50 border border-red-300 text-red-800 rounded-md p-3 text-sm mt-2">
                                    {errorMsg}
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="font-oswald hover:bg-gray-100"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    className={`${buttonStyle} font-oswald shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Mettre à jour
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

// StatusBadge component for enhanced status display
const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case 'facturé':
          return 'bg-green-50 text-green-800 border border-green-300';
        case 'réservé':
          return 'bg-yellow-50 text-yellow-800 border border-yellow-300';
        case 'annulé':
          return 'bg-red-50 text-red-800 border border-red-300';
        case 'draft':
          return 'bg-blue-100 text-blue-700 border border-blue-200';
        case 'livré':
          return 'bg-purple-50 text-purple-700 border border-purple-200';
        case 'hdsi':
          return 'bg-highBlue text-whiteSecond border border-highBlue';  
        default:
          return 'bg-gray-100 text-gray-700 border border-gray-200';
      }
    };

    const isBilled = status?.toLowerCase() === 'facturé';
    const isCancelled = status?.toLowerCase() === 'annulé';
    const isReserved = status?.toLowerCase() === 'réservé';
    const isLivred = status?.toLowerCase() === 'livré';
    const isHdsi = status?.toLowerCase() === 'hdsi';

    return (
      <span className={`px-3 w-[100px] justify-center py-1 text-xs font-medium rounded-md inline-flex items-center font-oswald ${getStatusColor()}`}>
        {isBilled ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 mr-1 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M9 14l6-6" />
              <rect width="18" height="18" x="3" y="3" rx="2" className="animate-[pulse_2s_ease-in-out_infinite]" />
              <path d="M9 8h6M9 12h6M9 16h6" />
            </svg>
            <span className="animate-[fadeIn_1s_ease-in-out]">Facturé</span>
          </>
        ) : isCancelled ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 mr-1 animate-spin-slow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6" />
              <path d="M9 9l6 6" />
            </svg>
            <span className="animate-[fadeIn_1s_ease-in-out]">Annulé</span>
          </>
        ) : isReserved ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 mr-1 "
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <path d="M20 7h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
              <circle cx="12" cy="14" r="2" />
            </svg>
            <span className="animate-[fadeIn_1s_ease-in-out]">Réservé</span>
          </>
        ) : isLivred ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-1 animate-bounce"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              {/* Car body */}
              <path d="M5 17h14v-6H5v6z" />
              {/* Car top */}
              <path d="M7 11V9c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v2" />
              {/* Wheels */}
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
              {/* Motion lines */}
              <path d="M3 17h-2" className="animate-pulse" />
              <path d="M23 17h-2" className="animate-pulse" />
            </svg>
            <span className="transition-opacity duration-1000">Livré</span>
          </>
        ) : isHdsi ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              {/* Document */}
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="animate-pulse" />
              {/* Corner fold */}
              <path d="M14 2v6h6" />
              {/* Stars/sparkles */}
              <path d="M20 13l-1.5-1.5L20 10l1.5 1.5L20 13z" className="animate-ping" />
              <path d="M4 13l-1.5-1.5L4 10l1.5 1.5L4 13z" className="animate-ping" />
              <path d="M12 7l-1-1 1-1 1 1-1 1z" className="animate-ping" />
              {/* Trending line */}
              <path d="M9 17l3-3 3 3" className="animate-pulse" />
            </svg>
            <span className="text-white animate-[fadeIn_1s_ease-in-out]">HDSI</span>
          </>
        ) : status}
      </span>
    );
  };

function StatusTab({
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    newStatus,
    setNewStatus,
    handleCreateStatus,
    handleDeleteStatus,
    handleRestoreStatus,
    goalStatuses,
    refetch
}: StatusTabProps) {
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        statusId: number | null;
        statusName: string;
    }>({
        isOpen: false,
        statusId: null,
        statusName: ""
    });

    // Edit status states
    const [showEditStatusDialog, setShowEditStatusDialog] = useState(false);
    const [editingStatus, setEditingStatus] = useState<GoalStatus | null>(null);

    // Handle edit status
    const handleEditStatus = (status: GoalStatus) => {
        setEditingStatus(status);
        setShowEditStatusDialog(true);
    };

    const handleSaveStatus = () => {
        setShowEditStatusDialog(false);
        setEditingStatus(null);
        // Refetch data to get updated status
        refetch();
    };

    const handleCloseEditDialog = () => {
        setShowEditStatusDialog(false);
        setEditingStatus(null);
    };

    const handleDeleteClick = (statusId: number, statusName: string) => {
        setDeleteConfirmation({
            isOpen: true,
            statusId,
            statusName
        });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirmation.statusId) {
            await handleDeleteStatus(deleteConfirmation.statusId, deleteConfirmation.statusName);
            setDeleteConfirmation({
                isOpen: false,
                statusId: null,
                statusName: ""
            });
        }
    };

    return (
        <div className="space-y-4 pb-8 mb-8">
            {/* Enhanced Header Section */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-highBlue font-oswald">Gestion des Statuts</h3>
                        <p className="text-sm text-gray-600 font-oswald">Configurez les états de suivi de vos objectifs</p>
                    </div>
                </div>
                <Dialog 
                    open={showCreateStatusDialog} 
                    onOpenChange={(open) => {
                        if (open) {
                            setNewStatus({ StatusName: "", Description: "", StatusKey: "" });
                        }
                        setShowCreateStatusDialog(open);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className={`${buttonStyle} shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Statut
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-white rounded-xl border-0 shadow-2xl">
                        <DialogHeader className="pb-4">
                            <DialogTitle className="text-xl font-bold text-highBlue font-oswald flex items-center space-x-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Plus className="w-5 h-5 text-blue-600" />
                                </div>
                                <span>Créer un nouveau statut</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className={`${labelStyle} flex items-center space-x-2`}>
                                    <Activity className="w-4 h-4" />
                                    <span>Statut</span>
                                </Label>
                                <StatusDevisDropDown 
                                    value={newStatus.StatusName}
                                    isFiltring={false}
                                    onChange={(val: string) => {
                                        if (val === 'Tous Status') return; // ignore meta option
                                        setNewStatus({
                                            ...newStatus,
                                            StatusName: val,
                                            StatusKey: val
                                        });
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className={`${labelStyle} flex items-center space-x-2`}>
                                    <FileText className="w-4 h-4" />
                                    <span>Description (optionnel)</span>
                                </Label>
                                <Input
                                    className={`${textInputStyle} focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200`}
                                    value={newStatus.Description || ''}
                                    onChange={(e) => setNewStatus({...newStatus, Description: e.target.value})}
                                    placeholder="Description du statut"
                                />
                            </div>
                            <Button 
                                onClick={handleCreateStatus} 
                                className={`${buttonStyle} w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Créer le statut
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Enhanced Status Table */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-200 bg-gray-50">
                                <TableHead className="text-gray-700 py-2 text-center text-sm font-oswald">#</TableHead>
                                <TableHead className="text-gray-700 py-2 text-center text-sm font-oswald">Nom du statut</TableHead>
                                <TableHead className="text-gray-700 py-2 text-center text-sm font-oswald">Clé</TableHead>
                                <TableHead className="text-gray-700 py-2 text-center text-sm font-oswald">Description</TableHead>
                                <TableHead className="text-gray-700 py-2 text-center text-sm font-oswald">Statut</TableHead>
                                <TableHead className="text-gray-700 py-2 text-center text-sm font-oswald">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goalStatuses.map((status, index) => (
                                <TableRow 
                                    key={status.StatusId}
                                    className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <TableCell className="text-center py-2 font-oswald">
                                        <span className="font-bold text-gray-700 text-sm font-oswald">
                                            {index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-oswald">
                                        <span className="text-gray-900 text-sm font-oswald">
                                            {status.StatusName}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-oswald">
                                        <StatusBadge status={status.StatusKey} />
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-oswald">
                                        <span className="text-gray-700 text-sm font-oswald">
                                            {status.Description || "Aucune description"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-oswald">
                                        <span className={`px-3 py-1 rounded-md text-sm font-medium font-oswald ${
                                            status.IsActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {status.IsActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-2 font-oswald">
                                        <div className="flex justify-center space-x-2">
                                            {/* Edit button - always visible */}
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="hover:bg-black hover:text-white border-black text-black transition-all duration-200"
                                                onClick={() => handleEditStatus(status)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            
                                            {/* Delete/Restore button */}
                                            {status.IsActive ? (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="hover:bg-red-500 hover:text-white border-red-500 text-red-500 transition-all duration-200"
                                                    onClick={() => handleDeleteClick(status.StatusId, status.StatusName)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="hover:bg-green-500 hover:text-white border-green-500 text-green-500 transition-all duration-200"
                                                    onClick={() => handleRestoreStatus(status.StatusId, status.StatusName)}
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                            {goalStatuses.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-16 font-oswald">
                                        <div className="flex flex-col items-center space-y-6">
                                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
                                                <Activity className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xl font-bold text-gray-600 font-oswald">Aucun statut créé</p>
                                                <p className="text-sm text-gray-500 font-oswald max-w-md">
                                                    Commencez par créer votre premier statut pour suivre l'état de vos objectifs
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                                                <Plus className="w-4 h-4" />
                                                <span className="text-sm font-medium font-oswald">Cliquez sur "Nouveau Statut" pour commencer</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => setDeleteConfirmation(prev => ({...prev, isOpen: open}))}>
                <AlertDialogContent className="bg-white rounded-xl border-0 shadow-2xl">
                    <AlertDialogHeader className="pb-4">
                        <AlertDialogTitle className="text-xl font-bold text-orange-600 font-oswald flex items-center space-x-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Trash2 className="w-5 h-5 text-orange-600" />
                            </div>
                            <span>Confirmer la désactivation</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 text-sm leading-relaxed">
                            Êtes-vous sûr de vouloir désactiver le statut <strong>"{deleteConfirmation.statusName}"</strong> ?
                            <br /><br />
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                                <div className="flex items-center space-x-2 text-amber-800">
                                    <span className="text-lg">⚠️</span>
                                    <strong>Attention:</strong>
                                </div>
                                <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                                    Ce statut sera marqué comme <strong>inactif</strong> et ne sera plus disponible pour de nouveaux objectifs. 
                                    Les <strong>objectifs existants</strong> qui utilisent ce statut resteront intacts.
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-4">
                        <AlertDialogCancel className="hover:bg-gray-100 transition-colors">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-oswald transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Désactiver
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit Status Dialog */}
            <EditStatusDialog
                status={editingStatus}
                isOpen={showEditStatusDialog}
                onClose={handleCloseEditDialog}
                onSave={handleSaveStatus}
            />
        </div>
    );
}

export default StatusTab;
