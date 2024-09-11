// src/components/atoms/Loading.tsx
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-12 h-12 border-4 border-t-highGrey border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
