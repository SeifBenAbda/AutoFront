import React, { useEffect, useState } from 'react';
import { FileData, useDevisFiles } from '../../../hooks/useUploadFiles'; // Adjust the import path as needed
import { useUrlFiles } from '../../../hooks/useUploadFiles'; // Import the useUrlFiles hook
import Modal from '../../atoms/ModalFileViewer'; // Adjust the import path to your Modal component
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '../../../@/components/ui/card';
import imageIcon from '../../../images/picture.png';
import textIcon from '../../../images/text.png';
import pdfIcon from '../../../images/pdf.png';
import emptyBoxIcon from '../../../images/emptyBox.png';

const FileViewer: React.FC<{ devisId: number }> = ({ devisId }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'text' | 'image' | 'pdf' | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [fileName , setFileName] = useState<string | null>(null);
    const API_URL = import.meta.env.VITE_FILES_URL;
    const navigate = useNavigate();
    const [isLoadingFile, setIsLoadingFiles] = useState(false)
    // Fetch all files using the useDevisFiles hook
    const { data: files = [], isLoading, error, refetch } = useDevisFiles(devisId, navigate);

    // Use the useUrlFiles hook
    const { mutateAsync: fetchFileUrl } = useUrlFiles(devisId, navigate);


    useEffect(() => {
        setIsLoadingFiles(true)
        refetch().then(() => {
            setIsLoadingFiles(false);
        });
    }, [devisId, refetch]); // Add refetch to the dependency array

    const handleButtonClick = async (filename: string) => {
        try {
            // Fetch the file metadata including the file path and MIME type
            const fileResponse = await fetchFileUrl(filename);
            if (!fileResponse) {
                throw new Error('File not found');
            }

            const file_path = fileResponse.file_path;
            const mime_type = fileResponse.mime_type;

            // Sanitize the file path
            const sanitizedFilePath = file_path.replace(/\\/g, '/');

            // Construct the full URL
            const fullUrl = `${API_URL}${encodeURIComponent(sanitizedFilePath)}`;

            // Set the file URL and type based on the MIME type
            setFileUrl(fullUrl);
            setFileName(filename)

            if (mime_type.startsWith('image/')) {
                setFileType('image');
            } else if (mime_type === 'application/pdf') {
                setFileType('pdf');
            } else if (mime_type.startsWith('text/')) {
                setFileType('text');
            } else {
                throw new Error('Unsupported file type');
            }

            

            // Open the modal
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFileUrl(null);
        setFileType(null);
        setFileName(null);
    };

    if (isLoading || isLoadingFile) return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className="w-12 h-12 border-4 border-t-highGrey border-gray-200 rounded-full animate-spin"></div>
        </div>
    )
    if (error) return <div>Error fetching files: {error.message}</div>;


    const renderFiles = () => {
        return (
            <div className="flex flex-wrap">
                {files.map((file) => (
                    <CardContent key={file.id}>
                        <div className='flex flex-col items-center'>
                            <img
                                key={file.id} // Ensure each button has a unique key
                                onClick={() => handleButtonClick(file.file_name)} // Call handleButtonClick on click
                                className="m-2 p-2 border rounded shadow hover:bg-gray-300 bg-highGrey cursor-pointer"
                                src={getFileIcon(file.mime_type)}
                                height={80}
                                width={80}
                            />
                            <span className='text-highGrey2 font-oswald'>{file.file_name}</span>
                        </div>
                    </CardContent>
                ))}
            </div>
        )
    }


    const renderEmptyFiles = () => {
        return (
            <div className='h-full w-full items-center flex flex-col space-x-4'>
                <img src={emptyBoxIcon} alt='EmptyBox' height={100} width={100} />
                <span className='text-highGrey text-lg font-oswald text-center'>Il n'y a actuellement aucun fichier ici </span>
            </div>
        )
    }

    return (
        <Card className='bg-lightWhite border border-lightWhite rounded-md p-2 mt-2'>
            <CardTitle className='text-center mb-5 mt-2 text-2xl font-oswald'>Visualisation des fichiers</CardTitle>

            {files.length > 0 ? renderFiles() : renderEmptyFiles()}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                content={fileUrl}
                fileType={fileType}
                fileName={fileName!}
            />
        </Card>
    );
};

export default FileViewer;

const getFileIcon = (myFileType: string) => {
    const fileType = myFileType.split('/')[0];
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
