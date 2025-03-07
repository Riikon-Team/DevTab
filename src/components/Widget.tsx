import { defineComponent, ref } from 'vue';
import GithubStats from './GithubStats';
import WeatherWidget from './Weather'
export default defineComponent({
  name: 'Widget',
  setup() {
    // const isOpen = ref(localStorage.getItem('widget_state') !== 'false');
    const widgetState = ref(localStorage.getItem('widget_state'))

    const toggleWidget = (widgetType: string) => {
      // isOpen.value = !isOpen.value
      // Save state to localStorage
      widgetState.value = widgetType
      localStorage.setItem('widget_state', widgetState.value.toString());
    };

    return () => (
      <div
        class="widget position-fixed bg-dark bg-opacity-25 shadow-lg"
        style={{
          left: 0,
          top: 0,
          bottom: 0,
          // width: isOpen.value ? '350px' : '60px',
          width: widgetState.value !== "false" ? '350px' : '60px',
          transition: 'width 0.3s ease',
          overflow: 'hidden'
        }}
      >
        <div class="d-flex flex-column align-items-end p-2">
          {widgetState.value === "false" ? (
            <>
              <button
                class="mb-1 btn btn-sm btn-link text-white p-0"
                onClick={() => toggleWidget('github')}
              >
                <div class="d-flex align-items-center">
                  <i class="bi bi-github h4 m-0 me-2"></i>
                  <i class="bi bi-chevron-right"></i>
                </div>
              </button>

              <button
                class="mb-1 btn btn-sm btn-link text-white p-0"
                onClick={() => toggleWidget('weather')}
              >
                <div class="d-flex align-items-center">
                  <i class="bi bi-cloud-fill h4 m-0 me-2"></i>
                  <i class="bi bi-chevron-right"></i>
                </div>
              </button>
            </>
          ) : (
              <button
                class="mb-1 btn btn-sm btn-link text-white p-0"
                onClick={() => toggleWidget('false')}
              >
                <i class="bi bi-chevron-left"></i>
              </button>
          )}
        </div>

        <div
          class="widget-content pb-3"
          style={{
            opacity: widgetState.value === "false" ? 0 : 1,
            transition: 'opacity 0.3s ease',
            visibility: widgetState.value === "false" ? 'hidden' : 'visible'
          }}
        >
          {widgetState.value === 'github' && <GithubStats />}
          {widgetState.value === 'weather' && <WeatherWidget />}
        </div>
      </div>
    );
  }
});
