import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import SearchInput from './SearchInput';
import ISelect from './ISelect';
import * as constants from '../constants/main';

export default defineComponent({
  name: 'SearchBar',
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
  },
  setup(props) {
    const searchEngineOptions = Object.entries(constants.SEARCH_ENGINES).map(([value, { img }]) => ({
      value,
      img,
      label: value,
    }));
    return () => (
      <div class="input-group mb-3 position-relative rounded">
        <ISelect
          options={searchEngineOptions} 
          modelValue={props.searchEngine} 
          onChange={props.onEngineChange}
          hasBorder = {false}
          hasLabel = {false}
          style="border-radius: 10px 0 0 10px;"
        />
        <SearchInput onSearch={props.onSearch} onEnter={props.onEnter} />
        <button class="btn btn-primary" onClick={props.onEnter}>
          <i class="bi bi-search"></i>
        </button>
        {props.searchSuggestions.length > 0 && (
          <div class="dropdown-menu show position-absolute w-100 _controls border-secondary" style="top: 100%; z-index: 1000;">
            {props.searchSuggestions.map((suggestion, index) => (
              <button 
                key={index} 
                class="dropdown-item"
                onClick={() => {
                  props.onSearch(suggestion);
                  props.onEnter();
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
});