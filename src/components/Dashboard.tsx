import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Bookmark, BookmarkCheck, Circle, CircleDot, Tag, ChevronLeft, ChevronRight, MoreHorizontal, Search, Clock, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { feedItems, preferences, feeds, toggleBookmark, toggleRead } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter and sort items
  const filteredItems = feedItems
    .filter((item) => preferences?.selectedCategories?.includes(item.category))
    .filter(filterItemsByTags)
    .filter(filterItemsBySearch);

  // Sort by tag count first, then by date
  const sortedItems = filteredItems.sort((a, b) => {
    const aTagCount = getMatchingTags(a).length;
    const bTagCount = getMatchingTags(b).length;
    
    if (bTagCount !== aTagCount) {
      return bTagCount - aTagCount;
    }
    
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const showAround = 2; // Number of pages to show around current page

    // Always add first page
    pageNumbers.push(1);

    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - showAround);
    let rangeEnd = Math.min(totalPages - 1, currentPage + showAround);

    // Adjust range to show more numbers if we're near the start/end
    if (currentPage <= showAround + 2) {
      rangeEnd = Math.min(totalPages - 1, 5);
      rangeStart = 2;
    }
    if (currentPage >= totalPages - (showAround + 1)) {
      rangeStart = Math.max(2, totalPages - 4);
      rangeEnd = totalPages - 1;
    }

    // Add ellipsis and numbers
    if (rangeStart > 2) {
      pageNumbers.push('ellipsis1');
    }

    // Add all numbers in the range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pageNumbers.push('ellipsis2');
    }

    // Add last page if we're not already there
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not in an input field already
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!preferences) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      {/* Search Bar */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            placeholder="Search articles... (Press '/' to focus)"
            className="w-full px-9 py-2 rounded-lg border border-input bg-card text-card-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout */}
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl shadow-md">
          <Tag className="w-16 h-16 text-muted mx-auto mb-4" />
          <p className="text-lg text-card-foreground">No articles match your selected tags</p>
          <p className="text-muted-foreground mt-2">Try adjusting your search tags in Settings</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <article key={item.id} className="news-card">
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
                  <p className="text-card-foreground mb-4">{item.content}</p>
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
                        <span className={`tag-${item.category.replace(/\s+/g, '')}`}>
                          {item.category}
                        </span>
                      </div>
                      <div>{getTimeDifference(item.pubDate)}</div>
                    </div>
                  </div>
                </div>
                <div className="news-card-footer">
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
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8 mb-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:bg-muted'}`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                {getPageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === 'ellipsis1' || page === 'ellipsis2' ? (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={`w-8 h-8 rounded-lg ${
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
                className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:bg-muted'}`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};