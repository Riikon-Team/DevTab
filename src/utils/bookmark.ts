import type { BookmarkList } from '../constants/bookmark'
import { API_WINFO } from '../constants/main'

const STORAGE_KEY = 'devtab_bookmarks';

export const getBookmarks = (): BookmarkList => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBookmarks = (bookmarks: BookmarkList): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
};

const favicons: { [key: string]: string } = {
  'github.com':"https://cdn-icons-png.flaticon.com/512/25/25231.png"
}

export const getInfoWebsite = async (url: string): Promise<{ title: string, description: string, favicon: string, url: string }> => {
  url = url.replace(/^(http|https):\/\//i, '');
  try{
    const response = await fetch(`${API_WINFO}${url}`);
    const { title, favicon, description, fullUrl, domain } = await response.json();
    return {
      title,
      description,
      favicon: favicons[domain] || favicon ||  '/assets/img/web.png',
      url: fullUrl
    };
  } catch {
    return {
      title: "Unknown",
      description: '',
      favicon: '/assets/img/web.png',
      url: url
    };
  }
};