export const createProxiedUrl = (url: string): string => {
  // For Google News, use their RSS feed directly without proxy
  if (url.includes('news.google.com')) {
    return url;
  }

  // For Medium-based feeds (including Towards Data Science), use a different proxy
  if (url.includes('medium.com') || url.includes('towardsdatascience.com')) {
    return `https://cors-anywhere.herokuapp.com/${url}`;
  }

  // Use allorigins with the 'raw' endpoint for RSS feeds
  // The 'get' endpoint sometimes has issues with XML content
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
};