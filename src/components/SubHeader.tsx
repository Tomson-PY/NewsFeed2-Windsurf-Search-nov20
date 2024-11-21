import React, { useCallback } from 'react';
import { Home, Rss, Bookmark, Tag, Settings, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SubHeaderProps {
  activeView: 'dashboard' | 'feeds' | 'bookmarks' | 'tags' | 'settings';
}

const viewConfigs = {
  dashboard: {
    title: 'Latest Updates',
    subtitle: 'Stay informed with your personalized news feed',
    icon: Home,
  },
  feeds: {
    title: 'Manage Feeds',
    subtitle: 'Add, remove, and organize your news sources',
    icon: Rss,
  },
  bookmarks: {
    title: 'Bookmarks',
    subtitle: 'Access your saved articles',
    icon: Bookmark,
  },
  tags: {
    title: 'Tag Presets',
    subtitle: 'Manage your search tag presets',
    icon: Tag,
  },
  settings: {
    title: 'Settings',
    subtitle: 'Customize your news feed experience',
    icon: Settings,
  },
};

export const SubHeader: React.FC<SubHeaderProps> = ({ activeView }) => {
  const content = viewConfigs[activeView];
  const Icon = content.icon;
  const { refreshFeeds, isRefreshing } = useStore();

  // Debounced refresh handler with touch event support
  const handleRefresh = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default behavior
    
    if (isRefreshing) return;
    
    // For touch events, prevent the subsequent click
    if (e.type === 'touchend') {
      const target = e.target as HTMLElement;
      target.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
      }, { once: true });
    }

    refreshFeeds();
  }, [refreshFeeds, isRefreshing]);

  return (
    <div className="sticky top-16 z-10 bg-background border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
            <div>
              <h2 className="text-lg md:text-xl font-semibold">{content.title}</h2>
              <p className="text-xs md:text-sm text-muted-foreground">{content.subtitle}</p>
            </div>
          </div>
          
          {activeView === 'dashboard' && (
            <button
              onTouchEnd={handleRefresh}
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label={isRefreshing ? 'Refreshing feeds' : 'Refresh feeds'}
              className={`flex items-center space-x-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg 
                transition-all duration-200 touch-manipulation select-none
                ${isRefreshing
                  ? 'bg-orange-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 active:bg-primary/80'
                } text-primary-foreground text-sm md:text-base`}
            >
              <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{isRefreshing ? 'Refreshing...' : 'Refresh Feeds'}</span>
              <span className="md:hidden">{isRefreshing ? '...' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};