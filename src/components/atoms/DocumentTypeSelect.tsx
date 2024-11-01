import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";

interface DocumentTypeDropDownProps {
    value?: string;
    onChange: (value: string) => void;
}

const DocumentTypeDropDown = ({ value, onChange }: DocumentTypeDropDownProps) => {
    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-highGrey2">
                <SelectValue placeholder={value ? value.toString() : "Tous Types"} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem key="BC Interne" value="BC Interne">BC Interne</SelectItem>
                <SelectItem key="CIN" value="CIN">CIN</SelectItem>
                <SelectItem key="Quittance" value="Quittance">Quittance</SelectItem>
                <SelectItem key="Acompte" value="Acompte">Acompte</SelectItem>
                <SelectItem key="Reste du Payement" value="Reste du Payement">Reste du Payement</SelectItem>
                <SelectItem key="Accord" value="Accord">Accord</SelectItem>
                <SelectItem key="BC" value="BC">BC</SelectItem>
                <SelectItem key="Contrat" value="Contrat">Contrat</SelectItem>
                <SelectItem key="PV" value="PV">PV</SelectItem>
                <SelectItem key="Bon de Sortie" value="Bon de Sortie">Bon de Sortie</SelectItem>
                <SelectItem key="CG" value="CG">CG</SelectItem>
                <SelectItem key="Avis de Paiement" value="Avis de Paiement">Avis de Paiement</SelectItem>
                <SelectItem key="RNE" value="RNE">RNE</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default DocumentTypeDropDown;
