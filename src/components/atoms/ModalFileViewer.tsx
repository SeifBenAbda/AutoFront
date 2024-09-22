import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string | null; // For text content
  fileType: 'text' | 'image' | 'pdf' | null; // To determine how to render the content
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content, fileType }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (fileType) {
      case 'text':
        return <iframe src={content || ''} width="100%" height="80%" title="Text Preview" style={{ border: 'none' }} />;
      case 'image':
        return <img src={content || ''} alt="Preview" className="max-w-full" />;
      case 'pdf':
        return (
          <iframe 
            src={content || ''} 
            width="100%" // Use full width of the modal
            height="80%" // Set a fixed height or adjust as needed
            title="PDF Preview" 
            style={{ border: 'none' }} // Optional: Remove border for a cleaner look
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full h-[80vh] max-w-3xl max-h-3xl p-4 rounded shadow-lg overflow-hidden z-60">
        <h2 className="text-lg font-bold">File Content</h2>
        {renderContent()}
        <button onClick={onClose} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
