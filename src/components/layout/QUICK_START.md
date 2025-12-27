# Layout Components - Quick Start Guide

## Installation (Already Done)
All components are ready to use. Dependencies are already installed in your project.

## Import

```typescript
import { Header, Navigation, TabBar, TabId } from './components/layout';
```

## Basic Setup (3 Steps)

### 1. Add State to Your App

```typescript
const [activeTab, setActiveTab] = useState<TabId>('game');
const [darkMode, setDarkMode] = useState(false);
const [activeGame, setActiveGame] = useState<LotoGame | undefined>();
```

### 2. Add Components to JSX

```tsx
<div className="min-h-screen flex flex-col" style={{ backgroundColor: darkMode ? '#1f2937' : '#f9fafb' }}>
  {/* Header */}
  <Header
    activeGame={activeGame}
    darkMode={darkMode}
    onToggleTheme={() => setDarkMode(!darkMode)}
  />

  {/* Desktop Navigation (hidden on mobile) */}
  <div className="hidden sm:block">
    <Navigation
      activeTab={activeTab}
      onTabChange={setActiveTab}
      darkMode={darkMode}
    />
  </div>

  {/* Your Content */}
  <main className="flex-1 pb-20 sm:pb-6">
    {/* Content goes here */}
  </main>

  {/* Mobile TabBar (hidden on desktop) */}
  <TabBar
    activeTab={activeTab}
    onTabChange={setActiveTab}
    darkMode={darkMode}
  />
</div>
```

### 3. Add Bottom Padding to Main Content

**Important:** Add `pb-20` on mobile and `sm:pb-6` on desktop to prevent content from being hidden behind the TabBar.

```tsx
<main className="flex-1 pb-20 sm:pb-6">
```

## Tab IDs

```typescript
type TabId = 'game' | 'stats' | 'history' | 'settings';
```

- `'game'` → Partie
- `'stats'` → Stats Globales
- `'history'` → Parties
- `'settings'` → Paramètres

## Props Reference

### Header
```typescript
{
  activeGame?: LotoGame;      // Optional
  darkMode: boolean;           // Required
  onToggleTheme: () => void;   // Required
}
```

### Navigation
```typescript
{
  activeTab: TabId;            // Required
  onTabChange: (tab: TabId) => void; // Required
  darkMode: boolean;           // Required
}
```

### TabBar
```typescript
{
  activeTab: TabId;            // Required
  onTabChange: (tab: TabId) => void; // Required
  darkMode: boolean;           // Required
}
```

## Example Active Game Object

```typescript
const activeGame: LotoGame = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Soirée du vendredi',
  date: new Date().toISOString(),
  startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
  numbers: [12, 45, 67, 23, 89], // Numbers drawn
  isActive: true,
};
```

## Responsive Behavior

| Component | Mobile (< 640px) | Desktop (≥ 640px) |
|-----------|------------------|-------------------|
| Header | Always visible | Always visible |
| Navigation | Hidden | Visible |
| TabBar | Visible (fixed bottom) | Hidden |

## Common Patterns

### Switch Tab Programmatically
```typescript
setActiveTab('stats');
```

### Toggle Theme
```typescript
const handleToggleTheme = () => {
  setDarkMode(prev => !prev);
  // Optional: persist to localStorage
  localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
};
```

### Conditional Content Based on Tab
```typescript
<main className="flex-1 pb-20 sm:pb-6">
  {activeTab === 'game' && <GameView />}
  {activeTab === 'stats' && <StatsView />}
  {activeTab === 'history' && <HistoryView />}
  {activeTab === 'settings' && <SettingsView />}
</main>
```

## Styling Tips

### Background Colors
```typescript
// Container background
style={{ backgroundColor: darkMode ? '#1f2937' : '#f9fafb' }}

// Card background
style={{ backgroundColor: darkMode ? '#111827' : '#ffffff' }}

// Text color
style={{ color: darkMode ? '#f9fafb' : '#111827' }}

// Secondary text
style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}
```

### Tailwind Classes
```tsx
// Responsive visibility
className="hidden sm:block"  // Hidden on mobile, visible on desktop
className="sm:hidden"         // Visible on mobile, hidden on desktop

// Bottom padding for TabBar
className="pb-20 sm:pb-6"     // 80px mobile, 24px desktop
```

## Testing Checklist

- [ ] Header displays correctly
- [ ] Theme toggle works
- [ ] Active game status shows (when game exists)
- [ ] Timer updates (if implemented with live state)
- [ ] Navigation tabs change on desktop
- [ ] TabBar appears on mobile
- [ ] TabBar hidden on desktop
- [ ] Active tab highlighting works
- [ ] Content not hidden behind TabBar
- [ ] Dark mode styles applied correctly
- [ ] All icons render (Lucide React)
- [ ] Smooth transitions between tabs
- [ ] Accessible via keyboard

## Troubleshooting

**Content hidden behind TabBar?**
- Add `pb-20 sm:pb-6` to main content container

**Icons not showing?**
- Verify `lucide-react` is installed: `npm list lucide-react`

**Navigation not responsive?**
- Check Tailwind breakpoints: `hidden sm:block` vs `sm:hidden`

**Timer not updating?**
- Timer calculates on render. Wrap Header in a component with interval/effect for live updates

**Dark mode not working?**
- Verify `darkMode` prop is passed to all components
- Check inline styles are using ternary operators correctly

## Next Steps

1. See `LayoutExample.tsx` for a complete working example
2. Read `README.md` for detailed documentation
3. Integrate with your existing app state management
4. Add live timer updates if needed
5. Persist theme preference to localStorage
6. Add page transition animations between tabs
