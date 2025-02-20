import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ProjectCreationModal from './components/ProjectCreationModal';

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const handleProjectSubmit = () => {
    setShowProjectModal(false);
    setShowSidebar(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar 
        onMenuClick={() => setShowSidebar(!showSidebar)}
        onCreateProject={() => setShowProjectModal(true)}
      />
      
      <div className="flex">
        {/* Sidebar with animation */}
        <div className={`
          fixed inset-y-0 left-0 transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          transition duration-200 ease-in-out z-30 md:relative md:translate-x-0
        `}>
          <Sidebar onNewProject={() => setShowProjectModal(true)} />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 mt-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              AI Database Assistant
            </h1>
            <ChatInterface />
          </div>
        </main>
      </div>

      {/* Project creation modal */}
      {showProjectModal && (
        <ProjectCreationModal 
          onClose={() => setShowProjectModal(false)} 
          onSubmit={handleProjectSubmit}
        />
      )}

      {/* Mobile overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}

export default App;