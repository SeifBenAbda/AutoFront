import React, { useState } from 'react';
import { useStreamFile } from '../../../hooks/useUploadFiles'; // Adjust the import path as needed
import Modal from '../../atoms/ModalFileViewer'; // Adjust the import path as needed

const DevisDocsViewer: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'text' | 'image' | 'pdf' | null>(null);
    const navigate = (path: string) => {
        // Implement your navigation logic (e.g., using React Router)
    };

    const { mutateAsync: streamFile } = useStreamFile(navigate);

    const handleButtonClick = async (filename: string) => {
        try {
            await streamFile(filename).then(async (blob) => {
                const type = getFileType(filename);
                setFileType(type);

                if (type === 'text') {
                    const textContent = await blob.text(); // Read the text from the blob
                    setFileContent(textContent); // Set the actual text content
                } else {
                    const contentUrl = URL.createObjectURL(blob); // Create a URL for the blob
                    setFileContent(contentUrl); // Set the blob URL for images and PDFs
                }

                setModalOpen(true); // Open the modal
            });

        } catch (error) {
            console.error('Error fetching file content:', error);
        }
    };


    const getFileType = (filename: string): 'text' | 'image' | 'pdf' | null => {
        const extension = filename.split('.').pop()?.toLowerCase();
        if (extension === 'txt') return 'text';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) return 'image';
        if (extension === 'pdf') return 'pdf';
        return null;
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setFileContent(null); // Clear content on close
        setFileType(null); // Clear file type on close
    };

    return (
        <div>
            <h1>File Viewer</h1>
           
            <button onClick={() => handleButtonClick('test1.txt')}>View PDF</button>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} content={fileContent} fileType={fileType} fileName={""}/>
        </div>
    );
};

export default DevisDocsViewer;
