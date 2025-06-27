import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// UI Components
import { Button } from '../../../@/components/ui/button';
import { Badge } from '../../../@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Label } from '../../../@/components/ui/label';
import { Alert, AlertDescription } from '../../../@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../../@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../../../@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../../@/components/ui/select";

// Icons
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Filter,
    Loader,
    Save,
    CreditCard
} from 'lucide-react';

// Custom components and hooks
import CustomPagination from '../../../components/atoms/CustomPagination';
import { useUser } from '../../../context/userContext';
import useBanksAndLeasing, { useAddBankOrLeasing } from '../../../hooks/useBanks';


// Data model
interface BanksAndLeasing {
    id: number;
    name: string;
    type: string;
}

// Edit Bank or Leasing Dialog Component
const EditBankOrLeasingDialog = ({
    item,
    isOpen,
    onClose,
    onSave
}: {
    item: BanksAndLeasing | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedItem: BanksAndLeasing) => void;
}) => {
    const [formData, setFormData] = useState<Partial<BanksAndLeasing>>({});
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const queryClient = useQueryClient();

    React.useEffect(() => {
        if (item) {
            setFormData({
                id: item.id,
                name: item.name,
                type: item.type
            });
            setSuccessMsg('');
            setErrorMsg('');
        }
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            type: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        // Here you would call your update API
        try {
            // Placeholder for update mutation
            // const result = await updateBankOrLeasing(formData);

            setSuccessMsg('Modifié avec succès.');
            setTimeout(() => {
                setSuccessMsg('');
                onClose();
                if (item) {
                    onSave({ ...item, ...formData as BanksAndLeasing });
                }
                queryClient.invalidateQueries({ queryKey: ['banksAndLeasing'] });
            }, 1200);
        } catch (error) {
            setErrorMsg("Une erreur est survenue lors de la modification.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md w-full">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-highBlue">
                        {formData.type === 'bank' ? 'Modifier la banque' : 'Modifier le leasing'}
                    </DialogTitle>
                    <DialogDescription>
                        Modifiez les informations ici. Cliquez sur enregistrer quand vous avez terminé.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Nom</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                className="w-full"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={handleTypeChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bank">Banque</SelectItem>
                                    <SelectItem value="leasing">Leasing</SelectItem>
                                </SelectContent>
                            </Select>
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

                    <DialogFooter className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-gray-300"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-highBlue hover:bg-blue-700 text-white"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer les modifications
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Create Bank or Leasing Dialog Component
const CreateBankOrLeasingDialog = ({
    isOpen,
    onClose,
    onSave
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}) => {
    const [formData, setFormData] = useState<{ name: string, type: string }>({
        name: '',
        type: 'bank'
    });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { user } = useUser();
    const addBankOrLeasingMutation = useAddBankOrLeasing();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            type: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');

        addBankOrLeasingMutation.mutate(formData, {
            onSuccess: () => {
                setSuccessMsg(formData.type === 'bank' ? 'Banque ajoutée avec succès.' : 'Leasing ajouté avec succès.');
                setTimeout(() => {
                    setSuccessMsg('');
                    onClose();
                    onSave();
                }, 1200);
            },
            onError: () => {
                setErrorMsg("Une erreur est survenue lors de l'ajout.");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md w-full">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-highBlue">
                        Ajouter une banque ou un leasing
                    </DialogTitle>
                    <DialogDescription>
                        Remplissez les informations du nouvel établissement.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={handleTypeChange}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bank">Banque</SelectItem>
                                    <SelectItem value="Leasing">Leasing</SelectItem>
                                </SelectContent>
                            </Select>
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

                    <DialogFooter className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={addBankOrLeasingMutation.isPending}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="bg-highBlue text-white"
                            disabled={addBankOrLeasingMutation.isPending}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {addBankOrLeasingMutation.isPending ? "Ajout..." : "Ajouter"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const BankAndLeasingManipulation: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState(true);
    const pageSize = 7;
    const navigate = useNavigate();

    // Dialog state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<BanksAndLeasing | null>(null);

    // Use the provided hook
    const { data: banksAndLeasingData, isLoading, error, refetch } = useBanksAndLeasing();

    // Filter and paginate data
    const filteredData = useMemo(() => {
        if (!banksAndLeasingData) return [];
        
        return banksAndLeasingData.filter((item: BanksAndLeasing) =>
            item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.type.toLowerCase().includes(filter.toLowerCase())
        );
    }, [banksAndLeasingData, filter]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    // Reset to first page when filter changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    // Navigation handlers
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Action handlers
    const handleEditItem = (item: BanksAndLeasing) => {
        setSelectedItem(item);
        setIsEditDialogOpen(true);
    };

    const handleSaveItem = (updatedItem: BanksAndLeasing) => {
        setIsEditDialogOpen(false);
        setSelectedItem(null);
        refetch(); // Refresh the list after editing
    };

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setSelectedItem(null);
    };

    const handleDeleteItem = (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément?')) {
            // Implement deletion API call here
            // refetch();
        }
    };

    const handleAddItem = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    return (
        <Card className="shadow-md border border-gray-200/10 transition-all duration-200 rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-highBlue to-normalBlue">
                <CardTitle className="text-xl font-bold text-white">
                    Banques et Leasings
                </CardTitle>
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-gray-100 bg-gray-100"
                    >
                        <Filter className="h-4 w-4 mr-1" />
                        {isFilterVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleAddItem}
                        className="bg-greenOne hover:bg-greenOne text-white"
                    >
                        <Plus className="h-4 w-4 mr-1" /> Ajouter
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6 bg-white">
                {isFilterVisible && (
                    <div className="mb-6 p-4 bg-normalGrey rounded-md border border-normalGrey animate-in fade-in-50 duration-150">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="filter" className="text-highBlue text-sm font-medium">Rechercher</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="filter"
                                        placeholder="Rechercher par nom ou type..."
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center my-10">
                        <Loader className="h-8 w-8 animate-spin text-highBlue" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="my-4">
                        <AlertDescription>
                            Erreur lors du chargement des données. Veuillez réessayer.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {paginatedData && paginatedData.length > 0 ? (
                            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100">
                                <Table>
                                    <TableHeader className="bg-gradient-to-r from-highBlue to-normalBlue">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="text-whiteSecond font-bold">Nom</TableHead>
                                            <TableHead className="text-whiteSecond font-bold">Type</TableHead>
                                            <TableHead className="text-whiteSecond font-bold text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedData.map((item: BanksAndLeasing) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-gray-50/80 transition-colors border-b border-gray-100/80"
                                            >
                                                <TableCell className="font-medium text-gray-700">{item.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`${item.type === 'bank'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : 'bg-purple-50 text-purple-700 border-purple-200'
                                                        } rounded-md px-3 py-2`}>
                                                        {item.type === 'bank' ? 'Banque' : 'Leasing'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditItem(item)}
                                                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <CreditCard className="h-12 w-12 text-gray-300 mb-3" />
                                {filter ? (
                                    <p className="text-gray-500 text-center">Aucun résultat ne correspond à vos critères de recherche.</p>
                                ) : (
                                    <>
                                        <p className="text-gray-500 text-center">Vous n'avez pas encore ajouté de banques ou de leasings.</p>
                                        <Button
                                            variant="outline"
                                            className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
                                            onClick={handleAddItem}
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Ajouter votre premier établissement
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(newPage) => setCurrentPage(newPage)}
                                containerClassName="flex items-center justify-center mt-6 space-x-2"
                                previousButtonClassName="px-3 py-1 bg-normalGrey text-highBlue rounded-md disabled:opacity-50 font-medium"
                                nextButtonClassName="px-3 py-1 bg-normalGrey text-highBlue rounded-md disabled:opacity-50 font-medium"
                                activePageClassName="bg-highBlue text-whiteSecond"
                                inactivePageClassName="bg-normalGrey text-highBlue"
                                dotClassName="px-3 py-1 text-highBlue"
                            />
                        )}

                        {banksAndLeasingData && (
                            <div className="text-center mt-2 text-sm text-gray-500">
                                {filteredData.length} établissements au total
                                {filter && ` (${banksAndLeasingData.length} au total)`}
                            </div>
                        )}
                    </>
                )}
            </CardContent>

            {/* Edit Dialog */}
            <EditBankOrLeasingDialog
                item={selectedItem}
                isOpen={isEditDialogOpen}
                onClose={handleCloseEditDialog}
                onSave={handleSaveItem}
            />

            {/* Create Dialog */}
            <CreateBankOrLeasingDialog
                isOpen={isCreateDialogOpen}
                onClose={handleCloseCreateDialog}
                onSave={() => {
                    setIsCreateDialogOpen(false);
                    refetch();
                }}
            />
        </Card>
    );
};

export default BankAndLeasingManipulation;