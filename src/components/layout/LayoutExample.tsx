/**
 * Example usage of layout components
 * This file demonstrates how to use Header, Navigation, and TabBar together
 */

import React, { useState } from 'react';
import Header from './Header';
import Navigation, { TabId } from './Navigation';
import TabBar from './TabBar';
import { LotoGame } from '../../types/game';

/**
 * Example layout component showing all three layout components in action
 */
const LayoutExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('game');
  const [darkMode, setDarkMode] = useState(false);

  // Example active game (replace with real data from your app state)
  const activeGame: LotoGame = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Soirée du vendredi',
    date: new Date().toISOString(),
    startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // Started 45 minutes ago
    numbers: [12, 45, 67, 23, 89, 34, 56, 78, 90, 1, 23, 45], // Example: 12 numbers drawn
    isActive: true,
  };

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
      }}
    >
      {/* Header */}
      <Header
        activeGame={activeGame}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Desktop/Tablet Navigation */}
      <div className="hidden sm:block">
        <Navigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          darkMode={darkMode}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 sm:pb-6">
        <div
          className="p-6 rounded-lg shadow-sm"
          style={{
            backgroundColor: darkMode ? '#111827' : '#ffffff',
            color: darkMode ? '#f9fafb' : '#111827',
          }}
        >
          <h2 className="text-2xl font-bold mb-4">
            {activeTab === 'game' && 'Partie en cours'}
            {activeTab === 'stats' && 'Statistiques Globales'}
            {activeTab === 'history' && 'Historique des Parties'}
            {activeTab === 'settings' && 'Paramètres'}
          </h2>
          <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
            Content for the {activeTab} tab goes here.
          </p>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        darkMode={darkMode}
      />
    </div>
  );
};

export default LayoutExample;
