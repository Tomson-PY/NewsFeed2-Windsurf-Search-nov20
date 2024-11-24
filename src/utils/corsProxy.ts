export const createProxiedUrl = (url: string): string => {
  // For Google News, use their RSS feed directly without proxy
  if (url.includes('news.google.com')) {
    return url;
  }

  // For Hacker News, use a different proxy
  if (url.includes('hnrss.org')) {
    return `https://cors-anywhere.herokuapp.com/${url}`;
  }

  // Use allorigins for all other feeds
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
};