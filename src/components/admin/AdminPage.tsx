import { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import { Link } from 'react-router-dom';

// These will be the actual AI categories as shown in the image
const AI_CATEGORIES = [
  'Research & Breakthroughs AI',
  'Enterprise & Business AI',
  'Startups & Funding AI',
  'Policy, Regulation & Governance AI',
  'Ethics & Responsible AI',
  'Robotics & Industrial Automation AI',
  'Autonomous Vehicles & Transportation AI',
  'Healthcare & Biotech AI',
  'Computer Vision & Image Recognition AI',
  'Finance & Fintech AI',
  'Education & EdTech AI',
  'Cybersecurity AI',
  'Cloud, HPC & Edge AI',
  'Tools, Libraries & Frameworks AI',
  'Marketing & Advertising AI',
  'Retail & eCommerce AI',
  'Social Impact & Sustainability AI',
  'Gaming & Entertainment AI'
];

interface FeedItem {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  categories?: string[];
}

export function AdminPage() {
  const [url, setUrl] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewItems, setPreviewItems] = useState<FeedItem[]>([]);
  const [feedCategories, setFeedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addToDefaults, setAddToDefaults] = useState(false);

  const clearUrl = () => {
    setUrl('');
    setPreviewItems([]);
    setFeedCategories([]);
    setSelectedCategories([]);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { url, categories: selectedCategories });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const fetchPreview = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setFeedCategories([]);
    try {
      // Use a CORS proxy to fetch the RSS feed
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Failed to fetch RSS feed');
      
      const xmlData = await response.text();
      const parser = new XMLParser();
      const result = parser.parse(xmlData);
      
      // Handle different RSS feed structures
      const channel = result.rss?.channel || result.feed;
      const items = channel?.item || channel?.entry || [];
      
      // Extract feed-level categories if they exist
      const channelCategories = channel?.category || [];
      const feedCats = Array.isArray(channelCategories) ? channelCategories : [channelCategories];
      setFeedCategories(feedCats.filter(Boolean));

      const feedItems = (Array.isArray(items) ? items : [items]).slice(0, 5).map((item: any) => ({
        title: item.title,
        link: item.link?.href || item.link,
        pubDate: item.pubDate || item.published,
        description: item.description || item.summary || item.content,
        categories: Array.isArray(item.category) ? item.category : [item.category].filter(Boolean)
      }));

      setPreviewItems(feedItems);
      
      // Log categories for debugging
      console.log('Feed Categories:', feedCats);
      console.log('Item Categories:', feedItems.map(item => item.categories));
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feed preview');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-900">Add New Feed</h1>
            <Link
              to="/admin/manage"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Edit Existing Feeds
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-lg border border-purple-300">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-8 py-6 rounded-t-xl">
              <h2 className="text-2xl font-semibold text-white">Add New Feed</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              {/* URL Input Section */}
              <div className="bg-purple-100 rounded-xl p-6 mb-8">
                <label htmlFor="url" className="block text-sm font-medium text-purple-900 mb-3">
                  RSS Feed URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    placeholder="https://example.com/feed.xml"
                    required
                  />
                  <button
                    type="button"
                    onClick={clearUrl}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-300 hover:border-gray-400"
                    title="Clear form"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => fetchPreview(url)}
                    className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors disabled:opacity-50 shadow-sm font-medium"
                    disabled={!url || isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Loading...
                      </span>
                    ) : 'Preview Feed'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Section */}
              {!isLoading && !error && previewItems.length > 0 && (
                <div className="mb-8 bg-gradient-to-b from-purple-100 to-white rounded-xl border border-purple-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-700 to-purple-800 px-6 py-4 border-b border-purple-300">
                    <h3 className="text-lg font-medium text-white">Feed Preview</h3>
                  </div>
                  <div className="p-6">
                    {feedCategories.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-purple-900 mb-3">Feed Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {feedCategories.map((category, index) => (
                            <span key={index} className="px-3 py-1.5 bg-purple-200 text-purple-900 rounded-lg text-sm font-medium shadow-sm uppercase">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="space-y-6">
                      {previewItems.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                          <h3 className="font-medium text-gray-900 mb-2">
                            <a href={item.link} target="_blank" rel="noopener noreferrer" 
                               className="hover:text-purple-700 transition-colors">
                              {item.title}
                            </a>
                          </h3>
                          {item.pubDate && (
                            <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                              <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(item.pubDate).toLocaleDateString()}
                            </p>
                          )}
                          {item.categories && item.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {item.categories.map((cat, idx) => (
                                <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs font-medium uppercase">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          )}
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {item.description.replace(/<[^>]*>/g, '')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Section */}
              <div className="bg-gradient-to-r from-purple-100 to-white rounded-xl p-6 mb-8 border border-purple-300">
                <label className="block text-lg font-medium text-purple-900 mb-4">
                  Select Categories
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {AI_CATEGORIES.sort().map(category => (
                    <div
                      key={category}
                      className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== category)
                            );
                          }
                        }}
                        className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label className="ml-3 block text-sm font-medium text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add to Default Feeds Section */}
              <div className="mt-8 mb-4 p-6 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add to Default Feeds</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Include this feed in the default feed list shown to all users
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={addToDefaults}
                      onChange={(e) => setAddToDefaults(e.target.checked)}
                      className="w-12 h-12 text-red-600 bg-white border-4 border-red-400 rounded-xl focus:ring-red-500 focus:ring-offset-0 transition-all cursor-pointer transform hover:scale-105 accent-red-600"
                      style={{ accentColor: '#dc2626' }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-700 to-purple-900 text-white py-4 px-6 rounded-xl hover:from-purple-800 hover:to-purple-950 transition-all shadow-lg hover:shadow-xl font-medium text-lg"
                >
                  Add Feed to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
