import api from '@/utils/api';
import { TeamSlice, SliceCreator } from '../types';

export const createTeamSlice: SliceCreator<TeamSlice> = (set) => ({
  teamMembers: [],

  fetchTeamMembers: async () => {
    try {
      const response = await api.get('/users');
      set({ teamMembers: response.data });
    } catch (error: any) {
      console.error("Erreur de chargement des membres d'équipe", error);
    }
  },
});
