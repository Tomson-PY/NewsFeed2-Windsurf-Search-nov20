import { FeedCatalogItem } from '../types';

export const feedCatalog: FeedCatalogItem[] = [
    // AI News & Analysis
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
    {
        id: 'guardian-ai',
        title: 'The Guardian AI',
        url: 'https://www.theguardian.com/technology/artificialintelligenceai/rss',
        category: 'AI News',
        description: 'Quality journalism covering AI developments'
    },

    // Research & Academic
    {
        id: 'deepmind',
        title: 'DeepMind Blog',
        url: 'https://deepmind.com/blog/feed/basic/',
        category: 'AI Research',
        description: 'Latest breakthroughs in AI research from DeepMind'
    },
    {
        id: 'openai',
        title: 'OpenAI Blog',
        url: 'https://openai.com/blog/rss/',
        category: 'AI Research',
        description: 'Updates and research from OpenAI'
    },
    {
        id: 'google-ai',
        title: 'Google AI Blog',
        url: 'http://googleaiblog.blogspot.com/atom.xml',
        category: 'AI Research',
        description: 'Latest AI research and developments from Google'
    },
    {
        id: 'berkeley-ai',
        title: 'Berkeley AI Research',
        url: 'https://bair.berkeley.edu/blog/feed.xml',
        category: 'AI Research',
        description: 'Academic AI research from UC Berkeley'
    },
    {
        id: 'mit-ml',
        title: 'MIT ML News',
        url: 'https://news.mit.edu/topic/mitmachine-learning-rss.xml',
        category: 'AI Research',
        description: 'Machine learning news from MIT'
    },

    // AI Engineering & Practice
    {
        id: 'huggingface',
        title: 'Hugging Face Blog',
        url: 'https://huggingface.co/blog/feed.xml',
        category: 'AI Engineering',
        description: 'Updates from the leading ML models platform'
    },
    {
        id: 'weights-biases',
        title: 'Weights & Biases',
        url: 'https://wandb.ai/fully-connected/rss.xml',
        category: 'AI Engineering',
        description: 'ML experiment tracking and model management'
    },
    {
        id: 'tensorflow',
        title: 'TensorFlow Blog',
        url: 'https://blog.tensorflow.org/feeds/posts/default?alt=rss',
        category: 'AI Engineering',
        description: 'Official TensorFlow framework updates'
    },
    {
        id: 'eugene-yan',
        title: 'Eugene Yan',
        url: 'https://eugeneyan.com/rss/',
        category: 'AI Engineering',
        description: 'Applied ML and engineering best practices'
    },

    // Data Science & Learning
    {
        id: 'towards-data-science',
        title: 'Towards Data Science',
        url: 'https://medium.com/feed/towards-data-science',
        category: 'AI Learning',
        description: 'Community-driven data science content'
    },
    {
        id: 'ml-mastery',
        title: 'Machine Learning Mastery',
        url: 'https://machinelearningmastery.com/feed/',
        category: 'AI Learning',
        description: 'Practical machine learning tutorials and guides'
    },
    {
        id: 'fast-ai',
        title: 'fast.ai Blog',
        url: 'https://www.fast.ai/index.xml',
        category: 'AI Learning',
        description: 'Making neural nets uncool again'
    },
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
    {
        id: 'neptune-ai',
        title: 'Neptune.ai Blog',
        url: 'https://neptune.ai/blog/feed',
        category: 'Data Science',
        description: 'ML experiment management and monitoring'
    },

    // Computer Vision & NLP
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
    },
    {
        id: 'explosion-ai',
        title: 'Explosion AI',
        url: 'https://explosion.ai/feed',
        category: 'NLP',
        description: 'Creators of spaCy and industrial NLP tools'
    },

    // Tech News
    {
        id: 'techcrunch',
        title: 'TechCrunch',
        url: 'https://techcrunch.com/feed/',
        category: 'Tech News',
        description: 'Leading technology news and analysis'
    },
    {
        id: 'mit-tech-review',
        title: 'MIT Technology Review',
        url: 'https://www.technologyreview.com/feed/',
        category: 'Tech News',
        description: 'Technology news from MIT\'s media company'
    },
    {
        id: 'the-verge',
        title: 'The Verge',
        url: 'https://www.theverge.com/rss/index.xml',
        category: 'Tech News',
        description: 'Technology, science, art, and culture news'
    },
    {
        id: 'hackernews',
        title: 'Hacker News',
        url: 'https://hnrss.org/frontpage',
        category: 'Tech News',
        description: 'Tech news and discussions from Y Combinator'
    },

    // Science & Space
    {
        id: 'nasa',
        title: 'NASA Breaking News',
        url: 'https://www.nasa.gov/news-release/feed/',
        category: 'Science',
        description: 'Latest news and updates from NASA'
    },

    // Technology
    {
        id: 'hackernews',
        title: 'Hacker News',
        url: 'https://hnrss.org/frontpage',
        category: 'Technology',
        description: 'Top stories from the tech community'
    },

    // AI Companies & Research
    {
        id: 'google-ai',
        title: 'Google AI Blog',
        url: 'http://googleaiblog.blogspot.com/atom.xml',
        category: 'AI',
        description: 'Latest AI research and developments from Google'
    },
    {
        id: 'openai',
        title: 'OpenAI Blog',
        url: 'https://openai.com/blog/rss.xml',
        category: 'AI',
        description: 'Updates and breakthroughs from OpenAI'
    },
    {
        id: 'mit-ai',
        title: 'MIT AI News',
        url: 'https://news.mit.edu/topic/artificial-intelligence2/rss',
        category: 'AI',
        description: 'AI research and news from MIT'
    },
    {
        id: 'deepmind',
        title: 'DeepMind Blog',
        url: 'https://deepmind.google/blog/feed/basic/',
        category: 'AI',
        description: 'Latest AI research from DeepMind'
    },
    {
        id: 'aws-ai',
        title: 'AWS AI Blog',
        url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
        category: 'AI',
        description: 'AI and machine learning updates from AWS'
    },
    {
        id: 'nvidia-ai',
        title: 'NVIDIA AI News',
        url: 'https://blogs.nvidia.com/blog/category/deep-learning/feed/',
        category: 'AI',
        description: 'AI and deep learning news from NVIDIA'
    },
    {
        id: 'microsoft-ai',
        title: 'Microsoft AI Blog',
        url: 'https://blogs.microsoft.com/ai/feed/',
        category: 'AI',
        description: 'AI developments and updates from Microsoft'
    },

    // AI Learning & Education
    {
        id: 'ml-mastery',
        title: 'Machine Learning Mastery',
        url: 'https://machinelearningmastery.com/feed/',
        category: 'AI Learning',
        description: 'Practical machine learning tutorials and guides'
    },
    {
        id: 'towards-datascience',
        title: 'Towards Data Science',
        url: 'https://towardsdatascience.com/feed',
        category: 'AI Learning',
        description: 'Data science and machine learning articles from the community'
    },

    // AI News & Analysis
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
    {
        id: 'guardian-ai',
        title: 'The Guardian AI',
        url: 'https://www.theguardian.com/technology/artificialintelligenceai/rss',
        category: 'AI News',
        description: 'Quality journalism covering AI developments'
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
