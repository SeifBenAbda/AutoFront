import { Button } from '../../@/components/ui/button';
import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string | null; // For the content URL
  fileType: 'text' | 'image' | 'pdf' | null; // To determine how to render the content
  fileName: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content, fileType, fileName }) => {
  const [dimensions, setDimensions] = useState({ width: 'auto', height: 'auto' });

  useEffect(() => {
    if (isOpen) {
      setDimensions({ width: 'auto', height: 'auto' });
    }
  }, [isOpen, fileType, content]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setDimensions({
      width: Math.min(naturalWidth, window.innerWidth * 0.5).toString(),
      height: Math.min(naturalHeight, window.innerHeight * 0.8).toString(),
    });
  };

  const renderContent = () => {
    if (!content) return null;
  
    const updatedContent = fileType === 'text' ? `${content}?t=${Date.now()}` : content; // Append timestamp for text
  
    switch (fileType) {
      case 'text':
        return (
          <iframe
            src={updatedContent} // Use the updated content URL
            width="100%"
            height="80%"
            title="Text Preview"
            style={{ border: 'none' }}
          />
        );
      case 'image':
        return (
          <img
            src={content}
            alt="Preview"
            onLoad={handleImageLoad}
            className="object-contain"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        );
      case 'pdf':
        return (
          <iframe
            src={content}
            width="100%"
            height="100%" // Set height to 100% to utilize available space
            title="PDF Preview"
            style={{ border: 'none', minHeight: '70vh', minWidth: '100vh' }} // Ensure minimum height for better visibility
            onLoad={() => setDimensions({ width: 'auto', height: 'auto' })}
          />
        );
      default:
        return null;
    }
  };
  

  const renderHeader = () => {
    return (
      <div className="sticky top-0 flex flex-row justify-between items-center mb-4 p-2 bg-highBlue border border-highBlue rounded-md space-x-6 z-10">
        <div className="text-lightWhite font-oswald text-xl">{fileName}</div>
        <Button onClick={onClose} className="bg-red-500 text-white rounded-md hover:bg-red-500">
          Fermer
        </Button>
      </div>
    );
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white rounded shadow-lg overflow-auto"
        style={{
          width: dimensions.width,
          height: dimensions.height,
          maxWidth: '80%',
          maxHeight: '80%',
          padding: '16px',
        }}
      >
        {renderHeader()}
        <div className="flex justify-center items-center h-full p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Modal;
