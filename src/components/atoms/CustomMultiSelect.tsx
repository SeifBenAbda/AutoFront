import React, { useState, useEffect, useRef } from 'react';

interface CustomMultiSelectProps {
    options: string[];
    defaultValue?: string[];
    onChange?: (selectedItems: string[]) => void;
    className?: string;
    containerClassName?: string;
    optionClassName?: string;
    selectedOptionClassName?: string;
    placeholder?: string;
    disabled?: boolean;
    maxItemsToShow?: number;
    optionStyle?: string;
    optionListStyle?: string;
}

const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
    options,
    defaultValue = [],
    onChange,
    className = '',
    containerClassName = '',
    optionClassName = '',
    selectedOptionClassName = '',
    placeholder = 'Sélectionner des options',
    disabled = false,
    maxItemsToShow = 2,
    optionStyle = "px-3 py-2 cursor-pointer hover:bg-gray-100",
    optionListStyle = "absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
}) => {
    const [selectedItems, setSelectedItems] = useState<string[]>(defaultValue);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedItems(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        // Fonction pour gérer les clics en dehors du composant
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node) && isOpen) {
                setIsOpen(false);
            }
        };

        // Ajouter un écouteur d'événement lorsque le menu déroulant est ouvert
        document.addEventListener('mousedown', handleClickOutside);

        // Nettoyer l'écouteur d'événement
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleOption = (option: string) => {
        // Le reste de la fonction reste identique
        const newSelectedItems = selectedItems.includes(option)
            ? selectedItems.filter(item => item !== option)
            : [...selectedItems, option];

        setSelectedItems(newSelectedItems);

        if (onChange) {
            onChange(newSelectedItems);
        }
    };

    // Fonction pour effacer tous les éléments sélectionnés
    const clearAll = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedItems([]);
        if (onChange) {
            onChange([]);
        }
    };

    // Éléments à afficher et combien d'autres sont cachés
    const displayedItems = selectedItems.slice(0, maxItemsToShow);
    const remainingCount = Math.max(0, selectedItems.length - maxItemsToShow);

    return (
        <div className={`relative ${containerClassName}`} ref={containerRef}>
            <div
                className={`cursor-pointer border rounded-md p-2 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {selectedItems.length > 0 ? (
                    <div className="flex flex-wrap gap-1 items-center">
                        {displayedItems.map(item => (
                            <span
                                key={item}
                                className={`bg-blue-500 text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center ${selectedOptionClassName}`}
                            >
                                🚗 {item.length > 8 ? item.substring(0, 8) + '...' : item}
                                {!disabled && (
                                    <span
                                        className="ml-1 hover:bg-blue-600 rounded-full w-3 h-3 flex items-center justify-center text-xs cursor-pointer transition-colors duration-200"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOption(item);
                                        }}
                                        title={`Retirer ${item}`}
                                    >
                                        ×
                                    </span>
                                )}
                            </span>
                        ))}
                        {remainingCount > 0 && (
                            <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-md font-medium shadow-sm">
                                +{remainingCount}
                            </span>
                        )}
                        {!disabled && selectedItems.length > 1 && (
                            <button
                                className="ml-1 bg-red-500 hover:bg-red-600 rounded-md py-1 px-2 text-white text-xs cursor-pointer hover:shadow-md transition-all duration-200 font-medium"
                                onClick={clearAll}
                                title="Effacer tout"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="text-highBlue">{placeholder}</div>
                )}
            </div>

            {isOpen && !disabled && (
                <div className={optionListStyle}>
                    {options.map(option => (
                        <div
                            key={option}
                            className={`${optionStyle} ${selectedItems.includes(option) ? 
                                'bg-blue-50 border-l-4 border-blue-500 text-blue-800 font-semibold ' + selectedOptionClassName : 
                                optionClassName
                            }`}
                            onClick={() => toggleOption(option)}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    checked={selectedItems.includes(option)}
                                    readOnly
                                />
                                <span className={`${selectedItems.includes(option) ? 'font-semibold' : 'font-medium'}`}>
                                    {selectedItems.includes(option) ? '🚗 ' : '🚙 '}{option}
                                </span>
                                {selectedItems.includes(option) && (
                                    <span className="ml-auto text-blue-600 text-sm">✓</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomMultiSelect;