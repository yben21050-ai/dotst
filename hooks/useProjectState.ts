import { useState, useEffect, useCallback } from 'react';
import type { Project } from '../types';
import * as storage from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';

export default function useProjectState() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(storage.getProjects());
  }, []);

  const updateProject = useCallback((updatedProject: Project) => {
    storage.saveProject(updatedProject);
    setProjects(prevProjects =>
      prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p))
    );
    if (activeProject?.id === updatedProject.id) {
      setActiveProject(updatedProject);
    }
  }, [activeProject]);

  const loadProject = useCallback((id: string) => {
    const projectToLoad = storage.getProject(id);
    setActiveProject(projectToLoad);
  }, []);

  const createNewProject = useCallback(() => {
    const newProject: Project = {
      id: uuidv4(),
      name: 'Untitled Project',
      dots: [],
      lastModified: Date.now(),
      lineStyle: 'straight',
      showLines: true,
    };
    storage.saveProject(newProject);
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    return newProject.id;
  }, []);

  const deleteProject = useCallback((id: string) => {
    storage.deleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
  }, [activeProject]);
  
  return {
    projects,
    activeProject,
    loadProject,
    createNewProject,
    deleteProject,
    updateProject,
    setActiveProject
  };
}