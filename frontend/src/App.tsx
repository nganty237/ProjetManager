import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { Team } from '@/pages/Team';
import { Settings } from '@/pages/Settings';
import { Profile } from '@/pages/Profile';
import { Finance } from '@/pages/Finance';
import { Login } from '@/pages/Login';
import { ActivateAccount } from '@/pages/ActivateAccount';
import { AdminUsers } from '@/pages/AdminUsers';
import { MyTasks } from '@/pages/MyTasks';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';

// Layout wrapper for authenticated routes
function AuthenticatedLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const fetchTeamMembers = useProjectStore((state) => state.fetchTeamMembers);

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, [fetchProjects, fetchTeamMembers]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Page d'accueil : Landing page publique si non connecté, Dashboard si connecté */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <AuthenticatedLayout />
            ) : (
              <LandingPage />
            )
          }
        >
          {isAuthenticated && <Route index element={<Dashboard />} />}
        </Route>

        {/* Routes publiques */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/activate/:token" element={<ActivateAccount />} />

        {/* Routes protégées de l'application */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/team" element={<Team />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />

            {/* Routes réservées aux Administrateurs */}
            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRATEUR']} />}>
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* Finance : Administrateur et Chef de projet */}
            <Route element={<ProtectedRoute allowedRoles={['ADMINISTRATEUR', 'CHEF_DE_PROJET']} />}>
              <Route path="/finance" element={<Finance />} />
            </Route>
          </Route>
        </Route>

        {/* Redirection pour toute autre route inconnue */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
