/**
 * Example usage of all Parties components
 * This demonstrates how to integrate PartiesList, PartyCard, and PartyDetails
 */

import React, { useState } from 'react';
import { LotoGame } from '../../types/game';
import { PartiesList, PartyDetails } from './index';

// Example component showing complete integration
const PartiesExample: React.FC = () => {
  // Sample game data
  const [games, setGames] = useState<LotoGame[]>([
    {
      id: '1',
      name: 'Soirée du vendredi',
      date: '2025-12-27',
      startTime: '2025-12-27T19:00:00Z',
      endTime: '2025-12-27T21:30:00Z',
      manches: [
        {
          id: 'manche-1-1',
          mancheNumber: 1,
          startTime: '2025-12-27T19:00:00Z',
          numbers: [12, 45, 67, 23, 89, 34, 56, 78, 90, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          isActive: false,
        }
      ],
      isActive: false,
    },
    {
      id: '2',
      name: 'Partie du samedi',
      date: '2025-12-28',
      startTime: '2025-12-28T20:00:00Z',
      manches: [
        {
          id: 'manche-2-1',
          mancheNumber: 1,
          startTime: '2025-12-28T20:00:00Z',
          numbers: [15, 25, 35, 45, 55, 65, 75, 85],
          isActive: true,
        }
      ],
      isActive: true,
    },
    {
      id: '3',
      name: 'Grand tournoi',
      date: '2025-12-20',
      startTime: '2025-12-20T18:00:00Z',
      endTime: '2025-12-20T23:00:00Z',
      manches: [
        {
          id: 'manche-3-1',
          mancheNumber: 1,
          startTime: '2025-12-20T18:00:00Z',
          numbers: Array.from({ length: 90 }, (_, i) => i + 1),
          isActive: false
        }
      ],
      isActive: false,
    },
  ]);

  const [selectedGame, setSelectedGame] = useState<LotoGame | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Handler for selecting a game (opens details modal)
  const handleSelectGame = (game: LotoGame) => {
    setSelectedGame(game);
  };

  // Handler for resuming a game
  const handleResumeGame = (game: LotoGame) => {
    setGames((prevGames) =>
      prevGames.map((g) =>
        g.id === game.id
          ? { ...g, isActive: true, endTime: undefined }
          : { ...g, isActive: false }
      )
    );
    alert(`Partie "${game.name}" reprise !`);
  };

  // Handler for deleting a game
  const handleDeleteGame = (game: LotoGame) => {
    setGames((prevGames) => prevGames.filter((g) => g.id !== game.id));
  };

  // Handler for exporting a game
  const handleExportGame = (game: LotoGame) => {
    const dataStr = JSON.stringify(game, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${game.name.replace(/\s+/g, '_')}_${game.date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handler for closing the details modal
  const handleCloseDetails = () => {
    setSelectedGame(null);
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-200"
      style={{
        backgroundColor: darkMode ? '#111827' : '#f9fafb',
      }}
    >
      {/* Header with Dark Mode Toggle */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-3xl font-bold"
            style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
          >
            Mes Parties de Loto
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: darkMode ? '#374151' : '#ffffff',
              color: darkMode ? '#f3f4f6' : '#111827',
              border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
            }}
          >
            {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderColor: darkMode ? '#374151' : '#e5e7eb',
            }}
          >
            <div
              className="text-sm font-medium mb-1"
              style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            >
              Total de parties
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            >
              {games.length}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderColor: darkMode ? '#374151' : '#e5e7eb',
            }}
          >
            <div
              className="text-sm font-medium mb-1"
              style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            >
              Parties en cours
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: darkMode ? '#10b981' : '#059669' }}
            >
              {games.filter((g) => g.isActive).length}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderColor: darkMode ? '#374151' : '#e5e7eb',
            }}
          >
            <div
              className="text-sm font-medium mb-1"
              style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            >
              Parties terminées
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
            >
              {games.filter((g) => !g.isActive).length}
            </div>
          </div>
        </div>

        {/* Parties List */}
        <PartiesList
          games={games}
          onSelectGame={handleSelectGame}
          onResumeGame={handleResumeGame}
          onDeleteGame={handleDeleteGame}
          darkMode={darkMode}
        />
      </div>

      {/* Party Details Modal */}
      {selectedGame && (
        <PartyDetails
          game={selectedGame}
          onExport={handleExportGame}
          onClose={handleCloseDetails}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default PartiesExample;

// ===================================================================
// Usage in your main App component:
// ===================================================================
/*

import PartiesExample from './components/parties/Example';

function App() {
  return <PartiesExample />;
}

export default App;

*/

// ===================================================================
// Advanced usage with state management:
// ===================================================================
/*

import { useState, useEffect } from 'react';
import { PartiesList, PartyDetails } from './components/parties';
import { LotoGame } from './types/game';

function App() {
  const [games, setGames] = useState<LotoGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<LotoGame | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load games from localStorage on mount
  useEffect(() => {
    const savedGames = localStorage.getItem('loto-games');
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    }
  }, []);

  // Save games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('loto-games', JSON.stringify(games));
  }, [games]);

  const handleSelectGame = (game: LotoGame) => {
    setSelectedGame(game);
  };

  const handleResumeGame = (game: LotoGame) => {
    setGames((prevGames) =>
      prevGames.map((g) =>
        g.id === game.id
          ? { ...g, isActive: true, endTime: undefined }
          : { ...g, isActive: false }
      )
    );
  };

  const handleDeleteGame = (game: LotoGame) => {
    if (window.confirm(`Delete "${game.name}"?`)) {
      setGames((prevGames) => prevGames.filter((g) => g.id !== game.id));
    }
  };

  const handleExportGame = (game: LotoGame) => {
    const dataStr = JSON.stringify(game, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${game.name}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: darkMode ? '#111827' : '#f9fafb' }}>
      <PartiesList
        games={games}
        onSelectGame={handleSelectGame}
        onResumeGame={handleResumeGame}
        onDeleteGame={handleDeleteGame}
        darkMode={darkMode}
      />

      {selectedGame && (
        <PartyDetails
          game={selectedGame}
          onExport={handleExportGame}
          onClose={() => setSelectedGame(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}

*/
