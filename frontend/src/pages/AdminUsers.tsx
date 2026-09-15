import { useState, useEffect } from 'react';
import { UserPlus, Shield, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { UserRole, UserStatus } from '@/types';
import api from '@/utils/api';
import { AdminStatsCards } from '@/components/Admin/AdminStatsCards';
import { AdminUserFilters } from '@/components/Admin/AdminUserFilters';
import { AdminUserTable, ManagedUser } from '@/components/Admin/AdminUserTable';
import { CreateUserModal } from '@/components/Admin/CreateUserModal';
import { InvitationLinkModal } from '@/components/Admin/InvitationLinkModal';
import { EditRoleModal } from '@/components/Admin/EditRoleModal';

/**
 * Page d'administration centrale de la plateforme.
 * Permet la création par invitation, l'attribution des rôles, la bascule de statut
 * et la suppression définitive des utilisateurs.
 */
export function AdminUsers() {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres et recherche
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  // Modales et notifications
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteModalData, setInviteModalData] = useState<{ name: string; email: string; link: string } | null>(null);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Récupère la liste complète des utilisateurs depuis l'API backend.
   */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors du chargement des utilisateurs',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Traite la création d'un utilisateur et ouvre la modale d'invitation avec le lien généré.
   */
  const handleCreateUser = async (newUserData: { name: string; email: string; role: UserRole }) => {
    try {
      const res = await api.post('/users', newUserData);
      setUsers([res.data.user, ...users]);
      
      // Ouvrir la modale d'invitation avec le lien copiable
      setInviteModalData({
        name: res.data.user.name,
        email: res.data.user.email,
        link: res.data.invitationLink,
      });
      setShowInviteModal(true);
      setNotification({
        type: 'success',
        text: `Compte créé pour ${res.data.user.name} (en attente d'activation)`,
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors de la création du compte',
      });
      throw err;
    }
  };

  /**
   * Renvoie une invitation avec génération d'un nouveau jeton d'activation.
   */
  const handleResendInvite = async (user: ManagedUser) => {
    try {
      const res = await api.post(`/users/${user.id}/resend-invite`);
      setInviteModalData({
        name: user.name,
        email: user.email,
        link: res.data.invitationLink,
      });
      setShowInviteModal(true);
      setNotification({ type: 'success', text: `Invitation renouvelée pour ${user.name}` });
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err.response?.data?.message || "Erreur lors du renvoi de l'invitation",
      });
    }
  };

  /**
   * Active ou désactive un compte utilisateur (ACTIF <-> INACTIF).
   */
  const handleToggleStatus = async (user: ManagedUser) => {
    try {
      const res = await api.put(`/users/${user.id}/toggle-status`);
      setUsers(users.map((u) => (u.id === user.id ? { ...u, status: res.data.user.status } : u)));
      setNotification({ type: 'success', text: res.data.message });
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors du changement de statut',
      });
    }
  };

  /**
   * Met à jour le rôle fonctionnel d'un utilisateur.
   */
  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      const res = await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      setEditingUser(null);
      setNotification({ type: 'success', text: res.data.message });
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors du changement de rôle',
      });
    }
  };

  /**
   * Supprime définitivement un utilisateur non-admin après confirmation.
   */
  const handleDeleteUser = async (user: ManagedUser) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement ${user.name} ? Cette action est irréversible.`)) {
      return;
    }
    try {
      await api.delete(`/users/${user.id}`);
      setUsers(users.filter((u) => u.id !== user.id));
      setNotification({ type: 'success', text: `Utilisateur ${user.name} supprimé avec succès.` });
    } catch (err: any) {
      setNotification({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors de la suppression',
      });
    }
  };

  // Filtrage combiné par statut, rôle et terme de recherche
  const filteredUsers = users.filter((u) => {
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  // Calcul des compteurs KPI
  const totalUsers = users.length;
  const pendingUsers = users.filter((u) => u.status === 'EN_ATTENTE').length;
  const activeUsers = users.filter((u) => u.status === 'ACTIF').length;
  const inactiveUsers = users.filter((u) => u.status === 'INACTIF').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Shield className="text-amber-600" size={26} />
            <span>Gestion des Utilisateurs</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Création, attribution des rôles, envoi des invitations et gestion des statuts de compte
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold self-start sm:self-auto cursor-pointer"
        >
          <UserPlus size={16} />
          <span>Créer un utilisateur</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          <span>{notification.text}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Cartes KPI */}
      <AdminStatsCards
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        pendingUsers={pendingUsers}
        inactiveUsers={inactiveUsers}
      />

      {/* Barre de Recherche et Filtres */}
      <AdminUserFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        totalCount={totalUsers}
        activeCount={activeUsers}
        pendingCount={pendingUsers}
        inactiveCount={inactiveUsers}
      />

      {/* Tableau des utilisateurs */}
      <AdminUserTable
        users={filteredUsers}
        currentUserId={currentUser?.id}
        loading={loading}
        onEditRole={setEditingUser}
        onResendInvite={handleResendInvite}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
      />

      {/* Modale de création d'utilisateur */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
      />

      {/* Modale d'affichage du lien d'invitation généré */}
      <InvitationLinkModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        data={inviteModalData}
      />

      {/* Modale de modification du rôle */}
      <EditRoleModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdateRole={handleUpdateRole}
      />
    </div>
  );
}

export default AdminUsers;