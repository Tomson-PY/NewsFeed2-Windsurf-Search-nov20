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

      {/* Theme Settings */}
      <section className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Theme Settings</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 text-primary hover:text-primary/80"
          >
            {preferences.theme === 'light' ? (
              <>
                <Moon className="w-5 h-5" />
                <span>Switch to Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                <span>Switch to Light Mode</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Guide Modal */}
      {isGuideOpen && (
        <Guide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      )}
    </div>
  );
};