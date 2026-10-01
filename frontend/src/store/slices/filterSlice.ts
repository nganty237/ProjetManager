import { FilterSlice, SliceCreator } from '../types';

export const createFilterSlice: SliceCreator<FilterSlice> = (set) => ({
  filters: {},
  viewMode: 'grid',

  setFilters: (filters) => {
    set({ filters });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  clearFilters: () => {
    set({ filters: {} });
  },
});
