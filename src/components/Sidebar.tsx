import React from 'react';
import { Database, History, GitBranch, Save, Plus } from 'lucide-react';

interface SidebarProps {
  onNewProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewProject }) => {
  return (
    <div className="w-64 bg-white h-full border-r flex flex-col">
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
          >
            <Database className="mr-3 h-6 w-6 text-gray-500" />
            Databases
          </a>
          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
          >
            <History className="mr-3 h-6 w-6 text-gray-500" />
            History
          </a>
          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
          >
            <GitBranch className="mr-3 h-6 w-6 text-gray-500" />
            Schema Diagram
          </a>
          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100 group"
          >
            <Save className="mr-3 h-6 w-6 text-gray-500" />
            Saved Queries
          </a>
        </nav>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={onNewProject}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>
    </div>
  );
};

export default Sidebar;