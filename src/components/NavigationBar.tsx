import React from 'react';
import { Menu, Plus, Database } from 'lucide-react';

interface NavigationBarProps {
  onMenuClick: () => void;
  onCreateProject: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onMenuClick, onCreateProject }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={onMenuClick}
              className="px-2 rounded-md text-gray-400 md:hidden hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DBMaster</span>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={onCreateProject}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;