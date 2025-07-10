/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { AppBar, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderIcon from "@mui/icons-material/Folder";
import { type BookmarkNode, type BookmarkProps } from "../../constants/BookmarkTypes";
import { useBookmarkSettings } from "../../hooks/useSettings";
import "./Bookmark.css";
import { sampleBookmarks } from "../../test/bookmark";

declare const chrome: any;
declare const browser: any;

const Bookmark: React.FC<BookmarkProps> = React.memo(() => {
  const { bookmarkSettings } = useBookmarkSettings();
  const [bookmarks, setBookmarks] = useState<BookmarkNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFolder, setSelectedFolder] = useState<BookmarkNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const bookmarksRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  useEffect(() => {
    const calculateMaxScroll = () => {
      if (!bookmarksRef.current || !containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth - 120;
      const contentWidth = bookmarksRef.current.scrollWidth;
      setMaxScroll(Math.max(0, contentWidth - containerWidth));
    };
    
    calculateMaxScroll();
    window.addEventListener('resize', calculateMaxScroll);
    return () => window.removeEventListener('resize', calculateMaxScroll);
  }, [bookmarks]);
  
  useEffect(() => {
    fetchBookmarks();
  }, []);
  
  const fetchBookmarks = async () => {
    try {
      const browserAPI = typeof chrome !== 'undefined' ? chrome : 
                        typeof browser !== 'undefined' ? browser : null;
    
      if (browserAPI?.bookmarks) {
        const tree = await browserAPI.bookmarks.getTree();
        const bookmarksBar = tree[0]?.children?.[0];
        setBookmarks(bookmarksBar?.children || []);
      } else {
        console.warn('Browser bookmarks API not available. Using mock data.');
        setBookmarks(sampleBookmarks);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBookmark = (url?: string) => {
    if (!url) return;
    
    const browserAPI = typeof chrome !== 'undefined' ? chrome : 
                      typeof browser !== 'undefined' ? browser : null;
  
    if (browserAPI?.tabs) {
      browserAPI.tabs.create({ url });
    } else {
      window.open(url, '_self', 'noopener,noreferrer');
    }
  };


  const handleFolderClick = (folder: BookmarkNode, event: React.MouseEvent<HTMLElement>) => {
    setSelectedFolder(folder);
    setAnchorEl(event.currentTarget);
  };

  const handleFolderClose = () => {
    setAnchorEl(null);
  };

  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return newExpanded;
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (!bookmarksRef.current) return;
    
    const scrollAmount = containerRef.current?.clientWidth ? containerRef.current.clientWidth * 0.5 : 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount) 
      : Math.min(maxScroll, scrollPosition + scrollAmount);
    
    setScrollPosition(newPosition);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 'right' : 'left';
    handleScroll(direction);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleScroll('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleScroll('right');
    }
  };

  const renderFolderMenu = () => {
    if (!selectedFolder) return null;
    
    const renderBookmarkNode = (node: BookmarkNode, depth = 0) => {
      const isFolder = !node.url && node.children && node.children.length > 0;
      const isExpanded = expandedFolders.has(node.id);
      
      if (isFolder) {
        return (
          <div key={node.id}>
            <MenuItem 
              onClick={() => toggleFolderExpansion(node.id)}
              sx={{ pl: 1 + depth * 2 }}
              className={isExpanded ? 'active-folder' : ''}
            >
              <FolderIcon sx={{ mr: 1, color: isExpanded ? 'primary.main' : 'text.secondary' }} />
              <span>{node.title}</span>
              <span className="folder-indicator">{isExpanded ? '▼' : '▶'}</span>
            </MenuItem>
            
            {isExpanded && node.children && (
              <div className="subfolder-container">
                {node.children.map(child => renderBookmarkNode(child, depth + 1))}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <MenuItem 
            key={node.id} 
            onClick={() => {
              openBookmark(node.url);
              handleFolderClose();
            }}
            sx={{ pl: 1 + depth * 2 }}
          >
            <div className="menu-favicon">
              {node.url && (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${new URL(node.url).hostname}&sz=32`}
                  alt=""
                  width="16"
                  height="16"
                />
              )}
            </div>
            <span>{node.title}</span>
          </MenuItem>
        );
      }
    };

    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFolderClose}
        className="bookmark-folder-menu"
        slotProps={{
          paper: {
            sx: {
              maxHeight: '70vh',
              maxWidth: '320px',
              width: '280px',
            }
          }
        }}
      >
        <div className="folder-menu-header">
          <span>{selectedFolder.title}</span>
        </div>
        <div className="folder-menu-content">
          {selectedFolder.children?.map(node => renderBookmarkNode(node))}
        </div>
      </Menu>
    );
  };

  const renderBookmarks = () => {
    return bookmarks.map(bookmark => {
      const isFolder = !bookmark.url && bookmark.children && bookmark.children.length > 0;
      
      if (isFolder && !bookmarkSettings.showFolders) {
        return null;
      }
      
      return (
        <Tooltip key={bookmark.id} title={bookmark.title} arrow placement="bottom">
          <div 
            className={`bookmark-item ${bookmarkSettings.labelsPosition === 'right' ? 'horizontal' : ''}`}
            onClick={(e) => isFolder ? handleFolderClick(bookmark, e) : openBookmark(bookmark.url)}
          >
            {bookmarkSettings.showIcons && (
              <div 
                className="bookmark-icon" 
                style={{ 
                  width: `${bookmarkSettings.iconSize || 16}px`, 
                  height: `${bookmarkSettings.iconSize || 16}px` 
                }}
              >
                {isFolder ? (
                  <div className="folder-icon">
                    <FolderIcon />
                    <span className="folder-count">{bookmark.children?.length}</span>
                  </div>
                ) : (
                  bookmark.url && (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`}
                      alt=""
                      width={bookmarkSettings.iconSize || 16}
                      height={bookmarkSettings.iconSize || 16}
                    />
                  )
                )}
              </div>
            )}
            {bookmarkSettings.showLabels && (
              <div className="bookmark-title">{bookmark.title}</div>
            )}
          </div>
        </Tooltip>
      );
    });
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < maxScroll;

  if (loading) {
    return (
      <AppBar 
        position="static" 
        className={`bookmark-bar ${bookmarkSettings.backgroundTransparent ? 'transparent' : ''}`}
        style={{ backdropFilter: `blur(${bookmarkSettings.blur}px)` }}
      >
        <div className="bookmark-container">
          Loading bookmarks...
        </div>
      </AppBar>
    );
  }

  if (!bookmarkSettings.enable) {
    return null;
  }

  return (
    <AppBar 
      position="static" 
      className={`bookmark-bar ${bookmarkSettings.backgroundTransparent ? 'transparent' : ''}`}
      style={{ backdropFilter: `blur(${bookmarkSettings.blur}px)` }}
    >
      <div 
        className="bookmark-container" 
        ref={containerRef} 
        tabIndex={0} 
        onKeyDown={handleKeyDown}
      >
        <IconButton 
          className={`nav-button left ${!canScrollLeft ? 'hidden' : ''}`}
          onClick={() => handleScroll('left')}
          size="small"
          style={{ opacity: canScrollLeft ? 1 : 0 }}
          disabled={!canScrollLeft}
        >
          <ChevronLeftIcon />
        </IconButton>
        
        <div className="bookmarks-wrapper" onWheel={handleWheel}>
          <div 
            className="bookmarks-display" 
            ref={bookmarksRef}
            style={{ transform: `translateX(${-scrollPosition}px)` }}
          >
            {renderBookmarks()}
          </div>
        </div>
        
        <IconButton 
          className={`nav-button right ${!canScrollRight ? 'hidden' : ''}`}
          onClick={() => handleScroll('right')}
          size="small"
          style={{ opacity: canScrollRight ? 1 : 0 }}
          disabled={!canScrollRight}
        >
          <ChevronRightIcon />
        </IconButton>
        
        {renderFolderMenu()}
      </div>
    </AppBar>
  );
});

export default Bookmark;