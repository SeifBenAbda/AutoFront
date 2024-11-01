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
import { set } from 'date-fns';
import { Button } from '../../../@/components/ui/button';
import useDocsCheck, { DocumentCondition } from '../../../hooks/useDocsCheck';
import { Devis } from '../../../types/devisTypes';

const FileViewer: React.FC<{ devisId: number, devis: Devis }> = ({ devisId, devis }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'text' | 'image' | 'pdf' | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const API_URL = import.meta.env.VITE_FILES_URL;
    const navigate = useNavigate();
    const [isLoadingFile, setIsLoadingFiles] = useState(false);

    const [isLoadingOpening, setIsLoadingOpening] = useState(false);


    const { data: files = [], isLoading, error, refetch } = useDevisFiles(devisId, navigate);
    const { mutateAsync: fetchFileUrl } = useUrlFiles(devisId, navigate);
    const {
        data: devisCheckedDocs = [],
        isLoading: isLoadingDocs,
        error: docsError,
        refetch: refetchDocs
    } = useDocsCheck(devis.client!.clientType, devis.PayementMethod);
    const [listAvailableDocsTypes, setListAvailableDocsTypes] = useState<string[]>([]);

    useEffect(() => {
        setIsLoadingFiles(true);

        const updateDocTypes = async () => {
            try {
                await refetchDocs();
                await refetch();

                // Now we can use the FileData interface for proper typing
                if (files && Array.isArray(files)) {
                    const docTypes = files.map((file: FileData) => file.typeDocument);
                    const uniqueDocTypes = [...new Set(docTypes)];
                    setListAvailableDocsTypes(uniqueDocTypes);
                }

                setIsLoadingFiles(false);
            } catch (error) {
                console.error('Error updating document types:', error);
                setIsLoadingFiles(false);
            }
        };

        updateDocTypes();

    }, [devisId, refetch, refetchDocs, files]);

    const fetchFileWithAuth = async (fileUrl: string) => {
        try {
            const response = await fetch(fileUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa('Faouzi:baf.syrine2013')}`, // Replace with your credentials
                },
                credentials: 'include', // Include credentials in the request
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
            }

            return await response.blob(); // Return the file blob for further processing
        } catch (error) {
            console.error('Error fetching file:', error);
            throw error; // Rethrow error for handling in the calling function
        }
    };

    const handleButtonClick = async (filename: string) => {
        setIsLoadingOpening(true);
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

            // Fetch the file content with authorization
            const fileBlob = await fetchFileWithAuth(fullUrl);
            const blobUrl = URL.createObjectURL(fileBlob);

            // Set the file URL and type based on the MIME type
            setFileUrl(blobUrl);
            setFileName(filename);

            if (mime_type.startsWith('image/')) {
                setFileType('image');
            } else if (mime_type === 'application/pdf') {
                setFileType('pdf');
            } else if (mime_type.startsWith('text/')) {
                setFileType('text');
            } else {
                throw new Error('Unsupported file type');
            }

            setIsLoadingOpening(false);

            // Open the modal
            setModalOpen(true);
        } catch (error) {
            setIsLoadingOpening(false);
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
            <div className="w-12 h-12 border-4 border-t-highGrey2 border-gray-200 rounded-full animate-spin"></div>
        </div>
    );



    if (error) return <div>Error fetching files: {error.message}</div>;


    const renderDocumentStatus = () => {
        return (
            <div className="w-full md:w-1/3 p-4 bg-blueCiel rounded-lg h-fit sticky top-4">
                <h3 className="font-oswald text-xl mb-4 text-highGrey2">Documents requis</h3>
                <div className="flex flex-col gap-2">
                    {devisCheckedDocs.map((doc: DocumentCondition) => {
                        const hasDocument = files.some(
                            file => file.typeDocument === doc.DocumentType
                        );

                        return (
                            <div
                                key={doc.DocumentType}
                                className="flex items-center justify-between p-2 bg-white rounded-lg shadow"
                            >
                                <span className="font-oswald text-gray-700">{doc.DocumentType}</span>
                                <div className={`
                                    px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap font-oswald
                                    ${hasDocument
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }
                                `}>
                                    {hasDocument ? 'Présent' : 'Manquant'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderFiles = () => {
        return (
            <div className="flex-1 p-4 min-h-0">
                <h3 className="text-xl mb-4 text-highGrey2 font-oswald">Fichiers déposés</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                    {isLoadingOpening && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1b2a4d]/80 z-50 rounded-lg">
                            <div className="text-white font-bold">Veuillez patienter...</div>
                        </div>
                    )}
                    {files.map((file: FileData) => (
                        <Card
                            key={file.id}
                            className="hover:shadow-lg transition-shadow bg-lightWhite h-fit flex-shrink-0 cursor-pointer"
                            onClick={() => handleButtonClick(file.file_name)}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-center gap-3">

                                    <img
                                        className="w-10 h-10 object-contain"
                                        src={getFileIcon(file.mime_type)}
                                        alt={file.file_name}
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="font-oswald text-base text-gray-800 truncate">
                                            {`${file.file_name.split("_")[0]}.${file.file_name.split(".").pop()}`}
                                        </div>
                                        <div
                                            className={`w-full mt-2 h-8 font-oswald text-sm text-center border rounded-lg flex items-center justify-center
                                            ${devisCheckedDocs.some(doc => doc.DocumentType === file.typeDocument)
                                                    ? 'bg-green-500 border-green-500 hover:bg-green-600'
                                                    : 'bg-red-500 border-red-500 hover:bg-red-600'
                                                } text-white`}
                                        >
                                            {file.typeDocument || 'No Type'}
                                        </div>

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    };

    const renderEmptyFiles = () => {
        return (
            <div className='h-full w-full items-center flex flex-col space-x-4'>
                <img src={emptyBoxIcon} alt='EmptyBox' height={100} width={100} />
                <span className='text-highGrey2 text-lg font-oswald text-center'>Il n'y a actuellement aucun fichier ici </span>
            </div>
        )
    };

    return (
        <Card className='bg-lightWhite border border-lightWhite rounded-md p-2 mt-2'>
            <CardTitle className='text-center mb-5 mt-2 text-2xl font-oswald'>Visualisation des fichiers</CardTitle>
            {files.length > 0 ?
                <div className="flex flex-col md:flex-row  bg-gray-50">
                    {renderFiles()}
                    {renderDocumentStatus()}
                </div> : renderEmptyFiles()}
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

const getFileIcon = (myFileType: string) => {
    const fileType = myFileType.split('/')[0];
    switch (fileType) {
        case 'image':
            return '/images/picture.png';
        case 'application':
            return '/images/pdf.png';
        case 'text':
            return '/images/text.png';
        default:
            return '/path/to/file-icon.png'; // Default icon for unknown types
    }
};

export default FileViewer;
