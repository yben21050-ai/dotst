import React from 'react';
import type { Project } from '../types';
import { exportToPng, exportToSvg, exportToJson } from '../services/exportService';
import GitHubUploadForm from './GitHubUploadForm';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface ToolbarProps {
  project: Project;
  onUpdate: (updatedFields: Partial<Project>) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ project, onUpdate }) => {
    const [isExportOpen, setIsExportOpen] = React.useState(false);
    
    // Stub functions for undo/redo
    const handleUndo = () => alert("Undo functionality is not yet implemented.");
    const handleRedo = () => alert("Redo functionality is not yet implemented.");
    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear the canvas? This cannot be undone.")) {
            onUpdate({ dots: [] });
        }
    }
    
    const handleExport = (format: 'png' | 'svg' | 'json') => {
        const options = {
            showLines: project.showLines ?? true,
            showNumbers: true, // Assuming we always show numbers for now
            dotSize: project.dotSize || 5,
        };
        switch (format) {
            case 'png':
                exportToPng(project, options);
                break;
            case 'svg':
                exportToSvg(project, options);
                break;
            case 'json':
                exportToJson(project);
                break;
        }
        setIsExportOpen(false);
    };
    
    const showLines = project.showLines ?? true;

    return (
        <div className="absolute top-4 left-4 bg-white bg-opacity-80 backdrop-blur-sm shadow-lg rounded-lg p-4 space-y-4 max-w-sm">
            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button onClick={handleUndo} className="p-2 rounded hover:bg-gray-200" title="Undo (coming soon)">Undo</button>
                <button onClick={handleRedo} className="p-2 rounded hover:bg-gray-200" title="Redo (coming soon)">Redo</button>
                <button onClick={handleClear} className="p-2 rounded hover:bg-red-200 text-red-700" title="Clear Canvas">Clear</button>
            </div>

            {/* Visibility Toggle */}
            <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Visibility</h4>
                <button 
                    onClick={() => onUpdate({ showLines: !showLines })}
                    className="w-full flex items-center justify-center p-2 rounded hover:bg-gray-200"
                >
                    {showLines ? (
                        <EyeSlashIcon className="h-5 w-5 mr-2" />
                    ) : (
                        <EyeIcon className="h-5 w-5 mr-2" />
                    )}
                    {showLines ? 'Hide Lines' : 'Show Lines'}
                </button>
            </div>


            {/* Export Dropdown */}
            <div className="relative border-t pt-4">
                 <button onClick={() => setIsExportOpen(!isExportOpen)} className="w-full p-2 rounded bg-primary text-white hover:bg-blue-600 font-semibold">
                     Export / Upload
                 </button>
                 {isExportOpen && (
                     <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg z-20 border">
                         <button onClick={() => handleExport('png')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as PNG</button>
                         <button onClick={() => handleExport('svg')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as SVG</button>
                         <button onClick={() => handleExport('json')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as JSON</button>
                     </div>
                 )}
            </div>
            
            <GitHubUploadForm project={project} options={{
                showLines: showLines,
                showNumbers: true,
                dotSize: project.dotSize || 5
            }} />
        </div>
    );
};

export default Toolbar;