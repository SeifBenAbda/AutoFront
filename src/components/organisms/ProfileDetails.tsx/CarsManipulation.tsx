import { CarModel, useCarsPaginated } from '../../../hooks/useCars';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '../../../@/components/ui/table';
import { Button } from '../../../@/components/ui/button';
import { Badge } from '../../../@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Input } from '../../../@/components/ui/input';
import { Label } from '../../../@/components/ui/label';
import { 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    ChevronLeft, 
    ChevronRight, 
    Filter, 
    Loader, 
    Car,
    Save
} from 'lucide-react';
import { Alert, AlertDescription } from '../../../@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../@/components/ui/dialog";
import CustomPagination from '../../../components/atoms/CustomPagination';
import { useEditCar, useCreateCar } from '../../../hooks/useCars';
import { useUser } from '../../../context/userContext';

// Edit Car Dialog Component
const EditCarDialog = ({
  car,
  isOpen,
  onClose,
  onSave
}: {
  car: CarModel | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCar: CarModel) => void;
}) => {
  const [formData, setFormData] = useState<Partial<CarModel>>({});
  const [showPriceWarning, setShowPriceWarning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Store the initial price to compare (as string with comma)
  const initialPrice = car?.price !== undefined && car?.price !== null
    ? String(car.price).replace(/\./g, ',')
    : '';

  // Use the updated mutation hook (no params at call, pass updatedCar in mutate)
  const editCarMutation = useEditCar();

  React.useEffect(() => {
    if (car) {
      let priceStr = '';
      if (car.price !== undefined && car.price !== null && car.price !== '') {
        priceStr = String(car.price).replace(/\./g, ',');
      }
      setFormData({
        carId: car.carId,
        carModel: car.carModel,
        carName: car.carName,
        modelYear: car.modelYear,
        price: priceStr
      });
      setShowPriceWarning(false);
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'price') {
      let formatted = value.replace(/\./g, ',').replace(/[^0-9,]/g, '');
      const parts = formatted.split(',');
      if (parts.length > 2) {
        formatted = parts[0] + ',' + parts.slice(1).join('');
      }
      if (parts[1]?.length > 3) {
        formatted = parts[0] + ',' + parts[1].slice(0, 3);
      }
      setFormData(prev => ({
        ...prev,
        price: formatted
      }));
      if (formatted !== initialPrice) {
        setShowPriceWarning(true);
      } else {
        setShowPriceWarning(false);
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: name === 'modelYear' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (car && formData) {
      // Prepare the payload: convert price to number with dot for backend if needed
      let payload = { ...formData };
      if (typeof payload.price === 'string' && payload.price !== '') {
        payload.price = Number(payload.price.replace(',', '.'));
      }
      editCarMutation.mutate(
        { updatedCar: payload },
        {
          onSuccess: (data) => {
            if (data.success) {
              setSuccessMsg('Voiture modifiée avec succès.');
              setTimeout(() => {
                setSuccessMsg('');
                onClose();
              }, 1200);
              onSave({ ...car, ...formData, price: payload.price ?? 0 });
            } else {
              setErrorMsg(data.message || "Une erreur est survenue lors de la modification.");
            }
          },
          onError: () => {
            setErrorMsg("Une erreur est survenue lors de la modification.");
          }
        }
      );
    }
  };

  const handleDiscard = () => {
    if (car) {
      setFormData(prev => ({
        ...prev,
        price: initialPrice
      }));
    }
    setShowPriceWarning(false);
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-highBlue">Modifier la voiture</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre voiture ici. Cliquez sur enregistrer quand vous avez terminé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carModel" className="text-sm font-medium">Modèle</Label>
              <Input
                id="carModel"
                name="carModel"
                value={formData.carModel || ''}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carName" className="text-sm font-medium">Nom</Label>
              <Input
                id="carName"
                name="carName"
                value={formData.carName || ''}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelYear" className="text-sm font-medium">Année</Label>
              <Input
                id="modelYear"
                name="modelYear"
                type="number"
                value={formData.modelYear || ''}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">Prix</Label>
              <Input
                id="price"
                name="price"
                type="text"
                inputMode="decimal"
                pattern="^\d+(,\d{0,3})?$"
                min={0}
                value={formData.price !== undefined && formData.price !== null ? formData.price : ''}
                onChange={handleChange}
                className="w-full"
                placeholder="Entrer le prix (ex: 12345,999)"
                required
              />
            </div>
          </div>

          {showPriceWarning && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-md p-3 text-sm flex items-center space-x-2 mt-2">
              <span>⚠️</span>
              <span>
                Le prix a changé et cela affectera tous les devis qui ont demandé la voiture <b>{formData.carName || formData.carModel}</b>.
              </span>
            </div>
          )}

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
              disabled={editCarMutation.isPending}
            >
              Annuler
            </Button>
            {showPriceWarning && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDiscard}
                className="border-yellow-400 text-yellow-700"
                disabled={editCarMutation.isPending}
              >
                Annuler la modification du prix
              </Button>
            )}
            <Button
              type="submit"
              className="bg-highBlue hover:bg-blue-700 text-white"
              disabled={editCarMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {editCarMutation.isPending ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Create Car Dialog Component
const CreateCarDialog = ({
  isOpen,
  onClose,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [formData, setFormData] = useState<Partial<CarModel>>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {user} = useUser();
  const createCarMutation = useCreateCar(user?.username || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'modelYear' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    createCarMutation.mutate(formData, {
      onSuccess: (data: any) => {
        setSuccessMsg('Voiture ajoutée avec succès.');
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
      <DialogContent className="sm:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-highBlue">Ajouter une voiture</DialogTitle>
          <DialogDescription>
            Remplissez les informations de la nouvelle voiture.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carModel">Modèle</Label>
              <Input id="carModel" name="carModel" value={formData.carModel || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carName">Nom</Label>
              <Input id="carName" name="carName" value={formData.carName || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelYear">Année</Label>
              <Input id="modelYear" name="modelYear" type="number" value={formData.modelYear || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Prix</Label>
              <Input id="price" name="price" type="text" value={formData.price || ''} onChange={handleChange} required />
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
            <Button type="button" variant="outline" onClick={onClose} disabled={createCarMutation.isPending}>
              Annuler
            </Button>
            <Button type="submit" className="bg-highBlue text-white" disabled={createCarMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createCarMutation.isPending ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const CarManipulation: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const pageSize = 7;
  const navigate = useNavigate();

  // Dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarModel | null>(null);

  // Pass filter as searchTerm to the hook, remove useMemo and local filtering
  const { data, isLoading, isFetching, error, refetch } = useCarsPaginated(currentPage, pageSize, filter);

  // Navigation handlers
  const handleNextPage = () => {
    if (data && currentPage < data.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Action handlers
  const handleEditCar = (car: CarModel) => {
    setSelectedCar(car);
    setIsEditDialogOpen(true);
  };

  const handleSaveCar = (updatedCar: CarModel) => {
    setIsEditDialogOpen(false);
    setSelectedCar(null);
    refetch(); // Refresh the car list after editing
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedCar(null);
  };

  const handleDeleteCar = (carId: string | number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      // Implement deletion API call here
      // Optionally trigger a refetch if your hook doesn't do it automatically
      // refetch();
    }
  };

  const handleAddCar = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  return (
    <Card className="shadow-md border border-gray-200/10 transition-all duration-200 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-highBlue to-normalBlue">
        <CardTitle className="text-xl font-bold text-white">
          Mes voitures
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
            onClick={handleAddCar}
            className="bg-greenOne hover:bg-greenOne text-white"
          >
            <Plus className="h-4 w-4 mr-1" /> Ajouter une Voiture
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6 bg-white">
        {isFilterVisible && (
          <div className="mb-6 p-4 bg-normalGrey rounded-md border border-normalGrey animate-in fade-in-50 duration-150">
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label htmlFor="filter" className="text-highBlue text-sm font-medium">Rechercher des voitures</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                  id="filter"
                  placeholder="Rechercher par modèle, nom ou année..."
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setCurrentPage(1); // Optionally reset to first page on search
                  }}
                  className="pl-9 "
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isLoading || isFetching ? (
          <div className="flex justify-center items-center my-10">
            <Loader className="h-8 w-8 animate-spin text-highBlue" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-4">
            <AlertDescription>
              Erreur lors du chargement des voitures. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {data?.cars && data.cars.length > 0 ? (
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-highBlue to-normalBlue">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-whiteSecond font-bold">Modèle</TableHead>
                      <TableHead className="text-whiteSecond font-bold">Nom</TableHead>
                      <TableHead className="text-whiteSecond font-bold">Année</TableHead>
                      <TableHead className="text-whiteSecond font-bold">Prix</TableHead>
                      <TableHead className="text-whiteSecond font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.cars.map((car: CarModel) => (
                      <TableRow 
                        key={car.carId} 
                        className="hover:bg-gray-50/80 transition-colors border-b border-gray-100/80"
                      >
                        <TableCell className="font-medium text-gray-700">{car.carModel}</TableCell>
                        <TableCell>{car.carName || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 rounded-md text-blue-700 border-blue-200 px-3 py-2">
                            {car.modelYear}
                          </Badge>
                        </TableCell>
                        <TableCell>{car.price ? `${car.price} DT` : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCar(car)}
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCar(car.carId)}
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
                <Car className="h-12 w-12 text-gray-300 mb-3" />
                {filter ? (
                  <p className="text-gray-500 text-center">Aucune voiture ne correspond à vos critères de recherche.</p>
                ) : (
                  <>
                    <p className="text-gray-500 text-center">Vous n'avez pas encore de voitures.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 border-blue-500 text-blue-600 hover:bg-blue-50"
                      onClick={handleAddCar}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add your first car
                    </Button>
                  </>
                )}
              </div>
            )}

            {data && data.totalPages > 1 && (
              <CustomPagination
                currentPage={currentPage}
                totalPages={data.totalPages || 0}
                onPageChange={(newPage) => setCurrentPage(newPage)}
                containerClassName="flex items-center justify-center mt-6 space-x-2"
                previousButtonClassName="px-3 py-1 bg-normalGrey text-highBlue rounded-md disabled:opacity-50 font-medium"
                nextButtonClassName="px-3 py-1 bg-normalGrey text-highBlue rounded-md disabled:opacity-50 font-medium"
                activePageClassName="bg-highBlue text-whiteSecond"
                inactivePageClassName="bg-normalGrey text-highBlue"
                dotClassName="px-3 py-1 text-highBlue"
              />
            )}
            
            {data && (
              <div className="text-center mt-2 text-sm text-gray-500">
                {data.total || data.cars.length} voitures au total
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {/* Edit Car Dialog */}
      <EditCarDialog
        car={selectedCar}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveCar}
      />
      {/* Create Car Dialog */}
      <CreateCarDialog
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

export default CarManipulation;