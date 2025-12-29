/**
 * Main App component with shadcn/ui
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGameState } from './hooks/useGameState';
import { useStats } from './hooks/useStats';
import { useTheme } from './hooks/useTheme';
import { GlobalStats, isGlobalStats } from './types/game';
import { initializeGlobalStats, saveGlobalStats } from './utils/storage';
import { AUTO_SAVE_INTERVAL, STORAGE_KEY } from './constants/config';
import { downloadJSON } from './utils/export';
import { importFromFile } from './utils/import';
import { useCallback } from 'react';
import { useTutorial } from './hooks/useTutorial';

// Lucide Icons
import {
  Sun,
  Dice5,
  Moon,
  Target,
  BarChart3,
  ListChecks,
  Settings,
  Plus,
  Undo2,
  Square,
  Check,
  Clock,
  Medal,
  Trophy,
  Download,
  Upload,
  Trash2,
  HelpCircle,
  Edit2
} from 'lucide-react';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionTabs as Tabs, MotionTabsContent as TabsContent, MotionTabsList as TabsList, MotionTabsTrigger as TabsTrigger, MotionTabsContents } from '@/components/ui/motion-tabs';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Components
import NumberGrid from './components/game/NumberGrid';
import QuineStatsCard from './components/stats/QuineStatsCard';
import TimingStatsCard from './components/stats/TimingStatsCard';
import GapAnalysisCard from './components/stats/GapAnalysisCard';
import FrequencyBarChart from './components/stats/charts/FrequencyBarChart';
import Heatmap from './components/stats/charts/Heatmap';
import TopFlopList from './components/stats/charts/TopFlopList';
import ColumnDistributionChart from './components/stats/charts/ColumnDistributionChart';
import QuineTimelineChart from './components/stats/charts/QuineTimelineChart';
import MancheMilestones from './components/parties/MancheMilestones';
import Tutorial from './components/tutorial/Tutorial';
import ActivateGameHint from './components/tutorial/ActivateGameHint';

function App() {
  const [theme, toggleTheme] = useTheme();
  const { showTutorial, startTutorial, closeTutorial } = useTutorial();

  // Global stats with localStorage
  const [globalStats, setGlobalStats, isSaved] = useLocalStorage<GlobalStats>(
    STORAGE_KEY,
    initializeGlobalStats(),
    isGlobalStats
  );

  // Game state management (Partie and Manche)
  const {
    activeGame,
    activeManche,
    startNewGame,
    endGame,
    deleteGame,
    renameGame,
    resumeGame,
    startNewManche,
    endManche,
    addNumber,
    removeNumber,
    removeLastNumber,
    isNumberDrawn,
    markMilestone,
    clearMilestone,
  } = useGameState(globalStats, setGlobalStats);

  // Selected partie for stats (defaults to active game or last game)
  const [selectedPartieId, setSelectedPartieId] = useState<string | null>(null);

  const selectedPartie = useMemo(() => {
    // If a partie is selected, use it
    if (selectedPartieId) {
      return globalStats.games.find(g => g.id === selectedPartieId) || null;
    }
    // Otherwise use active game
    if (activeGame) {
      return activeGame;
    }
    // Otherwise use the last game
    if (globalStats.games.length > 0) {
      return globalStats.games[globalStats.games.length - 1];
    }
    return null;
  }, [selectedPartieId, activeGame, globalStats.games]);

  // Statistics for selected partie
  const stats = useStats(selectedPartie);

  // Dialog states
  const [showEndMancheDialog, setShowEndMancheDialog] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);

  // Tab state for tutorial navigation
  const [activeTab, setActiveTab] = useState('partie');

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
    if (!activeManche) {
      alert('Aucune manche active. Créez une nouvelle manche pour commencer.');
      return;
    }

    const isDrawn = isNumberDrawn(number);

    if (isDrawn) {
      removeNumber(number);
    } else {
      addNumber(number);
    }
  };

  // Calculate frequency for current partie (not all-time)
  const currentPartieFrequency = useMemo(() => {
    if (!activeGame) {
      return {};
    }

    const frequency: Record<number, number> = {};
    activeGame.manches.forEach((manche) => {
      manche.numbers.forEach((num) => {
        frequency[num] = (frequency[num] || 0) + 1;
      });
    });

    return frequency;
  }, [activeGame]);

  const darkMode = theme === 'dark';

  // Helper to edit milestone position with prompt
  const editMilestonePosition = useCallback(
    (
      type: 'quine' | 'deuxieme-quine' | 'double-quine' | 'carton-plein',
      currentPosition: number,
      label: string
    ) => {
      if (!activeManche) return;

      const position = window.prompt(
        `Modifier la position ${label} (actuellement au ${currentPosition}ème numéro) :\n\nEntrez une position entre 1 et ${activeManche.numbers.length} :`,
        currentPosition.toString()
      );

      if (position) {
        const pos = parseInt(position, 10);
        if (!isNaN(pos) && pos >= 1 && pos <= activeManche.numbers.length) {
          markMilestone(type, pos);
        } else {
          alert(`Position invalide. Doit être entre 1 et ${activeManche.numbers.length}`);
        }
      }
    },
    [activeManche, markMilestone]
  );

  // Handlers for dialog confirmations
  const handleEndMancheConfirm = useCallback(() => {
    endManche();
    setShowEndMancheDialog(false);
  }, [endManche]);

  const handleEndGameConfirm = useCallback(() => {
    endGame();
    setShowEndGameDialog(false);
  }, [endGame]);

  // Handle file import
  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const hasExistingData = globalStats.games.length > 0;

    if (hasExistingData) {
      const merge = window.confirm(
        `Vous avez déjà ${globalStats.games.length} partie(s) enregistrée(s).\n\n` +
        'Voulez-vous FUSIONNER les données (recommandé) ?\n\n' +
        '✓ OUI = Fusionner (garder les parties existantes + ajouter les nouvelles)\n' +
        '✗ NON = Remplacer (supprimer toutes les parties existantes)'
      );

      const result = await importFromFile(file, merge, globalStats);

      if (result.success && result.stats) {
        setGlobalStats(result.stats);
        alert(`Import réussi ! ${result.stats.games.length} partie(s) au total.`);
      } else {
        alert(`Erreur d'import : ${result.error}`);
      }
    } else {
      const result = await importFromFile(file, false, globalStats);

      if (result.success && result.stats) {
        setGlobalStats(result.stats);
        alert(`Import réussi ! ${result.stats.games.length} partie(s) importée(s).`);
      } else {
        alert(`Erreur d'import : ${result.error}`);
      }
    }

    event.target.value = '';
  };

  const handleExportData = () => {
    downloadJSON(globalStats);
    alert('Données exportées avec succès !');
  };

  const handleLoadDemo = async () => {
    const hasExistingData = globalStats.games.length > 0;

    if (hasExistingData) {
      const confirm = window.confirm(
        `Vous avez déjà ${globalStats.games.length} partie(s) enregistrée(s).\n\n` +
        'Charger la démo supprimera toutes vos données actuelles.\n\n' +
        'Voulez-vous continuer ?'
      );

      if (!confirm) {
        return;
      }
    }

    try {
      const demoData = await import('./data/demoData.json');
      const exportData = demoData.default as { version: string; exportDate: string; stats: GlobalStats };
      setGlobalStats(exportData.stats);
      alert('Partie démo chargée avec succès !');
    } catch (error) {
      console.error('Erreur lors du chargement de la démo:', error);
      alert('Erreur lors du chargement de la partie démo.');
    }
  };

  const handleRenameGame = useCallback(
    (gameId: string, currentName: string) => {
      const newName = window.prompt(
        'Nouveau nom de la partie :',
        currentName
      );

      if (newName && newName.trim() !== '' && newName.trim() !== currentName) {
        renameGame(gameId, newName);
      }
    },
    [renameGame]
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 py-3">
          {/* Desktop: single row */}
          <div className="hidden sm:flex h-10 items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Dice5 className="h-6 w-6" />
                Loto Stats
              </h1>
              {activeGame && (
                <p className="text-sm text-muted-foreground truncate">
                  {activeGame.name}
                  {activeManche && ` • Manche #${activeManche.mancheNumber}`}
                  {activeManche && ` • ${activeManche.numbers.length}/90 numéros`}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 ml-4">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {isSaved ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Sauvegardé {lastSaved.toLocaleTimeString()}</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 animate-spin" />
                    <span>Sauvegarde...</span>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile: two rows */}
          <div className="sm:hidden space-y-2">
            {/* Row 1: Title + Theme button */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Dice5 className="h-5 w-5" />
                Loto Stats
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="h-8 w-8"
              >
                {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              </Button>
            </div>

            {/* Row 2: Game info + Save status */}
            {activeGame && (
              <div className="flex items-center justify-between text-xs">
                <p className="text-muted-foreground truncate flex-1 min-w-0 pr-2">
                  {activeGame.name}
                  {activeManche && ` • M${activeManche.mancheNumber} • ${activeManche.numbers.length}/90`}
                </p>
                <div className="text-muted-foreground flex items-center gap-1 shrink-0">
                  {isSaved ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3 animate-spin" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="partie" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 text-xs sm:text-sm">
              <Target className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Partie</span>
              <span className="sm:hidden">Jeu</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 text-xs sm:text-sm">
              <BarChart3 className="h-4 w-4 sm:h-4 sm:w-4" />
              <span>Stats</span>
            </TabsTrigger>
            <TabsTrigger value="parties" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 text-xs sm:text-sm">
              <ListChecks className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Parties</span>
              <span className="sm:hidden">Liste</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-1.5 text-xs sm:text-sm">
              <Settings className="h-4 w-4 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Paramètres</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>

          <MotionTabsContents>
          {/* Partie Tab */}
          <TabsContent value="partie" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2">
                      <span className="truncate">
                        {activeGame ? activeGame.name : 'Aucune partie active'}
                      </span>
                      {activeGame && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRenameGame(activeGame.id, activeGame.name)}
                          className="h-6 w-6 p-0 shrink-0"
                          title="Renommer la partie"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      )}
                    </CardTitle>
                    {activeGame && (
                      <CardDescription>
                        {activeGame.manches.length} manche(s)
                        {activeManche && ` • Manche #${activeManche.mancheNumber} en cours`}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    {!activeGame && (
                      <Button onClick={() => startNewGame()} className="gap-2 text-xs sm:text-sm">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nouvelle Partie</span>
                        <span className="sm:hidden">Nouvelle</span>
                      </Button>
                    )}
                    {activeGame && !activeManche && (
                      <>
                        <Button onClick={startNewManche} className="gap-2 text-xs sm:text-sm">
                          <Plus className="h-4 w-4" />
                          <span>Nouvelle Manche</span>
                        </Button>
                        <Button variant="destructive" onClick={() => setShowEndGameDialog(true)} className="gap-2 text-xs sm:text-sm">
                          <Square className="h-4 w-4" />
                          <span>Terminer Partie</span>
                        </Button>
                      </>
                    )}
                    {activeManche && (
                      <>
                        <Button variant="outline" onClick={removeLastNumber} className="gap-2 text-xs sm:text-sm">
                          <Undo2 className="h-4 w-4" />
                          <span>Annuler</span>
                        </Button>
                        <Button variant="secondary" onClick={() => setShowEndMancheDialog(true)} className="gap-2 text-xs sm:text-sm">
                          <Square className="h-4 w-4" />
                          <span>Fin Manche</span>
                        </Button>
                        <Button variant="destructive" onClick={() => setShowEndGameDialog(true)} className="gap-2 text-xs sm:text-sm">
                          <Square className="h-4 w-4" />
                          <span className="hidden sm:inline">Terminer Partie</span>
                          <span className="sm:hidden">Fin</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              {activeManche && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Numéros tirés</div>
                      <div className="text-2xl font-bold">{activeManche.numbers.length}/90</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Progression</div>
                      <div className="text-2xl font-bold">
                        {((activeManche.numbers.length / 90) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Dernier numéro</div>
                      <div className="text-2xl font-bold text-primary">
                        {activeManche.numbers[activeManche.numbers.length - 1] || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Milestone Buttons */}
                  <div className="border-t pt-4 flex flex-col gap-3">
                    <div className="text-sm font-medium">Marquer un gain :</div>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                      {/* Quine Button */}
                      {activeManche.quineAt ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-chart-1/10 border-chart-1/30 text-chart-1 hover:bg-chart-1/20"
                            onClick={() => editMilestonePosition('quine', activeManche.quineAt!, 'de la Quine')}
                          >
                            <span>✓ Quine au {activeManche.quineAt}ème</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => clearMilestone('quine')}
                            title="Supprimer"
                          >
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => markMilestone('quine')}
                          disabled={activeManche.numbers.length === 0}
                        >
                          <Target className="h-4 w-4" /> Quine
                        </Button>
                      )}

                      {/* 2ème Quine Button */}
                      {activeManche.deuxiemeQuineAt ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-chart-2/10 border-chart-2/30 text-chart-2 hover:bg-chart-2/20"
                            onClick={() => editMilestonePosition('deuxieme-quine', activeManche.deuxiemeQuineAt!, 'de la 2ème Quine')}
                          >
                            <span>✓ 2ème Quine au {activeManche.deuxiemeQuineAt}ème</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => clearMilestone('deuxieme-quine')}
                            title="Supprimer"
                          >
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => markMilestone('deuxieme-quine')}
                          disabled={activeManche.numbers.length === 0}
                        >
                          <Target className="h-4 w-4" /> 2ème Quine
                        </Button>
                      )}

                      {/* Double Quine Button */}
                      {activeManche.doubleQuineAt ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-chart-4/10 border-chart-4/30 text-chart-4 hover:bg-chart-4/20"
                            onClick={() => editMilestonePosition('double-quine', activeManche.doubleQuineAt!, 'de la Double Quine')}
                          >
                            <span>✓ Double Quine au {activeManche.doubleQuineAt}ème</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => clearMilestone('double-quine')}
                            title="Supprimer"
                          >
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => markMilestone('double-quine')}
                          disabled={activeManche.numbers.length === 0}
                        >
                          <Medal className="h-4 w-4" /> Double Quine
                        </Button>
                      )}

                      {/* Carton Plein Button */}
                      {activeManche.cartonPleinAt ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-chart-5/10 border-chart-5/30 text-chart-5 hover:bg-chart-5/20"
                            onClick={() => editMilestonePosition('carton-plein', activeManche.cartonPleinAt!, 'du Carton Plein')}
                          >
                            <span>✓ Carton Plein au {activeManche.cartonPleinAt}ème</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => clearMilestone('carton-plein')}
                            title="Supprimer"
                          >
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => markMilestone('carton-plein')}
                          disabled={activeManche.numbers.length === 0}
                        >
                          <Trophy className="h-4 w-4" /> Carton Plein
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cliquez pour marquer un gain au numéro actuel ({activeManche.numbers.length}).
                      Une fois marqué, cliquez à nouveau sur le badge pour modifier la position.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Number Grid */}
            <NumberGrid
              onNumberClick={handleNumberClick}
              drawnNumbers={activeManche?.numbers || []}
              allTimeFrequency={currentPartieFrequency}
              isActive={!!activeManche}
              darkMode={darkMode}
            />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle>
                      Statistiques de la
                      {selectedPartie && ` ${selectedPartie.name}`}
                    </CardTitle>
                    <CardDescription>
                      {selectedPartie
                        ? `${selectedPartie.manches.length} manche(s)`
                        : 'Sélectionnez une partie pour voir ses statistiques'
                      }
                    </CardDescription>
                  </div>
                  {globalStats.games.length > 0 && (
                    <select
                      value={selectedPartieId || selectedPartie?.id || ''}
                      onChange={(e) => setSelectedPartieId(e.target.value || null)}
                      className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                    >
                      {globalStats.games.map((game) => (
                        <option key={game.id} value={game.id}>
                          {game.name} ({game.manches.length} manche{game.manches.length > 1 ? 's' : ''})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </CardHeader>
              {selectedPartie && (
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total tirages</p>
                      <p className="text-2xl font-bold">{stats.totalNumbersDrawn}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total manches</p>
                      <p className="text-2xl font-bold">{stats.totalManches}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Moyenne / manche</p>
                      <p className="text-2xl font-bold">{stats.averageNumbersPerManche.toFixed(1)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">N° le plus fréquent</p>
                      <p className="text-2xl font-bold">{stats.mostFrequentNumber || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Charts */}
            {selectedPartie && selectedPartie.manches.length > 0 ? (
              <div className="space-y-8">

                {/* Section: Statistiques clés pour le jeu */}
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    Analyse des Gains
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6 h-full">
                        <QuineTimelineChart partie={selectedPartie} darkMode={darkMode} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 h-full">
                        <TimingStatsCard timingStats={stats.timingStats} darkMode={darkMode} />
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardContent className="pt-6 h-full">
                      <QuineStatsCard quineStats={stats.quineStats} darkMode={darkMode} />
                    </CardContent>
                  </Card>
                </div>

                {/* Section: Analyse des numéros (crucial pour loto) */}
                <div className="flex flex-col gap-4 pt-4 border-t">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    Analyse des Numéros
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6 h-full">
                        <ColumnDistributionChart data={stats.frequencyData} darkMode={darkMode} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 h-full">
                        <GapAnalysisCard gapStats={stats.gapStats} darkMode={darkMode} />
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Section: Fréquences et tendances */}
                <div className="flex flex-col gap-4 pt-4 border-t">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    Fréquences et Tendances
                  </h2>
                  <Card>
                    <CardContent className="pt-6 h-full">
                      <FrequencyBarChart data={stats.frequencyData} darkMode={darkMode} />
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                    <Card>
                      <CardContent className="pt-6 h-full">
                        <TopFlopList
                          topNumbers={stats.topNumbers}
                          flopNumbers={stats.flopNumbers}
                          darkMode={darkMode}
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 h-full">
                        <Heatmap data={stats.frequencyData} darkMode={darkMode} />
                      </CardContent>
                    </Card>
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                {!selectedPartie && globalStats.games.length > 0 ? (
                  <ActivateGameHint
                    onNavigateToParties={() => setActiveTab('parties')}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      {selectedPartie
                        ? 'Aucune manche enregistrée pour cette partie. Créez une nouvelle manche pour voir les statistiques.'
                        : 'Aucune partie disponible. Créez votre première partie pour voir les statistiques.'
                      }
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Parties Tab */}
          <TabsContent value="parties" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Liste des Parties</CardTitle>
              </CardHeader>
              <CardContent>
                {globalStats.games.length === 0 ? (
                  <p className="text-muted-foreground">
                    Aucune partie enregistrée. Créez votre première partie !
                  </p>
                ) : (
                  <div className="space-y-4">
                    {globalStats.games.map((game) => {
                      const totalNumbersInPartie = game.manches.reduce(
                        (sum, manche) => sum + manche.numbers.length,
                        0
                      );
                      return (
                        <Card key={game.id}>
                          <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div className="flex-1">
                                <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                                  <span>{game.name}</span>
                                  {game.isActive && (
                                    <Badge variant="default">
                                      Active
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription>
                                  {new Date(game.date).toLocaleDateString('fr-FR')} •{' '}
                                  {game.manches.length} manche(s) • {totalNumbersInPartie} numéros
                                </CardDescription>
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                                {!game.isActive && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => resumeGame(game.id)}
                                    className="gap-2 flex-1 sm:flex-initial"
                                  >
                                    <Target className="h-4 w-4" />
                                    <span>Continuer</span>
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRenameGame(game.id, game.name)}
                                  className="gap-2"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">Renommer</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteGame(game.id)}
                                  className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">Supprimer</span>
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          {game.manches.length > 0 && (
                            <CardContent>
                              <div className="text-sm text-muted-foreground flex flex-col gap-2">
                                <div className="font-semibold">Manches:</div>
                                <div className="space-y-3">
                                  {game.manches.map((manche) => (
                                    <div key={manche.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                      <div className="flex items-center gap-4">
                                        <span className={manche.isActive ? "text-green-600 dark:text-green-500 font-semibold" : ""}>
                                          Manche #{manche.mancheNumber}
                                        </span>
                                        <span className="text-foreground font-medium">
                                          {manche.numbers.length} numéros
                                        </span>
                                      </div>
                                      <MancheMilestones manche={manche} compact />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold">Apparence</h3>
                  <Button variant="outline" onClick={toggleTheme} className="gap-2 w-fit">
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    Mode {darkMode ? 'Clair' : 'Sombre'}
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="font-semibold">Aide</h3>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-medium">Tutoriel interactif</h4>
                    <p className="text-xs text-muted-foreground">
                      Besoin d'aide pour utiliser l'application ? Lancez le tutoriel guidé.
                    </p>
                    <Button
                      variant="outline"
                      onClick={startTutorial}
                      className="gap-2 w-fit"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Lancer le tutoriel
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t pt-4">
                  <h3 className="font-semibold">Données</h3>
                  <p className="text-sm text-muted-foreground">
                    Parties enregistrées : {globalStats.totalGamesPlayed}
                  </p>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-medium">Exporter les données</h4>
                      <p className="text-xs text-muted-foreground">
                        Téléchargez toutes vos parties au format JSON pour sauvegarde ou transfert.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleExportData}
                        className="gap-2 w-fit"
                        disabled={globalStats.games.length === 0}
                      >
                        <Download className="h-4 w-4" />
                        Exporter les données
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h4 className="text-sm font-medium">Importer des données</h4>
                      <p className="text-xs text-muted-foreground">
                        Importez des parties depuis un fichier JSON.
                        {globalStats.games.length > 0 && (
                          <> Les données existantes peuvent être fusionnées ou remplacées.</>
                        )}
                      </p>
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          accept=".json,application/json"
                          onChange={handleImportFile}
                          className="hidden"
                          id="import-file-input"
                        />
                        <label htmlFor="import-file-input">
                          <Button variant="outline" className="gap-2" asChild>
                            <span>
                              <Upload className="h-4 w-4" />
                              Importer des données
                            </span>
                          </Button>
                        </label>
                        {globalStats.games.length > 0 && (
                          <p className="text-xs text-amber-600 dark:text-amber-500">
                            ⚠️ Lors de l'import, vous pourrez choisir de fusionner ou remplacer vos données existantes.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t pt-4">
                      <h4 className="text-sm font-medium">Charger une partie démo</h4>
                      <p className="text-xs text-muted-foreground">
                        Chargez une partie démo avec 10 réelee manches complètes pour tester l'application.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleLoadDemo}
                        className="gap-2 w-fit"
                      >
                        <Target className="h-4 w-4" />
                        Charger la démo
                      </Button>
                      {globalStats.games.length > 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-500">
                          ⚠️ Cela remplacera toutes vos données actuelles.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          </MotionTabsContents>
        </Tabs>
      </main>

      {/* End Manche Confirmation Dialog */}
      <AlertDialog open={showEndMancheDialog} onOpenChange={setShowEndMancheDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminer la manche ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de terminer la manche #{activeManche?.mancheNumber}.
              {activeManche && (
                <div className="mt-2 space-y-1">
                  <p className="font-medium">Résumé :</p>
                  <ul className="list-disc list-inside text-sm">
                    <li>{activeManche.numbers.length} numéros tirés</li>
                    {activeManche.quineAt && <li>Quine au {activeManche.quineAt}ème</li>}
                    {activeManche.deuxiemeQuineAt && <li>2ème Quine au {activeManche.deuxiemeQuineAt}ème</li>}
                    {activeManche.doubleQuineAt && <li>Double Quine au {activeManche.doubleQuineAt}ème</li>}
                    {activeManche.cartonPleinAt && <li>Carton Plein au {activeManche.cartonPleinAt}ème</li>}
                  </ul>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndMancheConfirm}>
              Terminer la manche
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* End Game Confirmation Dialog */}
      <AlertDialog open={showEndGameDialog} onOpenChange={setShowEndGameDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminer la partie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous êtes sur le point de terminer la partie "{activeGame?.name}".
              {activeGame && (
                <div className="mt-2 space-y-1">
                  <p className="font-medium">Résumé :</p>
                  <ul className="list-disc list-inside text-sm">
                    <li>{activeGame.manches.length} manche(s) jouée(s)</li>
                    {activeManche && activeManche.numbers.length > 0 && (
                      <li className="text-amber-600 dark:text-amber-500">
                        ⚠️ Manche #{activeManche.mancheNumber} en cours avec {activeManche.numbers.length} numéro(s) sera également terminée
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndGameConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Terminer la partie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tutorial */}
      {showTutorial && (
        <Tutorial
          onClose={closeTutorial}
          onTabChange={setActiveTab}
        />
      )}
    </div >
  );
}

export default App;
