import React from 'react';
import { Rappel } from "@/types/devisTypes";
import { Card, CardContent, CardHeader, CardTitle } from '../../@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../@/components/ui/accordion';
import { Textarea } from '../../@/components/ui/textarea';
import { DatePicker } from "../atoms/DataSelector";

interface RappelsCardProps {
    rappels: Rappel[];
    onUpdate: (updatedRappels: Rappel[]) => void; // Expecting an array of Rappel
}

export function RappelCard({ rappels, onUpdate }: RappelsCardProps) {
    const handleChange = (rappelId: number, field: keyof Rappel, value: string | Date | undefined) => {
        // Find the index of the rappel to update
        const index = rappels.findIndex(rappel => rappel.RappelId === rappelId);

        if (index === -1) return; // If Rappel not found, exit

        // Create a new list with the updated rappel
        const updatedRappels = [...rappels];
        updatedRappels[index] = {
            ...updatedRappels[index],
            [field]: value,
            UpdatedBy: "Current User", // Example, replace with actual user
            UpdatedAt: new Date() // Current timestamp
        };

        // Call onUpdate with the updated list
        onUpdate(updatedRappels);
    };

    const handleDateChange = (rappelId: number, date: Date | undefined) => {
        handleChange(rappelId, "RappelDate", date);
    };

    return (
        <Card className="pt-0 mb-5 mt-5 w-full border border-highGrey2 bg-highGrey2">
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="flex items-center text-highGrey2 text-lg space-x-4">
                    <span className="text-lg text-whiteSecond">Rappels</span>
                </CardTitle>
            </CardHeader>
            {rappels.map((rappel, index) => (
                <CardContent className='border border-lightWhite mr-2 ml-2 bg-lightWhite rounded-xl mb-2 pt-2' key={rappel.RappelId}>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger className='font-oswald pt-2 pb-2'>
                                Rappel N° {index+1} : {new Date(rappel.RappelDate!).toLocaleDateString()}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className='text-highGrey2 font-oswald text-base mt-2 mb-2'>Date du rappel</div>
                                <DatePicker
                                    value={rappel.RappelDate}
                                    onChange={(date) => handleDateChange(rappel.RappelId!, date)}
                                    fromYear={new Date().getFullYear()}
                                    toYear={new Date().getFullYear()+1}
                                />
                            </AccordionContent>
                            <AccordionContent>
                                <div className='text-highGrey2 font-oswald text-base mt-2 mb-2'>Contenu du rappel</div>
                                <Textarea
                                    value={rappel.RappelContent || ""} // Directly bind to client prop
                                    onChange={(e) => handleChange(rappel.RappelId!, "RappelContent", e.target.value)}
                                    className="mt-1 p-2 block w-full border border-highGrey2 rounded-md shadow-sm focus:ring-0 sm:text-sm"
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            ))}
        </Card>
    );
}
