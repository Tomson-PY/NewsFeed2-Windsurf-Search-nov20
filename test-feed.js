import fetch from 'node-fetch';

async function testFeed() {
  const url = 'https://news.mit.edu/rss/topic/artificial-intelligence2';
  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', text.substring(0, 500) + '...');
  } catch (error) {
    console.error('Error fetching feed:', error);
  }
}

testFeed();
