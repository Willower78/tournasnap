import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface DropZoneProps {
  onFilesDropped: (files: FileList) => void;
  children: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDropped, children }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(e.dataTransfer.files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative w-full h-full"
    >
      {children}

      {isDragging && (
        <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm border-2 border-dashed border-indigo-400 z-50 flex flex-col items-center justify-center text-white pointer-events-none">
          <UploadCloud className="w-16 h-16 text-indigo-400 animate-bounce mb-3" />
          <h3 className="text-xl font-bold">Släpp ZIP eller kodfiler här</h3>
          <p className="text-sm text-indigo-200 mt-1">Extraheras och laddas direkt in i projektet</p>
        </div>
      )}
    </div>
  );
};
