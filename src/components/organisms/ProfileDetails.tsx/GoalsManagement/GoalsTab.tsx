import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { Label } from "../../../../@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../@/components/ui/select";
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
import { GoalsTabProps } from "./types";
import { textInputStyle, labelStyle, buttonStyle, cardStyle, months } from "./constants";

function GoalsTab({
    showCreateGoalDialog,
    setShowCreateGoalDialog,
    newGoal,
    setNewGoal,
    handleCreateGoal,
    goalCategories,
    goalStatuses,
    monthlyGoals
}: GoalsTabProps) { 
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-highBlue font-oswald">Gestion des Objectifs</h3>
                <Dialog 
                    open={showCreateGoalDialog} 
                    onOpenChange={(open) => {
                        if (open) {
                            setNewGoal({ categoryName: "", statusName: "", year: 0, month: 0, targetQuantity: 0, createdBy: "" });
                        }
                        setShowCreateGoalDialog(open);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className={buttonStyle}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvel Objectif
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer un nouvel objectif</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label className={labelStyle}>Catégorie</Label>
                                <Select 
                                    value={newGoal.categoryName} 
                                    onValueChange={(value) => setNewGoal({...newGoal, categoryName: value})}
                                >
                                    <SelectTrigger className={textInputStyle}>
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {goalCategories.filter(cat => cat.IsActive).map((category) => (
                                            <SelectItem key={category.CategoryId} value={category.CategoryName}>
                                                {category.CategoryName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className={labelStyle}>Statut cible</Label>
                                <Select 
                                    value={newGoal.statusName} 
                                    onValueChange={(value) => setNewGoal({...newGoal, statusName: value})}
                                >
                                    <SelectTrigger className={textInputStyle}>
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {goalStatuses.filter(status => status.IsActive).map((status) => (
                                            <SelectItem key={status.StatusId} value={status.StatusName}>
                                                {status.StatusName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className={labelStyle}>Année</Label>
                                    <Input
                                        type="number"
                                        className={textInputStyle}
                                        value={newGoal.year === 0 ? "" : newGoal.year}
                                        onChange={(e) => setNewGoal({...newGoal, year: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                                        placeholder="Année"
                                    />
                                </div>
                                <div>
                                    <Label className={labelStyle}>Mois</Label>
                                    <Select 
                                        value={newGoal.month === 0 ? "" : newGoal.month.toString()} 
                                        onValueChange={(value) => setNewGoal({...newGoal, month: value === "" ? 0 : parseInt(value)})}
                                    >
                                        <SelectTrigger className={textInputStyle}>
                                            <SelectValue placeholder="Mois" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {months.map((month, index) => (
                                                <SelectItem key={index + 1} value={(index + 1).toString()}>
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label className={labelStyle}>Quantité cible</Label>
                                <Input
                                    type="number"
                                    className={textInputStyle}
                                    value={newGoal.targetQuantity === 0 ? "" : newGoal.targetQuantity}
                                    onChange={(e) => setNewGoal({...newGoal, targetQuantity: e.target.value === "" ? 0 : parseInt(e.target.value)})}
                                    placeholder="Quantité"
                                />
                            </div>
                            <Button onClick={handleCreateGoal} className={buttonStyle}>
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
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Année</TableHead>
                            <TableHead>Mois</TableHead>
                            <TableHead>Objectif</TableHead>
                            <TableHead>Créé par</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {monthlyGoals && monthlyGoals.length > 0 ? (
                            monthlyGoals.map((goal) => {
                                return (
                                    <TableRow key={goal.GoalId}>
                                        <TableCell>{goal.GoalId}</TableCell>
                                        <TableCell>
                                            {goalCategories.find(cat => cat.CategoryId === goal.CategoryId)?.CategoryName || 'Unknown Category'}
                                        </TableCell>
                                        <TableCell>{goal.Year}</TableCell>
                                        <TableCell>{months[goal.Month - 1] || goal.Month}</TableCell>
                                        <TableCell className="font-medium">{goal.TargetQuantity}</TableCell>
                                        <TableCell>{goal.CreatedBy}</TableCell>
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
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    {monthlyGoals === undefined ? 
                                        'Chargement des objectifs...' : 
                                        'Aucun objectif trouvé. Créez votre premier objectif en cliquant sur "Nouvel Objectif".'
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default GoalsTab;
