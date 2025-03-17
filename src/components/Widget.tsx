import { defineComponent, ref } from 'vue';
import GithubStats from './GithubStats';
import WeatherWidget from './Weather'
import { WidgetType } from '@/enums/widget';

export default defineComponent({
  name: 'Widget',
  setup() {
    const widgetState = ref(localStorage.getItem('widget_state'))

    const toggleWidget = (widgetType: WidgetType) => {
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
          width: widgetState.value === WidgetType.NONE ?  '60px' : '350px',
          transition: 'width 0.3s ease',
          overflow: 'hidden'
        }}
      >
        <div class="d-flex flex-column align-items-end p-2">
          {widgetState.value === WidgetType.NONE ? (
            // When state is none, display open widget button
            <>
              <button
                class="mb-1 btn btn-sm btn-link text-white p-0"
                onClick={() => toggleWidget(WidgetType.GITHUB)}
              >
                <div class="d-flex align-items-center">
                  <i class="bi bi-github h4 m-0 me-2"></i>
                  <i class="bi bi-chevron-right"></i>
                </div>
              </button>

              <button
                class="mb-1 btn btn-sm btn-link text-white p-0"
                onClick={() => toggleWidget(WidgetType.WEATHER)}
              >
                <div class="d-flex align-items-center">
                  <i class="bi bi-cloud-sun-fill h4 m-0 me-2"></i>
                  <i class="bi bi-chevron-right"></i>
                </div>
              </button>
            </>
          ) : (
            // Display close widget button
              <button
                class="mb-1 btn btn-sm btn-link text-white p-0"
                onClick={() => toggleWidget(WidgetType.NONE)}
              >
                <i class="bi bi-chevron-left"></i>
              </button>
          )}
        </div>
        
        {/* Widget detail */}
        <div
          class="widget-content pb-3"
          style={{
            opacity: widgetState.value === WidgetType.NONE ? 0 : 1,
            transition: 'opacity 0.3s ease',
            visibility: widgetState.value === WidgetType.NONE ? 'hidden' : 'visible'
          }}
        >
          {widgetState.value === WidgetType.GITHUB && <GithubStats />}
          {widgetState.value === WidgetType.WEATHER && <WeatherWidget />}
        </div>
      </div>
    );
  }
});
