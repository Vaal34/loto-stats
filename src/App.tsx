/**
 * Main App component with shadcn/ui
 */

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGameState } from './hooks/useGameState';
import { useStats } from './hooks/useStats';
import { useTheme } from './hooks/useTheme';
import { GlobalStats, isGlobalStats } from './types/game';
import { initializeGlobalStats, saveGlobalStats } from './utils/storage';
import { AUTO_SAVE_INTERVAL, STORAGE_KEY } from './constants/config';

// Lucide Icons
import {
  Dice5,
  Sun,
  Moon,
  Target,
  BarChart3,
  ListChecks,
  Settings,
  Plus,
  Undo2,
  Square,
  Check,
  Clock
} from 'lucide-react';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

function App() {
  const [theme, toggleTheme] = useTheme();

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
                {activeGame.name} • {activeGame.numbers.length}/90 numéros
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
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {!activeGame && (
                      <Button onClick={() => startNewGame()} className="gap-2 text-xs sm:text-sm">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nouvelle Partie</span>
                        <span className="sm:hidden">Nouvelle</span>
                      </Button>
                    )}
                    {activeGame && (
                      <>
                        <Button variant="outline" onClick={removeLastNumber} className="gap-2 text-xs sm:text-sm">
                          <Undo2 className="h-4 w-4" />
                          <span>Annuler</span>
                        </Button>
                        <Button variant="destructive" onClick={endGame} className="gap-2 text-xs sm:text-sm">
                          <Square className="h-4 w-4" />
                          <span>Terminer</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>

              {activeGame && (
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Numéros tirés</div>
                      <div className="text-2xl font-bold">{activeGame.numbers.length}/90</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Progression</div>
                      <div className="text-2xl font-bold">
                        {((activeGame.numbers.length / 90) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Dernier numéro</div>
                      <div className="text-2xl font-bold text-primary">
                        {activeGame.numbers[activeGame.numbers.length - 1] || '-'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Number Grid */}
            <NumberGrid
              onNumberClick={handleNumberClick}
              drawnNumbers={activeGame?.numbers || []}
              allTimeFrequency={globalStats.allTimeFrequency}
              isActive={!!activeGame}
              darkMode={darkMode}
            />
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Globales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Parties jouées</p>
                    <p className="text-2xl font-bold">{globalStats.totalGamesPlayed}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total tirages</p>
                    <p className="text-2xl font-bold">{stats.totalNumbersDrawn}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Moyenne / partie</p>
                    <p className="text-2xl font-bold">{stats.averageNumbersPerGame.toFixed(1)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">N° le plus fréquent</p>
                    <p className="text-2xl font-bold">{stats.mostFrequentNumber || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <FrequencyBarChart data={stats.frequencyData} darkMode={darkMode} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Heatmap data={stats.frequencyData} darkMode={darkMode} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <TopFlopList
                    topNumbers={stats.topNumbers}
                    flopNumbers={stats.flopNumbers}
                    darkMode={darkMode}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <DecadeDistribution data={stats.decadeStats} darkMode={darkMode} />
                </CardContent>
              </Card>

              {stats.gameEvolution.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <EvolutionChart data={stats.gameEvolution} darkMode={darkMode} />
                  </CardContent>
                </Card>
              )}
            </div>
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
                    {globalStats.games.map((game) => (
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
                                {game.numbers.length}/90 numéros
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
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
                  <p className="text-sm text-muted-foreground">
                    Parties enregistrées : {globalStats.totalGamesPlayed}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
