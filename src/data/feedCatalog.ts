import { FeedCatalogItem } from '../types';

export const feedCatalog: FeedCatalogItem[] = [
    // AI Research & Companies
    {
        id: 'google-ai',
        title: 'Google AI Blog',
        url: 'https://blog.google/technology/ai/rss/',
        category: 'AI',
        description: 'Latest AI research and developments from Google'
    },
    {
        id: 'openai',
        title: 'OpenAI Blog',
        url: 'https://openai.com/api/feed.rss',
        category: 'AI',
        description: 'Updates and research from OpenAI'
    },
    {
        id: 'deepmind',
        title: 'DeepMind Blog',
        url: 'https://deepmind.google/blog/feed/basic/',
        category: 'AI',
        description: 'Latest breakthroughs in AI research from DeepMind'
    },
    {
        id: 'mit-ai',
        title: 'MIT AI News',
        url: 'https://news.mit.edu/rss/topic/artificial-intelligence',
        category: 'AI',
        description: 'AI research and news from MIT'
    },
    
    // AI Learning & Practice
    {
        id: 'towards-data-science',
        title: 'Towards Data Science - AI',
        url: 'https://medium.com/feed/towards-data-science/tagged/artificial-intelligence',
        category: 'AI Learning',
        description: 'AI-focused articles from Towards Data Science'
    },
    {
        id: 'ml-mastery',
        title: 'Machine Learning Mastery',
        url: 'https://machinelearningmastery.com/feed/',
        category: 'AI Learning',
        description: 'Practical machine learning tutorials and guides'
    },
    
    // Science & Technology
    {
        id: 'nasa',
        title: 'NASA Breaking News',
        url: 'https://www.nasa.gov/news-release/feed/',
        category: 'Science',
        description: 'Latest space and science news from NASA'
    },
    {
        id: 'hackernews',
        title: 'Hacker News',
        url: 'https://hnrss.org/frontpage',
        category: 'Technology',
        description: 'Technology news and discussions'
    }
];

export function getFeedsByCategory() {
    const categoryMap = new Map<string, FeedCatalogItem[]>();
    
    feedCatalog.forEach(feed => {
        if (!categoryMap.has(feed.category)) {
            categoryMap.set(feed.category, []);
        }
        categoryMap.get(feed.category)?.push(feed);
    });
    
    return categoryMap;
}
