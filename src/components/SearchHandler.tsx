import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { fetchSearchSuggestions } from '../utils/search';
import SearchBar from './SearchBar';

export default defineComponent({
  name: 'SearchHandler',
  props: {
    searchEngine: {
      type: String,
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
    },
    searchSuggestions: {
      type: Array,
      required: true,
    },
    onSearch: {
      type: Function,
      required: true,
    },
    onEnter: {
      type: Function as PropType<(event?: MouseEvent) => void>,
      required: true,
    },
    onEngineChange: {
      type: Function as PropType<(value: string) => void>,
      required: true,
    },
    onSuggestionsChange: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const handleSearch = async (query: string) => {
      props.onSearch(query.trim());

      if (!query || query.length < 1) {
        props.onSuggestionsChange([]);
        return;
      }

      try {
        const suggestions = await fetchSearchSuggestions(query);
        props.onSuggestionsChange(suggestions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        props.onSuggestionsChange([]);
      }
    };

    return () => (
      <div>
        <SearchBar 
          searchEngine={props.searchEngine}
          searchQuery={props.searchQuery}
          searchSuggestions={props.searchSuggestions}
          onSearch={handleSearch}
          onEnter={props.onEnter}
          onEngineChange={props.onEngineChange}
        />
      </div>
    );
  },
});