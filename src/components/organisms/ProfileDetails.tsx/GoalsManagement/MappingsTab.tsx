import { useState, useEffect } from "react";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../@/components/ui/table";
import { useToast } from "../../../../hooks/use-toast";
import useCarModels from "../../../../hooks/useCars";
import { useAssignCarToCategory, useAutoCategorizeCars } from "../../../../hooks/useGoalsManagement";
import { fetchCarCategorization } from "../../../../services/goalManagementService";
import CarsDropDown from "../../../atoms/CarsDropDown";
import CategorySelect from "./CategorySelect";
import Loading from "../../../atoms/Loading";
import { state } from "../../../../utils/shared_functions";
import { MappingsTabProps } from "./types";
import { buttonStyle, cardStyle, labelStyle } from "./constants";

function MappingsTab({ goalCategories, goalStatuses }: MappingsTabProps) {
    const { toast } = useToast();
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [modelFilter, setModelFilter] = useState<string>("");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [assignCarId, setAssignCarId] = useState<number | null>(null); // underlying id
    const [assignCarName, setAssignCarName] = useState<string>(""); // selected dropdown value (name)
    const [assignCategoryName, setAssignCategoryName] = useState<string>("");
    const [assignStatusName, setAssignStatusName] = useState<string>(""); // optional status

    // All cars list to resolve carId even if not yet mapped
    const { data: carModels } = useCarModels();

    const assignMutation = useAssignCarToCategory();
    const autoMutation = useAutoCategorizeCars();

    const loadData = async () => {
        try {
            setLoading(true);
            const rows = await fetchCarCategorization(state.databaseName, categoryFilter || undefined, modelFilter || undefined, undefined, () => {});
            setData(rows || []);
        } catch (e: any) {
            toast({ title: "Erreur", description: e.message || 'Chargement échoué', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!assignCarId || !assignCategoryName) {
            toast({ title: 'Champs manquants', description: 'Voiture & catégorie requis', variant: 'destructive' });
            return;
        }
        try {
            const assignData = { 
                carId: assignCarId, 
                categoryName: assignCategoryName,
                ...(assignStatusName && assignStatusName !== "none" && { statusName: assignStatusName })
            };
            await assignMutation.mutateAsync(assignData);
            toast({ title: 'Assigné', description: 'Voiture assignée à la catégorie' });
            setAssignCarId(null);
            setAssignCarName("");
            setAssignCategoryName("");
            setAssignStatusName("");
            loadData();
        } catch (e: any) {
            toast({ title: 'Erreur', description: e.message || 'Assignation échouée', variant: 'destructive' });
        }
    };

    const handleAutoCategorize = async () => {
        try {
            await autoMutation.mutateAsync();
            toast({ title: 'Succès', description: 'Catégorisation automatique lancée' });
            loadData();
        } catch (e: any) {
            toast({ title: 'Erreur', description: e.message || 'Opération échouée', variant: 'destructive' });
        }
    };

    // Initial load when tab opened
    useEffect(() => { loadData(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h3 className="text-lg font-semibold text-highBlue font-oswald">Mappings Voiture-Catégorie</h3>
                <div className="flex flex-wrap gap-2">
                    <Input placeholder="Filtrer Catégorie" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-40 bg-normalGrey border-normalGrey" />
                    <Input placeholder="Filtrer Modèle" value={modelFilter} onChange={(e) => setModelFilter(e.target.value)} className="w-40 bg-normalGrey border-normalGrey" />
                    <Button onClick={loadData} className={buttonStyle} disabled={loading}>{loading ? '...' : 'Filtrer'}</Button>
                    <Button onClick={handleAutoCategorize} className={buttonStyle} disabled={autoMutation.isPending}>Auto Catégoriser</Button>
                </div>
            </div>

            <div className={cardStyle}>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                    {/* Car Dropdown (by name) */}
                    <div>
                        <Label className={labelStyle}>Voiture</Label>
                        <CarsDropDown 
                            value={assignCarName}
                            isFiltring={false}
                            onChange={(val: string) => {
                                setAssignCarName(val);
                                // Resolve carId from complete carModels list first
                                const foundModel = carModels?.find(c => c.carName === val);
                                if (foundModel) {
                                    setAssignCarId(foundModel.carId);
                                } else {
                                    // Fallback: look in already loaded mapping rows
                                    const found = data.find(d => 
                                        d.Model === val ||
                                        d.Modele === val ||
                                        d.carModel === val ||
                                        d.carName === val ||
                                        d.ModelName === val ||
                                        d.CarName === val
                                    );
                                    setAssignCarId(found?.CarId ?? found?.carId ?? null);
                                }
                                if (!foundModel && !data.find(d => d.Model === val || d.carModel === val || d.carName === val)) {
                                    toast({ title: 'Attention', description: 'Impossible de résoudre l\'ID de la voiture (non trouvée)', variant: 'destructive' });
                                }
                            }}
                        />
                    </div>
                    {/* Category Dropdown */}
                    <div>
                        <Label className={labelStyle}>Catégorie</Label>
                        <CategorySelect value={assignCategoryName} onChange={setAssignCategoryName} categories={goalCategories} />
                    </div>
                    {/* Status Dropdown */}
                    <div>
                        <Label className={labelStyle}>Statut (optionnel)</Label>
                        <Select 
                            value={assignStatusName} 
                            onValueChange={setAssignStatusName}
                        >
                            <SelectTrigger className="bg-normalGrey border-normalGrey">
                                <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Aucun statut</SelectItem>
                                {goalStatuses.filter(status => status.IsActive).map((status) => (
                                    <SelectItem key={status.StatusId} value={status.StatusName}>
                                        {status.StatusName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button onClick={handleAssign} className={buttonStyle} disabled={assignMutation.isPending || assignCarId === null || !assignCategoryName}>{assignMutation.isPending ? '...' : 'Assigner'}</Button>
                    </div>
                </div>
                <div className="overflow-auto max-h-[500px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>CarId</TableHead>
                                <TableHead>Modèle</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Disponible</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row: any, idx: number) => {
                                // Normalize fields coming from vw_CarCategorization (carId, carModel, carName, CategoryName, StatusName, isAvailable)
                                const carId = row.CarId ?? row.carId;
                                const model = row.Model || row.Modele || row.carModel || row.carName || '-';
                                const category = row.CategoryName || row.categoryName || '-';
                                const status = row.StatusName || row.statusName || '-';
                                const availableRaw = row.Available ?? row.available ?? row.isAvailable;
                                let availableDisplay = '-';
                                if (availableRaw === true || availableRaw === 1) availableDisplay = 'Oui';
                                else if (availableRaw === false || availableRaw === 0) availableDisplay = 'Non';
                                return (
                                    <TableRow key={idx} className="text-sm">
                                        <TableCell>{carId ?? '-'}</TableCell>
                                        <TableCell>{model}</TableCell>
                                        <TableCell>{category}</TableCell>
                                        <TableCell>{status}</TableCell>
                                        <TableCell>{availableDisplay}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {data.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-highGrey py-6">Aucune donnée</TableCell>
                                </TableRow>
                            )}
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6"><Loading /></TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default MappingsTab;
