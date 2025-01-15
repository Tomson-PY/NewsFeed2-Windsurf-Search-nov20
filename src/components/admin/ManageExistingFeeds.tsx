import { useState } from 'react';
import { Link } from 'react-router-dom';
import { feedCatalog } from '../../data/feedCatalog';
import { XMLParser } from 'fast-xml-parser';
import { FeedCatalogItem } from '../../types';

type TestResult = {
  status: 'success' | 'error';
  message: string;
  details?: {
    itemCount?: number;
    latestItem?: string;
    feedType?: 'RSS' | 'Atom';
  };
};

export function ManageExistingFeeds() {
  const [feeds, setFeeds] = useState(feedCatalog);
  const [editingFeed, setEditingFeed] = useState<FeedCatalogItem | null>(null);
  const [loadingFeeds, setLoadingFeeds] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});

  // Test a feed URL
  const testFeedUrl = async (url: string, feedId: string) => {
    setLoadingFeeds(prev => ({ ...prev, [feedId]: true }));
    setError(null);
    try {
      // First try with /raw endpoint
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Failed to fetch RSS feed');
      
      const xmlData = await response.text();
      const parser = new XMLParser();
      const result = parser.parse(xmlData);
      
      // Handle different RSS feed structures
      const channel = result.rss?.channel || result.feed;
      if (!channel) {
        throw new Error('Invalid feed format - neither RSS nor Atom detected');
      }

      const items = channel.item || channel.entry || [];
      const feedItems = Array.isArray(items) ? items : [items];
      
      const feedType = result.rss ? 'RSS' : 'Atom';
      const itemCount = feedItems.length;
      const latestItem = feedItems[0]?.title;

      setTestResults(prev => ({
        ...prev,
        [feedId]: {
          status: 'success',
          message: 'Feed validated successfully',
          details: {
            itemCount,
            latestItem,
            feedType
          }
        }
      }));
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        [feedId]: {
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error occurred'
        }
      }));
      console.error('Feed test error:', err);
    } finally {
      setLoadingFeeds(prev => ({ ...prev, [feedId]: false }));
    }
  };

  // Test all feeds
  const testAllFeeds = async () => {
    const allIds = feeds.map(feed => feed.id);
    allIds.forEach(id => setLoadingFeeds(prev => ({ ...prev, [id]: true })));
    
    await Promise.all(
      feeds.map(feed => testFeedUrl(feed.url, feed.id))
    );
  };

  // Update feed details
  const updateFeed = (updatedFeed: FeedCatalogItem) => {
    setFeeds(prev => prev.map(feed => 
      feed.id === updatedFeed.id ? updatedFeed : feed
    ));
    setEditingFeed(null);
  };

  // Remove feed
  const removeFeed = (feedId: string) => {
    setFeeds(prev => prev.filter(feed => feed.id !== feedId));
  };

  // Move feed within its category
  const moveFeed = (feedId: string, direction: 'up' | 'down') => {
    const feedIndex = feeds.findIndex(f => f.id === feedId);
    const feed = feeds[feedIndex];
    const categoryFeeds = feeds.filter(f => f.category === feed.category);
    const categoryIndex = categoryFeeds.findIndex(f => f.id === feedId);

    if (direction === 'up' && categoryIndex > 0) {
      const newFeeds = [...feeds];
      const prevFeedIndex = feeds.findIndex(f => f.id === categoryFeeds[categoryIndex - 1].id);
      [newFeeds[feedIndex], newFeeds[prevFeedIndex]] = [newFeeds[prevFeedIndex], newFeeds[feedIndex]];
      setFeeds(newFeeds);
    } else if (direction === 'down' && categoryIndex < categoryFeeds.length - 1) {
      const newFeeds = [...feeds];
      const nextFeedIndex = feeds.findIndex(f => f.id === categoryFeeds[categoryIndex + 1].id);
      [newFeeds[feedIndex], newFeeds[nextFeedIndex]] = [newFeeds[nextFeedIndex], newFeeds[feedIndex]];
      setFeeds(newFeeds);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-900">Manage Existing Feeds</h1>
            <div className="flex gap-4">
              <button
                onClick={testAllFeeds}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test All Feeds
              </button>
              <Link
                to="/admin"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add New Feed
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            {feeds.reduce((acc: JSX.Element[], feed, index) => {
              // Add category header if this is the first feed in its category
              if (index === 0 || feeds[index - 1].category !== feed.category) {
                acc.push(
                  <h2 key={`cat-${feed.category}`} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                    {feed.category}
                  </h2>
                );
              }

              // Add feed item
              acc.push(
                <div
                  key={feed.id}
                  className="border rounded-lg p-4 mb-4 bg-gray-50 hover:shadow-md transition-shadow"
                >
                  {editingFeed?.id === feed.id ? (
                    // Edit mode
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editingFeed.title}
                        onChange={e => setEditingFeed({ ...editingFeed, title: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Feed Title"
                      />
                      <input
                        type="text"
                        value={editingFeed.url}
                        onChange={e => setEditingFeed({ ...editingFeed, url: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Feed URL"
                      />
                      <textarea
                        value={editingFeed.description}
                        onChange={e => setEditingFeed({ ...editingFeed, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Description"
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingFeed(null)}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => updateFeed(editingFeed)}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{feed.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{feed.description}</p>
                          <p className="text-sm text-gray-400 mt-1">{feed.url}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveFeed(feed.id, 'up')}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Move Up"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveFeed(feed.id, 'down')}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Move Down"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <button
                          onClick={() => setEditingFeed(feed)}
                          className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeFeed(feed.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => testFeedUrl(feed.url, feed.id)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                          disabled={loadingFeeds[feed.id]}
                        >
                          {loadingFeeds[feed.id] ? 'Testing...' : 'Test Feed'}
                        </button>
                        {testResults[feed.id] && (
                          <div className={`text-sm ${
                            testResults[feed.id].status === 'success' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            <div className="flex items-center gap-1">
                              {testResults[feed.id].status === 'success' ? '✓' : '✗'}
                              {testResults[feed.id].message}
                            </div>
                            {testResults[feed.id].details && (
                              <div className="text-gray-600 text-xs mt-1">
                                <div>Type: {testResults[feed.id].details.feedType}</div>
                                <div>Items: {testResults[feed.id].details.itemCount}</div>
                                {testResults[feed.id].details.latestItem && (
                                  <div>Latest: {testResults[feed.id].details.latestItem}</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );

              return acc;
            }, [])}
          </div>
        </div>
      </div>
    </div>
  );
}
