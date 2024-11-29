import React, { useRef, useEffect } from 'react';
import { Input } from "../../@/components/ui/input";

export const NumericInput = ({ value, onChange, className }: { value: string | number, onChange: (value: string | number) => void, className: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current && document.activeElement === inputRef.current) {
            inputRef.current.focus();
        }
    }, [value]);

    return (
        <Input
            ref={inputRef}
            type="text"
            inputMode="decimal"  // Shows numeric keyboard with decimal on mobile
            maxLength={10}      // Native length limit
            pattern="[0-9]*,?[0-9]*"    // HTML5 validation
            autoComplete="off"  // Prevents unwanted autocomplete
            value={value}
            onBeforeInput={(e: React.FormEvent<HTMLInputElement>) => {
                // Allow numeric input and a single comma
                const inputEvent = e as unknown as InputEvent;
                if (!/^\d*,?\d*$/.test(inputEvent.data || '')) {
                    e.preventDefault();
                }
            }}
            onChange={(e) => onChange(e.target.value)}
            className={className}
        />
    );
};