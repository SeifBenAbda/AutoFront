import * as React from "react"
import { cn } from "../../@/lib/utils"
import { max } from "date-fns";

export interface NumericInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'inputMode' | 'pattern'> {}

const NumericInputForm = React.forwardRef<HTMLInputElement, NumericInputProps>(
    ({ className, autoComplete = "off", onChange, ...props }, ref) => {
        const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
            const numericValue = event.target.value.replace(/[^0-9]/g, '');
            event.target.value = numericValue;
            onChange?.(event);
        }, [onChange]);

        return (
            <input
            maxLength={length}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete={autoComplete}
                onChange={handleChange}
                className={cn(
                    "flex h-10 w-full rounded-md border border-slate-200 bg-whiteSecond px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-highBlue focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

NumericInputForm.displayName = "NumericInputForm"

export { NumericInputForm }
