import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import './NewsFeed.css';

interface NewsItem {
  title: string;
  link: string;
  img?: string;
  source: string;
}

const RSS_FEEDS = [
  {
    url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
    source: 'VnExpress',
  },
  {
    url: 'https://news.google.com/rss?hl=vi&gl=VN&ceid=VN:vi',
    source: 'Google News',
  },
  {
    url: 'https://thanhnien.vn/rss/home.rss',
    source: 'Thanh Nien',
  },
];

function getRandomFeed() {
  return RSS_FEEDS[Math.floor(Math.random() * RSS_FEEDS.length)];
}

const NewsFeed: React.FC<{ enable?: boolean }> = ({ enable = true }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feed, setFeed] = useState(getRandomFeed());

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      let items: NewsItem[] = [];
      // Thử allorigins trước
      try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`);
        const data = await res.json();
        const parser = new window.DOMParser();
        const xml = parser.parseFromString(data.contents, 'text/xml');
        items = Array.from(xml.querySelectorAll('item')).slice(0, 5).map((item) => {
          const title = item.querySelector('title')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          let img = '';
          const enclosure = item.querySelector('enclosure');
          if (enclosure && enclosure.getAttribute('url')) {
            img = enclosure.getAttribute('url')!;
          } else {
            const desc = item.querySelector('description')?.textContent || '';
            const match = desc.match(/<img.*?src=["'](.+?)["']/);
            if (match) img = match[1];
          }
          return { title, link, img, source: feed.source };
        });
      } catch {
        // Fallback sang rss2json nếu allorigins lỗi
        const rss2json = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
        const res = await fetch(rss2json);
        const data = await res.json();
        if (data.items) {
          items = data.items.slice(0, 5).map((item: any) => ({
            title: item.title,
            link: item.link,
            img: item.thumbnail || '',
            source: feed.source,
          }));
        }
      }
      if (!items.length) throw new Error('Không có tin tức.');
      setNews(items);
    } catch (e) {
      setError('Không thể tải tin tức.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enable) fetchNews();
    // eslint-disable-next-line
  }, [feed, enable]);

  const handleRefresh = () => {
    setFeed(getRandomFeed());
  };

  if (!enable) return null;

  return (
    <div className="newsfeed-container">
      <div className="newsfeed-header">
        <h2>News Feed</h2>
        <IconButton onClick={handleRefresh} color="inherit" size="small" aria-label="refresh" sx={{ ml: 1 }}>
          <RefreshIcon />
        </IconButton>
      </div>
      <div className="newsfeed-source">{feed.source}</div>
      {loading && <div>Đang tải...</div>}
      {error && <div className="newsfeed-error">{error}</div>}
      <ul className="newsfeed-list">
        {news.map((item, idx) => (
          <li key={idx} className="newsfeed-item">
            {item.img && <img src={item.img} alt="thumb" className="newsfeed-thumb" />}
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="newsfeed-title">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsFeed; 