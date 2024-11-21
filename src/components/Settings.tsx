import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Moon, Sun, HelpCircle } from 'lucide-react';
import { Guide } from './Guide';

export const Settings: React.FC = () => {
  const { preferences, toggleTheme } = useStore();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Help Section */}
      <section className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Help & Documentation</h2>
        <button
          onClick={() => setIsGuideOpen(true)}
          className="flex items-center space-x-2 text-primary hover:text-primary/80"
        >
          <HelpCircle className="w-5 h-5" />
          <span>View Features Guide</span>
        </button>
      </section>

      <div className="bg-card rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-card-foreground mb-6">Your Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-card-foreground mb-1">Theme</h3>
              <p className="text-muted-foreground">Choose your preferred theme</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {preferences.theme === 'light' ? (
                <Moon className="w-5 h-5 text-secondary-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-secondary-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      <Guide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};