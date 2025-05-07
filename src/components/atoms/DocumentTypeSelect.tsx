import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../@/components/ui/select";
import useDocsCheck, { DocumentCondition } from "../../hooks/useDocsCheck"; // Add this import, adjust path if needed

interface DocumentTypeDropDownProps {
    value?: string;
    onChange: (value: string) => void;
    clientType: string;
    paymentMethod: string;
    useStaticList?: boolean; // Optional flag to fall back to static list
}

const DocumentTypeDropDown = ({
    value,
    onChange,
    clientType,
    paymentMethod,
    useStaticList = false
}: DocumentTypeDropDownProps) => {
    const {
        data: devisCheckedDocs = [],
        isLoading: isLoadingDocs,
        error: docsError,
    } = useStaticList ? { data: [], isLoading: false, error: null } : useDocsCheck(clientType, paymentMethod);

    // Static document types list as fallback
    const staticDocTypes = [
        "BC Interne",
        "Copie du passeport (30 pages)",
        "Carte d'identité nationale (CIN) / CIN du conjoint",
        "DUR 2023 (quittance d'impôt)",
        "Extrait de naissance",
        "Virement bancaire",
        "Demande de retour définitif",
        "CIN",
        "Quittance",
        "Acompte",
        "Reste du Payement",
        "Accord",
        "BC",
        "Contrat",
        "PV",
        "Bon de Sortie",
        "CG",
        "Avis de Paiement",
        "RNE"
    ];

    const documentsToDisplay = useStaticList || docsError || !devisCheckedDocs.length ? staticDocTypes : devisCheckedDocs;

    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-full border border-normalGrey bg-normalGrey text-highBlue font-oswald">
                <SelectValue placeholder={value ? value.toString() : "Tous types"} />
            </SelectTrigger>
            <SelectContent className="border-normalGrey bg-normalGrey cursor-pointer">


                {isLoadingDocs ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : (
                    documentsToDisplay.map((doc: string | DocumentCondition) => {
                        // Handle both string array and object array
                        const docValue: string | undefined = typeof doc === 'string' ? doc : doc.DocumentType;
                        return (
                            <SelectItem key={docValue as string} value={docValue as string}>
                                {docValue}
                            </SelectItem>
                        )
                    })
                )}
            </SelectContent>
        </Select>
    );
};

export default DocumentTypeDropDown;
