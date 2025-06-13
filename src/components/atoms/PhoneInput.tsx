import React, { useRef, useEffect } from 'react';
import { Input } from "../../@/components/ui/input";

export const PhoneInput = ({ 
    value, 
    onChange, 
    className = '', 
    placeholder = ''
}: { 
    value: string, 
    onChange: (value: string) => void, 
    className?: string, 
    placeholder?: string 
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && document.activeElement === inputRef.current) {
            inputRef.current.focus();
        }
    }, [value]);

    const isValid = (phone: string) => {
        return phone.length === 8;
    };

    return (
        <Input
            ref={inputRef}
            placeholder={placeholder}
            type="tel"
            inputMode="numeric"
            maxLength={8}
            pattern="[0-9]{8}"
            autoComplete="tel"
            value={value}
            onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
                const inputEvent = e as unknown as InputEvent;
                const inputData = inputEvent.data || '';
                
                // Only allow digits
                if (!/^\d$/i.test(inputData)) {
                    e.preventDefault();
                }
                
                // Prevent adding more than 8 digits
                if (value.length >= 8 && inputData !== '') {
                    e.preventDefault();
                }
            }}
            onChange={(e) => {
                // Filter out non-numeric characters and limit to 8 digits
                const numericValue = e.target.value.replace(/\D/g, '').substring(0, 8);
                onChange(numericValue);
            }}
            onBlur={(e) => {
                // Validate exactly 8 digits on blur
                if (value && !isValid(value)) {
                    // You can add visual feedback or error state here
                    console.warn('Phone number must be exactly 8 digits');
                }
            }}
            className={className}
        />
    );
};

export default PhoneInput;