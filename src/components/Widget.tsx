import { defineComponent, ref } from 'vue';
import GithubStats from './GithubStats';

export default defineComponent({
  name: 'Widget',
  setup() {
    const isOpen = ref(localStorage.getItem('widget_state') !== 'false');

    const toggleWidget = () => {
      isOpen.value = !isOpen.value;
      // Save state to localStorage
      localStorage.setItem('widget_state', isOpen.value.toString());
    };

    return () => (
      <div
        class="widget position-fixed bg-dark bg-opacity-25 shadow-lg"
        style={{
          left: 0,
          top: 0,
          bottom: 0,
          width: isOpen.value ? '350px' : '40px',
          transition: 'width 0.3s ease',
          overflow: 'hidden'
        }}
      >
        <div class="d-flex justify-content-end p-2">
          <button 
            class="btn btn-sm btn-link text-white p-0"
            onClick={toggleWidget}
          >
            <i class={`bi bi-chevron-${isOpen.value ? 'left' : 'right'}`}></i>
          </button>
        </div>
        
        <div 
          class="widget-content px-3"
          style={{
            opacity: isOpen.value ? 1 : 0,
            transition: 'opacity 0.3s ease',
            visibility: isOpen.value ? 'visible' : 'hidden'
          }}
        >
          <GithubStats />
        </div>
      </div>
    );
  }
});