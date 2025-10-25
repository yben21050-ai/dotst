
import React from 'react';
import type { Project } from '../types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProjectCardProps {
  project: Project;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onLoad, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      onDelete(project.id);
    }
  };

  return (
    <div 
      className="bg-base-100 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
      onClick={() => onLoad(project.id)}
    >
      <div className="bg-base-300 h-32 rounded-t-lg flex items-center justify-center text-text-secondary">
        <p>{project.dots.length} dots</p>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg truncate">{project.name}</h3>
          <p className="text-sm text-text-secondary">
            Last modified: {new Date(project.lastModified).toLocaleDateString()}
          </p>
        </div>
        <div className="flex justify-end items-center mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLoad(project.id);
            }}
            className="p-2 text-text-secondary hover:text-primary rounded-full transition-colors"
            title="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-text-secondary hover:text-red-500 rounded-full transition-colors"
            title="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
