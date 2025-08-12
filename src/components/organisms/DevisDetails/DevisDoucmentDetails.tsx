import { Devis } from "@/types/devisTypes";
import { useState } from 'react';
import uploadIcon from '../../../images/file.png';
import checkDocIcon from '../../../images/checkDoc.png';
import FileViewer from "./FileViewer";
import { DocumentsUploadCard } from "./DocumentsUpload";
import { useUser } from "../../../context/userContext";

interface DevisDoucmentDetailsProps {
    devis: Devis;
}


export function DevisDoucmentDetails({ devis }: DevisDoucmentDetailsProps) {

    const [activeComponent, setActiveComponent] = useState<'checkFiles' | 'uploadFile'>('checkFiles');
    const [hasSelectedFiles, setHasSelectedFiles] = useState<boolean>(false);
     const { user } = useUser();
    const isAdmin = user?.role === 'ADMIN';
    const isEditingOpen = (devis.StatusDevis!='Annulé') && (devis.AssignedTo === "" || devis.AssignedTo=== user?.username || isAdmin);


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
            <div className="w-full flex flex-row space-x-3 items-end justify-end mb-4">
                {icons.map((icon) => {
                    const isActive = activeComponent === icon.id;
                    const buttonText = icon.id === 'checkFiles' ? 'Voir les fichiers' : 'Envoyer des fichiers';
                    
                    return (
                        <button
                            disabled={!isEditingOpen}
                            key={icon.id}
                            className={`flex items-center font-oswald gap-2 px-3 py-2 rounded-md transition-colors ${
                                isActive 
                                    ? 'bg-highBlue text-white' 
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => handleChangeComponent(icon.id as 'checkFiles' | 'uploadFile')}
                        >
                            <img src={icon.src} alt={icon.alt} className="w-5 h-5" />
                            <span>{buttonText}</span>
                        </button>
                    );
                })}
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