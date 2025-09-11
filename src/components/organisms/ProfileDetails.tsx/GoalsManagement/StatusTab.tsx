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
    Key,
    RotateCcw,
} from "lucide-react";
import StatusDevisDropDown from "../../../atoms/StatusDevis";
import { StatusTabProps } from "./types";
import { textInputStyle, labelStyle, buttonStyle } from "./constants";
import { useState } from "react";

function StatusTab({
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    newStatus,
    setNewStatus,
    handleCreateStatus,
    handleDeleteStatus,
    handleRestoreStatus,
    goalStatuses
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
        <div className="space-y-8">
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
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-highBlue font-oswald mb-2">Liste des statuts</h4>
                    <p className="text-sm text-gray-600 font-oswald">Gérez tous les états de suivi de vos objectifs</p>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-200 bg-gray-50">
                                <TableHead className="font-bold text-gray-700 py-4 text-center">#</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Nom du statut</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Clé</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Description</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Statut</TableHead>
                                <TableHead className="font-bold text-gray-700 py-4 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {goalStatuses.map((status, index) => (
                                <TableRow 
                                    key={status.StatusId}
                                    className="border-gray-200 hover:bg-gray-50 transition-all duration-200"
                                >
                                    <TableCell className="text-center py-4">
                                        <span className="font-bold text-gray-700">
                                            {index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className="font-semibold text-gray-900">
                                            {status.StatusName}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <code className="bg-gray-100 px-3 py-1 rounded-md text-xs font-mono text-gray-700">
                                            {status.StatusKey}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className="text-gray-700">
                                            {status.Description || "Aucune description"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            status.IsActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {status.IsActive ? 'Actif' : 'Inactif'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center py-4">
                                        <div className="flex justify-center">
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
                                    <TableCell colSpan={6} className="text-center py-16">
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
                                                <span className="text-sm font-medium">Cliquez sur "Nouveau Statut" pour commencer</span>
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
        </div>
    );
}

export default StatusTab;
