import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { feedCatalog } from '../../data/feedCatalog';
import { XMLParser } from 'fast-xml-parser';
import { FeedCatalogItem } from '../../types';

interface FeedCatalogItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string | string[];
}

type TestResult = {
  status: 'success' | 'error';
  message: string;
  details?: {
    itemCount?: number;
    latestItem?: string;
    feedType?: 'RSS' | 'Atom';
  };
};

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

// Regular FeedItem component
function FeedItem({ feed, onEdit, onRemove, onTest, loadingFeeds, testResults }) {
  const getCategories = (category: string | string[]): string => {
    if (Array.isArray(category)) {
      return category.join(', ');
    }
    return category;
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 transition-all hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex-grow">
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="text-lg font-medium text-gray-900">{feed.title}</h3>
            {getCategories(feed.category).split(', ').map((cat, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
              >
                {cat}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{feed.description}</p>
          <a
            href={feed.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1 group"
          >
            <span className="truncate hover:underline">{feed.url}</span>
            <svg 
              className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onEdit(feed)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onRemove(feed.id)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
              <button
                onClick={() => onTest(feed.url, feed.id)}
                disabled={loadingFeeds[feed.id]}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                  loadingFeeds[feed.id]
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 active:scale-95'
                }`}
              >
                {loadingFeeds[feed.id] ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Testing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Test Feed
                  </>
                )}
              </button>
            </div>
            {testResults[feed.id] && (
              <div className={`text-sm ml-4 ${
                testResults[feed.id].status === 'success' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <div className="flex items-center gap-1">
                  {testResults[feed.id].status === 'success' ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {testResults[feed.id].message}
                </div>
                {testResults[feed.id].details && (
                  <div className="bg-gray-50 rounded-md p-2 mt-2 text-xs space-y-1 border border-gray-200">
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Type:</span> 
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {testResults[feed.id].details.feedType}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Items:</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                        {testResults[feed.id].details.itemCount}
                      </span>
                    </div>
                    {testResults[feed.id].details.latestItem && (
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Latest:</span>
                        <span className="truncate max-w-[200px]">{testResults[feed.id].details.latestItem}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// EditFeedForm component - now full width
function EditFeedForm({ feed, onSave, onCancel }) {
  const [title, setTitle] = useState(feed.title);
  const [description, setDescription] = useState(feed.description);
  const [url, setUrl] = useState(feed.url);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.isArray(feed.category) ? feed.category : feed.category ? [feed.category] : []
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...feed,
      title,
      description,
      url,
      category: selectedCategories
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-8 w-full max-w-4xl bg-white shadow-xl rounded-lg">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            onClick={onCancel}
            className="bg-white rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h2 className="text-2xl font-bold text-purple-900 mb-6">Edit Feed</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feed Information Section */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Feed Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-purple-900">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-purple-900">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Technical Details Section */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Technical Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-blue-900">
                  Feed URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Categories
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AI_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`
                        px-3 py-2 rounded-md text-sm font-medium
                        ${
                          selectedCategories.includes(category)
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }
                        transition-colors duration-150
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Pagination component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-6 pt-4">
      <div className="flex w-0 flex-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center pt-4 pr-1 text-sm font-medium ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-purple-600 hover:text-purple-800'
          }`}
        >
          <svg className="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Previous
        </button>
      </div>
      <div className="hidden md:flex">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`inline-flex items-center px-4 pt-4 text-sm font-medium ${
              currentPage === number
                ? 'text-purple-600 border-t-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-t-2 hover:border-gray-300'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="flex w-0 flex-1 justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center pt-4 pl-1 text-sm font-medium ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-purple-600 hover:text-purple-800'
          }`}
        >
          Next
          <svg className="ml-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H7a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export function ManageExistingFeeds() {
  const [feeds, setFeeds] = useState(feedCatalog);
  const [editingFeed, setEditingFeed] = useState<FeedCatalogItem | null>(null);
  const [loadingFeeds, setLoadingFeeds] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFailedFeeds, setShowFailedFeeds] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // Calculate if all feeds have been tested
  const allFeedsTested = useMemo(() => {
    return feeds.every(feed => testResults[feed.id]);
  }, [feeds, testResults]);

  // Get failed feeds
  const failedFeeds = useMemo(() => {
    if (!showFailedFeeds) return [];
    return feeds.filter(feed => 
      testResults[feed.id]?.status === 'error'
    ).sort((a, b) => a.title.localeCompare(b.title));
  }, [feeds, testResults, showFailedFeeds]);

  // Filter and sort feeds based on search query
  const searchResults = useMemo(() => 
    searchQuery ? feeds
      .filter(feed => 
        feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feed.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(feed.category) ? feed.category.join(', ') : feed.category).toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title)) 
    : [], [feeds, searchQuery]);

  // Get paginated feeds
  const paginatedFeeds = useMemo(() => {
    // If showing failed feeds, use those instead
    const feedsToShow = showFailedFeeds ? failedFeeds : feeds;
    const sortedFeeds = [...feedsToShow].sort((a, b) => a.title.localeCompare(b.title));
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    return sortedFeeds.slice(startIdx, endIdx);
  }, [feeds, currentPage, showFailedFeeds, failedFeeds]);

  // Calculate total pages
  const totalPages = Math.ceil((showFailedFeeds ? failedFeeds.length : feeds.length) / ITEMS_PER_PAGE);

  // Reset to first page when toggling failed feeds view
  const handleToggleFailedFeeds = () => {
    setShowFailedFeeds(prev => !prev);
    setCurrentPage(1);
    setSearchQuery(''); // Clear search when toggling failed feeds
  };

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

  // Remove a feed
  const removeFeed = (feedId: string) => {
    if (window.confirm('Are you sure you want to remove this feed?')) {
      setFeeds(prev => prev.filter(feed => feed.id !== feedId));
    }
  };

  // Update feed details
  const handleUpdateFeed = (updatedFeed: FeedCatalogItem) => {
    setFeeds(prev => prev.map(feed => 
      feed.id === updatedFeed.id ? updatedFeed : feed
    ));
    setEditingFeed(null);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when searching
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {editingFeed && (
            <EditFeedForm
              feed={editingFeed}
              onSave={handleUpdateFeed}
              onCancel={() => setEditingFeed(null)}
            />
          )}
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-900">Manage Existing Feeds</h1>
            <div className="flex gap-4">
              {!allFeedsTested ? (
                <button
                  onClick={testAllFeeds}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test All Feeds
                </button>
              ) : (
                <button
                  onClick={handleToggleFailedFeeds}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showFailedFeeds
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {showFailedFeeds ? 'Show All Feeds' : 'Show Failed Feeds'}
                </button>
              )}
              <Link
                to="/admin"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add New Feed
              </Link>
            </div>
          </div>

          {/* Search Box - Only show when not viewing failed feeds */}
          {!showFailedFeeds && (
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search feeds by title, description, URL, or category..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-12 transition-all duration-200"
                />
                <div className="absolute left-4 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            {/* Failed Feeds View */}
            {showFailedFeeds && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Failed Feeds ({failedFeeds.length})
                </h2>
                {failedFeeds.length > 0 ? (
                  <div className="space-y-4">
                    {paginatedFeeds.map((feed) => (
                      <FeedItem
                        key={feed.id}
                        feed={feed}
                        onEdit={setEditingFeed}
                        onRemove={removeFeed}
                        onTest={testFeedUrl}
                        loadingFeeds={loadingFeeds}
                        testResults={testResults}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">All feeds are working!</h3>
                    <p className="mt-1 text-sm text-gray-500">No failed feeds found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Search Results */}
            {searchQuery && searchResults.length > 0 && !showFailedFeeds && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Results ({searchResults.length})
                </h2>
                <div className="space-y-4">
                  {searchResults.map((feed) => (
                    <FeedItem
                      key={feed.id}
                      feed={feed}
                      onEdit={setEditingFeed}
                      onRemove={removeFeed}
                      onTest={testFeedUrl}
                      loadingFeeds={loadingFeeds}
                      testResults={testResults}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {searchQuery && searchResults.length === 0 && !showFailedFeeds && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No feeds found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms or clear the search to see all feeds.</p>
                <div className="mt-6">
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Regular Feed List */}
            {(!searchQuery && !showFailedFeeds) && (
              <div className="space-y-4">
                {paginatedFeeds.map((feed) => (
                  <FeedItem
                    key={feed.id}
                    feed={feed}
                    onEdit={setEditingFeed}
                    onRemove={removeFeed}
                    onTest={testFeedUrl}
                    loadingFeeds={loadingFeeds}
                    testResults={testResults}
                  />
                ))}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
