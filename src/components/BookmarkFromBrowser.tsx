import { defineComponent, ref, onMounted } from 'vue';

// Add Chrome API type definitions
declare namespace chrome {
  namespace bookmarks {
    function getTree(): Promise<BookmarkNode[]>;
  }
  namespace tabs {
    function create(createProperties: { url: string }): Promise<any>;
  }
}

interface BookmarkNode {
  id: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
  parentId?: string;
}

export default defineComponent({
  name: 'BookmarkFromBrowser',
  setup() {
    const isOpen = ref(false);
    const bookmarks = ref<BookmarkNode[]>([]);
    const expandedFolders = ref<Set<string>>(new Set(['1']));

    const toggleBookmarkPanel = () => {
      isOpen.value = !isOpen.value;
    };

    const toggleFolder = (folderId: string) => {
      if (expandedFolders.value.has(folderId)) {
        expandedFolders.value.delete(folderId);
      } else {
        expandedFolders.value.add(folderId);
      }
    };

    const openBookmarkManager = () => {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
          chrome.tabs.create({ url: 'chrome://bookmarks/' });
        } else {
          // Fallback for Firefox or other browsers
          window.open('chrome://bookmarks/', '_blank');
        }
      };

    const fetchBookmarks = async () => {
      try {
        // Check if we're in a browser extension context
        if (typeof chrome !== 'undefined' && chrome.bookmarks) {
          const tree = await chrome.bookmarks.getTree();
          bookmarks.value = tree[0]?.children || [];
        } else {
          console.warn('Browser bookmarks API not available. Are you running as an extension?');
          // For development testing, provide some mock data
          bookmarks.value = [
            {
              id: '1',
              title: 'Bookmarks Bar',
              children: [
                {
                  id: '2',
                  title: 'Vue.js',
                  url: 'https://vuejs.org'
                },
                {
                  id: '3',
                  title: 'Development',
                  children: [
                    {
                      id: '4',
                      title: 'GitHub',
                      url: 'https://github.com'
                    },
                    {
                      id: '5',
                      title: 'Stack Overflow',
                      url: 'https://stackoverflow.com'
                    }
                  ]
                }
              ]
            }
          ];
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };

    const renderBookmarkNode = (node: BookmarkNode) => {
      const isFolder = !node.url;
      const isExpanded = expandedFolders.value.has(node.id);
      
      if (isFolder) {
        return (
          <div key={node.id} class="bookmark-folder mb-1">
            <div 
              class="d-flex align-items-center py-1 ps-2 rounded cursor-pointer bookmark-folder-header text-white"
              onClick={() => toggleFolder(node.id)}
            >
              <i class={`bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder2'} me-2 text-warning`}></i>
              <span class="text-truncate">{node.title}</span>
              <i class={`bi ${isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} ms-auto me-2`}></i>
            </div>
            {isExpanded && node.children && (
              <div class="bookmark-folder-content ps-3 mt-1">
                {node.children.map(child => renderBookmarkNode(child))}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div key={node.id} class="bookmark-item py-1 ps-2 mb-1">
            <a 
              href={node.url} 
              class="d-flex align-items-center text-decoration-none text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src={`https://www.google.com/s2/favicons?domain=${new URL(node.url || '').hostname}`}
                alt="" 
                class="me-2"
                width="16"
                height="16"
              />
              <span class="text-truncate">{node.title}</span>
            </a>
          </div>
        );
      }
    };

    onMounted(() => {
      fetchBookmarks();
    });

    return () => (
      <div class="position-fixed" style={{ right: '10px', top: '30vh', zIndex: 900 }}>
        {/* Bookmark Icon Button */}
        <button 
          class="btn btn-dark rounded-circle p-2 d-flex justify-content-center align-items-center shadow"
          onClick={toggleBookmarkPanel}
          style={{ width: '42px', height: '42px' }}
        >
          <i class={`bi ${isOpen.value ? 'bi-x-lg' : 'bi-bookmark-star'} fs-5`}></i>
        </button>

        {/* Bookmark Panel */}
        {isOpen.value && (
          <div 
            class="bookmark-browser-panel bg-dark bg-opacity-25 shadow-lg rounded mt-2"
            style={{ 
              width: '300px', 
              maxHeight: '60vh',
              position: 'absolute',
              right: 0,
              overflowY: 'auto',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div class="p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="text-white m-0">Bookmarks</h6>
                <button 
                  class="btn btn-sm btn-outline-light" 
                  onClick={openBookmarkManager}
                  title="Manage Bookmarks"
                >
                  <i class="bi bi-gear"></i>
                </button>
              </div>
              {/* <h5 class="text-white mb-3">Browser Bookmarks</h5> */}
              <div class="bookmark-tree">
                {bookmarks.value.map(node => renderBookmarkNode(node))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
});



