import React from 'react';
import { useStore } from '../store/useStore';
import { Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const { preferences, toggleTheme } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-20">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg p-1 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
              />
            </svg>
          </div>
          <h1 className="text-lg md:text-xl font-bold text-card-foreground hidden sm:block">
            Ottomator News
          </h1>
          <h1 className="text-lg font-bold text-card-foreground sm:hidden">
            News
          </h1>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          title={preferences.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {preferences.theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};