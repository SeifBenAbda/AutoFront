import { Devis } from "@/types/devisTypes";
import { useState } from 'react';
import uploadIcon from '../../../images/file.png';
import checkDocIcon from '../../../images/checkDoc.png';
import { DocumentsUploadCard } from "./DocumentsUpload";
import FileViewer from "./FileViewer";

interface DocumentsCardProps {
    devis: Devis;
    onUpdate: (updatedDevis: Devis) => void;
}

export function DocumentsDetaillsCard({ devis, onUpdate }: DocumentsCardProps) {
    const [activeComponent, setActiveComponent] = useState<'checkFiles' | 'uploadFile'>('checkFiles');
    const [hasSelectedFiles, setHasSelectedFiles] = useState<boolean>(false);

    const handleChangeComponent = (component: 'checkFiles' | 'uploadFile') => {
        if (hasSelectedFiles && activeComponent === 'uploadFile') {
            const confirmLeave = window.confirm("Vous avez des fichiers dans la file d'attente, êtes-vous sûr de vouloir quitter ?");
            if (!confirmLeave) return;
        }
        setActiveComponent(component);
    };

    const handleUploadSuccess = () => {
        setHasSelectedFiles(false); // Reset the file selection state
        setActiveComponent('checkFiles'); // Switch back to FileViewer
    };

    const icons = [
        { id: 'checkFiles', src: checkDocIcon, alt: 'Check Files' },
        { id: 'uploadFile', src: uploadIcon, alt: 'Upload File' }
    ];

    return (
        <div>
            <div className="w-full flex flex-row space-x-2 items-end justify-end">
                {icons.map((icon) => (
                    <div
                        key={icon.id}
                        className="bg-whiteSecond border border-whiteSecond rounded-md p-1 cursor-pointer"
                        onClick={() => handleChangeComponent(icon.id as 'checkFiles' | 'uploadFile')}
                    >
                        <img src={icon.src} alt={icon.alt} height={30} width={30} />
                    </div>
                ))}
            </div>

            <div>
                {activeComponent === 'checkFiles' ? (
                   <FileViewer devisId={devis!.DevisId!} devis={devis}/>
                ) : (
                    <DocumentsUploadCard devis={devis} onFileSelect={(files) => setHasSelectedFiles(files.length > 0)}  onUploadSuccess={handleUploadSuccess}/>
                )}
            </div>
        </div>
    );
}
