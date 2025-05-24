import { CarModel, useCarsPaginated } from '../../../hooks/useCars';
import React, { useState, useMemo } from 'react';
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
  
  // Initialize form data when the dialog opens with a car
  React.useEffect(() => {
    if (car) {
      setFormData({
        carId: car.carId,
        carModel: car.carModel,
        carName: car.carName,
        modelYear: car.modelYear,
        price: car.price
      });
    }
  }, [car]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'modelYear' || name === 'price' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (car && formData) {
      onSave({
        ...car,
        ...formData
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-highBlue">Edit Car Details</DialogTitle>
          <DialogDescription>
            Make changes to your car information here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carModel" className="text-sm font-medium">Model</Label>
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
              <Label htmlFor="carName" className="text-sm font-medium">Name</Label>
              <Input
                id="carName"
                name="carName"
                value={formData.carName || ''}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modelYear" className="text-sm font-medium">Year</Label>
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
              <Label htmlFor="price" className="text-sm font-medium">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full"
                placeholder="Enter price"
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-highBlue hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
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
  const [selectedCar, setSelectedCar] = useState<CarModel | null>(null);

  // Fetch cars using the provided hook
  const { data, isLoading, error, refetch } = useCarsPaginated(currentPage, pageSize);

  // Filter cars client-side
  const filteredCars = useMemo(() => {
    if (!data?.cars) return [];
    
    if (!filter.trim()) return data.cars;
    
    const searchTerm = filter.toLowerCase().trim();
    return data.cars.filter((car: CarModel) => 
      car.carModel.toLowerCase().includes(searchTerm) ||
      car.carName?.toLowerCase().includes(searchTerm) ||
      car.modelYear?.toString().includes(searchTerm)
    );
  }, [data?.cars, filter]);

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
    // Here you would make an API call to update the car
    console.log('Saving updated car:', updatedCar);
    
    // Close the dialog and refresh the data
    setIsEditDialogOpen(false);
    setSelectedCar(null);
    refetch();
    
    // Show success notification (you can implement this part)
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedCar(null);
  };

  const handleDeleteCar = (carId: string | number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      // Implement deletion API call here
      console.log(`Deleting car with ID: ${carId}`);
      refetch();
    }
  };

  const handleAddCar = () => {
    navigate('/cars/add');
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
                    placeholder="Search by model, name, or year..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-9 "
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
              Error loading cars. Please try again.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {filteredCars.length > 0 ? (
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
                    {filteredCars.map((car: CarModel) => (
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
                        <TableCell>{car.price ? `$${car.price}` : '-'}</TableCell>
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
                  <p className="text-gray-500 text-center">No cars match your search criteria.</p>
                ) : (
                  <>
                    <p className="text-gray-500 text-center">You don't have any cars yet.</p>
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
              <div className="flex items-center justify-center mt-6 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                  className="h-8 px-3 py-1 bg-gray-100 text-blue-600 rounded-md disabled:opacity-50 font-medium border-gray-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                
                <div className="flex items-center text-sm">
                  <span className="font-semibold text-blue-600">{currentPage}</span>
                  <span className="mx-1 text-gray-400">/</span>
                  <span className="text-gray-600">{data.totalPages}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === data.totalPages}
                  onClick={handleNextPage}
                  className="h-8 px-3 py-1 bg-gray-100 text-blue-600 rounded-md disabled:opacity-50 font-medium border-gray-200"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
            
            {data && (
              <div className="text-center mt-2 text-sm text-gray-500">
                {data.total || filteredCars.length} cars total
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
    </Card>
  );
};

export default CarManipulation;