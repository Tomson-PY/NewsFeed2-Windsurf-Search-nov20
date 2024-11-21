import React from 'react';
import { useStore } from '../store/useStore';
import { Moon, Sun } from 'lucide-react';

export const Header: React.FC = () => {
  const { preferences, toggleTheme } = useStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-20">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        <div className="flex items-center space-x-3">
          <img
            src="https://ottomator.ai/wp-content/uploads/2024/11/OttomatorIcon-fullcolor-square.png"
            alt="Ottomator Logo"
            className="w-12 h-12 md:w-14 md:h-14 object-contain"
          />
          <h1 className="text-base md:text-xl font-bold text-card-foreground">
            Ottomator AI News
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