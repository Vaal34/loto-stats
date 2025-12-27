/**
 * Main App component
 */

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGameState } from './hooks/useGameState';
import { useStats } from './hooks/useStats';
import { useTheme } from './hooks/useTheme';
import { GlobalStats, isGlobalStats } from './types/game';
import { initializeGlobalStats, saveGlobalStats } from './utils/storage';
import { AUTO_SAVE_INTERVAL, STORAGE_KEY } from './constants/config';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Components
import NumberGrid from './components/game/NumberGrid';
import {
  FrequencyBarChart,
  Heatmap,
  DecadeDistribution,
  EvolutionChart,
  TopFlopList,
} from './components/stats/charts';

type Tab = 'partie' | 'stats' | 'parties' | 'settings';

function App() {
  const [theme, toggleTheme] = useTheme();
  const [activeTab, setActiveTab] = useState<string>('partie');

  // Global stats with localStorage
  const [globalStats, setGlobalStats, isSaved] = useLocalStorage<GlobalStats>(
    STORAGE_KEY,
    initializeGlobalStats(),
    isGlobalStats
  );

  // Game state management
  const {
    activeGame,
    startNewGame,
    endGame,
    addNumber,
    removeNumber,
    removeLastNumber,
    isNumberDrawn,
    getGameDuration,
  } = useGameState(globalStats, setGlobalStats);

  // Statistics
  const stats = useStats(globalStats);

  // Auto-save indicator
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  useEffect(() => {
    if (isSaved) {
      setLastSaved(new Date());
    }
  }, [isSaved]);

  // Auto-save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveGlobalStats(globalStats);
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [globalStats]);

  const handleNumberClick = (number: number) => {
    const isDrawn = isNumberDrawn(number);

    if (isDrawn) {
      removeNumber(number);
    } else {
      addNumber(number);
    }
  };

  const darkMode = theme === 'dark';

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: darkMode ? '#111827' : '#ffffff',
          borderColor: darkMode ? '#374151' : '#e5e7eb',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
              >
                🎲 Loto Stats
              </h1>
              {activeGame && (
                <p
                  className="text-sm mt-1"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  {activeGame.name} • {activeGame.numbers.length}/90 numéros
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                {isSaved ? (
                  <span>✓ Sauvegardé {lastSaved.toLocaleTimeString()}</span>
                ) : (
                  <span>⏳ Sauvegarde...</span>
                )}
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: darkMode ? '#f3f4f6' : '#111827',
                }}
                aria-label="Toggle theme"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav
        className="sticky top-16 z-40 border-b"
        style={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          borderColor: darkMode ? '#374151' : '#e5e7eb',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {(['partie', 'stats', 'parties', 'settings'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-3 font-medium whitespace-nowrap transition-all border-b-2"
                style={{
                  color:
                    activeTab === tab
                      ? darkMode
                        ? '#60a5fa'
                        : '#2563eb'
                      : darkMode
                      ? '#9ca3af'
                      : '#6b7280',
                  borderColor:
                    activeTab === tab
                      ? darkMode
                        ? '#60a5fa'
                        : '#2563eb'
                      : 'transparent',
                }}
              >
                {tab === 'partie' && '🎯 Partie'}
                {tab === 'stats' && '📊 Stats Globales'}
                {tab === 'parties' && '📋 Parties'}
                {tab === 'settings' && '⚙️ Paramètres'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'partie' && (
          <div className="space-y-6">
            {/* Game Controls */}
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xl font-bold"
                  style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                >
                  {activeGame ? activeGame.name : 'Aucune partie active'}
                </h2>
                <div className="flex gap-2">
                  {!activeGame && (
                    <button
                      onClick={() => startNewGame()}
                      className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                      style={{ backgroundColor: '#10b981' }}
                    >
                      ➕ Nouvelle Partie
                    </button>
                  )}
                  {activeGame && (
                    <>
                      <button
                        onClick={removeLastNumber}
                        className="px-4 py-2 rounded-lg font-medium transition-colors"
                        style={{
                          backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                          color: darkMode ? '#f3f4f6' : '#111827',
                        }}
                      >
                        ↩️ Annuler dernier
                      </button>
                      <button
                        onClick={endGame}
                        className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                        style={{ backgroundColor: '#ef4444' }}
                      >
                        ⏹️ Terminer
                      </button>
                    </>
                  )}
                </div>
              </div>

              {activeGame && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div
                      className="text-sm"
                      style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                    >
                      Numéros tirés
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                    >
                      {activeGame.numbers.length}/90
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-sm"
                      style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                    >
                      Progression
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                    >
                      {((activeGame.numbers.length / 90) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-sm"
                      style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                    >
                      Dernier numéro
                    </div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: darkMode ? '#10b981' : '#059669' }}
                    >
                      {activeGame.numbers[activeGame.numbers.length - 1] || '-'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Number Grid */}
            <NumberGrid
              onNumberClick={handleNumberClick}
              drawnNumbers={activeGame?.numbers || []}
              allTimeFrequency={globalStats.allTimeFrequency}
              isActive={!!activeGame}
              darkMode={darkMode}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            >
              Statistiques Globales
            </h2>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderLeft: '4px solid #3b82f6',
                }}
              >
                <div
                  className="text-sm"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Parties jouées
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                >
                  {globalStats.totalGamesPlayed}
                </div>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderLeft: '4px solid #10b981',
                }}
              >
                <div
                  className="text-sm"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Total tirages
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                >
                  {stats.totalNumbersDrawn}
                </div>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderLeft: '4px solid #f59e0b',
                }}
              >
                <div
                  className="text-sm"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Moyenne / partie
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                >
                  {stats.averageNumbersPerGame.toFixed(1)}
                </div>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderLeft: '4px solid #ef4444',
                }}
              >
                <div
                  className="text-sm"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  N° le plus fréquent
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                >
                  {stats.mostFrequentNumber || '-'}
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="space-y-8">
              {/* Frequency Bar Chart */}
              <div
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                }}
              >
                <FrequencyBarChart data={stats.frequencyData} darkMode={darkMode} />
              </div>

              {/* Heatmap */}
              <div
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                }}
              >
                <Heatmap data={stats.frequencyData} darkMode={darkMode} />
              </div>

              {/* Top & Flop */}
              <div
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                }}
              >
                <TopFlopList
                  topNumbers={stats.topNumbers}
                  flopNumbers={stats.flopNumbers}
                  darkMode={darkMode}
                />
              </div>

              {/* Decade Distribution */}
              <div
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#ffffff',
                  border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                }}
              >
                <DecadeDistribution data={stats.decadeStats} darkMode={darkMode} />
              </div>

              {/* Evolution Chart */}
              {stats.gameEvolution.length > 0 && (
                <div
                  className="p-6 rounded-lg"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#ffffff',
                    border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                  }}
                >
                  <EvolutionChart data={stats.gameEvolution} darkMode={darkMode} />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'parties' && (
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            >
              Liste des Parties
            </h2>

            <div className="space-y-4">
              {globalStats.games.length === 0 ? (
                <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                  Aucune partie enregistrée. Créez votre première partie !
                </p>
              ) : (
                globalStats.games.map((game) => (
                  <div
                    key={game.id}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: darkMode ? '#374151' : '#f9fafb',
                      border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className="font-semibold"
                          style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                        >
                          {game.name}
                          {game.isActive && (
                            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-500 text-white">
                              En cours
                            </span>
                          )}
                        </h3>
                        <p
                          className="text-sm mt-1"
                          style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                        >
                          {new Date(game.date).toLocaleDateString('fr-FR')} •{' '}
                          {game.numbers.length}/90 numéros
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div
            className="p-6 rounded-lg"
            style={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            >
              Paramètres
            </h2>

            <div className="space-y-6">
              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                >
                  Apparence
                </h3>
                <button
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{
                    backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                    color: darkMode ? '#f3f4f6' : '#111827',
                  }}
                >
                  {darkMode ? '☀️' : '🌙'} Mode {darkMode ? 'Clair' : 'Sombre'}
                </button>
              </div>

              <div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
                >
                  Données
                </h3>
                <p
                  className="text-sm mb-2"
                  style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Parties enregistrées : {globalStats.totalGamesPlayed}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
