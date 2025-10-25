
import type { Project } from '../types';

const PROJECT_IDS_KEY = 'project_ids';

// Gets the list of all project IDs
const getProjectIds = (): string[] => {
  try {
    const idsJson = localStorage.getItem(PROJECT_IDS_KEY);
    return idsJson ? JSON.parse(idsJson) : [];
  } catch (e) {
    console.error("Error reading project IDs from localStorage", e);
    return [];
  }
};

// Gets a single project by its ID
export const getProject = (id: string): Project | null => {
  try {
    const projectJson = localStorage.getItem(id);
    return projectJson ? JSON.parse(projectJson) : null;
  } catch (e) {
    console.error(`Error reading project ${id} from localStorage`, e);
    return null;
  }
};

// Gets all projects
export const getProjects = (): Project[] => {
  const ids = getProjectIds();
  return ids.map(id => getProject(id)).filter((p): p is Project => p !== null);
};

// Saves a project
export const saveProject = (project: Project): void => {
  try {
    const ids = getProjectIds();
    if (!ids.includes(project.id)) {
      localStorage.setItem(PROJECT_IDS_KEY, JSON.stringify([...ids, project.id]));
    }
    localStorage.setItem(project.id, JSON.stringify(project));
  } catch (e) {
    console.error(`Error saving project ${project.id} to localStorage`, e);
  }
};

// Deletes a project
export const deleteProject = (id: string): void => {
  try {
    const ids = getProjectIds();
    const newIds = ids.filter(projectId => projectId !== id);
    localStorage.setItem(PROJECT_IDS_KEY, JSON.stringify(newIds));
    localStorage.removeItem(id);
  } catch (e) {
    console.error(`Error deleting project ${id} from localStorage`, e);
  }
};
