import { Input } from '../../@/components/ui/input';
import { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react';

interface CinInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
}

const CinInput = forwardRef<HTMLInputElement, CinInputProps>(
    ({ value, onChange, maxLength = 15, ...props }, ref) => {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            
            // Only allow digits
            if (newValue === '' || /^[0-9]+$/.test(newValue)) {
                // Truncate to maxLength if needed
                const truncatedValue = newValue.slice(0, maxLength);
                onChange(truncatedValue);
            }
        };

        return (
            <Input
                ref={ref}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={value}
                onChange={handleChange}
                maxLength={maxLength}
                {...props}
            />
        );
    }
);

CinInput.displayName = 'CinInput';

export default CinInput;