import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(location.pathname === '/combat' ? 'combat' : 'exploration');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <nav className="bg-dungeon-dark rounded-lg p-1 mb-6">
      <div className="flex space-x-1">
        <button
          onClick={() => handleTabChange('exploration')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'exploration'
              ? 'bg-dungeon-accent text-white'
              : 'text-dungeon-light hover:bg-dungeon-darker'
          }`}
        >
          🏰 Exploration
        </button>
        <button
          onClick={() => handleTabChange('combat')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'combat'
              ? 'bg-dungeon-accent text-white'
              : 'text-dungeon-light hover:bg-dungeon-darker'
          }`}
        >
          ⚔️ Combat
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
