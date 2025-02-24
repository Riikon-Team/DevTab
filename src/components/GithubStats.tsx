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
    // Default github param
    const githubStyle = {
      statCard: {theme: 'tokyonight'},
      streak: {theme: 'tokyonight'},
      topLanguage: {theme: 'tokyonight'}
    }

    const loadStats = async () => {
      loading.value = true;
      error.value = null;
      try {
        stats.value = await fetchGithubStats(username.value);
      } catch (err) {
        error.value = 'Failed to load GitHub stats';
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

    const loadGithubStyle = async () => {
      const defaultTheme = 'tokyonight'
      //Currently support theme parameter
      const cardStyle = localStorage.getItem("githubStatCard") || defaultTheme
      const streakStyle = localStorage.getItem("githubStreak") || defaultTheme
      const topLanguageStyle = localStorage.getItem("githubTopLanguage") || defaultTheme
      githubStyle.statCard = {theme: cardStyle}
      githubStyle.streak = {theme: streakStyle}
      githubStyle.topLanguage = {theme: topLanguageStyle}
    }

    onMounted(() => {
      loadStats()
      loadGithubStyle()
    });

    return () => (
      <div class="github-stats text-white p-3 rounded bg-transparent position-relative">
        {loading.value ? (
          <div class="text-center">
            <div class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error.value ? (
          <div class="text-danger">{error.value}</div>
        ) : stats.value && (
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
                    src={`https://github-readme-stats.vercel.app/api?username=${username.value}&theme=${githubStyle.statCard.theme}&show_icons=true&hide_border=true&count_private=true`}
                    frameborder="0"
                    scrolling="no"
                    style={{
                      width: '100%',
                      height: '120px',
                    }}
                  ></iframe>
                </div>

                {/* GitHub Streak Stats */}
                <div class="mb-3">
                  <iframe
                    src={`https://github-readme-streak-stats.herokuapp.com/?user=${username.value}&theme=${githubStyle.streak.theme}&hide_border=true`}
                    frameborder="0"
                    scrolling="no"
                    style={{
                      width: '100%',
                      height: '120px',
                    }}
                  ></iframe>
                </div>

                {/* Top Languages Card */}
                <div>
                  <iframe
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username.value}&theme=${githubStyle.topLanguage.theme}&hide_border=true&layout=compact`}
                    frameborder="0"
                    scrolling="no"
                    style={{
                      width: '100%',
                      height: '120px',
                    }}
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
});
