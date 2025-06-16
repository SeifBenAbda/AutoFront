import { Button } from "../../../@/components/ui/button";
import { Input } from "../../../@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Devis } from "../../../types/devisTypes";
import { useUploadFiles } from "../../../hooks/useUploadFiles";
import DocumentTypeDropDown from "../../../components/atoms/DocumentTypeSelect";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useUser } from "../../../context/userContext";
interface DocumentFile {
    file: File; // Keep using the native File type
    typeDocument: string; // Store the document type separately
}

interface DocumentsUploadProps {
    devis: Devis;
    onFileSelect: (files: DocumentFile[]) => void; // Pass selected files with types
    onUploadSuccess: () => void;
}

export function DocumentsUploadCard({ devis, onFileSelect, onUploadSuccess }: DocumentsUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<DocumentFile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
     const { user } = useUser();
    const isAdmin = user?.role === 'ADMIN';
     const isEditingOpen = (devis.StatusDevis != "Livré" && devis.StatusDevis!='Annulé') && (devis.AssignedTo === "" || devis.AssignedTo=== user?.username || isAdmin);
    const navigate = useNavigate();

    // Use mutation instead of query
    const uploadFilesMutation = useUploadFiles({
        devisId: devis.DevisId!,
        navigate,
    });

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError("Veuillez sélectionner des fichiers à télécharger.");
            return;
        }
        const invalidTypeFiles = selectedFiles.filter(doc => (doc.typeDocument === "" || doc.typeDocument === undefined));
        if (invalidTypeFiles.length > 0) {
            setError("Type de document requis pour tous les fichiers. Veuillez sélectionner un type spécifique pour chaque document.");
            return;
        }

        if (loading) return;
        setUploadMessage(null);
        setLoading(true);

        try {
            // Pass files to the mutation
            await uploadFilesMutation.mutateAsync(
                selectedFiles.map(doc => ({ 
                    file: doc.file, 
                    typeDocument: doc.typeDocument 
                }))
            );
            
            setUploadMessage('Téléchargement réussi !');
            setSelectedFiles([]);
            onFileSelect([]);
            onUploadSuccess();
        } catch (error) {
            console.error("Upload error:", error);
            setUploadMessage('Échec du téléchargement ! Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const validTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg'];
            const newFilesArray = Array.from(event.target.files);
            const invalidFiles = newFilesArray.filter(file => !validTypes.includes(file.type));

            if (invalidFiles.length > 0) {
                setError(`Types de fichiers invalides : ${invalidFiles.map(file => file.name).join(', ')}`);
                return;
            }

            setError(null);
            const newSelectedFiles = newFilesArray.map(file => ({
                file,
                typeDocument: '', // Initialize with an empty type
            }));

            // Merge the new files with the existing selected files
            setSelectedFiles(prevFiles => [...prevFiles, ...newSelectedFiles]);
            onFileSelect([...selectedFiles, ...newSelectedFiles]); // Notify parent of updated files

            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };


    const handleDeleteFile = (fileToDelete: File) => {
        const updatedFiles = selectedFiles.filter(({ file }) => file !== fileToDelete);
        setSelectedFiles(updatedFiles);
        onFileSelect(updatedFiles);
    };

    const handleTypeChange = (index: number, value: string) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles[index].typeDocument = value;
        setSelectedFiles(updatedFiles);
        onFileSelect(updatedFiles); // Notify parent of updated types
    };


    const getFileIcon = (file: File) => {
        const fileType = file.type.split('/')[0];
        switch (fileType) {
            case 'image':
                return '/images/picture.png';
            case 'application':
                return '/images/pdf.png';
            case 'text':
                return '/images/text.png';
            default:
                return '/path/to/file-icon.png';
        }
    };

    // Alert component for displaying messages
    const AlertMessage = ({ message, type }: { message: string, type: 'error' | 'success' }) => {
        return (
            <div 
                className={`flex items-center p-3 mb-4 rounded-md animate-fadeIn ${
                    type === 'error' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
                }`}
                role="alert"
            >
                {type === 'error' 
                    ? <AlertCircle className="h-5 w-5 mr-2" /> 
                    : <CheckCircle2 className="h-5 w-5 mr-2" />
                }
                <span className="font-medium">{message}</span>
            </div>
        );
    };

    return (
        <div className="relative p-4">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1b2a4d]/80 z-50">
                    <div className="text-white font-bold">Veuillez patienter...</div>
                </div>
            )}
            <div className={`flex flex-row justify-between space-x-4 ${loading ? 'opacity-50' : ''}`}>
                <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4 cursor-pointer"
                    ref={fileInputRef}
                    accept=".pdf,.txt,.png,.jpg,.jpeg"
                    disabled={loading}
                />
                {selectedFiles.length > 0 && (
                    <Button
                        onClick={handleUpload}
                        className="bg-blueCiel border border-blueCiel hover:bg-blueCiel text-highBlue rounded-md font-oswald"
                        disabled={loading}
                    >
                        Envoyer les fichiers
                    </Button>
                )}
            </div>
            {error && <AlertMessage message={error} type="error" />}
            {uploadMessage && <AlertMessage message={uploadMessage} type="success" />}
            <div className="flex flex-wrap gap-4 mb-4">
                {selectedFiles.map((doc, index) => (
                    <div className="flex flex-col space-y-2 p-2 bg-whiteSecond border rounded-md border-whiteSecond" key={doc.file.name} >
                        <div className="flex items-center  p-1 ">
                            <img src={getFileIcon(doc.file)} alt={doc.file.name} className="w-10 h-10 object-cover" />
                            <span className="ml-2 text-highBlue font-oswald">{doc.file.name}</span>
                            <Button
                                onClick={() => handleDeleteFile(doc.file)}
                                className="ml-4 bg-lightRed border border-lightRed rounded-md text-lightWhite hover:bg-lightRed font-oswald"
                                disabled={loading}
                            >
                                Supprimer
                            </Button>
                        </div>
                        <DocumentTypeDropDown
                            onChange={(value) => handleTypeChange(index, value)}
                            value={doc.typeDocument} // Pass the current type to the dropdown
                            clientType={devis.client!.clientType}
                            paymentMethod={devis.devisPayementDetails.PaymentMethod}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}