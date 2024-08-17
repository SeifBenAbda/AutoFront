import React from "react";
import { regions } from '../../utils/Regions'
import { Popover, PopoverContent, PopoverTrigger } from "../../@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../../@/components/ui/button";
import { cn } from "../../@/lib/utils";

const RegionDropDown: React.FC = () => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full flex justify-between items-center truncate"
                >
                    <span className="truncate">
                        {value
                            ? regions.find((region) => region.value === value)?.label
                            : "Rechercher..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandInput placeholder="Rechercher Region..." />
                    <CommandList>
                        <CommandEmpty>Region Introuvable</CommandEmpty>
                        <CommandGroup>
                            {regions.map((region) => (
                                <CommandItem
                                    key={region.value}
                                    value={region.value}
                                    onSelect={(currentValue: React.SetStateAction<string>) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === region.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {region.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


export default RegionDropDown