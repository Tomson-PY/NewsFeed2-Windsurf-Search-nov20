export interface Feed {
  id: string;
  title: string;
  url: string;
  category: string;
}

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  content: string;
  fullContent: string;
  pubDate: string;
  category: string;
  feedId: string;
}

export interface TagPreset {
  id: string;
  name: string;
  tags: string[];
}

export interface UserPreferences {
  selectedFeeds: string[];
  selectedCategories: string[];
  searchTags: string[];
  readItems: string[];
  bookmarkedItems: string[];
  tagPresets: TagPreset[];
  theme: 'light' | 'dark';
}