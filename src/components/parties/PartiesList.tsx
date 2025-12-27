/**
 * List component for displaying all games (active + completed)
 * Features sorting, filtering, and grid/list layout
 */

import React, { useState, useMemo } from 'react';
import { LotoGame } from '../../types/game';
import PartyCard from './PartyCard';
import { Search, SortAsc, SortDesc, Grid3x3, List, Calendar, Hash, BarChart3 } from 'lucide-react';

interface PartiesListProps {
  games: LotoGame[];
  onSelectGame: (game: LotoGame) => void;
  onResumeGame?: (game: LotoGame) => void;
  onDeleteGame?: (game: LotoGame) => void;
  darkMode?: boolean;
}

type SortField = 'date' | 'name' | 'numbersDrawn';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

const PartiesList: React.FC<PartiesListProps> = ({
  games,
  onSelectGame,
  onResumeGame,
  onDeleteGame,
  darkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    // Filter by search query
    let filtered = games.filter((game) =>
      game.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by selected field
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'numbersDrawn':
          const countA = a.manches.reduce((acc, m) => acc + m.numbers.length, 0);
          const countB = b.manches.reduce((acc, m) => acc + m.numbers.length, 0);
          comparison = countA - countB;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [games, searchQuery, sortField, sortOrder]);

  const activeGamesCount = games.filter((g) => g.isActive).length;
  const completedGamesCount = games.filter((g) => !g.isActive).length;

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSortFieldChange = (field: SortField) => {
    if (sortField === field) {
      toggleSortOrder();
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ color: darkMode ? '#f3f4f6' : '#111827' }}
            >
              Toutes les parties
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            >
              {games.length} partie{games.length !== 1 ? 's' : ''} au total
              {activeGamesCount > 0 && (
                <span className="ml-2">
                  ({activeGamesCount} en cours, {completedGamesCount} terminée{completedGamesCount !== 1 ? 's' : ''})
                </span>
              )}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div
            className="flex items-center gap-1 p-1 rounded-lg"
            style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded transition-all duration-200"
              style={{
                backgroundColor: viewMode === 'grid'
                  ? darkMode ? '#1f2937' : '#ffffff'
                  : 'transparent',
                color: viewMode === 'grid'
                  ? darkMode ? '#3b82f6' : '#2563eb'
                  : darkMode ? '#9ca3af' : '#6b7280',
              }}
              aria-label="Vue en grille"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded transition-all duration-200"
              style={{
                backgroundColor: viewMode === 'list'
                  ? darkMode ? '#1f2937' : '#ffffff'
                  : 'transparent',
                color: viewMode === 'list'
                  ? darkMode ? '#3b82f6' : '#2563eb'
                  : darkMode ? '#9ca3af' : '#6b7280',
              }}
              aria-label="Vue en liste"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
            />
            <input
              type="text"
              placeholder="Rechercher une partie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
              style={{
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                borderColor: darkMode ? '#4b5563' : '#d1d5db',
                color: darkMode ? '#f3f4f6' : '#111827',
              }}
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSortFieldChange('date')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: sortField === 'date'
                  ? darkMode ? '#3b82f6' : '#60a5fa'
                  : darkMode ? '#374151' : '#ffffff',
                borderColor: sortField === 'date'
                  ? darkMode ? '#3b82f6' : '#60a5fa'
                  : darkMode ? '#4b5563' : '#d1d5db',
                color: sortField === 'date'
                  ? '#ffffff'
                  : darkMode ? '#f3f4f6' : '#111827',
              }}
              aria-label="Trier par date"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Date</span>
              {sortField === 'date' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => handleSortFieldChange('name')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: sortField === 'name'
                  ? darkMode ? '#3b82f6' : '#60a5fa'
                  : darkMode ? '#374151' : '#ffffff',
                borderColor: sortField === 'name'
                  ? darkMode ? '#3b82f6' : '#60a5fa'
                  : darkMode ? '#4b5563' : '#d1d5db',
                color: sortField === 'name'
                  ? '#ffffff'
                  : darkMode ? '#f3f4f6' : '#111827',
              }}
              aria-label="Trier par nom"
            >
              <Hash className="w-4 h-4" />
              <span className="hidden sm:inline">Nom</span>
              {sortField === 'name' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => handleSortFieldChange('numbersDrawn')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: sortField === 'numbersDrawn'
                  ? darkMode ? '#3b82f6' : '#60a5fa'
                  : darkMode ? '#374151' : '#ffffff',
                borderColor: sortField === 'numbersDrawn'
                  ? darkMode ? '#3b82f6' : '#60a5fa'
                  : darkMode ? '#4b5563' : '#d1d5db',
                color: sortField === 'numbersDrawn'
                  ? '#ffffff'
                  : darkMode ? '#f3f4f6' : '#111827',
              }}
              aria-label="Trier par nombre de numéros tirés"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Numéros</span>
              {sortField === 'numbersDrawn' && (
                sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Games Grid/List */}
      {filteredAndSortedGames.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg border"
          style={{
            backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
            borderColor: darkMode ? '#374151' : '#e5e7eb',
          }}
        >
          <p
            className="text-lg font-medium"
            style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
          >
            {searchQuery ? 'Aucune partie trouvée' : 'Aucune partie disponible'}
          </p>
          {searchQuery && (
            <p
              className="text-sm mt-2"
              style={{ color: darkMode ? '#6b7280' : '#9ca3af' }}
            >
              Essayez de modifier votre recherche
            </p>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-4'
          }
        >
          {filteredAndSortedGames.map((game) => (
            <PartyCard
              key={game.id}
              game={game}
              onClick={onSelectGame}
              onResume={onResumeGame}
              onDelete={onDeleteGame}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PartiesList;
