import { ProjectItem } from '../types';
import { INITIAL_REAL_PROJECTS } from '../data/projectsData';
import { isAdminAuthenticated } from './adminAuth';

const STORAGE_KEY = 'nesma_real_projects_v4';

export function getStoredProjects(): ProjectItem[] {
  if (typeof window === 'undefined') {
    return INITIAL_REAL_PROJECTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REAL_PROJECTS));
      return INITIAL_REAL_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_REAL_PROJECTS;
  } catch (error) {
    console.error('Failed to load projects from storage:', error);
    return INITIAL_REAL_PROJECTS;
  }
}

export function saveStoredProjects(projects: ProjectItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects to storage:', error);
  }
}

export function addStoredProject(project: Omit<ProjectItem, 'id' | 'createdAt'>): ProjectItem | null {
  if (!isAdminAuthenticated()) {
    console.warn('Unauthorized: Admin access required to add projects.');
    return null;
  }

  const current = getStoredProjects();
  const newProject: ProjectItem = {
    ...project,
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().getFullYear().toString()
  };

  const updated = [...current, newProject];
  saveStoredProjects(updated);
  return newProject;
}

export function updateStoredProject(id: string, updates: Partial<ProjectItem>): ProjectItem[] {
  if (!isAdminAuthenticated()) {
    console.warn('Unauthorized: Admin access required to update projects.');
    return getStoredProjects();
  }

  const current = getStoredProjects();
  const updated = current.map(p => {
    if (p.id === id) {
      return { ...p, ...updates };
    }
    return p;
  });
  saveStoredProjects(updated);
  return updated;
}

export function deleteStoredProject(id: string): ProjectItem[] {
  if (!isAdminAuthenticated()) {
    console.warn('Unauthorized: Admin access required to delete projects.');
    return getStoredProjects();
  }

  // Prevent deleting primary core projects
  if (id === 'nesma-hayat' || id === 'abaqirat-oyoun-misr') {
    return getStoredProjects();
  }

  const current = getStoredProjects();
  const updated = current.filter(p => p.id !== id);
  saveStoredProjects(updated);
  return updated;
}

export function resetProjectsToDefault(): ProjectItem[] {
  if (!isAdminAuthenticated()) {
    console.warn('Unauthorized: Admin access required to reset projects.');
    return getStoredProjects();
  }
  saveStoredProjects(INITIAL_REAL_PROJECTS);
  return INITIAL_REAL_PROJECTS;
}
