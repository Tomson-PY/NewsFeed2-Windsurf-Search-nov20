import React from 'react';
import { X, Keyboard, Bell, Layout, Search, Eye, Zap } from 'lucide-react';

interface GuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Guide: React.FC<GuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Add Escape key handler
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              NewsFeed Guide
            </h1>
            <p className="text-muted-foreground mt-2">
              Everything you need to know about using NewsFeed effectively
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Feed Management */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Layout className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Feed Management</h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Toggle feeds on/off in Active Feeds tab
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Browse and add new feeds from Feed Catalog
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Filter feeds by category
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Reset to default feeds or clear all
                </li>
              </ul>
            </div>

            {/* Dashboard Features */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Dashboard Features</h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Real-time feed updates every 5 minutes
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Filter by "Fresh" content (last 24 hours)
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Search across all feed content
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Filter by specific feeds or categories
                </li>
              </ul>
            </div>

            {/* Search and Tags */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Search & Tags</h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Create custom search tags
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Save tag presets for quick filtering
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Filter content by multiple tags
                </li>
                <li className="flex items-start gap-2">
                  <span className="block w-1 h-1 mt-2 rounded-full bg-primary" />
                  Clear all tags with one click
                </li>
              </ul>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Keyboard className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next page</span>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-background rounded border text-sm">j</kbd>
                    <kbd className="px-2 py-1 bg-background rounded border text-sm">↓</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Previous page</span>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-background rounded border text-sm">k</kbd>
                    <kbd className="px-2 py-1 bg-background rounded border text-sm">↑</kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Search</span>
                  <kbd className="px-2 py-1 bg-background rounded border text-sm">/</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Close modals</span>
                  <kbd className="px-2 py-1 bg-background rounded border text-sm">Esc</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-primary/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Pro Tips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 mt-1 text-primary" />
                <p>Use the "Fresh" filter to focus on latest updates</p>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 mt-1 text-primary" />
                <p>Combine multiple search tags for precise filtering</p>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 mt-1 text-primary" />
                <p>Save frequently used tag combinations as presets</p>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 mt-1 text-primary" />
                <p>Use keyboard shortcuts for faster navigation</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Press <kbd className="px-2 py-1 bg-muted rounded border text-sm">Esc</kbd> to close this guide</p>
          </div>
        </div>
      </div>
    </div>
  );
};
