import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Globe, Trash2, Bot, Brain, Image, Code, Newspaper, RefreshCw } from 'lucide-react';

export const FeedManager: React.FC = () => {
  const { feeds, preferences, updatePreferences, removeFeed, resetFeeds, refreshFeeds } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(feeds.map((feed) => feed.category)));

  const filteredFeeds = selectedCategory === 'all'
    ? feeds
    : feeds.filter((feed) => feed.category === selectedCategory);

  const handleFeedToggle = async (feedId: string) => {
    const newSelectedFeeds = preferences.selectedFeeds.includes(feedId)
      ? preferences.selectedFeeds.filter((id) => id !== feedId)
      : [...preferences.selectedFeeds, feedId];
    
    await updatePreferences({ selectedFeeds: newSelectedFeeds });
    refreshFeeds();
  };

  const handleRemoveFeed = async (feedId: string) => {
    if (window.confirm('Are you sure you want to remove this feed?')) {
      removeFeed(feedId);
      refreshFeeds();
    }
  };

  const handleReset = async () => {
    if (window.confirm('This will reset all feeds to their default state. Your other preferences will be preserved. Are you sure?')) {
      resetFeeds();
      refreshFeeds();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI News':
        return <Newspaper className="w-6 h-6 text-primary" />;
      case 'AI General':
        return <Bot className="w-6 h-6 text-primary" />;
      case 'LLMs':
        return <Brain className="w-6 h-6 text-primary" />;
      case 'AI Image Generation':
        return <Image className="w-6 h-6 text-primary" />;
      case 'AI Programming':
        return <Code className="w-6 h-6 text-primary" />;
      default:
        return <Globe className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors w-full md:w-auto"
        >
          Reset to Default Feeds
        </button>

        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <label className="font-medium text-card-foreground">
            Filter by Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-muted text-card-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFeeds.map((feed) => (
          <div key={feed.id} className="flex items-center justify-between bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center space-x-4">
              {getCategoryIcon(feed.category)}
              <div>
                <h3 className="font-medium text-card-foreground">{feed.title}</h3>
                <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-sm font-medium tag-${feed.category.replace(/\s+/g, '')}`}>
                  {feed.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.selectedFeeds.includes(feed.id)}
                  onChange={() => handleFeedToggle(feed.id)}
                  className="rounded text-primary focus:ring-primary border-input"
                />
                <span className="text-sm text-card-foreground">Active</span>
              </label>
              
              <button
                onClick={() => handleRemoveFeed(feed.id)}
                className="p-2 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted/50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};