import { create } from 'zustand';
import { ProjectStore } from './types';
import { createProjectSlice } from './slices/projectSlice';
import { createTaskSlice } from './slices/taskSlice';
import { createExpenseSlice } from './slices/expenseSlice';
import { createFilterSlice } from './slices/filterSlice';
import { createTeamSlice } from './slices/teamSlice';

export const useProjectStore = create<ProjectStore>()((...a) => ({
  ...createProjectSlice(...a),
  ...createTaskSlice(...a),
  ...createExpenseSlice(...a),
  ...createFilterSlice(...a),
  ...createTeamSlice(...a),
}));

export * from './types';
export * from './adapters';
