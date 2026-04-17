import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '@/components/Layout/Sidebar';
import Header from '@/components/Layout/Header';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';
import ProjectForm from '@/components/Projects/ProjectForm';

function App() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-gray-50">
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
          onCreateProject={() => {
            setShowProjectForm(true);
            setIsSidebarOpen(false);
          }} 
        />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/team" element={<Team />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
        
        {/* Modal de création de projet */}
        {showProjectForm && (
          <ProjectForm onClose={() => setShowProjectForm(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;
