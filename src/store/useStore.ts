import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Feed, FeedItem, UserPreferences, TagPreset } from '../types';
import { parseFeed } from '../utils/feedParser';
import { createProxiedUrl } from '../utils/corsProxy';

interface StoreState {
  feeds: Feed[];
  feedItems: FeedItem[];
  preferences: UserPreferences;
  isRefreshing: boolean;
  addFeed: (feed: Feed) => void;
  removeFeed: (id: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setFeedItems: (items: FeedItem[]) => void;
  toggleBookmark: (itemId: string) => void;
  toggleRead: (itemId: string) => void;
  addSearchTag: (tag: string) => void;
  removeSearchTag: (tag: string) => void;
  addTagPreset: (name: string, tags: string[]) => void;
  removeTagPreset: (presetId: string) => void;
  applyTagPreset: (presetId: string) => void;
  toggleTheme: () => void;
  resetFeeds: (selectedFeeds?: Feed[]) => void;
  refreshFeeds: () => Promise<void>;
}

const defaultFeeds: Feed[] = [
  {
    id: 'nasa',
    title: 'NASA Breaking News',
    url: 'https://www.nasa.gov/news-release/feed/',
    category: 'Science',
  },
  {
    id: 'hackernews',
    title: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'Technology',
    useProxy: true
  },
  {
    id: 'google-ai',
    title: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    category: 'AI',
  },
  {
    id: 'openai',
    title: 'OpenAI Blog',
    url: 'https://openai.com/api/feed.rss',
    category: 'AI',
    useProxy: true
  },
  {
    id: 'mit-ai',
    title: 'MIT AI News',
    url: 'https://news.mit.edu/rss/topic/artificial-intelligence-ai',
    category: 'AI',
    useProxy: true
  },
  {
    id: 'deepmind',
    title: 'DeepMind Blog',
    url: 'https://deepmind.google/blog/feed/basic/',
    category: 'AI',
  },
  {
    id: 'ml-mastery',
    title: 'Machine Learning Mastery',
    url: 'https://machinelearningmastery.com/feed/',
    category: 'AI Learning',
  },
  {
    id: 'towards-data-science',
    title: 'Towards Data Science - AI',
    url: 'https://medium.com/feed/towards-data-science/tagged/artificial-intelligence',
    category: 'AI Learning',
    useProxy: true
  }
];

const initialPreferences: UserPreferences = {
  selectedCategories: ['Science', 'Technology', 'AI', 'AI Learning'],
  selectedFeeds: defaultFeeds.map(feed => feed.id),
  bookmarkedItems: [],
  readItems: [],
  searchTags: [],
  tagPresets: [],
  theme: 'light'
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      feeds: defaultFeeds,
      feedItems: [],
      isRefreshing: false,
      preferences: initialPreferences,
      
      refreshFeeds: async () => {
        const state = get();
        if (state.isRefreshing) return;

        set({ isRefreshing: true });
        try {
          const activeFeedPromises = state.feeds
            .filter(feed => state.preferences.selectedFeeds.includes(feed.id))
            .map(async (feed) => {
              try {
                const proxiedUrl = feed.useProxy ? createProxiedUrl(feed.url) : feed.url;
                const items = await parseFeed(proxiedUrl, feed.category, feed.id);
                return items;
              } catch (error) {
                console.error(`Error fetching feed ${feed.title}:`, error);
                return [];
              }
            });

          const feedResults = await Promise.all(activeFeedPromises);
          const allItems = feedResults.flat().sort((a, b) => 
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
          );
          
          set({ feedItems: allItems, isRefreshing: false });
        } catch (error) {
          console.error('Error refreshing feeds:', error);
          set({ isRefreshing: false });
        }
      },

      addFeed: (feed) =>
        set((state) => ({ feeds: [...state.feeds, feed] })),
      removeFeed: (id) =>
        set((state) => ({ feeds: state.feeds.filter((feed) => feed.id !== id) })),
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      setFeedItems: (items) =>
        set({ feedItems: items }),
      resetFeeds: (selectedFeeds?: Feed[]) =>
        set((state) => ({
          feeds: selectedFeeds || defaultFeeds,
          feedItems: [],
          preferences: {
            ...state.preferences,
            selectedFeeds: (selectedFeeds || defaultFeeds).map(feed => feed.id),
            selectedCategories: Array.from(new Set((selectedFeeds || defaultFeeds).map(feed => feed.category)))
          }
        })),
      toggleBookmark: (itemId) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            bookmarkedItems: state.preferences.bookmarkedItems?.includes(itemId)
              ? state.preferences.bookmarkedItems.filter(id => id !== itemId)
              : [...(state.preferences.bookmarkedItems || []), itemId]
          }
        })),
      toggleRead: (itemId) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            readItems: state.preferences.readItems?.includes(itemId)
              ? state.preferences.readItems.filter(id => id !== itemId)
              : [...(state.preferences.readItems || []), itemId]
          }
        })),
      addSearchTag: (tag) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            searchTags: [...new Set([...(state.preferences.searchTags || []), tag])]
          }
        })),
      removeSearchTag: (tag) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            searchTags: (state.preferences.searchTags || []).filter(t => t !== tag)
          }
        })),
      addTagPreset: (name, tags) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            tagPresets: [
              ...(state.preferences.tagPresets || []),
              {
                id: `preset-${Date.now()}`,
                name,
                tags
              }
            ]
          }
        })),
      removeTagPreset: (presetId) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            tagPresets: state.preferences.tagPresets.filter(preset => preset.id !== presetId)
          }
        })),
      applyTagPreset: (presetId) =>
        set((state) => {
          const preset = state.preferences.tagPresets.find(p => p.id === presetId);
          if (!preset) return state;

          return {
            preferences: {
              ...state.preferences,
              searchTags: [...new Set([...state.preferences.searchTags, ...preset.tags])]
            }
          };
        }),
      toggleTheme: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            theme: state.preferences.theme === 'light' ? 'dark' : 'light'
          }
        })),
    }),
    {
      name: 'feed-reader-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        feeds: state.feeds,
      }),
    }
  )
);
