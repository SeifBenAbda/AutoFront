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
} from "lucide-react";
import StatusDevisDropDown from "../../../atoms/StatusDevis";
import { StatusTabProps } from "./types";
import { textInputStyle, labelStyle, buttonStyle, cardStyle } from "./constants";

function StatusTab({
    showCreateStatusDialog,
    setShowCreateStatusDialog,
    newStatus,
    setNewStatus,
    handleCreateStatus,
    goalStatuses
}: StatusTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-highBlue font-oswald">Gestion des Statuts</h3>
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
                        <Button className={buttonStyle}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau Statut
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un nouveau statut</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label className={labelStyle}>Statut</Label>
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
                            <div>
                                <Label className={labelStyle}>Description (optionnel)</Label>
                                <Input
                                    className={textInputStyle}
                                    value={newStatus.Description || ''}
                                    onChange={(e) => setNewStatus({...newStatus, Description: e.target.value})}
                                    placeholder="Description du statut"
                                />
                            </div>
                            <Button onClick={handleCreateStatus} className={buttonStyle}>
                                Créer
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className={cardStyle}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Clé</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goalStatuses.map((status) => (
                            <TableRow key={status.StatusId}>
                                <TableCell>{status.StatusId}</TableCell>
                                <TableCell className="font-medium">{status.StatusName}</TableCell>
                                <TableCell>
                                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                        {status.StatusKey}
                                    </code>
                                </TableCell>
                                <TableCell>{status.Description}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        status.IsActive 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {status.IsActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="hover:bg-lightBlue hover:text-white border-lightBlue text-lightBlue">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="hover:bg-red-500 hover:text-white border-red-500 text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default StatusTab;
