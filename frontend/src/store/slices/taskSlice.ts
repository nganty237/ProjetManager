import api from '@/utils/api';
import { TaskSlice, SliceCreator } from '../types';
import { adaptTask } from '../adapters';

export const createTaskSlice: SliceCreator<TaskSlice> = (set) => ({
  addTask: async (projectId, taskData) => {
    try {
      const response = await api.post(`/tasks/${projectId}`, taskData);
      const newTask = adaptTask(response.data.task || response.data);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks ? [...project.tasks, newTask] : [newTask],
              }
            : project
        ),
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de l'ajout de tâche: ${msg}` });
      console.error("Erreur lors de l'ajout de tâche", error);
    }
  },

  updateTask: async (projectId, taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      const updatedTask = adaptTask(response.data.task || response.data);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, ...updatedTask } : t)),
              }
            : project
        ),
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur maj tâche: ${msg}` });
      console.error("Erreur maj tâche", error);
    }
  },

  deleteTask: async (projectId, taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter((t) => t.id !== taskId),
              }
            : project
        ),
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur suppr tâche: ${msg}` });
      console.error("Erreur suppr tâche", error);
    }
  },
});
