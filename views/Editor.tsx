import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Project } from '../types';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface EditorProps {
  project: Project | null;
  onUpdate: (project: Project) => void;
  onLoadProject: (id: string) => void;
}

const Editor: React.FC<EditorProps> = ({ project, onUpdate, onLoadProject }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState(project?.name || '');
  
  // Load project if it's not the active one or if page is reloaded
  useEffect(() => {
    if (projectId && (!project || project.id !== projectId)) {
      onLoadProject(projectId);
    }
  }, [projectId, project, onLoadProject]);

  // Update local project name state when project data changes
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
    }
  }, [project]);

  if (!project || project.id !== projectId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl">Loading project...</p>
      </div>
    );
  }

  const handleUpdate = (updatedFields: Partial<Project>) => {
    onUpdate({ ...project, ...updatedFields, lastModified: Date.now() });
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleNameBlur = () => {
    if (project.name !== projectName.trim() && projectName.trim() !== '') {
        handleUpdate({ name: projectName.trim() });
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-base-200">
      <header className="flex items-center p-2 bg-base-100 border-b border-base-300 shadow-sm z-10">
        <button onClick={() => navigate('/')} className="p-2 mr-2 rounded-full hover:bg-base-200">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <input
          type="text"
          value={projectName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          className="text-xl font-bold bg-transparent focus:outline-none focus:ring-0 w-full"
          placeholder="Untitled Project"
        />
      </header>
      <div className="flex-1 relative">
        <Canvas project={project} onUpdate={handleUpdate} />
        <Toolbar project={project} onUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default Editor;
