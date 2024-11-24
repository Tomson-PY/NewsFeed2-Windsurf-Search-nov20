import { FeedItem } from '../types';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: true,
  trimValues: true,
  parseTrueNumberOnly: false,
  parseTagValue: false,
  textNodeName: "_",
  isArray: (name) => ['item', 'entry'].indexOf(name) !== -1
});

// Default images by category
const DEFAULT_IMAGES: { [key: string]: string } = {
  'AI News': 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
  'AI Research': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
  'AI Engineering': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
  'Computer Vision': 'https://images.unsplash.com/photo-1561736778-92e52a7769ef',
  'NLP': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d',
  'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
  'Tech News': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  'AI Learning': 'https://images.unsplash.com/photo-1509869175650-a1d97972541a'
};

const generateUniqueId = (item: any, category: string): string => {
  const titlePart = item.title ? `-${item.title.substring(0, 30)}` : '';
  const datePart = item.pubDate || item.published || item.updated || Date.now();
  const linkPart = item.link ? `-${item.link.split('/').pop()}` : '';
  
  const baseId = `${category}${titlePart}${linkPart}-${new Date(datePart).getTime()}`;
  
  return baseId
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const cleanContent = (content: any): string => {
  if (!content) return '';
  
  const textContent = typeof content === 'string' 
    ? content 
    : content['#text'] || content._ || '';

  return textContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
};

const extractImageUrl = (content: string, feedId: string, category: string): string | null => {
  if (!content) return DEFAULT_IMAGES[category] || null;

  console.log(`Attempting to extract image from ${feedId}`);

  // Feed-specific handling
  switch(feedId) {
    case 'arxiv-cv':
    case 'arxiv-nlp':
      return DEFAULT_IMAGES[category];
      
    case 'medium-feeds':
    case 'towards-data-science':
      const mediumImgMatch = content.match(/https:\/\/miro.medium.com\/[^"'\s]+/);
      return mediumImgMatch ? mediumImgMatch[0] : null;

    case 'hackernews':
      // HN doesn't have images, use tech default
      return DEFAULT_IMAGES['Tech News'];

    case 'pyimagesearch':
      const pyimageMatch = content.match(/https:\/\/pyimagesearch[^"'\s]+\.(?:png|jpg|jpeg|gif)/i);
      return pyimageMatch ? pyimageMatch[0] : null;
  }

  // Try to find image in standard locations
  const imgMatches = [
    // Standard img tag
    content.match(/<img[^>]+src="([^">]+)"/),
    // Media content tag
    content.match(/<media:content[^>]+url="([^">]+)"/),
    // Media thumbnail
    content.match(/<media:thumbnail[^>]+url="([^">]+)"/),
    // Enclosure
    content.match(/<enclosure[^>]+url="([^">]+)"[^>]+type="image/),
    // OG image
    content.match(/<meta[^>]+property="og:image"[^>]+content="([^">]+)"/),
    // Direct image URL
    content.match(/https?:\/\/[^"\s]+\.(?:jpg|jpeg|png|gif|webp)/i),
    // Figure tag
    content.match(/<figure[^>]*>.*?<img[^>]+src="([^">]+)"/s)
  ];

  // Return the first valid match
  for (const match of imgMatches) {
    if (match && match[1]) {
      console.log(`Found image URL: ${match[1]}`);
      return match[1];
    }
  }

  // Fallback to default category image
  return DEFAULT_IMAGES[category] || null;
};

const getFullContent = (item: any): string => {
  // Try different content fields in order of preference
  return item['content:encoded'] ||
         (typeof item.content === 'string' ? item.content : item.content?._) ||
         item.description ||
         item.summary ||
         item.title ||
         '';
};

export async function parseFeed(url: string, category: string, feedId: string): Promise<FeedItem[]> {
  try {
    console.log(`Fetching feed ${feedId} from URL: ${url}`);
    const response = await fetch(url);
    console.log(`Feed ${feedId} response status:`, response.status);
    
    if (!response.ok) {
      console.error(`HTTP error for feed ${feedId}! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log(`Feed ${feedId} content length:`, text.length);
    console.log(`Feed ${feedId} first 500 chars:`, text.substring(0, 500));
    
    if (!text?.trim()) {
      console.warn(`Empty response from feed ${feedId}: ${url}`);
      return [];
    }

    const result = parser.parse(text);
    console.log(`Feed ${feedId} parsed structure:`, JSON.stringify(result, null, 2).substring(0, 500));
    
    // Handle different RSS feed structures
    const channel = result.rss?.channel || result.feed || result;
    if (!channel) {
      console.warn(`Invalid feed structure for: ${url}`);
      return [];
    }

    const items = channel.item || channel.entry || [];
    if (!items?.length) {
      console.warn(`No items found in feed: ${url}`);
      return [];
    }

    return items.map((item: any): FeedItem => {
      // Get the full content with fallbacks
      const fullContent = getFullContent(item);
      console.log(`Content for item in ${feedId}:`, fullContent.substring(0, 200));

      // Handle different title formats
      const title = Array.isArray(item.title) ? item.title[0] : (
        typeof item.title === 'object' ? item.title._ : item.title
      );
      
      // Handle different link formats
      const link = Array.isArray(item.link) 
        ? item.link[0]?.href || item.link[0] 
        : typeof item.link === 'object'
          ? item.link.href || item.link._
          : item.link || '';

      // Get image URL with feed-specific handling
      const imageUrl = extractImageUrl(fullContent, feedId, category);
      if (imageUrl) {
        console.log(`Found image URL for ${feedId}:`, imageUrl);
      }

      // Add image to content if found
      const contentWithImage = imageUrl 
        ? `<img src="${imageUrl}" alt="${title || 'Article image'}" />${fullContent}`
        : fullContent;

      const cleanedContent = cleanContent(contentWithImage);

      return {
        id: generateUniqueId(item, category),
        title: title || 'Untitled',
        link: link || '',
        content: cleanedContent.substring(0, 300) + (cleanedContent.length > 300 ? '...' : ''),
        fullContent: contentWithImage,
        pubDate: item.pubDate || item.published || item.updated || new Date().toISOString(),
        category,
        feedId
      };
    });
  } catch (error) {
    console.error(`Error parsing feed: ${url}`, error);
    return [];
  }
}