
import React from 'react';
import type { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import { PlusIcon } from '@heroicons/react/24/solid';

interface HomeProps {
  projects: Project[];
  onCreateNew: () => void;
  onLoadProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ projects, onCreateNew, onLoadProject, onDeleteProject }) => {
  const sortedProjects = [...projects].sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Your Projects</h1>
        <button
          onClick={onCreateNew}
          className="bg-primary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New
        </button>
      </header>
      
      {sortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onLoad={onLoadProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-100 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-text-primary">No projects yet!</h2>
          <p className="text-text-secondary mt-2 mb-6">Click "Create New" to start your first dot-to-dot masterpiece.</p>
          <button
            onClick={onCreateNew}
            className="bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center mx-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Start Creating
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
