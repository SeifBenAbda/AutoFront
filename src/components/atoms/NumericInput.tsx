import React, { useRef, useEffect } from 'react';
import { Input } from "../../@/components/ui/input";

export const NumericInput = ({ 
    value, 
    onChange, 
    className = '', 
    placeholder 
}: { 
    value: string | number, 
    onChange: (value: string | number) => void, 
    className?: string, 
    placeholder?: string 
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && document.activeElement === inputRef.current) {
            inputRef.current.focus();
        }
    }, [value]);

    return (
        <Input
            ref={inputRef}
            placeholder={placeholder}
            type="text"
            inputMode="decimal"  // Shows numeric keyboard with decimal on mobile
            maxLength={15}      // Increased to accommodate decimal places
            pattern="[0-9]*\.?[0-9]{0,3}"  // Updated pattern for decimal validation
            autoComplete="off"  // Prevents unwanted autocomplete
            value={value}
            onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
                const inputEvent = e as unknown as InputEvent;
                const currentValue = (inputEvent.target as HTMLInputElement)?.value || '';
                const inputData = inputEvent.data || '';
                
                // Block the input if:
                // 1. The input is not a digit or decimal point
                // 2. The input is a decimal point and the value already has one
                // 3. The input would create more than 3 digits after the decimal point
                if (
                    !/^\d|\.$/i.test(inputData) || 
                    (inputData === '.' && currentValue.includes('.')) ||
                    (
                        currentValue.includes('.') && 
                        (inputEvent.target as HTMLInputElement)?.selectionStart !== null &&
                        ((inputEvent.target as HTMLInputElement)?.selectionStart ?? 0) > currentValue.indexOf('.') && 
                        currentValue.split('.')[1]?.length >= 3
                    )
                ) {
                    e.preventDefault();
                }
            }}
            onChange={(e) => {
                // Ensure value doesn't have more than 3 decimal places
                const value = e.target.value;
                const parts = value.split('.');
                if (parts.length > 1 && parts[1].length > 3) {
                    // Trim excess decimal places
                    onChange(parts[0] + '.' + parts[1].substring(0, 3));
                } else {
                    onChange(value);
                }
            }}
            className={className}
        />
    );
};