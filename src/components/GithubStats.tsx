import { defineComponent, ref, onMounted } from 'vue';
import { fetchGithubStats, getStoredUsername, setStoredUsername } from '../utils/github';
import type { GithubStats } from '../constants/github';

export default defineComponent({
  name: 'GithubStats',
  setup() {
    const stats = ref<GithubStats | null>(null);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const isEditing = ref(false);
    const username = ref(getStoredUsername());
    const newUsername = ref('');

    // Temp code
    const statTheme = ref(localStorage.getItem("githubStatCard") || "tokyonight")
    const streakTheme = ref(localStorage.getItem("githubStreak") || "tokyonight")
    const topLanguageTheme = ref(localStorage.getItem("githubTopLanguage") || "tokyonight")
    const githubTopLanguageCount = ref(localStorage.getItem("githubTopLanguageCount") || "6")
    const githubTopLanguageLayout = ref(localStorage.getItem("githubTopLanguageLayout") || "compact")
    const githubTopLanguageHide = ref(localStorage.getItem("githubTopLanguageHide") || "")

    const loadStats = async () => {
      loading.value = true;
      error.value = null;
      try {
        if (username.value !== null) stats.value = await fetchGithubStats(username.value);
        if (stats.value?.username=="") throw new Error("User not found");
      } catch (err) {
        // Default username
        setStoredUsername('konnn04'); 
        error.value = 'Failed to fetch GitHub stats, Please refresh and try again.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const handleUsernameChange = async () => {
      if (!newUsername.value.trim()) return;
      username.value = newUsername.value.trim();
      setStoredUsername(username.value);
      isEditing.value = false;
      await loadStats();
    };

    onMounted(() => {
      loadStats()
    });

    return () => (
      <div class="github-stats text-white p-3 rounded bg-transparent position-relative">
        {/*<p class="mb-3">Your Github stat</p>*/}
        {loading.value ? (
          <div class="text-center">
            <div class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error.value ? (
          <div class="text-danger">{error.value}</div>
        ) : stats.value ? (
          <div>
            {/* User Info Section */}
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="d-flex align-items-center">
                <img
                  src={stats.value.avatarUrl}
                  alt={stats.value.username}
                  class="rounded-circle me-2"
                  style="width: 50px; height: 50px;"
                />
                <div>
                  <h5 class="mb-0">{stats.value.name}</h5>
                  <small>@{stats.value.username}</small>
                </div>
              </div>
              <button
                class="btn btn-sm btn-outline-light"
                onClick={() => isEditing.value = true}
              >
                <i class="bi bi-pencil"></i>
              </button>
            </div>

            {isEditing.value ? (
              <div class="input-group mb-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter GitHub username"
                  v-model={newUsername.value}
                  onKeyup={(e) => e.key === 'Enter' && handleUsernameChange()}
                />
                <button
                  class="btn btn-primary"
                  onClick={handleUsernameChange}
                >
                  Save
                </button>
              </div>
            ) : (
              <div class="stats-container">
                <p class="small mb-3">{stats.value.bio}</p>

                {/* GitHub Stats Card */}
                <div class="mb-1">
                  <iframe
                    src={`https://github-readme-stats.vercel.app/api?username=${username.value}&theme=${statTheme.value}&show_icons=true&hide_border=true&count_private=true`}
                    frameborder="0"
                    scrolling="no"
                    style={{
                      width: '100%',
                      height: '125px',
                    }}
                  ></iframe>
                </div>

                {/* GitHub Streak Stats */}
                <div class="mb-3">
                  <iframe
                    src={`https://github-readme-streak-stats.herokuapp.com/?user=${username.value}&theme=${streakTheme.value}&hide_border=true`}
                    frameborder="0"
                    scrolling="no"
                    style={{
                      width: '100%',
                      height: '125px',
                    }}
                  ></iframe>
                </div>

                {/* Top Languages Card */}
                <div>
                  <iframe
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username.value}&theme=${topLanguageTheme.value}&hide_border=true&layout=${githubTopLanguageLayout.value}&langs_count=${githubTopLanguageCount.value}&hide=${githubTopLanguageHide.value}`}
                    frameborder="0"
                    scrolling="no"
                    style={{
                      width: '100%'
                    }}
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Enter GitHub username"
                v-model={newUsername.value}
                onKeyup={(e) => e.key === 'Enter' && handleUsernameChange()}
              />
              <button
                class="btn btn-primary"
                onClick={handleUsernameChange}
              >
                Save
              </button>
            </div>
            <p class="text-center">Choose a username to enable this feature.</p>
          </div>
        )}
      </div>
    );
  }
});
