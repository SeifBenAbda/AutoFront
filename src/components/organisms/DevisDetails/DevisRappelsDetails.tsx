import { Rappel } from "../../../types/devisTypes";
import AudioRecorder from "./DevisAudioSystem";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Textarea } from "../../../@/components/ui/textarea";
import { DatePicker } from "../../atoms/DateSelector";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../@/components/ui/accordion";
interface DevisRappelsDetailsProps {
    devisId: number,
    rappels: Rappel[];
    onUpdate: (updatedRappels: Rappel[]) => void;
}



export function DevisRappelsDetails({ devisId, rappels, onUpdate }: DevisRappelsDetailsProps) {

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
        <div className="flex flex-col pl-2 pr-2 pt-2 ">
            <div className="flex flex-col ml-2">

                {rappels.map((rappel, index) => (
                    <CardContent className='border border-blueCiel mr-2 ml-2 bg-blueCiel rounded-md mb-1' key={rappel.RappelId}>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={`item-${index}`}>
                                <AccordionTrigger className='font-oswald pt-2 pb-2'>
                                    Rappel N° {index + 1} : {new Date(rappel.RappelDate!).toLocaleDateString()}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className='text-highBlue font-oswald text-base mt-2 mb-2'>Date du rappel</div>
                                    <DatePicker
                                        value={rappel.RappelDate}
                                        onChange={(date) => handleDateChange(rappel.RappelId!, date)}
                                        fromYear={new Date().getFullYear()}
                                        toYear={new Date().getFullYear() + 1}
                                    />
                                </AccordionContent>
                                <AccordionContent>
                                    <div className='text-highBlue font-oswald text-base mt-2 mb-2'>Contenu du rappel</div>
                                    <Textarea
                                        value={rappel.RappelContent || ""} // Directly bind to client prop
                                        onChange={(e) => handleChange(rappel.RappelId!, "RappelContent", e.target.value)}
                                        className="mt-1 p-2 block w-full border border-highBlue rounded-md shadow-sm focus:ring-0 sm:text-sm"
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                ))}

            </div>

            <hr className=" bg-highBlue mt-1 mb-1 pl-2 mr-2 ml-2" />    

            <div className="pl-2 ">
                <AudioRecorder devisId={devisId} />
            </div>
        </div>

    );
}