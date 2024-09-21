import { Devis } from "@/types/devisTypes";
import React, { useState } from 'react';
import useUploadFiles from '../../../hooks/useUploadFiles'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';
import { Input } from "../../../@/components/ui/input";
import { Button } from "../../../@/components/ui/button";

interface DocumentsCardProps {
    devis: Devis;
    onUpdate: (updatedDevis: Devis) => void;
}


export function DocumentsDetaillsCard({ devis, onUpdate }: DocumentsCardProps) {

    const handleChange = (field: keyof Devis, value: string | Date | undefined) => {
        onUpdate({
            ...devis,
            [field]: value,
        });
    };

    const handleDeleteFile = (fileToDelete: File) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToDelete));
    };

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { mutate: uploadFiles } = useUploadFiles(useNavigate());

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFilesArray = Array.from(event.target.files);
            setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
        }
    };

    const getFileIcon = (file: File) => {
        const fileType = file.type.split('/')[0];

        switch (fileType) {
            case 'image':
                return <img src={URL.createObjectURL(file)} alt={file.name} className="w-16 h-16 object-cover" />;
            case 'application':
                if (file.type === 'application/pdf') {
                    return <img src="/path/to/pdf-icon.png" alt="PDF" className="w-16 h-16" />;
                }
                return <img src="/path/to/document-icon.png" alt="Document" className="w-16 h-16" />;
            default:
                return <img src="/path/to/file-icon.png" alt="File" className="w-16 h-16" />;
        }
    };

    const handleUpload = () => {
        
        uploadFiles({devisId: devis.DevisId, files: selectedFiles });
        setSelectedFiles([]); // Clear selected files after uploading
    };

    return (
        <div className="p-4">
            <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mb-4 cursor-pointer"
            />
            <div className="flex flex-wrap gap-4 mb-4">
                {selectedFiles.map((file) => (
                    <div key={file.name} className="flex items-center">
                        {getFileIcon(file)}
                        <span className="ml-2 text-lightWhite font-oswald">{file.name}</span>
                        <Button 
                            onClick={() => handleDeleteFile(file)} 
                            className="ml-2 bg-lightRed border border-lightRed rounded-md text-lightWhite hover:bg-lightRed"
                        >
                            Supprimer
                        </Button>
                    </div>
                ))}
            </div>
            <Button
                onClick={handleUpload}
                className="bg-greenOne border border-greenOne hover:bg-greenOne text-highGrey rounded-md"
            >
                Upload Files
            </Button>
        </div>
    );
}

