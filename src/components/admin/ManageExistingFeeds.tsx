import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

// SortableFeedItem component
function SortableFeedItem({ feed, onEdit, onRemove, onTest, loadingFeeds, testResults }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: feed.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-4 bg-gray-50 transition-all ${
        isDragging ? 'shadow-lg ring-2 ring-purple-500 scale-[1.02]' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium text-gray-900">{feed.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{feed.description}</p>
          <p className="text-sm text-gray-400 mt-1">{feed.url}</p>
          <div className="mt-4 flex items-center space-x-3">
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
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white ${
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Feed
                </>
              )}
            </button>
            {testResults[feed.id] && (
              <div className={`text-sm ${
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
                        <span className="truncate">{testResults[feed.id].details.latestItem}</span>
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

export function ManageExistingFeeds() {
  const [feeds, setFeeds] = useState(feedCatalog);
  const [editingFeed, setEditingFeed] = useState<FeedCatalogItem | null>(null);
  const [loadingFeeds, setLoadingFeeds] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Group feeds by category
  const feedsByCategory = feeds.reduce((acc, feed) => {
    if (!acc[feed.category]) {
      acc[feed.category] = [];
    }
    acc[feed.category].push(feed);
    return acc;
  }, {} as { [key: string]: FeedCatalogItem[] });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = feeds.findIndex(f => f.id === active.id);
    const newIndex = feeds.findIndex(f => f.id === over.id);
    
    setFeeds(feeds => arrayMove(feeds, oldIndex, newIndex));
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {Object.entries(feedsByCategory).map(([category, categoryFeeds]) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                    {category}
                  </h2>
                  <SortableContext
                    items={categoryFeeds.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {categoryFeeds.map((feed) => (
                        <SortableFeedItem
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
                  </SortableContext>
                </div>
              ))}
            </DndContext>
          </div>
        </div>
      </div>
    </div>
  );
}
