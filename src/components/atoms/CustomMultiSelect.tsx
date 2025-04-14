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
                                className={`bg-greenOne text-whiteSecond text-center text-sm px-2 py-1 rounded-md ${selectedOptionClassName}`}
                            >
                                {item}
                                {!disabled && (
                                    <span
                                        className="ml-1 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOption(item);
                                        }}
                                    >
                                        ×
                                    </span>
                                )}
                            </span>
                        ))}
                        {remainingCount > 0 && (
                            <span className="bg-gray-100 text-gray-800 border border-gray-800 text-sm px-2 py-1 rounded-md">
                                et {remainingCount} autres
                            </span>
                        )}
                        {!disabled && (
                            <span
                                className="ml-2 bg-red-500 border rounded-md py-1 px-1 border-red-500 text-whiteSecond text-sm cursor-pointer hover:text-whiteSecond"
                                onClick={clearAll}
                                title="Effacer toutes les sélections"
                            >
                                Tout effacer
                            </span>
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
                            className={`${optionStyle} ${selectedItems.includes(option) ? 'bg-blue-50 ' + selectedOptionClassName : optionClassName
                                }`}
                            onClick={() => toggleOption(option)}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedItems.includes(option)}
                                    readOnly
                                />
                                {option}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomMultiSelect;