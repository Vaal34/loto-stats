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
  Upload
} from 'lucide-react';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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

function App() {
  const [theme, toggleTheme] = useTheme();

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

  const darkMode = theme === 'dark';

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

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Dice5 className="h-6 w-6" />
              Loto Stats
            </h1>
            {activeGame && (
              <p className="text-sm text-muted-foreground">
                {activeGame.name}
                {activeManche && ` • Manche #${activeManche.mancheNumber}`}
                {activeManche && ` • ${activeManche.numbers.length}/90 numéros`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
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
      </header>

      {/* Main Content with Tabs */}
      <main className="container px-4 py-6">
        <Tabs defaultValue="partie" className="w-full">
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

          {/* Partie Tab */}
          <TabsContent value="partie" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {activeGame ? activeGame.name : 'Aucune partie active'}
                    </CardTitle>
                    {activeGame && (
                      <CardDescription className="mt-1">
                        {activeGame.manches.length} manche(s)
                        {activeManche && ` • Manche #${activeManche.mancheNumber} en cours`}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
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
                        <Button variant="destructive" onClick={endGame} className="gap-2 text-xs sm:text-sm">
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
                        <Button variant="secondary" onClick={endManche} className="gap-2 text-xs sm:text-sm">
                          <Square className="h-4 w-4" />
                          <span>Fin Manche</span>
                        </Button>
                        <Button variant="destructive" onClick={endGame} className="gap-2 text-xs sm:text-sm">
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
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-3">Marquer un gain :</div>
                    <div className="flex flex-wrap gap-2">
                      {/* Quine Button */}
                      {activeManche.quineAt ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                          onClick={() => clearMilestone('quine')}
                        >
                          <span>✓ Quine au {activeManche.quineAt}ème</span>
                          <span className="text-xs">×</span>
                        </Button>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                          onClick={() => clearMilestone('deuxieme-quine')}
                        >
                          <span>✓ 2ème Quine au {activeManche.deuxiemeQuineAt}ème</span>
                          <span className="text-xs">×</span>
                        </Button>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300"
                          onClick={() => clearMilestone('double-quine')}
                        >
                          <span>✓ Double Quine au {activeManche.doubleQuineAt}ème</span>
                          <span className="text-xs">×</span>
                        </Button>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                          onClick={() => clearMilestone('carton-plein')}
                        >
                          <span>✓ Carton Plein au {activeManche.cartonPleinAt}ème</span>
                          <span className="text-xs">×</span>
                        </Button>
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
                    <p className="text-xs text-muted-foreground mt-2">
                      Cliquez pour indiquer qu'un gain a été remporté au numéro actuel ({activeManche.numbers.length})
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Number Grid */}
            <NumberGrid
              onNumberClick={handleNumberClick}
              drawnNumbers={activeManche?.numbers || []}
              allTimeFrequency={globalStats.allTimeFrequency}
              isActive={!!activeManche}
              darkMode={darkMode}
            />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Statistiques de la partie
                      {selectedPartie && ` - ${selectedPartie.name}`}
                    </CardTitle>
                    <CardDescription className="mt-1">
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
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
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
                <div className="space-y-4 pt-4 border-t">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
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
                <div className="space-y-4 pt-4 border-t">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    Fréquences et Tendances
                  </h2>
                  <Card className="mb-6">
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
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  {selectedPartie
                    ? 'Aucune manche enregistrée pour cette partie. Créez une nouvelle manche pour voir les statistiques.'
                    : 'Aucune partie disponible. Créez votre première partie pour voir les statistiques.'
                  }
                </CardContent>
              </Card>
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
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {game.name}
                                  {game.isActive && (
                                    <Badge className="ml-2" variant="default">
                                      En cours
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription>
                                  {new Date(game.date).toLocaleDateString('fr-FR')} •{' '}
                                  {game.manches.length} manche(s) • {totalNumbersInPartie} numéros
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          {game.manches.length > 0 && (
                            <CardContent>
                              <div className="text-sm text-muted-foreground">
                                <div className="font-semibold mb-2">Manches:</div>
                                <div className="space-y-1">
                                  {game.manches.map((manche) => (
                                    <div key={manche.id} className="flex justify-between items-center">
                                      <span>
                                        Manche #{manche.mancheNumber}
                                        {manche.isActive && (
                                          <Badge className="ml-1 text-xs" variant="secondary">
                                            En cours
                                          </Badge>
                                        )}
                                      </span>
                                      <span className="text-foreground font-medium">
                                        {manche.numbers.length} numéros
                                      </span>
                                      <MancheMilestones manche={manche} darkMode={darkMode} compact />
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
                <div>
                  <h3 className="font-semibold mb-2">Apparence</h3>
                  <Button variant="outline" onClick={toggleTheme} className="gap-2">
                    {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    Mode {darkMode ? 'Clair' : 'Sombre'}
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Données</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Parties enregistrées : {globalStats.totalGamesPlayed}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Exporter les données</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Téléchargez toutes vos parties au format JSON pour sauvegarde ou transfert.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleExportData}
                        className="gap-2"
                        disabled={globalStats.games.length === 0}
                      >
                        <Download className="h-4 w-4" />
                        Exporter les données
                      </Button>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Importer des données</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        Importez des parties depuis un fichier JSON.
                        {globalStats.games.length > 0 && (
                          <> Les données existantes peuvent être fusionnées ou remplacées.</>
                        )}
                      </p>
                      <div>
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
                      </div>
                      {globalStats.games.length > 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                          ⚠️ Lors de l'import, vous pourrez choisir de fusionner ou remplacer vos données existantes.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div >
  );
}

export default App;
