import { Project, Task } from '@/types';

// Adapte le schéma d'une tâche backend vers le schéma frontend Task
export const adaptTask = (task: any | Task): Task => {
  const assignedTo = task.assignedTo || task.assignee || undefined;
  return {
    ...task,
    assignedTo: assignedTo
      ? {
          id: assignedTo.id,
          name: assignedTo.name,
          email: assignedTo.email || '',
          avatar: assignedTo.avatar,
          role: assignedTo.role,
        }
      : undefined,
    assignedToId: task.assignedToId || assignedTo?.id || undefined,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
    updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
  };
};

// Adapte les conventions de nommage MySQL vers le schéma frontend Project
export const adaptProject = (project: any | Project): Project => {
  const budgetAllocated =
    project.budgetAllocated !== undefined
      ? Number(project.budgetAllocated)
      : project.budget?.allocated;

  return {
    ...project,
    tasks: (project.tasks || project.Tasks || []).map(adaptTask),
    team: project.team || project.members || [],
    expenses: (project.expenses || []).map((e: any) => ({
      ...e,
      projectId: e.ProjectId || e.projectId || project.id,
      amount: Number(e.amount) || 0,
      date: new Date(e.date || e.createdAt),
    })),
    budget: budgetAllocated !== undefined ? { allocated: budgetAllocated } : undefined,
  };
};
