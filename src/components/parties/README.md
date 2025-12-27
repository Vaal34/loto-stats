# Parties Components

This directory contains React TypeScript components for managing and displaying Loto game parties.

## Components

### 1. PartiesList
Main component for displaying all games (active + completed) with filtering and sorting capabilities.

**Features:**
- Grid or list view toggle
- Search/filter by game name
- Sort by date, name, or numbers drawn
- Visual stats for active vs completed games
- Responsive design

**Props:**
```typescript
interface PartiesListProps {
  games: LotoGame[];                    // Array of all games
  onSelectGame: (game: LotoGame) => void;  // Called when clicking a game
  onResumeGame?: (game: LotoGame) => void; // Called when resuming a game
  onDeleteGame?: (game: LotoGame) => void; // Called when deleting a game
  darkMode?: boolean;                      // Dark mode toggle
}
```

**Example:**
```tsx
import { PartiesList } from './components/parties';

function App() {
  const [games, setGames] = useState<LotoGame[]>([]);

  const handleSelectGame = (game: LotoGame) => {
    console.log('Selected game:', game);
  };

  const handleResumeGame = (game: LotoGame) => {
    // Resume game logic
  };

  const handleDeleteGame = (game: LotoGame) => {
    setGames(games.filter(g => g.id !== game.id));
  };

  return (
    <PartiesList
      games={games}
      onSelectGame={handleSelectGame}
      onResumeGame={handleResumeGame}
      onDeleteGame={handleDeleteGame}
      darkMode={true}
    />
  );
}
```

### 2. PartyCard
Individual card component for displaying a single game's information.

**Features:**
- Visual progress bar
- Game status badge (En cours)
- Duration and date display
- Action buttons (Resume, Delete)
- Hover animations

**Props:**
```typescript
interface PartyCardProps {
  game: LotoGame;                        // Game to display
  onClick: (game: LotoGame) => void;     // Called when clicking the card
  onResume?: (game: LotoGame) => void;   // Called when clicking resume
  onDelete?: (game: LotoGame) => void;   // Called when clicking delete
  darkMode?: boolean;                    // Dark mode toggle
}
```

**Example:**
```tsx
import { PartyCard } from './components/parties';

function GamesList() {
  const game: LotoGame = {
    id: '123',
    name: 'Soirée du vendredi',
    date: '2025-12-27',
    startTime: '2025-12-27T19:00:00Z',
    numbers: [1, 5, 12, 23, 34],
    isActive: true
  };

  return (
    <PartyCard
      game={game}
      onClick={(g) => console.log('Clicked:', g)}
      onResume={(g) => console.log('Resume:', g)}
      onDelete={(g) => console.log('Delete:', g)}
      darkMode={false}
    />
  );
}
```

### 3. PartyDetails
Detailed modal view of a single game with comprehensive statistics.

**Features:**
- Full game statistics
- Numbers drawn timeline with position indicators
- Distribution by decade (1-10, 11-20, etc.)
- Duration and average time per number
- Export functionality
- Modal overlay with close button

**Props:**
```typescript
interface PartyDetailsProps {
  game: LotoGame;                      // Game to display
  onExport?: (game: LotoGame) => void; // Called when clicking export
  onClose: () => void;                 // Called when closing the modal
  darkMode?: boolean;                  // Dark mode toggle
}
```

**Example:**
```tsx
import { PartyDetails } from './components/parties';

function GameView() {
  const [selectedGame, setSelectedGame] = useState<LotoGame | null>(null);

  const handleExport = (game: LotoGame) => {
    const data = JSON.stringify(game, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${game.name}.json`;
    a.click();
  };

  return (
    <>
      {selectedGame && (
        <PartyDetails
          game={selectedGame}
          onExport={handleExport}
          onClose={() => setSelectedGame(null)}
          darkMode={true}
        />
      )}
    </>
  );
}
```

## Dependencies

These components use the following dependencies:
- **react** - Component framework
- **lucide-react** - Icons (Trash2, Play, Download, Clock, Calendar, etc.)
- **date-fns** - Date formatting and manipulation
- **tailwindcss** - Utility-first CSS framework

## Types

All components use types from `src/types/game.ts`:
- `LotoGame` - Main game interface
- Additional types for statistics and validation

## Styling

Components support:
- Dark mode via `darkMode` prop
- Tailwind CSS responsive classes
- Smooth animations and transitions
- Accessible ARIA labels
- Touch-friendly button sizes

## Accessibility

All components include:
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure
- Confirmation dialogs for destructive actions

## Responsive Design

Components are fully responsive:
- Mobile-first approach
- Grid layouts adapt to screen size
- Touch-friendly interactive elements
- Optimized for tablets and desktops
