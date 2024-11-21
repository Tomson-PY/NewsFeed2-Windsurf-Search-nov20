import React from 'react';
import { Home, Rss, Bookmark, Tag, Settings, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';

interface SubHeaderProps {
  activeView: 'dashboard' | 'feeds' | 'bookmarks' | 'tags' | 'settings';
}

const viewConfigs = {
  dashboard: {
    title: 'Latest Updates',
    subtitle: 'Stay informed with your personalized news feed',
    icon: <Home className="w-6 h-6" />
  },
  feeds: {
    title: 'Manage AI News Feeds',
    subtitle: 'Customize your AI news sources',
    icon: <Rss className="w-6 h-6" />
  },
  bookmarks: {
    title: 'Read Later',
    subtitle: 'Your saved articles for future reading',
    icon: <Bookmark className="w-6 h-6" />
  },
  tags: {
    title: 'Search Tags',
    subtitle: 'Manage your content filters',
    icon: <Tag className="w-6 h-6" />
  },
  settings: {
    title: 'Settings',
    subtitle: 'Customize your experience',
    icon: <Settings className="w-6 h-6" />
  }
};

export const SubHeader: React.FC<SubHeaderProps> = ({ activeView }) => {
  const content = viewConfigs[activeView];
  const { refreshFeeds, isRefreshing } = useStore();

  return (
    <div className="fixed top-16 left-0 md:left-20 right-0 z-10 bg-card border-b border-border shadow-sm">
      <div className="px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 md:p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl text-primary shadow-sm">
              {content.icon}
            </div>
            <div className="ml-3 md:ml-4">
              <h2 className="text-base md:text-xl font-semibold text-card-foreground mb-0.5 md:mb-1">{content.title}</h2>
              <p className="text-xs md:text-sm text-muted-foreground">{content.subtitle}</p>
            </div>
          </div>
          
          {activeView === 'dashboard' && (
            <button
              onClick={() => refreshFeeds()}
              disabled={isRefreshing}
              className={`flex items-center space-x-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg transition-all duration-200 ${
                isRefreshing
                  ? 'bg-orange-500 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90'
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