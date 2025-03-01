import { defineComponent, ref, onMounted } from 'vue';
import { getBookmarks, saveBookmarks, getInfoWebsite } from '../utils/bookmark';
import type { Bookmark, BookmarkList } from '../constants/bookmark'

export default defineComponent({
  name: 'Bookmark',
  setup() {
    const bookmarks = ref<BookmarkList>([]);
    const isEditing = ref(false);
    const showAddForm = ref(false);
    const newBookmark = ref<Partial<Bookmark>>({});

    onMounted(() => {
      bookmarks.value = getBookmarks();
    });

    const handleAdd = async () => {
      if (!newBookmark.value.url) return;

      const info = await getInfoWebsite(newBookmark.value.url);
      const bookmark: Bookmark = {
        id: Date.now().toString(),
        title: newBookmark.value.title || info.title || "Anythings",
        url: info.url,
        icon: info.favicon,
      };

      bookmarks.value = [...bookmarks.value, bookmark].slice(0, 8);
      saveBookmarks(bookmarks.value);
      showAddForm.value = false;
      newBookmark.value = {};
    };

    const handleDelete = (id: string) => {
      bookmarks.value = bookmarks.value.filter(b => b.id !== id);
      saveBookmarks(bookmarks.value);
    };

    const handleEdit = (bookmark: Bookmark) => {
      newBookmark.value = { ...bookmark };
      showAddForm.value = true;
      isEditing.value = true;
    };

    return () => (
      <div class="bookmark-container mt-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          
        </div>

        <div class="bookmark-scroll" style="max-width: 700px; width:100vw; overflow-y: auto; aspect-ratio:5/1; padding: 0 1rem;">
          <div class="d-flex gap-1 flex-wrap justify-content-start align-items-center">
            {bookmarks.value.map(bookmark => (
              <div key={bookmark.id} style="width: 16%; flex-shrink: 0; ">
                <div class="bookmark-item p-2 bg-dark bg-opacity-50 rounded text-center" style="aspect-ratio: 1/1; width: 100%;">
                  <div class="d-flex justify-content-end mb-1">
                    <button
                      class="btn btn-sm btn-link text-white p-0 me-2"
                      onClick={() => handleEdit(bookmark)}
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-sm btn-link text-danger p-0"
                      onClick={() => handleDelete(bookmark.id)}
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                  <a
                    href={bookmark.url}
                    class="text-decoration-none text-white"
                  >
                    <img
                      src={bookmark.icon}
                      alt={bookmark.title}
                      class="mb-2"
                      style="width: 32px; height: 32px;"
                    />
                    <div class="small text-truncate">{bookmark.title}</div>
                  </a>
                </div>
              </div>
            ))}
            <button
              class="btn btn-outline-light d-flex align-items-center justify-content-center border-dashed rounded"
              style="width: 16%; flex-shrink: 0; aspect-ratio: 1/1;"
              onClick={() => showAddForm.value = true}
            >
              <i class="bi bi-plus" style='font-size: 3rem'></i>
            </button>
          </div>
        </div>

        {showAddForm.value && (
          <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">
                    {isEditing.value ? 'Edit Bookmark' : 'Add Bookmark'}
                  </h5>
                  <button
                    class="btn-close"
                    onClick={() => {
                      showAddForm.value = false;
                      isEditing.value = false;
                      newBookmark.value = {};
                    }}
                  ></button>
                </div>
                <div class="modal-body">
                  <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model={newBookmark.value.title}
                      placeholder="Default title"
                    />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">URL</label>
                    <input
                      type="url"
                      class="form-control"
                      v-model={newBookmark.value.url}
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    class="btn btn-secondary"
                    onClick={() => {
                      showAddForm.value = false;
                      isEditing.value = false;
                      newBookmark.value = {};
                    }}
                  >
                    Cancel
                  </button>
                  <button class="btn btn-success" onClick={handleAdd}>
                    {isEditing.value ? 'Save Changes' : 'Add Bookmark'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
});