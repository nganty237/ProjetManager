import React, { useState } from 'react';
import { Project, ProjectStatus, ProjectPriority } from '@/types';
import { X } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { UserAvatar } from '@/components/Common/UserAvatar';

interface ProjectFormProps {
  project?: Project;
  onClose: () => void;
}

export function ProjectForm({ project, onClose }: ProjectFormProps) {
  const { addProject, updateProject, teamMembers } = useProjectStore();
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || ('planning' as ProjectStatus),
    priority: project?.priority || ('medium' as ProjectPriority),
    startDate: project?.startDate
      ? new Date(project.startDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    endDate: project?.endDate
      ? new Date(project.endDate).toISOString().split('T')[0]
      : '',
    selectedTeam: project?.team.map((m) => m.id) || [],
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedTeamMembers = teamMembers.filter((m) =>
      formData.selectedTeam.includes(m.id)
    );
    
    const projectData = {
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      team: selectedTeamMembers,
      teamIds: formData.selectedTeam,
      tasks: project?.tasks || [],
    };
    
    if (project) {
      updateProject(project.id, projectData);
    } else {
      addProject(projectData);
    }
    
    onClose();
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleTeamSelection = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTeam: prev.selectedTeam.includes(memberId)
        ? prev.selectedTeam.filter((id) => id !== memberId)
        : [...prev.selectedTeam, memberId],
    }));
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-extrabold text-slate-900">
            {project ? 'Modifier le projet' : 'Nouveau projet'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="label">Titre du projet *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input"
              required
            />
          </div>
          
          {/* Statut et Priorité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Statut *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="planning">Planification</option>
                <option value="active">En cours</option>
                <option value="on-hold">En pause</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>
            
            <div>
              <label className="label">Priorité *</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="critical">Critique</option>
              </select>
            </div>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Date de début *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label className="label">Date de fin</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input"
                min={formData.startDate}
              />
            </div>
          </div>
          
          {/* Équipe */}
          <div>
            <label className="label">Membres de l'équipe</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {teamMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center gap-3 p-3 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedTeam.includes(member.id)}
                    onChange={() => handleTeamSelection(member.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <UserAvatar name={member.name} avatar={member.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {member.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{member.role}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Boutons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {project ? 'Mettre à jour' : 'Créer le projet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
