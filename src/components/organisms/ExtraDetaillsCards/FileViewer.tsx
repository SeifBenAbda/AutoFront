import React, { useEffect, useState, useRef } from 'react';
import { FileData, useDevisFiles } from '../../../hooks/useUploadFiles'; // Adjust the import path as needed
import { useUrlFiles } from '../../../hooks/useUploadFiles'; // Import the useUrlFiles hook
import Modal from '../../atoms/ModalFileViewer'; // Adjust the import path to your Modal component
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle } from '../../../@/components/ui/card';
import emptyBoxIcon from '../../../images/emptyBox.png';
import useDocsCheck, { DocumentCondition } from '../../../hooks/useDocsCheck';
import { Devis } from '../../../types/devisTypes';
import Loading from '../../../components/atoms/Loading';

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
    } = useDocsCheck(devis.client!.clientType, devis.devisPayementDetails.PaymentMethod);
    const [listAvailableDocsTypes, setListAvailableDocsTypes] = useState<string[]>([]);


    // States and references
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [startPos, setStartPos] = useState(0);
    const [currentScroll, setCurrentScroll] = useState(0);
    const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left

    // Handle auto-scroll logic
    useEffect(() => {
        if (autoScroll && !isDragging) {
            const scrollInterval = setInterval(() => {
                if (scrollRef.current) {
                    const scrollContainer = scrollRef.current;

                    // Check if we are at the end or beginning of the scroll container
                    if (scrollDirection === 1) {
                        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
                            // Reverse direction at the end
                            setScrollDirection(-1);
                        } else {
                            // Continue scrolling right
                            scrollContainer.scrollLeft += 2; // Auto-scroll speed
                        }
                    } else {
                        if (scrollContainer.scrollLeft <= 0) {
                            // Reverse direction at the beginning
                            setScrollDirection(1);
                        } else {
                            // Continue scrolling left
                            scrollContainer.scrollLeft -= 2; // Auto-scroll speed
                        }
                    }
                }
            }, 20); // Frequency of auto-scroll steps

            return () => clearInterval(scrollInterval);
        }
    }, [autoScroll, isDragging, scrollDirection]);

    const handleDragStart = (e: MouseEvent | TouchEvent) => {
        setIsDragging(true);
        setAutoScroll(false); // Pause auto-scroll during manual scroll
        const pos = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setStartPos(pos);
        if (scrollRef.current) {
            setCurrentScroll(scrollRef.current.scrollLeft);
        }
    };

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const pos = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const walk = pos - startPos;
        scrollRef.current.scrollLeft = currentScroll - walk;
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setAutoScroll(true); // Resume auto-scroll after manual scrolling
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        // Adding native event listeners directly
        scrollContainer.addEventListener('mousedown', handleDragStart);
        scrollContainer.addEventListener('mouseup', handleDragEnd);
        scrollContainer.addEventListener('mouseleave', handleDragEnd);
        scrollContainer.addEventListener('mousemove', handleDragMove as EventListener);

        scrollContainer.addEventListener('touchstart', handleDragStart);
        scrollContainer.addEventListener('touchend', handleDragEnd);
        scrollContainer.addEventListener('touchmove', handleDragMove as EventListener);

        return () => {
            scrollContainer.removeEventListener('mousedown', handleDragStart);
            scrollContainer.removeEventListener('mouseup', handleDragEnd);
            scrollContainer.removeEventListener('mouseleave', handleDragEnd);
            scrollContainer.removeEventListener('mousemove', handleDragMove as EventListener);

            scrollContainer.removeEventListener('touchstart', handleDragStart);
            scrollContainer.removeEventListener('touchend', handleDragEnd);
            scrollContainer.removeEventListener('touchmove', handleDragMove as EventListener);
        };
    }, [isDragging, currentScroll]);

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
        console.log("Opening new file in new window");
        setIsLoadingOpening(true);

        try {
            // Fetch the file metadata including the file path and MIME type
            const fileResponse = await fetchFileUrl(filename);
            if (!fileResponse) {
                throw new Error('File not found');
            }

            const file_path = fileResponse.file_path;
            const sanitizedFilePath = file_path.replace(/\\/g, '/');
            const fullUrl = `${API_URL}${encodeURIComponent(sanitizedFilePath)}`;

            // Fetch the file content with authorization
            const fileBlob = await fetchFileWithAuth(fullUrl);

            // Check if the file is not empty or invalid
            if (!fileBlob || fileBlob.size === 0) {
                throw new Error('Invalid file content');
            }

            // Create a blob URL for the downloaded file
            const blobUrl = URL.createObjectURL(fileBlob);

            // Open the blob URL in a new tab
            window.open(blobUrl, '_blank');

        } catch (error) {
            console.error('Error opening file:', error);
            // Optionally, you can show a message to the user about the error
            alert("Échec de l'ouverture du fichier. Veuillez réessayer.");
        } finally {
            // Ensure loading state is reset regardless of success or failure
            setIsLoadingOpening(false);
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
            <div className="w-full  p-4  rounded-lg h-fit sticky top-4">
                <h3 className="font-oswald text-xl mb-4 text-highGrey2">Documents requis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg-custom:grid-cols-3 gap-2">
                    {devisCheckedDocs.map((doc: DocumentCondition) => {
                        const hasDocument = files.some(
                            file => file.typeDocument === doc.DocumentType
                        );

                        return (
                            <div
                                key={doc.DocumentType}
                                className="flex flex-col p-1 space-y-2 items-center justify-between  bg-blueCiel rounded-lg"
                            >
                                <span className="font-oswald text-gray-700 text-sm">{doc.DocumentType}</span>
                                <div className={`
                                    px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap font-oswald
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



    const renderFiles = () => (
        <div className="flex-1 p-4 min-h-0">
            <div
                ref={scrollRef}
                className="flex overflow-x-scroll relative gap-3 scroll-smooth cursor-grab active:cursor-grabbing"
            >
                {isLoadingOpening && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
                        <div className="w-12 h-12 border-4 border-t-highGrey2 border-gray-200 rounded-full animate-spin"></div>
                    </div>
                )}
                {files.map((file: FileData) => (
                    <Card
                        key={file.id}
                        className="flex-none w-[300px] hover:shadow-lg transition-all bg-lightWhite select-none"
                        onClick={() => !isDragging && handleButtonClick(file.file_name)}
                    >
                        <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                                <img
                                    className="w-10 h-10 object-contain pointer-events-none"
                                    src={getFileIcon(file.mime_type)}
                                    alt={file.file_name}
                                    draggable="false"
                                />
                                <div className="flex-1 min-w-0 pointer-events-none">
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

    const renderEmptyFiles = () => {
        return (
            <div className='h-full w-full items-center flex flex-col space-x-4'>
                <img src={emptyBoxIcon} alt='EmptyBox' height={100} width={100} />
                <span className='text-highGrey2 text-lg font-oswald text-center'>Il n'y a actuellement aucun fichier ici </span>
            </div>
        )
    };

    const LoadingFile = () => (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 z-20 flex items-center justify-center">
            <div className="spinner-border text-white w-12 h-12 border-4 border-t-4 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <Card className='bg-lightWhite border border-lightWhite rounded-md p-2 '>
            {/**<CardTitle className='text-center mb-5 mt-2 text-2xl font-oswald'>Visualisation des fichiers</CardTitle> */}
            {isLoading && <Loading />}
            {files.length > 0 ?
                <div className="flex flex-col   bg-gray-50">
                    {renderFiles()}
                    {renderDocumentStatus()}
                </div> :
                <div className="flex flex-col   bg-gray-50">
                    {renderEmptyFiles()}
                    {renderDocumentStatus()}
                </div>

            }
            {/**
             <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                content={fileUrl}
                fileType={fileType}
                fileName={fileName!}
            />
             */}
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
