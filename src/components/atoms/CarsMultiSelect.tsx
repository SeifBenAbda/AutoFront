// src/components/PriorityDevisDropDown.tsx
import useCarModels from '../../hooks/useCars';
import { MultiSelect } from '../../@/components/ui/multi-select';
import React from 'react';

interface CarsDropDownTypes {
    selectedValues: string[]; // Adjust to handle multiple selections
    onChange: (values: string[]) => void;
    isFiltering: boolean;
    inDialog?: boolean; // New prop to handle dialog context
}

const CarsMultiSelect = ({ selectedValues, onChange, isFiltering, inDialog = false }: CarsDropDownTypes) => {
    const { data: carModels, isLoading, error } = useCarModels();
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Handle wheel events for dialog context
    React.useEffect(() => {
        if (!inDialog) return;

        const handleWheel = (e: WheelEvent) => {
            // Look for any open CommandList (scrollable dropdown content)
            const commandLists = document.querySelectorAll('[data-cmdk-list]');
            
            commandLists.forEach((list) => {
                const listElement = list as HTMLElement;
                const rect = listElement.getBoundingClientRect();
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                
                // Check if mouse is over this command list
                if (mouseX >= rect.left && mouseX <= rect.right && 
                    mouseY >= rect.top && mouseY <= rect.bottom) {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // Apply scroll
                    listElement.scrollTop += e.deltaY;
                }
            });
        };

        document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
        
        return () => {
            document.removeEventListener('wheel', handleWheel, true);
        };
    }, [inDialog]);

    if (isLoading){
        return (
            <div className="flex justify-center items-center h-10">
                <div className="flex border-2 border-t-highBlue h-4 w-4 border-gray-200 rounded-full animate-spin"></div>
            </div>
        );
    }
    if (error) return <div>Error: {error.message}</div>;

    // Prepare options for MultiSelect
    const options = carModels?.map((car) => ({
        label: car.carName,
        value: car.carName,
    })) || [];

    // Add a default "All types of cars" option if filtering
    if (isFiltering) {
        /*options.unshift({
            label: 'Tous types de voitures',
            value: 'Tous types de voitures',
        });*/
    }
    const hoverItem = "cursor-pointer  hover:rounded-md hover:bg-normalGrey";
    const hoverItemCommand = "cursor-pointer   hover:bg-normalGrey";
    
    // Use higher z-index for dialog context
    const containerClass = inDialog ? "relative" : "";
    const commandClass = inDialog 
        ? `w-full border border-normalGrey bg-normalGrey text-highBlue max-h-60 overflow-y-auto scroll-smooth touch-pan-y ${hoverItemCommand}`
        : `w-full border border-normalGrey bg-normalGrey text-highBlue max-h-60 overflow-y-auto ${hoverItemCommand}`;
    const borderCommandClass = inDialog ? "border border-normalGrey z-[60] overscroll-contain" : "border border-normalGrey";

    // Handle mouse wheel events for dialog context
    const handleMouseWheel = (e: React.WheelEvent) => {
        if (inDialog) {
            e.stopPropagation(); // Prevent dialog from handling the scroll
            const target = e.currentTarget as HTMLElement;
            const scrollableElement = target.querySelector('[data-radix-scroll-area-viewport], .overflow-y-auto');
            if (scrollableElement) {
                scrollableElement.scrollTop += e.deltaY;
            }
        }
    };

    return (
        <div ref={containerRef} className={containerClass} onWheel={handleMouseWheel}>
            <MultiSelect
                options={options}
                onValueChange={onChange}
                defaultValue={selectedValues}
                placeholder="Tous types de voitures"
                variant="inverted"
                animation={0}
                maxCount={1}
                className={`w-full border border-normalGrey bg-normalGrey font-oswald text-highBlue ${hoverItem}`}
                classNameCommand={commandClass}
                classNameSearch={`w-full border border-normalGrey bg-normalGrey text-highBlue ${hoverItemCommand}`}
                borderCommand={borderCommandClass}
            />
        </div>
    );
};

export default CarsMultiSelect;
