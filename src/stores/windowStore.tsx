import { ref } from 'vue';

const activeWindowId = ref<string | null>(null);

export const useWindowStore = () => {
  const setActiveWindow = (id: string | null) => {
    activeWindowId.value = id;
  };

  const isWindowActive = (id: string) => {
    return activeWindowId.value === id;
  };

  return {
    activeWindowId,
    setActiveWindow,
    isWindowActive
  };
};