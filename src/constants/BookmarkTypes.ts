// Bookmark node structure
export interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
  parentId?: string;
}

export interface BookmarkProps {
  showLabels?: boolean;
}

declare global {
  interface Window {
    chrome?: {
      bookmarks: {
        getTree(): Promise<BookmarkNode[]>;
      };
      tabs: {
        create(createProperties: { url: string }): Promise<unknown>;
      };
    };
    browser?: {
      bookmarks: {
        getTree(): Promise<BookmarkNode[]>;
      };
      tabs: {
        create(createProperties: { url: string }): Promise<unknown>;
      };
    };
  }
}