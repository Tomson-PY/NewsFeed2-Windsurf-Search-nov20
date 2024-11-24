import React, { useState } from 'react';
import { FeedManager } from './FeedManager';
import { FeedCatalogSettings } from './FeedCatalogSettings';
import { ListFilter, BookOpen } from 'lucide-react';

export const FeedManagementTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manager' | 'catalog'>('manager');

  return (
    <div className="space-y-6">
      <div className="border-b border-border">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('manager')}
              className={`px-4 py-2 inline-flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'manager'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-card-foreground hover:border-border'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>Active Feeds</span>
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 inline-flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === 'catalog'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-card-foreground hover:border-border'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Feed Catalog</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'manager' ? <FeedManager /> : <FeedCatalogSettings />}
      </div>
    </div>
  );
};
