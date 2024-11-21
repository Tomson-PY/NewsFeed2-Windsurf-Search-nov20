import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Feed, FeedItem, UserPreferences, TagPreset } from '../types';

interface StoreState {
  feeds: Feed[];
  feedItems: FeedItem[];
  preferences: UserPreferences;
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
  resetFeeds: () => void;
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
  },
  {
    id: 'google-ai',
    title: 'Google AI Blog',
    url: 'http://googleaiblog.blogspot.com/atom.xml',
    category: 'AI',
  },
  {
    id: 'openai',
    title: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'AI',
  },
  {
    id: 'mit-ai',
    title: 'MIT AI News',
    url: 'https://news.mit.edu/topic/artificial-intelligence2-rss.xml',
    category: 'AI',
  },
  {
    id: 'deepmind',
    title: 'DeepMind Blog',
    url: 'https://deepmind.com/blog/feed/basic/',
    category: 'AI',
  },
  {
    id: 'aws-ai',
    title: 'AWS AI Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    category: 'AI',
  },
  {
    id: 'nvidia-ai',
    title: 'NVIDIA AI News',
    url: 'https://blogs.nvidia.com/blog/category/deep-learning/feed/',
    category: 'AI',
  },
  {
    id: 'microsoft-ai',
    title: 'Microsoft AI Blog',
    url: 'https://blogs.microsoft.com/ai/feed/',
    category: 'AI',
  },
  {
    id: 'arxiv-ai',
    title: 'arXiv AI',
    url: 'http://export.arxiv.org/rss/cs.AI',
    category: 'AI Research',
  },
  {
    id: 'ml-mastery',
    title: 'Machine Learning Mastery',
    url: 'https://machinelearningmastery.com/feed/',
    category: 'AI Learning',
  },
  {
    id: 'towards-datascience',
    title: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    category: 'AI Learning',
  }
];

const initialPreferences: UserPreferences = {
  selectedCategories: ['Science', 'Technology', 'AI', 'AI Research', 'AI Learning'],
  selectedFeeds: defaultFeeds.map(feed => feed.id),
  bookmarkedItems: [],
  readItems: [],
  searchTags: [],
  tagPresets: [],
  theme: 'light'
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      feeds: defaultFeeds,
      feedItems: [],
      preferences: initialPreferences,
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
      resetFeeds: () =>
        set((state) => ({
          feeds: defaultFeeds,
          feedItems: [],
          preferences: {
            ...state.preferences,
            selectedFeeds: defaultFeeds.map(feed => feed.id),
            selectedCategories: ['Science', 'Technology', 'AI', 'AI Research', 'AI Learning']
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
