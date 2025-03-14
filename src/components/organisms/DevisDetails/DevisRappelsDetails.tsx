import { Rappel } from "../../../types/devisTypes";
import AudioRecorder from "./DevisAudioSystem";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { DatePicker } from "../../atoms/DateSelector";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../../../@/components/ui/table";
import { Button } from "../../../@/components/ui/button";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, Clock } from "lucide-react";
import React from "react";
import { Badge } from "../../../@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../@/components/ui/dialog";
import { Input } from "../../../@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../@/components/ui/tooltip";

// Extending the Rappel type to include status if it doesn't already have it
interface EnhancedRappel extends Rappel {
    status?: 'open' | 'closed';
}

interface DevisRappelsDetailsProps {
    devisId: number,
    rappels: Rappel[];
    onUpdate: (updatedRappels: Rappel[]) => void;
}

export function DevisRappelsDetails({ devisId, rappels: initialRappels, onUpdate }: DevisRappelsDetailsProps) {
    const [enhancedRappels, setEnhancedRappels] = useState<EnhancedRappel[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rappelToDelete, setRappelToDelete] = useState<number | null>(null);
    const [editingCell, setEditingCell] = useState<{ rappelId: number, field: string } | null>(null);
    const [tempEditValue, setTempEditValue] = useState<string>("");

    // Process rappels to include status based on date
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const processed = initialRappels.map(rappel => {
            const rappelDate = rappel.RappelDate ? new Date(rappel.RappelDate) : null;
            rappelDate?.setHours(0, 0, 0, 0);

            // Default status: if date is in the past, mark as closed, otherwise open
            const status = (rappelDate && rappelDate < today) ? 'closed' : 'open';

            return {
                ...rappel,
                status: (rappel.RappelContent as 'open' | 'closed') || status // Preserve existing status if available
            };
        });

        setEnhancedRappels(processed);
    }, [initialRappels]);

    const handleChange = (rappelId: number, field: keyof EnhancedRappel, value: any) => {
        // ...existing code...
        const index = enhancedRappels.findIndex(rappel => rappel.RappelId === rappelId);
        if (index === -1) return;

        const updatedRappels = [...enhancedRappels];
        updatedRappels[index] = {
            ...updatedRappels[index],
            [field]: value,
            UpdatedBy: "Current User",
            UpdatedAt: new Date()
        };

        // If the date changes and is in the past, update status accordingly
        if (field === 'RappelDate') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const rappelDate = value ? new Date(value) : null;
            rappelDate?.setHours(0, 0, 0, 0);

            if (rappelDate && rappelDate < today) {
                updatedRappels[index].status = 'closed';
            } else if (rappelDate) {
                updatedRappels[index].status = 'open';
            }
        }

        setEnhancedRappels(updatedRappels);
        onUpdate(updatedRappels);
    };

    const handleDateChange = (rappelId: number, date: Date | undefined) => {
        handleChange(rappelId, "RappelDate", date);
    };

    const addNewRappel = () => {
        const newRappel: EnhancedRappel = {
            RappelId: Date.now(),
            DevisId: devisId,
            RappelDate: new Date(),
            RappelContent: "",
            status: 'open',
            CreatedBy: "Current User",
            CreatedAt: new Date(),
            UpdatedBy: "Current User",
            UpdatedAt: new Date()
        };

        const updatedRappels = [...enhancedRappels, newRappel];
        setEnhancedRappels(updatedRappels);
        onUpdate(updatedRappels);

        // Focus on the new rappel content field after a short delay
        setTimeout(() => {
            setEditingCell({ rappelId: newRappel.RappelId!, field: 'RappelContent' });
            setTempEditValue("");
        }, 100);
    };

    const confirmDeleteRappel = (rappelId: number, event?: React.MouseEvent) => {
        if (event) event.stopPropagation();
        setRappelToDelete(rappelId);
        setDeleteDialogOpen(true);
    };

    const deleteRappel = () => {
        if (rappelToDelete === null) return;

        const updatedRappels = enhancedRappels.filter(rappel => rappel.RappelId !== rappelToDelete);
        setEnhancedRappels(updatedRappels);
        onUpdate(updatedRappels);
        setDeleteDialogOpen(false);
        setRappelToDelete(null);
    };

    const startEditing = (rappelId: number, field: string, currentValue: string, event: React.MouseEvent) => {
        // Only allow editing if rappel exists
        const rappel = enhancedRappels.find(r => r.RappelId === rappelId);
        if (!rappel) return;
        
        // Check if editing is allowed for this field
        if (field === 'RappelDate' && !isDateEditable(rappel)) {
            return;
        }
        
        if (field === 'RappelContent' && !isContentEditable(rappel)) {
            return;
        }
        
        event.stopPropagation();
        setEditingCell({ rappelId, field });
        setTempEditValue(currentValue || "");
    };

    const saveEditing = () => {
        if (!editingCell) return;

        handleChange(editingCell.rappelId, editingCell.field as keyof EnhancedRappel, tempEditValue);
        setEditingCell(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveEditing();
        } else if (e.key === 'Escape') {
            setEditingCell(null);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'open') {
            return <Badge className="bg-green-100 text-green-800"><Clock size={14} className="mr-1" /> En cours</Badge>;
        } else {
            return <Badge className="bg-gray-100 text-gray-800"><CheckCircle size={14} className="mr-1" /> Clôturé</Badge>;
        }
    };

    const toggleStatus = (rappelId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        const rappel = enhancedRappels.find(r => r.RappelId === rappelId);
        if (!rappel) return;

        const newStatus = rappel.status === 'open' ? 'closed' : 'open';
        handleChange(rappelId, 'status', newStatus);
    };

    // Check if date is editable (not in the past)
    const isDateEditable = (rappel: EnhancedRappel) => {
        return rappel.status === 'open';
    };
   
    // Always allow content editing regardless of date
    const isContentEditable = (rappel: EnhancedRappel) => {
        return rappel.status === 'open';
    };

    return (
        <Card className="bg-blueCiel border-0">
            <CardHeader className="bg-transparent pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="font-oswald text-highBlue text-xl">Rappels</CardTitle>
                    <Button
                        onClick={addNewRappel}
                        className="bg-highBlue hover:bg-highBlue text-white flex items-center gap-1"
                        disabled={true}
                    >
                        <Plus size={16} /> Nouveau Rappel
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                {enhancedRappels.length === 0 ? (
                    <div className="text-center py-8 text-highBlue">
                        Aucun rappel pour l'instant. Cliquez sur "Nouveau Rappel" pour en créer un.
                    </div>
                ) : (
                    <div className="overflow-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-oswald w-10 text-highBlue">N°</TableHead>
                                    <TableHead className="font-oswald w-36 text-highBlue">Date</TableHead>
                                    <TableHead className="font-oswald text-highBlue">Contenu</TableHead>
                                    <TableHead className="font-oswald w-24 text-highBlue">Statut</TableHead>
                                    <TableHead className="font-oswald w-20 text-right text-highBlue">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enhancedRappels.map((rappel, index) => (
                                    <TableRow
                                        key={rappel.RappelId}
                                        className={`hover:bg-blueCiel ${rappel.status === 'closed' ? 'text-highBlue bg-blueCiel' : ''}`}
                                    >
                                        <TableCell className="font-medium p-2">{index + 1}</TableCell>
                                        <TableCell className="p-2">
                                            <DatePicker
                                                value={rappel.RappelDate}
                                                onChange={(date) => {
                                                    if (isDateEditable(rappel)) {
                                                        handleDateChange(rappel.RappelId!, date);
                                                    }
                                                }}
                                                fromYear={new Date().getFullYear() - 1}
                                                toYear={new Date().getFullYear() + 2}
                                                styling={`w-full  ${isDateEditable(rappel) ? 'text-highBlue' : 
                                                    'text-white font-oswald bg-lightRed cursor-not-allowed hover:bg-lightRed hover:text-white'}`}
                                                
                                            />
                                        </TableCell>
                                        <TableCell className="p-2">
                                            {editingCell?.rappelId === rappel.RappelId && editingCell?.field === 'RappelContent' && isContentEditable(rappel) ? (
                                                <div className="flex">
                                                    <Input
                                                        value={tempEditValue}
                                                        onChange={(e) => setTempEditValue(e.target.value)}
                                                        onBlur={saveEditing}
                                                        onKeyDown={handleKeyDown}
                                                        className="w-full"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className={`${isContentEditable(rappel) ? 'cursor-pointer' : 'cursor-not-allowed'} 
                                                    hover:bg-blueCiel p-1 rounded flex items-center justify-between truncate max-w-[300px]`}
                                                    onClick={(e) => startEditing(rappel.RappelId!, 'RappelContent', rappel.RappelContent || '', e)}
                                                >
                                                    <span className="truncate">{rappel.RappelContent || "Pas de contenu"}</span>
                                                    {isContentEditable(rappel) && <Edit size={14} className="ml-1 text-highBlue flex-shrink-0" />}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center" onClick={(e) => toggleStatus(rappel.RappelId!, e)}>
                                                            {getStatusBadge(rappel.status || 'open')}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Cliquez pour changer le statut</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell className="p-2 text-right">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                                            onClick={(e) => confirmDeleteRappel(rappel.RappelId!, e)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Supprimer ce rappel</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-200">
                   
                    <AudioRecorder devisId={devisId} />
                </div>
            </CardContent>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce rappel ? Cette action ne peut pas être annulée.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={deleteRappel}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}