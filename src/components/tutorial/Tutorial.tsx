import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, Target, BarChart3, ListChecks, Plus, Play } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tab?: string;
  highlight?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenue dans Loto Stats !',
    description: 'Cette application vous permet de suivre vos parties de loto et d\'analyser les statistiques de vos tirages. Suivez ce tutoriel pour découvrir toutes les fonctionnalités.',
    icon: <Target className="h-6 w-6" />,
  },
  {
    id: 'load-demo',
    title: 'Charger la partie démo (optionnel)',
    description: 'Pour tester l\'application avec des données, allez dans Paramètres et cliquez sur "Charger la démo". Cela charge une partie avec 10 manches complètes. ⚠️ Important : Après le chargement, n\'oubliez pas d\'activer la partie démo dans l\'onglet "Parties" pour voir ses statistiques !',
    icon: <Play className="h-6 w-6" />,
    tab: 'settings',
  },
  {
    id: 'create-game',
    title: 'Créer une nouvelle partie',
    description: 'Commencez par créer votre première partie. Cliquez sur "Nouvelle Partie" pour démarrer. Vous pouvez nommer votre partie (ex: "Soirée du vendredi").',
    icon: <Plus className="h-6 w-6" />,
    tab: 'partie',
    highlight: 'create-game-button',
  },
  {
    id: 'start-manche',
    title: 'Démarrer une manche',
    description: 'Une partie contient plusieurs manches. Après avoir créé une partie, cliquez sur "Nouvelle Manche" pour commencer à tirer des numéros.',
    icon: <Play className="h-6 w-6" />,
    tab: 'partie',
  },
  {
    id: 'draw-numbers',
    title: 'Tirer les numéros',
    description: 'Cliquez sur les numéros de 1 à 90 au fur et à mesure qu\'ils sont tirés. Les numéros sélectionnés apparaissent en surbrillance. Vous pouvez annuler le dernier numéro avec le bouton "Annuler".',
    icon: <Target className="h-6 w-6" />,
    tab: 'partie',
  },
  {
    id: 'mark-wins',
    title: 'Marquer les gains',
    description: 'Lorsqu\'un joueur gagne (Quine, Double Quine, Carton Plein), marquez-le immédiatement en cliquant sur le bouton correspondant. La position du tirage sera enregistrée automatiquement.',
    icon: <Target className="h-6 w-6" />,
    tab: 'partie',
  },
  {
    id: 'view-stats',
    title: 'Consulter les statistiques',
    description: 'Allez dans l\'onglet "Stats" pour voir l\'analyse détaillée de vos parties : fréquence des numéros, heatmap, timeline des gains, et bien plus encore.',
    icon: <BarChart3 className="h-6 w-6" />,
    tab: 'stats',
  },
  {
    id: 'parties-list',
    title: 'Liste des parties',
    description: 'Dans l\'onglet "Parties", vous pouvez voir toutes vos parties enregistrées. C\'est ici que vous pouvez activer une partie pour voir ses statistiques ou la continuer.',
    icon: <ListChecks className="h-6 w-6" />,
    tab: 'parties',
    highlight: 'parties-tab',
  },
  {
    id: 'activate-game',
    title: 'Activer une partie',
    description: '⚠️ Important : Pour voir les statistiques d\'une partie (y compris la démo !), vous devez d\'abord l\'activer. Allez dans l\'onglet "Parties", trouvez la partie souhaitée, et cliquez sur "Continuer". La partie devient active et vous pouvez consulter ses stats dans l\'onglet "Stats".',
    icon: <Play className="h-6 w-6" />,
    tab: 'parties',
    highlight: 'resume-game-button',
  },
  {
    id: 'complete',
    title: 'Vous êtes prêt !',
    description: 'Vous connaissez maintenant toutes les fonctionnalités principales. Bon jeu et que la chance soit avec vous ! 🎉',
    icon: <Target className="h-6 w-6" />,
  },
];

interface TutorialProps {
  onClose: () => void;
  onTabChange?: (tab: string) => void;
}

export default function Tutorial({ onClose, onTabChange }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const step = tutorialSteps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === tutorialSteps.length - 1;

  useEffect(() => {
    if (step.tab && onTabChange) {
      onTabChange(step.tab);
    }
  }, [step.tab, onTabChange]);

  const handleNext = () => {
    if (!isLast) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsMinimized(false)}
          className="gap-2 shadow-lg"
        >
          <Target className="h-4 w-4" />
          Reprendre le tutoriel ({currentStep + 1}/{tutorialSteps.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2">
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {step.icon}
              </div>
              <div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <CardDescription className="mt-1">
                  Étape {currentStep + 1} sur {tutorialSteps.length}
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8"
                title="Réduire"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="h-8 w-8"
                title="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-base leading-relaxed">{step.description}</p>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirst}
              size="icon"
              className="sm:w-auto sm:px-4"
              title="Précédent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Précédent</span>
            </Button>

            <div className="flex gap-2">
              {!isLast && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="hidden sm:inline-flex"
                >
                  Passer le tutoriel
                </Button>
              )}
              <Button
                onClick={handleNext}
                size="icon"
                className="sm:w-auto sm:px-4"
                title={isLast ? 'Terminer' : 'Suivant'}
              >
                <span className="hidden sm:inline mr-2">{isLast ? 'Terminer' : 'Suivant'}</span>
                {isLast ? <Target className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/50'
                    : 'w-2 bg-secondary'
                }`}
                aria-label={`Aller à l'étape ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
