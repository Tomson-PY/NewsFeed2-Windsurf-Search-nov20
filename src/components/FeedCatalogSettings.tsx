import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { feedCatalog, getFeedsByCategory } from '../data/feedCatalog';

export const FeedCatalogSettings: React.FC = () => {
    const { preferences, updatePreferences, resetFeeds } = useStore();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isApplying, setIsApplying] = useState(false);
    const [titleSearch, setTitleSearch] = useState('');
    
    const categoryMap = getFeedsByCategory();
    const categories = Array.from(categoryMap.keys());
    
    // Get initial feeds based on category
    const categoryFeeds = selectedCategory === 'all' 
        ? feedCatalog 
        : categoryMap.get(selectedCategory) || [];

    // Define default feed IDs
    const defaultFeedIds = [
        'nasa',
        'hackernews',
        'google-ai',
        'openai',
        'mit-ai',
        'deepmind',
        'aws-ai',
        'nvidia-ai',
        'microsoft-ai',
        'ml-mastery',
        'towards-datascience'
    ];

    // First, separate and sort all feeds
    const allDefaultFeeds = categoryFeeds
        .filter(feed => defaultFeedIds.includes(feed.id))
        .sort((a, b) => a.title.localeCompare(b.title));

    const allOtherFeeds = categoryFeeds
        .filter(feed => !defaultFeedIds.includes(feed.id))
        .sort((a, b) => a.title.localeCompare(b.title));

    // Then apply title search if there is one
    const defaultFeeds = titleSearch.trim()
        ? allDefaultFeeds.filter(feed => 
            feed.title.toLowerCase().includes(titleSearch.toLowerCase())
          )
        : allDefaultFeeds;

    const otherFeeds = titleSearch.trim()
        ? allOtherFeeds.filter(feed => 
            feed.title.toLowerCase().includes(titleSearch.toLowerCase())
          )
        : allOtherFeeds;

    const handleFeedSelection = (feedId: string) => {
        const newSelections = preferences.catalogSelections?.includes(feedId)
            ? preferences.catalogSelections.filter(id => id !== feedId)
            : [...(preferences.catalogSelections || []), feedId];
            
        updatePreferences({ catalogSelections: newSelections });
    };
    
    const handleApplySelections = () => {
        setIsApplying(true);
        
        const selectedFeeds = feedCatalog
            .filter(feed => preferences.catalogSelections?.includes(feed.id))
            .map(feed => ({
                id: feed.id,
                title: feed.title,
                url: feed.url,
                category: feed.category
            }));
            
        resetFeeds(selectedFeeds.length > 0 ? selectedFeeds : undefined);
        
        // Ensure we wait for the resetFeeds to complete before marking as not applying
        setTimeout(() => {
            setIsApplying(false);
        }, 2000);
    };
    
    const handleResetToDefault = () => {
        // Get the IDs of the default feeds from the feed catalog
        const defaultFeedIds = [
            'nasa',
            'hackernews',
            'google-ai',
            'openai',
            'mit-ai',
            'deepmind',
            'aws-ai',
            'nvidia-ai',
            'microsoft-ai',
            'ml-mastery',
            'towards-datascience'
        ];
        
        // Update the catalog selections with default feed IDs
        updatePreferences({ catalogSelections: defaultFeedIds });
        
        // Apply the selections immediately
        handleApplySelections();
    };
    
    const handleClearSelections = () => {
        // Only clear the checkboxes in the catalog view
        updatePreferences({ catalogSelections: [] });
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-card-foreground">Feed Catalog</h2>
            </div>

            <p className="text-sm text-muted-foreground">
                Select feeds from our catalog to add to your feed manager.
            </p>
            
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search feed titles..."
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-muted text-card-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <label className="font-medium text-card-foreground whitespace-nowrap">
                        Filter by:
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

            <div className="flex justify-end space-x-4 mb-4">
                <button
                    onClick={handleResetToDefault}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary/80 hover:bg-primary rounded-lg transition-colors"
                    disabled={isApplying}
                >
                    Reset to Default Feeds
                </button>
                <button
                    onClick={() => updatePreferences({ catalogSelections: [] })}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary/80 hover:bg-primary rounded-lg transition-colors"
                    disabled={isApplying}
                >
                    Clear Selections
                </button>
                <button
                    onClick={handleApplySelections}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                    disabled={isApplying}
                >
                    {isApplying ? 'Applying...' : 'Apply Selections'}
                </button>
            </div>

            <div className="border border-border rounded-lg bg-card max-h-[400px] overflow-y-auto">
                {/* Default Feeds Section */}
                {defaultFeeds.length > 0 && (
                    <div className="border-b border-border">
                        <div className="px-4 py-2 bg-primary text-white font-medium">
                            Default Feeds
                        </div>
                        {defaultFeeds.map((feed) => (
                            <div 
                                key={feed.id} 
                                className="flex items-center px-4 py-3 bg-primary/10 hover:bg-primary/20 transition-colors border-b border-border/50 last:border-b-0"
                            >
                                <input
                                    type="checkbox"
                                    id={feed.id}
                                    checked={preferences.catalogSelections?.includes(feed.id) || false}
                                    onChange={() => handleFeedSelection(feed.id)}
                                    className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-primary"
                                />
                                <label htmlFor={feed.id} className="flex-1 ml-3 cursor-pointer">
                                    <div className="font-medium text-foreground">{feed.title}</div>
                                    <div className="text-sm text-muted-foreground">{feed.description}</div>
                                </label>
                                <span className="text-xs px-2 py-1 rounded-full bg-primary text-white">
                                    {feed.category}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Other Feeds Section */}
                {otherFeeds.length > 0 && (
                    <>
                        <div className="px-4 py-2 bg-muted text-muted-foreground font-medium border-b border-border">
                            Additional Feeds
                        </div>
                        {otherFeeds.map((feed) => (
                            <div 
                                key={feed.id} 
                                className="flex items-center px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                            >
                                <input
                                    type="checkbox"
                                    id={feed.id}
                                    checked={preferences.catalogSelections?.includes(feed.id) || false}
                                    onChange={() => handleFeedSelection(feed.id)}
                                    className="w-4 h-4 text-primary border-primary/30 rounded focus:ring-primary"
                                />
                                <label htmlFor={feed.id} className="flex-1 ml-3 cursor-pointer">
                                    <div className="font-medium text-foreground">{feed.title}</div>
                                    <div className="text-sm text-muted-foreground">{feed.description}</div>
                                </label>
                                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                    {feed.category}
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="text-sm text-muted-foreground">
                {categoryFeeds.length} feeds available • {preferences.catalogSelections?.length || 0} selected
            </div>
        </div>
    );
};
