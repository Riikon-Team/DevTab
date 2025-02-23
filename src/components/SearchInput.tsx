import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SearchInput',
  props: {
    onSearch: {
      type: Function,
      required: true,
    },
    onEnter: {
      type: Function,
      required: false,
    },
  },
  setup(props) {
    const query = ref('');
    let timeout: ReturnType<typeof setTimeout>;

    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      query.value = target.value;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        // Timeout is triggered
        props.onSearch(query.value);
      }, 500); 
    };

    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        props.onEnter?.();
      }
    };

    return () => (
      <input
        type="text"
        class="form-control _controls border-0"
        style=""
        placeholder="Search..."
        value={query.value}
        onInput={handleInput}
        onKeydown={handleEnter}
      />
    );
  },
});