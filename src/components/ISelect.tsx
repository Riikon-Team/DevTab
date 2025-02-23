import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'ISelect',
  props: {
    options: {
      type: Array as PropType<Array<{ value: string, img: string, label: string }>>,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    onChange: {
      type: Function as PropType<(value: string) => void>,
      required: true,
    },
    hasBorder:{
      type: Boolean,
      required: false,
      default: true,
    },
    hasLabel:{
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup(props) {
    const isOpen = ref(false);

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectOption = (value: string) => {
      props.onChange(value);
      isOpen.value = false;
    };

    return () => (
      <div class="dropdown _controls">
        <button 
          class={`btn dropdown-toggle` + (props.hasBorder ? ' btn-outline-secondary' : '')}
          type="button" 
          onClick={toggleDropdown}
        >
          <img 
            src={props.options.find(option => option.value === props.modelValue)?.img} 
            alt={props.modelValue} 
            style="width: 20px; height: 20px; margin-right: 5px;" 
          />
          {props.hasLabel ? props.modelValue : ''}
        </button>
        {isOpen.value && (
          <div class="dropdown-menu show _controls">
            {props.options.map(option => (
              <button 
                class="dropdown-item _controls"
                onClick={() => selectOption(option.value)}
              >
                <img 
                  src={option.img} 
                  alt={option.value} 
                  style="width: 20px; height: 20px; margin-right: 5px;" 
                />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
});