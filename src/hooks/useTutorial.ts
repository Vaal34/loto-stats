import { useState, useEffect } from 'react';

const TUTORIAL_KEY = 'loto-stats-tutorial-completed';
const TUTORIAL_DISMISSED_KEY = 'loto-stats-tutorial-dismissed';

interface UseTutorialReturn {
  showTutorial: boolean;
  shouldShowTutorial: boolean;
  startTutorial: () => void;
  closeTutorial: () => void;
  resetTutorial: () => void;
}

/**
 * Hook to manage tutorial state and persistence
 */
export function useTutorial(): UseTutorialReturn {
  const [showTutorial, setShowTutorial] = useState(false);
  const [shouldShowTutorial, setShouldShowTutorial] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TUTORIAL_KEY) === 'true';
    const dismissed = localStorage.getItem(TUTORIAL_DISMISSED_KEY) === 'true';

    // Show tutorial automatically if not completed and not dismissed
    if (!completed && !dismissed) {
      setShouldShowTutorial(true);
      setShowTutorial(true);
    }
  }, []);

  const startTutorial = () => {
    setShowTutorial(true);
    localStorage.removeItem(TUTORIAL_DISMISSED_KEY);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem(TUTORIAL_KEY, 'true');
    setShouldShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_KEY);
    localStorage.removeItem(TUTORIAL_DISMISSED_KEY);
    setShouldShowTutorial(true);
    setShowTutorial(true);
  };

  return {
    showTutorial,
    shouldShowTutorial,
    startTutorial,
    closeTutorial,
    resetTutorial,
  };
}
