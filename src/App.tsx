// filepath: /e:/code/newDevTab/DevTab/src/App.tsx
import {defineComponent, ref, onMounted} from 'vue';
import {SEARCH_ENGINES, BACKGROUNDS} from './constants/main';
import SearchHandler from './components/SearchHandler';
import BookmarkFromBrowser from './components/BookmarkFromBrowser';
import Bookmark from './components/Bookmark';
import Clock from './components/Clock'
import Widget from './components/Widget';
import IframeWindow from './components/IframeWindow';
import Setting from "@/components/Setting";
import {randomBackground} from './utils/search';

export default defineComponent({
  name: 'App',
  setup() {
    const searchEngine = ref<keyof typeof SEARCH_ENGINES>('google');
    const searchQuery = ref('');
    const searchSuggestions = ref<string[]>([]);
    const backgroundImage = ref('');
    // Currently support only closed and open popup
    const isSettingOpen = ref(false)

    const performSearch = () => {
      const searchUrl = SEARCH_ENGINES[searchEngine.value].url + encodeURIComponent(searchQuery.value);
      window.location.href = searchUrl;
    };

    const toggleSetting = (state: boolean) => {
      isSettingOpen.value = state
    }

    onMounted(() => {
      backgroundImage.value = randomBackground(BACKGROUNDS);
    });

    return () => (
      <div
        class="container-fluid d-flex justify-content-center align-items-center position-relative w-100"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage.value})`,
          height: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <Widget/>
        <IframeWindow
          id="music-player"
          url="https://konnn04.is-a.dev/m"
          icon="https://raw.githubusercontent.com/konnn04/m/refs/heads/main/assets/img/ico.jpg"
          orientation='horizontal'
          style="position: absolute; bottom: 10px; right: 10px; width: 32px; height: 32px;"
        />

        {/* <IframeWindow
          id="youtube"
          url="https://www.youtube.com/"
          icon="https://raw.githubusercontent.com/konnn04/m/refs/heads/main/assets/img/ico.jpg"
          style="position: absolute; bottom: 10px; right: 50px; width: 32px; height: 32px;"
        /> */}

        <BookmarkFromBrowser/>
        <Clock style="position: absolute; top: 10px; right: 10px; color: white"/>
        <main class="d-flex flex-column align-items-center w-100" style="max-width: 600px">
          <div class="text-center">
            <img src="/assets/img/logo.gif" alt="" style="width: 100px"/>
            <h1 class="display-1 text-white">DevTab</h1>
          </div>
          <SearchHandler
            searchEngine={searchEngine.value}
            searchQuery={searchQuery.value}
            searchSuggestions={searchSuggestions.value}
            onSearch={(query: string) => searchQuery.value = query}
            onEnter={performSearch}
            onEngineChange={(value: string) => searchEngine.value = value as keyof typeof SEARCH_ENGINES}
            onSuggestionsChange={(suggestions: string[]) => searchSuggestions.value = suggestions}
          />
          <Bookmark/>

          {isSettingOpen.value && <Setting onClose={() => toggleSetting(false)}/>}
          {/*Setting button*/}
          <button
            class="position-absolute btn btn-sm btn-link text-white p-0"
            style={{bottom: "3rem", right: "10px"}}
            onClick={() => toggleSetting(true)}
          >
            <i class="h3 bi bi-gear"></i>
          </button>
        </main>
      </div>
    );
  },
});
