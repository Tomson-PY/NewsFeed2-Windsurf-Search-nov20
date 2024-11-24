import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Bookmark, BookmarkCheck, Circle, CircleDot, Tag, ChevronLeft, ChevronRight, MoreHorizontal, Search, Clock, X, Leaf, XCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { feedItems, preferences, feeds, toggleBookmark, toggleRead } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFreshOnly, setShowFreshOnly] = useState(false);
  const [selectedFeeds, setSelectedFeeds] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 21;

  const filterItemsByTags = (item: any) => {
    if (!preferences?.searchTags || preferences.searchTags.length === 0) {
      return true;
    }
    
    const searchText = `${item.title} ${item.content}`.toLowerCase();
    return preferences.searchTags.some(tag => searchText.includes(tag.toLowerCase()));
  };

  const filterItemsBySearch = (item: any) => {
    if (!searchQuery) return true;
    const searchText = `${item.title} ${item.content}`.toLowerCase();
    return searchText.includes(searchQuery.toLowerCase());
  };

  const isFresh = (pubDate: string) => {
    const now = new Date();
    const articleDate = new Date(pubDate);
    
    // Reset time part for "FRESH" comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const articleDay = new Date(articleDate.getFullYear(), articleDate.getMonth(), articleDate.getDate());
    
    return nowDate.getTime() === articleDay.getTime();
  };

  const filterItemsByFresh = (item: any) => {
    if (!showFreshOnly) return true;
    return isFresh(item.pubDate);
  };

  const filterItemsByFeed = (item: any) => {
    if (selectedFeeds.length === 0) return true;
    return selectedFeeds.includes(item.feedId);
  };

  const getMatchingTags = (item: any) => {
    if (!preferences?.searchTags || preferences.searchTags.length === 0) {
      return [];
    }
    
    const searchText = `${item.title} ${item.content}`.toLowerCase();
    return preferences.searchTags.filter(tag => searchText.includes(tag.toLowerCase()));
  };

  const getTimeDifference = (pubDate: string) => {
    const now = new Date();
    const articleDate = new Date(pubDate);
    
    // Reset time part for "FRESH" comparison
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const articleDay = new Date(articleDate.getFullYear(), articleDate.getMonth(), articleDate.getDate());
    
    if (nowDate.getTime() === articleDay.getTime()) {
      return <span className="text-emerald-500 font-bold">FRESH</span>;
    }
    
    const diffTime = Math.ceil((nowDate.getTime() - articleDay.getTime()) / (1000 * 60 * 60 * 24));
    return <span className="text-gray-500">{diffTime} {diffTime === 1 ? 'Day' : 'Days'}</span>;
  };

  // Add reading time estimation utility
  const estimateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Add utility function to extract image URL from content
  const extractImageUrl = (content: string): string | null => {
    if (!content) return null;
    
    console.log('Checking content for images:', content);

    // Try to find an img tag in the content
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      console.log('Found img tag:', imgMatch[1]);
      return imgMatch[1];
    }

    // Try to find a media:content tag
    const mediaMatch = content.match(/<media:content[^>]+url="([^">]+)"/);
    if (mediaMatch) {
      console.log('Found media:content tag:', mediaMatch[1]);
      return mediaMatch[1];
    }

    // Try to find an enclosure tag
    const enclosureMatch = content.match(/<enclosure[^>]+url="([^">]+)"[^>]+type="image/);
    if (enclosureMatch) {
      console.log('Found enclosure tag:', enclosureMatch[1]);
      return enclosureMatch[1];
    }

    // Try to find an og:image meta tag
    const ogMatch = content.match(/<meta[^>]+property="og:image"[^>]+content="([^">]+)"/);
    if (ogMatch) {
      console.log('Found og:image tag:', ogMatch[1]);
      return ogMatch[1];
    }

    // Try to find any URL that looks like an image
    const urlMatch = content.match(/https?:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif|webp)/i);
    if (urlMatch) {
      console.log('Found image URL:', urlMatch[0]);
      return urlMatch[0];
    }

    console.log('No image found in content');
    return null;
  };

  // Get active feeds (feeds that have items)
  const activeFeeds = feeds
    .filter(feed => feedItems.some(item => item.feedId === feed.id))
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(feed => ({
      id: feed.id,
      title: feed.title
    }));

  // Filter and sort items
  const filteredItems = feedItems
    .filter(filterItemsByTags)
    .filter(filterItemsBySearch)
    .filter(filterItemsByFresh)
    .filter(filterItemsByFeed)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - halfVisible);
      let end = Math.min(totalPages - 1, currentPage + halfVisible);

      // Adjust start and end to always show same number of pages
      if (currentPage <= halfVisible + 1) {
        end = maxVisiblePages - 1;
      } else if (currentPage >= totalPages - halfVisible) {
        start = totalPages - (maxVisiblePages - 1);
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push('ellipsis1');
      }

      // Add visible page numbers
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push('ellipsis2');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance for navigation (in pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left -> next page
      const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
      setCurrentPage(prev => Math.min(totalPages, prev + 1));
    }
    
    if (isRightSwipe) {
      // Swipe right -> previous page
      setCurrentPage(prev => Math.max(1, prev - 1));
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keyboard navigation on desktop/laptop
      if (window.innerWidth <= 768) return;

      // Only trigger if not in an input field or textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 'j':
          e.preventDefault();
          setCurrentPage(prev => Math.max(1, prev - 1)); // Go to previous page, but not below 1
          break;
        case 'k':
          e.preventDefault();
          setCurrentPage(prev => Math.min(totalPages, prev + 1)); // Go to next page, but not above total pages
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [filteredItems.length]);

  useEffect(() => {
    console.log('Feed items:', feedItems);
  }, [feedItems]);

  const PaginationControls = () => (
    <div className="inline-flex items-center space-x-2 sm:space-x-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-1.5 sm:p-2 rounded-lg ${currentPage === 1 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:bg-muted'}`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      <div className="flex items-center space-x-1 sm:space-x-2">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === 'ellipsis1' || page === 'ellipsis2' ? (
              <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
            ) : (
              <button
                onClick={() => handlePageChange(page as number)}
                className={`w-6 h-6 sm:w-8 sm:h-8 text-sm sm:text-base rounded-lg ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-card-foreground'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-1.5 sm:p-2 rounded-lg ${currentPage === totalPages ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:bg-muted'}`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );

  if (!preferences) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        {/* Search and Fresh Filter Row */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search and Filters Group */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-[300px]">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles"
                className="w-full pl-10 pr-4 py-2 bg-card rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filters Group */}
            <div className="flex items-center gap-2">
              {/* Fresh Only Toggle */}
              <button
                onClick={() => setShowFreshOnly(!showFreshOnly)}
                title="Show Fresh Articles Only"
                className={`p-2 rounded-lg border transition-colors ${
                  showFreshOnly
                    ? 'bg-emerald-500 border-emerald-600 hover:bg-emerald-600'
                    : 'bg-card border-border hover:bg-muted'
                }`}
              >
                <Leaf 
                  className={`h-5 w-5 ${
                    showFreshOnly 
                      ? 'text-white' 
                      : 'text-emerald-500'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Top Pagination - Desktop Only */}
          {totalPages > 1 && (
            <div className="hidden lg:flex">
              <PaginationControls />
            </div>
          )}
        </div>

        {/* Active Feeds Filter */}
        <div className="bg-card border border-border rounded-lg p-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-medium text-foreground">Filter by Feed</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedFeeds(activeFeeds.map(f => f.id))}
                className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors whitespace-nowrap"
              >
                Show All
              </button>
              {selectedFeeds.length > 0 && (
                <button
                  onClick={() => setSelectedFeeds([])}
                  className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-md transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
            {activeFeeds.map((feed) => (
              <button
                key={feed.id}
                onClick={() => {
                  setSelectedFeeds(prev => 
                    prev.includes(feed.id)
                      ? prev.filter(id => id !== feed.id)
                      : [...prev, feed.id]
                  );
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                  selectedFeeds.includes(feed.id)
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {feed.title}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl shadow-md">
              <Tag className="w-16 h-16 text-muted mx-auto mb-4" />
              <p className="text-lg text-card-foreground">No articles match your selected tags</p>
              <p className="text-muted-foreground mt-2">Try adjusting your search tags in Settings</p>
            </div>
          ) : (
            <>
              {paginatedItems.map((item) => (
                <article 
                  key={item.id} 
                  className="news-card bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="relative">
                    {extractImageUrl(item.fullContent || item.content) && (
                      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={extractImageUrl(item.fullContent || item.content)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Image failed to load:', (e.target as HTMLImageElement).src);
                            (e.target as HTMLElement).parentElement!.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="news-card-header">
                        <h2 className="text-xl font-semibold mb-3">
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 dark:text-sky-300 dark:hover:text-sky-200"
                          >
                            {item.title}
                          </a>
                        </h2>
                        <p className="text-card-foreground mb-4 line-clamp-3">{item.content.replace(/<[^>]*>/g, '')}</p>
                        <div className="flex justify-between items-center text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-muted-foreground">
                                {new Date(item.pubDate).toLocaleDateString()}
                              </span>
                              <span className="text-muted-foreground">-</span>
                              <span className="font-bold text-blue-600 dark:text-blue-400">
                                {feeds.find(feed => feed.id === item.feedId)?.title || 'Unknown Source'}
                              </span>
                              <span className="text-muted-foreground">-</span>
                              <span className="flex items-center gap-1 text-gray-500">
                                <Clock className="w-3 h-3" />
                                {estimateReadingTime(item.content)} min read
                              </span>
                            </div>
                            <div>{getTimeDifference(item.pubDate)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="news-card-footer mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 flex gap-2">
                            {getMatchingTags(item).map((tag) => (
                              <span key={tag} className="tag-badge tag-badge-default">
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <div className="tooltip-wrapper">
                              <button
                                onClick={() => toggleRead(item.id)}
                                className="action-button"
                                aria-label={preferences.readItems?.includes(item.id) ? "Mark as unread" : "Mark as read"}
                              >
                                {preferences.readItems?.includes(item.id) ? (
                                  <Circle className="w-5 h-5 text-primary fill-current" />
                                ) : (
                                  <CircleDot className="w-5 h-5 text-muted-foreground" />
                                )}
                                <span className="tooltip">
                                  {preferences.readItems?.includes(item.id) ? "Mark as unread" : "Mark as read"}
                                </span>
                              </button>
                            </div>
                            <div className="tooltip-wrapper">
                              <button
                                onClick={() => toggleBookmark(item.id)}
                                className="action-button"
                                aria-label={preferences.bookmarkedItems?.includes(item.id) ? "Remove from Read Later" : "Save for Later"}
                              >
                                {preferences.bookmarkedItems?.includes(item.id) ? (
                                  <BookmarkCheck className="w-5 h-5 text-primary fill-current" />
                                ) : (
                                  <Bookmark className="w-5 h-5 text-muted-foreground" />
                                )}
                                <span className="tooltip">
                                  {preferences.bookmarkedItems?.includes(item.id) ? "Remove from Read Later" : "Save for Later"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </>
          )}
        </div>

        {/* Bottom Pagination - Show on all devices */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-6">
            <div className="overflow-x-auto max-w-full pb-2">
              <PaginationControls />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};