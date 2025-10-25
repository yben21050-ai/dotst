import React from 'react';
import { PlusIcon, MinusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ZoomControlsProps {
    transform: { zoom: number; pan: { x: number; y: number } };
    onTransformChange: (transform: { zoom: number; pan: { x: number; y: number } }) => void;
    onTransformCommit: () => void;
}

const ToolButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2 text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-md"
  >
    {children}
  </button>
);


const ZoomControls: React.FC<ZoomControlsProps> = ({ transform, onTransformChange, onTransformCommit }) => {
    
    const handleZoom = (factor: number) => {
        const newZoom = Math.max(0.1, Math.min(10, transform.zoom * factor));
        onTransformChange({ ...transform, zoom: newZoom });
        onTransformCommit();
    };

    const handleReset = () => {
        onTransformChange({ zoom: 1, pan: { x: 0, y: 0 } });
        onTransformCommit();
    }

    return (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-50 backdrop-blur-sm shadow-lg rounded-lg flex items-center space-x-1 p-1">
           <ToolButton onClick={() => handleZoom(0.8)} title="Zoom Out">
                <MinusIcon className="h-5 w-5" />
            </ToolButton>
             <button onClick={handleReset} className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-md" title="Reset View">
                {Math.round(transform.zoom * 100)}%
            </button>
            <ToolButton onClick={() => handleZoom(1.25)} title="Zoom In">
                <PlusIcon className="h-5 w-5" />
            </ToolButton>
        </div>
    );
};

export default ZoomControls;