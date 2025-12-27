# Quick Start Guide - Parties Components

## Installation
These components are already integrated into your project with all required dependencies.

## Import Components
```tsx
import { PartiesList, PartyCard, PartyDetails } from './components/parties';
```

## Minimal Example
```tsx
import React, { useState } from 'react';
import { PartiesList, PartyDetails } from './components/parties';
import { LotoGame } from './types/game';

function App() {
  const [games, setGames] = useState<LotoGame[]>([
    {
      id: '1',
      name: 'Ma première partie',
      date: '2025-12-27',
      startTime: '2025-12-27T19:00:00Z',
      numbers: [1, 5, 12, 23],
      isActive: true,
    }
  ]);

  const [selectedGame, setSelectedGame] = useState<LotoGame | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div>
      {/* List of all games */}
      <PartiesList
        games={games}
        onSelectGame={setSelectedGame}
        onDeleteGame={(game) => {
          setGames(games.filter(g => g.id !== game.id));
        }}
        darkMode={darkMode}
      />

      {/* Detail modal (when a game is selected) */}
      {selectedGame && (
        <PartyDetails
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
```

## Component Props Quick Reference

### PartiesList
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `games` | `LotoGame[]` | Yes | Array of all games |
| `onSelectGame` | `(game: LotoGame) => void` | Yes | Called when game clicked |
| `onResumeGame` | `(game: LotoGame) => void` | No | Called when resume clicked |
| `onDeleteGame` | `(game: LotoGame) => void` | No | Called when delete clicked |
| `darkMode` | `boolean` | No | Enable dark theme |

### PartyCard
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `game` | `LotoGame` | Yes | Game to display |
| `onClick` | `(game: LotoGame) => void` | Yes | Called when card clicked |
| `onResume` | `(game: LotoGame) => void` | No | Called when resume clicked |
| `onDelete` | `(game: LotoGame) => void` | No | Called when delete clicked |
| `darkMode` | `boolean` | No | Enable dark theme |

### PartyDetails
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `game` | `LotoGame` | Yes | Game to display |
| `onClose` | `() => void` | Yes | Called when modal closed |
| `onExport` | `(game: LotoGame) => void` | No | Called when export clicked |
| `darkMode` | `boolean` | No | Enable dark theme |

## Common Use Cases

### 1. Display All Games
```tsx
<PartiesList
  games={allGames}
  onSelectGame={(game) => console.log(game)}
  darkMode={false}
/>
```

### 2. With Resume & Delete
```tsx
<PartiesList
  games={allGames}
  onSelectGame={handleViewDetails}
  onResumeGame={handleResume}
  onDeleteGame={handleDelete}
  darkMode={true}
/>
```

### 3. Single Card Display
```tsx
<PartyCard
  game={myGame}
  onClick={handleClick}
  onResume={handleResume}
  onDelete={handleDelete}
  darkMode={false}
/>
```

### 4. Details Modal with Export
```tsx
<PartyDetails
  game={selectedGame}
  onClose={handleClose}
  onExport={(game) => {
    const json = JSON.stringify(game);
    // Download logic here
  }}
  darkMode={true}
/>
```

## Features Overview

### PartiesList Features
- Grid/List view toggle
- Search by game name
- Sort by date, name, or numbers drawn
- Shows total, active, and completed counts
- Responsive layout

### PartyCard Features
- Game name and date
- Progress bar (X/90 numbers)
- Duration display
- "En cours" badge for active games
- Resume and Delete buttons

### PartyDetails Features
- Complete game statistics
- Numbers drawn timeline
- Decade distribution chart
- Export functionality
- Modal overlay

## Styling

All components support:
- Light/Dark mode via `darkMode` prop
- Tailwind CSS classes
- Responsive design (mobile/tablet/desktop)
- Smooth animations
- Accessible ARIA labels

## File Locations

```
/home/val34/loto-stats/src/components/parties/
├── PartiesList.tsx    # Main list component
├── PartyCard.tsx      # Individual card
├── PartyDetails.tsx   # Detail modal
├── index.ts           # Exports
├── types.ts           # TypeScript types
└── Example.tsx        # Full examples
```

## Next Steps

1. See `README.md` for detailed documentation
2. See `Example.tsx` for complete integration examples
3. See `FEATURES.md` for comprehensive feature list
4. Import and use in your app!

## Tips

- Always provide a unique `id` for each game
- Use ISO date strings for `date`, `startTime`, `endTime`
- Handle the `onClose` callback to hide PartyDetails
- Use the `darkMode` prop consistently across components
- The `onResumeGame` callback should update the game's `isActive` state
- Confirmation dialogs are built-in for delete actions

## Support

For questions or issues:
1. Check the README.md
2. Review Example.tsx
3. Inspect component source code
4. Verify prop types match expectations
