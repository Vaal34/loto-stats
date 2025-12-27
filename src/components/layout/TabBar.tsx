/**
 * Bottom tab bar for mobile navigation
 * Fixed bottom navigation with icon buttons
 */

import React from 'react';
import { PlayCircle, BarChart3, List, Settings } from 'lucide-react';
import { TabId } from './Navigation';

interface TabBarProps {
  /** Currently active tab */
  activeTab: TabId;
  /** Tab change handler */
  onTabChange: (tab: TabId) => void;
  /** Current theme mode */
  darkMode: boolean;
}

interface TabBarItem {
  id: TabId;
  label: string;
  Icon: React.ElementType;
  ariaLabel: string;
}

const TAB_BAR_ITEMS: TabBarItem[] = [
  {
    id: 'game',
    label: 'Partie',
    Icon: PlayCircle,
    ariaLabel: 'Current game',
  },
  {
    id: 'stats',
    label: 'Stats',
    Icon: BarChart3,
    ariaLabel: 'Global statistics',
  },
  {
    id: 'history',
    label: 'Parties',
    Icon: List,
    ariaLabel: 'Game history',
  },
  {
    id: 'settings',
    label: 'Réglages',
    Icon: Settings,
    ariaLabel: 'Settings',
  },
];

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange, darkMode }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg sm:hidden"
      style={{
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        paddingBottom: 'env(safe-area-inset-bottom)', // iOS safe area
      }}
      role="navigation"
      aria-label="Mobile bottom navigation"
    >
      <div className="grid grid-cols-4 gap-0">
        {TAB_BAR_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.Icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-inset"
              style={{
                backgroundColor: isActive
                  ? darkMode
                    ? '#1f2937'
                    : '#f9fafb'
                  : 'transparent',
                minHeight: '64px', // Ensure adequate touch target
              }}
              role="tab"
              aria-selected={isActive}
              aria-label={item.ariaLabel}
              aria-controls={`${item.id}-panel`}
            >
              {/* Icon */}
              <div className="relative mb-1">
                <Icon
                  className="w-6 h-6 transition-transform duration-200"
                  style={{
                    color: isActive
                      ? darkMode
                        ? '#60a5fa'
                        : '#3b82f6'
                      : darkMode
                        ? '#9ca3af'
                        : '#6b7280',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                  aria-hidden="true"
                />

                {/* Active indicator dot */}
                {isActive && (
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: darkMode ? '#60a5fa' : '#3b82f6',
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Label */}
              <span
                className="text-xs font-medium truncate max-w-full transition-colors duration-200"
                style={{
                  color: isActive
                    ? darkMode
                      ? '#60a5fa'
                      : '#3b82f6'
                    : darkMode
                      ? '#9ca3af'
                      : '#6b7280',
                  fontWeight: isActive ? '600' : '500',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;
