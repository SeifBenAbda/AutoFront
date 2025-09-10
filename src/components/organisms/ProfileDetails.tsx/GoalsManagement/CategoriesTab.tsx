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
import { CategoriesTabProps } from "./types";
import { textInputStyle, labelStyle, buttonStyle, cardStyle } from "./constants";

function CategoriesTab({
    showCreateCategoryDialog,
    setShowCreateCategoryDialog,
    newCategory,
    setNewCategory,
    handleCreateCategory,
    goalCategories
}: CategoriesTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-highBlue font-oswald">Gestion des Catégories</h3>
                <Dialog 
                    open={showCreateCategoryDialog} 
                    onOpenChange={(open) => {
                        if (open) {
                            // Reset form when opening
                            setNewCategory({ CategoryName: "", Description: "" });
                        }
                        setShowCreateCategoryDialog(open);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button className={buttonStyle}>
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvelle Catégorie
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label className={labelStyle}>Nom de la catégorie</Label>
                                <Input
                                    className={textInputStyle}
                                    value={newCategory.CategoryName}
                                    onChange={(e) => setNewCategory({...newCategory, CategoryName: e.target.value})}
                                    placeholder="Ex: i10_i20"
                                />
                            </div>
                            <div>
                                <Label className={labelStyle}>Description</Label>
                                <Input
                                    className={textInputStyle}
                                    value={newCategory.Description}
                                    onChange={(e) => setNewCategory({...newCategory, Description: e.target.value})}
                                    placeholder="Description de la catégorie"
                                />
                            </div>
                            <Button onClick={handleCreateCategory} className={buttonStyle}>
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
                            <TableHead>Description</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goalCategories.map((category) => (
                            <TableRow key={category.CategoryId}>
                                <TableCell>{category.CategoryId}</TableCell>
                                <TableCell className="font-medium">{category.CategoryName}</TableCell>
                                <TableCell>{category.Description}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        category.IsActive 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {category.IsActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </TableCell>
                                <TableCell>{new Date(category.CreatedAt).toLocaleDateString()}</TableCell>
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

export default CategoriesTab;
