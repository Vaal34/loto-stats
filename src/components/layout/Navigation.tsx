/**
 * Main navigation component with tabs
 * Desktop/tablet layout with horizontal tabs
 */

import React from 'react';

export type TabId = 'game' | 'stats' | 'history' | 'settings';

interface Tab {
  id: TabId;
  label: string;
}

interface NavigationProps {
  /** Currently active tab */
  activeTab: TabId;
  /** Tab change handler */
  onTabChange: (tab: TabId) => void;
  /** Current theme mode */
  darkMode: boolean;
}

const TABS: Tab[] = [
  { id: 'game', label: 'Partie' },
  { id: 'stats', label: 'Stats Globales' },
  { id: 'history', label: 'Parties' },
  { id: 'settings', label: 'Paramètres' },
];

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, darkMode }) => {
  return (
    <nav
      className="w-full border-b"
      style={{
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-2 sm:px-4">
        {/* Scrollable container for mobile */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max sm:min-w-0 sm:justify-start gap-1 sm:gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-inset rounded-t-lg"
                  style={{
                    color: isActive
                      ? darkMode
                        ? '#60a5fa'
                        : '#3b82f6'
                      : darkMode
                      ? '#9ca3af'
                      : '#6b7280',
                    backgroundColor: isActive
                      ? darkMode
                        ? '#1f2937'
                        : '#f9fafb'
                      : 'transparent',
                  }}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tab.id}-panel`}
                  tabIndex={isActive ? 0 : -1}
                >
                  <span>{tab.label}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 rounded-t-full transition-all duration-200"
                      style={{
                        backgroundColor: darkMode ? '#60a5fa' : '#3b82f6',
                      }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbar while keeping functionality */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
