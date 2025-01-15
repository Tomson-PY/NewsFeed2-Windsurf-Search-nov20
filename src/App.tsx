import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FeedManagementTabs } from './components/FeedManagementTabs';
import { BookmarkView } from './components/BookmarkView';
import { SearchTags } from './components/SearchTags';
import { Settings } from './components/Settings';
import { Header } from './components/Header';
import { SubHeader } from './components/SubHeader';
import { useStore } from './store/useStore';
import { parseFeed } from './utils/feedParser';
import { createProxiedUrl } from './utils/corsProxy';
import { AdminPage } from './components/admin/AdminPage';
import { ManageExistingFeeds } from './components/admin/ManageExistingFeeds';

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'feeds' | 'bookmarks' | 'tags' | 'settings'>('dashboard');
  const { feeds, preferences, setFeedItems } = useStore();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Apply theme class to document
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  useEffect(() => {
    let isMounted = true;

    const fetchFeeds = async () => {
      try {
        const activeFeedPromises = feeds
          .filter(feed => preferences.selectedFeeds.includes(feed.id))
          .map(async (feed) => {
            try {
              const proxiedUrl = createProxiedUrl(feed.url);
              const items = await parseFeed(proxiedUrl, feed.category, feed.id);
              return items;
            } catch (error) {
              console.error(`Error fetching feed ${feed.title}:`, error);
              return [];
            }
          });

        const feedResults = await Promise.all(activeFeedPromises);
        
        if (isMounted) {
          const allItems = feedResults.flat().sort((a, b) => 
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
          );
          
          setFeedItems(allItems);
        }
      } catch (error) {
        console.error('Error fetching feeds:', error);
      }
    };

    fetchFeeds();
    const interval = setInterval(fetchFeeds, 300000); // Refresh every 5 minutes

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [feeds, preferences.selectedFeeds, setFeedItems]);

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/manage" element={<ManageExistingFeeds />} />
      </Routes>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${preferences.theme}`}>
      <Header />
      <div className="flex flex-col md:flex-row min-h-screen pt-16 md:pt-20">
        <Sidebar onViewChange={setActiveView} activeView={activeView} />
        <main className="flex-1 w-full md:ml-20">
          <SubHeader activeView={activeView} />
          <div className="pt-24 px-4 md:px-8">
            <div className="flex-1 overflow-auto">
              <div className="container mx-auto px-4 py-6">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/feeds" element={<FeedManagementTabs />} />
                  <Route path="/bookmarks" element={<BookmarkView />} />
                  <Route path="/tags" element={<SearchTags />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;