import { Button } from "../../../@/components/ui/button";
import { useUploadFiles } from "../../../hooks/useUploadFiles";
import { Devis } from "../../../types/devisTypes";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../@/components/ui/input";
import imageIcon from '../../../images/picture.png';
import textIcon from '../../../images/text.png';
import pdfIcon from '../../../images/pdf.png';

interface DocumentsUploadProps {
    devis: Devis;
    onFileSelect: (files: File[]) => void;
    onUploadSuccess: () => void; // New prop for upload success
}

export function DocumentsUploadCard({ devis, onFileSelect,onUploadSuccess }: DocumentsUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Custom loading state
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const { refetch: uploadFiles } = useUploadFiles({
        devisId: devis.DevisId!,
        files: selectedFiles,
        navigate,
    });

    useEffect(() => {
        onFileSelect(selectedFiles);
    }, [selectedFiles, onFileSelect]);

    const handleDeleteFile = (fileToDelete: File) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToDelete));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const validTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg'];
            const newFilesArray = Array.from(event.target.files);
            const invalidFiles = newFilesArray.filter(file => !validTypes.includes(file.type));

            if (invalidFiles.length > 0) {
                setError(`Invalid file types: ${invalidFiles.map(file => file.name).join(', ')}`);
            } else {
                setError(null); // Clear any previous error
                setSelectedFiles(prevFiles => [...prevFiles, ...newFilesArray]);
            }

            // Reset the file input to allow selecting the same file again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleUpload = async () => {
        setUploadMessage(null); // Clear any previous message
        setLoading(true); // Set loading to true
        try {
            await uploadFiles(); // Trigger the upload
            setUploadMessage('Upload successful!'); // Set success message
            setSelectedFiles([]); // Clear selected files
            onUploadSuccess();
        } catch (error) {
            setUploadMessage('Upload failed! Please try again.'); // Set failure message
        } finally {
            setLoading(false); // Set loading to false after upload completes
        }
    };

    return (
        <div className="relative p-4">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 mt-2">
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
                    disabled={loading} // Disable input when loading
                />
                {selectedFiles.length > 0 && (
                    <Button
                        onClick={handleUpload}
                        className="bg-greenOne border border-greenOne hover:bg-greenOne text-highGrey2 rounded-md font-oswald"
                        disabled={loading} // Disable button when loading
                    >
                        Envoyer les fichiers
                    </Button>
                )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {uploadMessage && <p className="text-green-500">{uploadMessage}</p>}
            <div className="flex flex-wrap gap-4 mb-4">
                {selectedFiles.map((file) => (
                    <div key={file.name} className="flex items-center bg-lightWhite p-1 border border-lightWhite rounded-md">
                        <img src={getFileIcon(file)} alt={file.name} className="w-10 h-10 object-cover" />
                        <span className="ml-2 text-highGrey2 font-oswald">{file.name}</span>
                        <Button
                            onClick={() => handleDeleteFile(file)}
                            className="ml-4 bg-lightRed border border-lightRed rounded-md text-lightWhite hover:bg-lightRed font-oswald"
                            disabled={loading} // Disable delete button when loading
                        >
                            Supprimer
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const getFileIcon = (file: File) => {
    const fileType = file.type.split('/')[0];

    switch (fileType) {
        case 'image':
            return imageIcon;
        case 'application':
            return pdfIcon;
        case 'text':
            return textIcon;
        default:
            return '/path/to/file-icon.png';
    }
};
