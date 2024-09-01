import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { fr } from 'date-fns/locale';
import { cn } from "../../@/lib/utils";
import { Button } from "../../@/components/ui/button";
import { Calendar } from "../../@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../@/components/ui/popover";
import { useState } from "react";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  fromYear?: number;
  toYear?: number;
}

export function DatePicker({ value, onChange, fromYear = 1960, toYear = new Date().getFullYear() - 18 }: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal border border-bluePrimary",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP", { locale: fr }) : <span>Choisir une date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start" side="bottom" sideOffset={0}>
        <Calendar
          className="w-full"
          mode="single"
          captionLayout="dropdown-buttons"
          selected={value}
          onSelect={(e) => { onChange(e); setIsCalendarOpen(false); }}
          initialFocus
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  );
}