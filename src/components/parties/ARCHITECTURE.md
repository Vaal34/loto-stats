# Architecture Overview

## Component Hierarchy

```
App (Your main component)
│
├── PartiesList
│   │
│   ├── Search Bar
│   ├── View Mode Toggle (Grid/List)
│   ├── Sort Buttons (Date/Name/Numbers)
│   │
│   └── Multiple PartyCard instances
│       │
│       ├── Game Info (Name, Date, Duration)
│       ├── Progress Bar
│       ├── Status Badge ("En cours")
│       └── Action Buttons
│           ├── Resume Button (if completed)
│           └── Delete Button
│
└── PartyDetails (Modal - conditional render)
    │
    ├── Header (Sticky)
    │   ├── Game Name & Date
    │   ├── Status Badge
    │   ├── Export Button
    │   └── Close Button
    │
    └── Content (Scrollable)
        │
        ├── Statistics Cards (4 cards)
        │   ├── Numbers Drawn
        │   ├── Duration
        │   ├── Start Time
        │   └── Average Time
        │
        ├── Progress Bar
        │
        ├── Decade Distribution (9 sections)
        │   └── 1-10, 11-20, ..., 81-90
        │
        └── Numbers Timeline
            └── All drawn numbers with position badges
```

---

## Data Flow

```
                   ┌─────────────────────┐
                   │   App Component     │
                   │  (Your main app)    │
                   └──────────┬──────────┘
                              │
                              │ games: LotoGame[]
                              │ onSelectGame()
                              │ onResumeGame()
                              │ onDeleteGame()
                              │
                ┌─────────────┴──────────────┐
                │                            │
                │                            │
       ┌────────▼────────┐          ┌───────▼────────┐
       │  PartiesList    │          │ PartyDetails   │
       │   Component     │          │   Component    │
       └────────┬────────┘          │   (Modal)      │
                │                   └────────────────┘
                │
                │ Renders multiple:
                │
       ┌────────▼────────┐
       │   PartyCard     │ (repeated for each game)
       │   Component     │
       └─────────────────┘
```

---

## State Management

### Parent Component (App) - Recommended State

```typescript
const [games, setGames] = useState<LotoGame[]>([]);
const [selectedGame, setSelectedGame] = useState<LotoGame | null>(null);
const [darkMode, setDarkMode] = useState(false);
```

### PartiesList - Internal State

```typescript
const [searchQuery, setSearchQuery] = useState('');
const [sortField, setSortField] = useState<SortField>('date');
const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
const [viewMode, setViewMode] = useState<ViewMode>('grid');
```

### PartyCard - No Internal State
- Fully controlled by parent props

### PartyDetails - Internal State

```typescript
const decadeStats = useMemo(() => { /* calculation */ }, [game.numbers]);
const numbersGrid = useMemo(() => { /* calculation */ }, [game.numbers]);
const avgTimeBetweenDraws = useMemo(() => { /* calculation */ }, [duration]);
```

---

## Event Flow

### User Interaction Flow

```
User Action                  Component              Handler              Parent Action
───────────                  ─────────              ───────              ─────────────

Click game card      →       PartyCard      →       onClick()      →     setSelectedGame(game)
                                                                          (opens PartyDetails)

Click resume        →        PartyCard      →       onResume()     →     Update game.isActive = true

Click delete        →        PartyCard      →       onDelete()     →     Remove from games array
                                                     (with confirm)

Click export        →        PartyDetails   →       onExport()     →     Download JSON file

Click close         →        PartyDetails   →       onClose()      →     setSelectedGame(null)

Search input        →        PartiesList    →       (internal)     →     Filter games locally

Change sort         →        PartiesList    →       (internal)     →     Sort games locally

Toggle view         →        PartiesList    →       (internal)     →     Switch grid/list
```

---

## Props Interface

### PartiesList Props
```typescript
interface PartiesListProps {
  games: LotoGame[];                        // Data in
  onSelectGame: (game: LotoGame) => void;   // Event out
  onResumeGame?: (game: LotoGame) => void;  // Event out
  onDeleteGame?: (game: LotoGame) => void;  // Event out
  darkMode?: boolean;                       // Config in
}
```

### PartyCard Props
```typescript
interface PartyCardProps {
  game: LotoGame;                        // Data in
  onClick: (game: LotoGame) => void;     // Event out
  onResume?: (game: LotoGame) => void;   // Event out
  onDelete?: (game: LotoGame) => void;   // Event out
  darkMode?: boolean;                    // Config in
}
```

### PartyDetails Props
```typescript
interface PartyDetailsProps {
  game: LotoGame;                        // Data in
  onExport?: (game: LotoGame) => void;   // Event out
  onClose: () => void;                   // Event out
  darkMode?: boolean;                    // Config in
}
```

---

## Component Responsibilities

### PartiesList
**Responsibilities:**
- Display all games
- Handle search/filter
- Handle sorting
- Handle view mode (grid/list)
- Delegate individual game rendering to PartyCard
- Manage local UI state (search, sort, view)

**Does NOT:**
- Modify game data
- Store games
- Handle game CRUD operations
- Manage dark mode state

---

### PartyCard
**Responsibilities:**
- Display single game info
- Calculate and format duration
- Format dates
- Show progress bar
- Provide action buttons
- Handle click events

**Does NOT:**
- Modify game data
- Store game state
- Make decisions about resume/delete
- Manage visibility

---

### PartyDetails
**Responsibilities:**
- Display comprehensive game statistics
- Calculate decade distribution
- Format numbers timeline
- Provide export functionality
- Modal overlay behavior
- Close on backdrop click

**Does NOT:**
- Modify game data
- Store game state
- Persist to storage
- Navigate to other views

---

## Data Dependencies

### External Dependencies
```typescript
import { LotoGame } from '../../types/game';  // All components
import { format, formatDistanceToNow } from 'date-fns';  // PartyCard, PartyDetails
import { fr } from 'date-fns/locale';  // PartyCard, PartyDetails
```

### Internal Dependencies
```typescript
import PartyCard from './PartyCard';  // PartiesList only
```

### Icon Dependencies
```typescript
// PartiesList
import { Search, SortAsc, SortDesc, Grid3x3, List, Calendar, Hash, BarChart3 } from 'lucide-react';

// PartyCard
import { Play, Trash2, Clock, Calendar } from 'lucide-react';

// PartyDetails
import { X, Download, Clock, Calendar, Hash, TrendingUp, Activity } from 'lucide-react';
```

---

## Rendering Logic

### PartiesList Render Flow
```
1. Filter games by search query
2. Sort games by selected field/order
3. Map to PartyCard components
4. Render in grid or list layout
```

### PartyCard Render Flow
```
1. Calculate progress (numbers.length / 90)
2. Calculate duration (endTime - startTime or now - startTime)
3. Format duration (smart h/m/s formatting)
4. Render card with all info
5. Show/hide buttons based on isActive
```

### PartyDetails Render Flow
```
1. Calculate decade statistics (memoized)
2. Create numbers grid (10 per row, memoized)
3. Calculate average time (memoized)
4. Render modal with all sections
5. Handle scroll in content area
```

---

## CSS/Styling Architecture

### Tailwind Classes
- Responsive: `sm:`, `md:`, `lg:` prefixes
- Layout: `flex`, `grid`, `gap-*`
- Spacing: `p-*`, `m-*`, `gap-*`
- Typography: `text-*`, `font-*`
- Interactions: `hover:`, `active:`, `focus:`
- Animations: `transition-*`, `duration-*`, `animate-pulse`

### Inline Styles
- Dynamic colors (dark mode)
- Progress bar widths
- Background colors
- Text colors
- Border colors

### Animation Classes
```css
transition-all duration-200  /* Smooth transitions */
hover:scale-105              /* Hover grow */
active:scale-95              /* Click shrink */
animate-pulse                /* Badge pulse */
```

---

## Memory/Performance Considerations

### Optimizations Implemented
- `useMemo` for expensive calculations
- Event handler optimization (no inline functions)
- Efficient filtering/sorting
- Conditional rendering
- Proper React keys

### Potential Bottlenecks
- Large game lists (100+) may need virtualization
- Sorting large arrays could be slow
- Multiple modals could impact performance

### Recommendations
- For 1000+ games: Add virtual scrolling
- For complex filters: Debounce search input
- For animations: Use CSS transforms only

---

## Integration Pattern

### Recommended Integration
```typescript
function App() {
  // 1. State management
  const [games, setGames] = useState<LotoGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<LotoGame | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // 2. Load data (useEffect)
  useEffect(() => {
    const saved = localStorage.getItem('games');
    if (saved) setGames(JSON.parse(saved));
  }, []);

  // 3. Save data (useEffect)
  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  // 4. Event handlers
  const handleSelectGame = (game: LotoGame) => setSelectedGame(game);
  const handleResumeGame = (game: LotoGame) => { /* ... */ };
  const handleDeleteGame = (game: LotoGame) => { /* ... */ };
  const handleExportGame = (game: LotoGame) => { /* ... */ };

  // 5. Render
  return (
    <div>
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
```

---

## File Locations

```
/home/val34/loto-stats/src/
│
├── types/
│   └── game.ts                    # LotoGame interface
│
└── components/
    └── parties/
        ├── PartiesList.tsx        # Main list component
        ├── PartyCard.tsx          # Card component
        ├── PartyDetails.tsx       # Modal component
        ├── index.ts               # Exports
        ├── types.ts               # Local types
        ├── Example.tsx            # Examples
        └── *.md                   # Documentation
```

---

## Testing Strategy

### Unit Tests
```typescript
// PartiesList.test.tsx
- Renders with empty games array
- Renders with multiple games
- Filters games by search query
- Sorts games by date/name/numbers
- Toggles view mode
- Calls callbacks on actions

// PartyCard.test.tsx
- Renders game information
- Calculates progress correctly
- Formats duration correctly
- Shows/hides buttons based on isActive
- Calls onClick/onResume/onDelete

// PartyDetails.test.tsx
- Renders game statistics
- Calculates decade distribution
- Renders numbers timeline
- Calls onExport/onClose
- Closes on backdrop click
```

### Integration Tests
```typescript
- Full user flow: list → click → details → close
- Search → sort → select game
- Resume game → verify state update
- Delete game → confirm → verify removal
```

---

## Extensibility

### Easy to Add
- New sort fields (add to SortField type)
- New filters (add state + logic)
- Custom themes (extend darkMode logic)
- Additional actions (add callbacks)

### Moderate Effort
- Multiple selection
- Bulk operations
- Advanced filtering
- Custom layouts

### Requires Refactoring
- Real-time collaboration
- Backend integration
- Complex state management
- Offline sync

---

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Unidirectional data flow
- ✅ Reusable components
- ✅ Type-safe interfaces
- ✅ Performance optimization
- ✅ Easy testing
- ✅ Maintainable code

**Ready for production use!**
