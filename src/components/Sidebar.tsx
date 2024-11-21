import React from 'react';
import { Home, Rss, Bookmark, Tag, Settings } from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'feeds' | 'bookmarks' | 'tags' | 'settings';
  onViewChange: (view: 'dashboard' | 'feeds' | 'bookmarks' | 'tags' | 'settings') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-16 md:left-0 md:bottom-0 md:w-20 bg-card border-t md:border-r border-border z-10">
      <div className="flex md:flex-col justify-around md:justify-start items-center h-16 md:h-full md:pt-6 md:space-y-6">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`p-2 rounded-xl transition-colors ${
            activeView === 'dashboard'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
          }`}
          title="Dashboard"
        >
          <Home className="w-6 h-6" />
          <span className="sr-only">Dashboard</span>
        </button>

        <button
          onClick={() => onViewChange('feeds')}
          className={`p-2 rounded-xl transition-colors ${
            activeView === 'feeds'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
          }`}
          title="Manage Feeds"
        >
          <Rss className="w-6 h-6" />
          <span className="sr-only">Manage Feeds</span>
        </button>

        <button
          onClick={() => onViewChange('bookmarks')}
          className={`p-2 rounded-xl transition-colors ${
            activeView === 'bookmarks'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
          }`}
          title="Bookmarks"
        >
          <Bookmark className="w-6 h-6" />
          <span className="sr-only">Bookmarks</span>
        </button>

        <button
          onClick={() => onViewChange('tags')}
          className={`p-2 rounded-xl transition-colors ${
            activeView === 'tags'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
          }`}
          title="Search Tags"
        >
          <Tag className="w-6 h-6" />
          <span className="sr-only">Search Tags</span>
        </button>

        <button
          onClick={() => onViewChange('settings')}
          className={`p-2 rounded-xl transition-colors ${
            activeView === 'settings'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-card-foreground hover:bg-muted/50'
          }`}
          title="Settings"
        >
          <Settings className="w-6 h-6" />
          <span className="sr-only">Settings</span>
        </button>
      </div>
    </nav>
  );
};