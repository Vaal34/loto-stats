# Layout Components

Production-ready React TypeScript layout components for the Loto Stats application.

## Components

### 1. Header.tsx

The main application header with app branding and game status.

**Features:**
- App title "Loto Stats"
- Active game status display (name, timer, numbers drawn)
- Theme toggle button (sun/moon icon)
- Sticky positioning
- Responsive design
- Live timer updates

**Props:**
```typescript
interface HeaderProps {
  activeGame?: LotoGame;  // Optional active game
  darkMode: boolean;       // Current theme
  onToggleTheme: () => void; // Theme toggle handler
}
```

**Usage:**
```tsx
import { Header } from './components/layout';

<Header
  activeGame={currentGame}
  darkMode={isDarkMode}
  onToggleTheme={() => setIsDarkMode(!isDarkMode)}
/>
```

**Timer Display:**
- Shows elapsed time since game started
- Format: "HH:MM" (< 1 hour) or "Hh MMm" (> 1 hour)
- Updates automatically via `getElapsedTime()`

---

### 2. Navigation.tsx

Horizontal tab navigation for desktop and tablet devices.

**Features:**
- 4 tabs: "Partie", "Stats Globales", "Parties", "Paramètres"
- Active tab highlighting with bottom border
- Horizontal scroll on mobile (hidden scrollbar)
- Smooth transitions
- Keyboard navigation support
- ARIA roles for accessibility

**Props:**
```typescript
interface NavigationProps {
  activeTab: TabId;          // Current active tab
  onTabChange: (tab: TabId) => void; // Tab change handler
  darkMode: boolean;          // Current theme
}

type TabId = 'game' | 'stats' | 'history' | 'settings';
```

**Usage:**
```tsx
import { Navigation, TabId } from './components/layout';

const [activeTab, setActiveTab] = useState<TabId>('game');

<Navigation
  activeTab={activeTab}
  onTabChange={setActiveTab}
  darkMode={isDarkMode}
/>
```

**Responsive Behavior:**
- Desktop/Tablet: Full horizontal layout
- Mobile: Scrollable (hidden on mobile in favor of TabBar)

---

### 3. TabBar.tsx

Fixed bottom navigation bar for mobile devices.

**Features:**
- 4 icon buttons with labels
- Icons: PlayCircle, BarChart3, List, Settings (Lucide React)
- Active indicator (dot and color change)
- Fixed bottom positioning
- iOS safe area support
- Touch-optimized (64px min-height)
- Hidden on desktop (sm:hidden)

**Props:**
```typescript
interface TabBarProps {
  activeTab: TabId;          // Current active tab
  onTabChange: (tab: TabId) => void; // Tab change handler
  darkMode: boolean;          // Current theme
}
```

**Usage:**
```tsx
import { TabBar } from './components/layout';

<TabBar
  activeTab={activeTab}
  onTabChange={setActiveTab}
  darkMode={isDarkMode}
/>
```

**Icons:**
- Partie: PlayCircle
- Stats: BarChart3
- Parties: List
- Réglages: Settings

---

## Complete Layout Example

```tsx
import React, { useState } from 'react';
import { Header, Navigation, TabBar, TabId } from './components/layout';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('game');
  const [darkMode, setDarkMode] = useState(false);
  const [activeGame, setActiveGame] = useState<LotoGame | undefined>();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Always visible */}
      <Header
        activeGame={activeGame}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />

      {/* Desktop/Tablet Navigation - Hidden on mobile */}
      <div className="hidden sm:block">
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
        />
      </div>

      {/* Main Content - Add bottom padding for mobile TabBar */}
      <main className="flex-1 pb-20 sm:pb-6">
        {/* Your content here */}
      </main>

      {/* Mobile TabBar - Hidden on desktop */}
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        darkMode={darkMode}
      />
    </div>
  );
};
```

---

## Styling

All components use **Tailwind CSS** for styling with inline styles for dynamic theming.

### Color Scheme

**Light Mode:**
- Background: `#ffffff`
- Text: `#111827`
- Secondary: `#6b7280`
- Border: `#e5e7eb`
- Primary: `#3b82f6`
- Success: `#10b981`

**Dark Mode:**
- Background: `#111827`
- Text: `#f9fafb`
- Secondary: `#9ca3af`
- Border: `#374151`
- Primary: `#60a5fa`
- Success: `#34d399`

### Responsive Breakpoints

- Mobile: < 640px (sm)
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Accessibility

All components follow accessibility best practices:

- **Semantic HTML**: Proper use of `<header>`, `<nav>`, `<button>`
- **ARIA Roles**: `role="tab"`, `role="navigation"`
- **ARIA Labels**: Descriptive labels for screen readers
- **ARIA States**: `aria-selected`, `aria-controls`, `aria-pressed`
- **Keyboard Navigation**: Tab order, focus states
- **Touch Targets**: Minimum 44px (iOS) / 48px (Android)
- **Color Contrast**: WCAG AA compliant

---

## Performance

- **Smooth Transitions**: 200ms duration for all state changes
- **Optimized Re-renders**: React.FC with proper props
- **CSS Transitions**: Hardware-accelerated transforms
- **Minimal Dependencies**: Only Lucide React icons

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari 12+
- Android Chrome 80+

---

## Files

```
src/components/layout/
├── Header.tsx          # App header component
├── Navigation.tsx      # Desktop tab navigation
├── TabBar.tsx         # Mobile bottom navigation
├── LayoutExample.tsx  # Usage example
├── index.ts           # Barrel exports
└── README.md          # This file
```

---

## Dependencies

- **react**: ^18.3.1
- **lucide-react**: ^0.468.0 (icons)
- **tailwindcss**: ^3.4.17 (styling)

---

## Notes

1. **Mobile-First Design**: Components are optimized for mobile with progressive enhancement
2. **Timer Updates**: Header timer is calculated on render - wrap in a component with state for live updates
3. **Safe Areas**: TabBar respects iOS safe area insets
4. **Sticky Header**: Header uses `position: sticky` for scroll behavior
5. **Fixed TabBar**: TabBar uses `position: fixed` at bottom on mobile only

---

## Future Enhancements

- [ ] Add swipe gestures for tab navigation on mobile
- [ ] Add notification badges to tabs
- [ ] Add animation when switching tabs
- [ ] Add tab transition effects
- [ ] Support for custom tab icons/colors
