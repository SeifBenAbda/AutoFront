import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card";
import { Textarea } from "../../../@/components/ui/textarea";
import { DatePicker } from "../../../components/atoms/DataSelector";
import { Rappel } from "@/types/devisTypes";
import AudioRecorder from "./DevisAudioSystem";



interface RappelsCardProps {
  devisId: number,
  rappels: Rappel[];
  onUpdate: (updatedRappels: Rappel[]) => void; // Expecting an array of Rappel
}


export function RappelsDetaillsCard({ devisId, rappels, onUpdate }: RappelsCardProps) {

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
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row space-x-2 ml-2">
        
        {rappels.map((rappel, index) => (
          <Card
            className="flex flex-col bg-lightWhite border border-lightWhite rounded-md w-full"
            key={rappel.RappelId}
          >

            <CardContent
              className=" mr-2 ml-2 mb-2 pt-2"
              key={rappel.RappelId}
            >
              <div>
                <div className="text-highGrey font-oswald text-base mt-2 mb-2">
                  Rappel N° {index + 1} : {new Date(rappel.RappelDate!).toLocaleDateString()}
                </div>
                <DatePicker
                  value={rappel.RappelDate}
                  onChange={(date) => handleDateChange(rappel.RappelId!, date)}
                  fromYear={new Date().getFullYear()}
                  toYear={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <div className="text-highGrey font-oswald text-base mt-2 mb-2">
                  Contenu du rappel
                </div>
                <Textarea
                  value={rappel.RappelContent || ""}
                  onChange={(e) =>
                    handleChange(rappel.RappelId!, "RappelContent", e.target.value)
                  }
                  className="mt-1 p-2 block w-full border border-highGrey rounded-md shadow-sm focus:ring-0 sm:text-sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}

      </div>


      <div>
        <AudioRecorder devisId={devisId} />
      </div>
    </div>

  );

}




