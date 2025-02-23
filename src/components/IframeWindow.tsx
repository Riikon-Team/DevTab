import { defineComponent, ref, computed } from 'vue';
import type { PropType } from 'vue';
import { useDraggable } from '@vueuse/core';
import { useWindowStore } from '../stores/windowStore';

export interface IframeWindowProps {
  url: string;
  icon: string;
  orientation?: 'horizontal' | 'vertical';
  id: string; // Add new prop for unique identification
}

export default defineComponent({
  name: 'IframeWindow',
  props: {
    url: {
      type: String as PropType<string>,
      required: true
    },
    icon: {
      type: String as PropType<string>,
      required: true
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'vertical'
    },
    id: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {
    const isMinimized = ref(false);
    const windowRef = ref<HTMLDivElement | null>(null);
    const { setActiveWindow, isWindowActive } = useWindowStore();

    const dimensions = computed(() => {
      const baseShorter = 400;
      const aspect = 16 / 9;

      if (props.orientation === 'horizontal') {
        return {
          width: `${baseShorter * aspect}px`,
          height: `${baseShorter}px`
        };
      }
      return {
        width: `${baseShorter}px`,
        height: `${baseShorter * aspect}px`
      };
    });

    // Initialize draggable with bottom-right position
    const { x, y } = useDraggable(windowRef, {
      initialValue: {
        x: window.innerWidth - (parseInt(dimensions.value.width) + 20),
        y: window.innerHeight - (parseInt(dimensions.value.height) + 20)
      }
    });

    const style = computed(() => ({
      left: `${x.value}px`,
      top: `${y.value}px`
    }));

    const toggleWindow = () => {
      if (isWindowActive(props.id)) {
        setActiveWindow(null);
      } else {
        setActiveWindow(props.id);
      }
    };

    const toggleMinimize = () => {
      isMinimized.value = !isMinimized.value;
    };

    return () => (
      <div>
        <button
          class="btn btn-link p-0"
          onClick={toggleWindow}
          style="width: 32px; height: 32px;"
        >
          <img
            src={props.icon}
            alt="Website Icon"
            style="width: 100%; height: 100%; object-fit: contain;"
          />
        </button>

        {isWindowActive(props.id) && (
          <div
            ref={windowRef}
            class="iframe-window position-fixed bg-dark rounded shadow-lg overflow-hidden"
            style={{
              ...style.value,
              width: dimensions.value.width,
              height: isMinimized.value ? '40px' : dimensions.value.height,
              zIndex: 1000,
              transition: 'height 0.3s ease'
            }}
          >
            <div class="window-header d-flex justify-content-between align-items-center p-2 bg-dark border-bottom border-secondary">
              <div class="d-flex align-items-center">
                <img
                  src={props.icon}
                  alt="Website Icon"
                  style="width: 16px; height: 16px; margin-right: 8px;"
                />
                <span class="text-white small">
                  {new URL(props.url).hostname}
                </span>
              </div>
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-sm btn-link text-white p-0 me-2"
                  onClick={toggleMinimize}
                >
                  <i class={`bi bi-${isMinimized.value ? 'chevron-up' : 'chevron-down'}`}></i>
                </button>
                <button
                  class="btn btn-sm btn-link text-white p-0"
                  onClick={toggleWindow}
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <iframe
              src={props.url}
              style={{
                width: '142%',
                height: 'calc(142% - 40px)',
                border: 'none',
                transform: 'scale(0.68) translateX(-22%)',
                transformOrigin: 'top center',
                backgroundColor: 'white',
                visibility: isMinimized.value ? 'hidden' : 'visible',
                position: 'absolute',
                top: '40px',
                left: 0,
                right: 0,
                bottom: 0,
                opacity: isMinimized.value ? 0 : 1,
                transition: 'opacity 0.3s ease',          
                
              }}
            ></iframe>
          </div>
        )}
      </div>
    );
  }
});