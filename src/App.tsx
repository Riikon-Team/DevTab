import { defineComponent, ref, onMounted } from 'vue';
import { SEARCH_ENGINES, BACKGROUNDS } from './constants';
import SearchBar from './components/SearchBar';
import { PROXY } from './constants';

export default defineComponent({
  name: 'App',
  setup() {
    const searchEngine = ref<keyof typeof SEARCH_ENGINES>('google')
    const searchQuery = ref('');
    const searchSuggestions = ref<string[]>([]);
    const backgroundImage = ref('');

    const handleSearch = (query: string) => {
      searchQuery.value = query.trim();
      
      if (!query || query.length < 1) {
        searchSuggestions.value = [];
        return;
      }

      fetch(PROXY + encodeURIComponent(`https://api.bing.com/osjson.aspx?query=${query}`))
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          searchSuggestions.value = data[1].slice(0, 5);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
          searchSuggestions.value = [];
        });
    };

    const performSearch = () => {
      const searchUrl = SEARCH_ENGINES[searchEngine.value].url + encodeURIComponent(searchQuery.value);
      window.location.href = searchUrl;
    };

    const randomBackground = () => {
      const randomIndex = Math.floor(Math.random() * BACKGROUNDS.length);
      return BACKGROUNDS[randomIndex];
    };

    onMounted(() => {
      backgroundImage.value = randomBackground();
    });

    return () => (
      <div 
        class="container-fluid d-flex justify-content-center align-items-center w-100"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage.value})`,
          height: '100vh', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <main class="d-flex flex-column align-items-center w-100" style="max-width: 600px">
          <div class="text-center">
            <img src="/assets/img/logo.gif" alt="" style="width: 100px" />
            <h1 class="display-1 text-white">DevTab</h1>
          </div>
          <SearchBar 
            searchEngine={searchEngine.value}
            searchQuery={searchQuery.value}
            searchSuggestions={searchSuggestions.value}
            onSearch={handleSearch}
            onEnter={performSearch}
            onEngineChange={(value: string) => searchEngine.value = value as keyof typeof SEARCH_ENGINES}
          />
        </main>
      </div>
    );
  },
});