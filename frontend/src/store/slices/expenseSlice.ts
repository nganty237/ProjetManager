import api from '@/utils/api';
import { Expense } from '@/types';
import { ExpenseSlice, SliceCreator } from '../types';

export const createExpenseSlice: SliceCreator<ExpenseSlice> = (set) => ({
  setBudget: async (projectId, allocated) => {
    try {
      const numAllocated = Number(allocated) || 0;
      await api.put(`/projects/${projectId}/budget`, { allocated: numAllocated });
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, budget: { allocated: numAllocated }, updatedAt: new Date() }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? { ...state.selectedProject, budget: { allocated: numAllocated }, updatedAt: new Date() }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de la mise à jour du budget: ${msg}` });
      console.error("Erreur lors de la mise à jour du budget", error);
    }
  },

  addExpense: async (projectId, expenseData) => {
    try {
      const response = await api.post(`/expenses/${projectId}`, expenseData);
      const newExpense: Expense = {
        ...response.data,
        projectId: response.data.ProjectId || projectId,
        amount: Number(response.data.amount) || 0,
        date: new Date(response.data.date || response.data.createdAt),
      };

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, expenses: [newExpense, ...(p.expenses || [])] }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? {
                ...state.selectedProject,
                expenses: [newExpense, ...(state.selectedProject.expenses || [])],
              }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de l'ajout de dépense: ${msg}` });
      console.error("Erreur lors de l'ajout de dépense", error);
    }
  },

  updateExpense: async (projectId, expenseId, updates) => {
    try {
      const response = await api.put(`/expenses/${expenseId}`, updates);
      const updatedExpense: Expense = {
        ...response.data,
        projectId: response.data.ProjectId || projectId,
        amount: Number(response.data.amount) || 0,
        date: new Date(response.data.date || response.data.createdAt),
      };

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                expenses: (p.expenses || []).map((e) =>
                  e.id === expenseId ? updatedExpense : e
                ),
              }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? {
                ...state.selectedProject,
                expenses: (state.selectedProject.expenses || []).map((e) =>
                  e.id === expenseId ? updatedExpense : e
                ),
              }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de la modification de la dépense: ${msg}` });
      console.error("Erreur lors de la modification de la dépense", error);
    }
  },

  deleteExpense: async (projectId, expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                expenses: (p.expenses || []).filter((e) => e.id !== expenseId),
              }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? {
                ...state.selectedProject,
                expenses: (state.selectedProject.expenses || []).filter((e) => e.id !== expenseId),
              }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de la suppression de la dépense: ${msg}` });
      console.error("Erreur lors de la suppression de la dépense", error);
    }
  },
});
