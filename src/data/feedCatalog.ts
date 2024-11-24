import { FeedCatalogItem } from '../types';

export const feedCatalog: FeedCatalogItem[] = [
    // Default Feeds - AI Research & Companies
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
        url: 'https://news.mit.edu/rss/topic/artificial-intelligence-ai',
        category: 'AI',
        description: 'AI research and news from MIT'
    },
    
    // Default Feeds - AI Learning & Practice
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
    
    // Default Feeds - Science & Technology
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
    },

    // Additional Feeds - AI News & Analysis
    {
        id: 'ai-business',
        title: 'AI Business',
        url: 'https://aibusiness.com/rss.xml',
        category: 'AI News',
        description: 'Informing and educating the global AI community'
    },
    {
        id: 'venturebeat-ai',
        title: 'VentureBeat AI',
        url: 'https://venturebeat.com/category/ai/feed/',
        category: 'AI News',
        description: 'Transformative tech coverage that matters'
    },
    {
        id: 'wired-ai',
        title: 'Wired AI',
        url: 'https://www.wired.com/feed/tag/ai/latest/rss',
        category: 'AI News',
        description: 'Leading technology and AI news coverage'
    },

    // Additional Feeds - AI Engineering
    {
        id: 'huggingface',
        title: 'Hugging Face Blog',
        url: 'https://huggingface.co/blog/feed.xml',
        category: 'AI Engineering',
        description: 'Updates from the leading ML models platform'
    },
    {
        id: 'tensorflow',
        title: 'TensorFlow Blog',
        url: 'https://blog.tensorflow.org/feeds/posts/default?alt=rss',
        category: 'AI Engineering',
        description: 'Official TensorFlow framework updates'
    },

    // Additional Feeds - Data Science
    {
        id: 'kdnuggets',
        title: 'KDnuggets',
        url: 'https://www.kdnuggets.com/feed',
        category: 'Data Science',
        description: 'Leading platform for data science knowledge'
    },
    {
        id: 'analytics-india',
        title: 'Analytics India Magazine',
        url: 'https://analyticsindiamag.com/feed/',
        category: 'Data Science',
        description: 'Data Science and Analytics news from India'
    },

    // Additional Feeds - Computer Vision & NLP
    {
        id: 'pyimagesearch',
        title: 'PyImageSearch',
        url: 'https://pyimagesearch.com/blog/feed',
        category: 'Computer Vision',
        description: 'Computer Vision and Deep Learning tutorials'
    },
    {
        id: 'arxiv-cv',
        title: 'arXiv Computer Vision',
        url: 'https://arxiv.org/rss/cs.CV',
        category: 'Computer Vision',
        description: 'Latest Computer Vision research papers'
    },
    {
        id: 'arxiv-nlp',
        title: 'arXiv NLP',
        url: 'https://arxiv.org/rss/cs.CL',
        category: 'NLP',
        description: 'Latest Natural Language Processing research'
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
