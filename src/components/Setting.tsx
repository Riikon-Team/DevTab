import {defineComponent, type PropType, ref} from "vue";
import '../assets/setting.css'

export default defineComponent({
  name: 'Setting',
  props: {
    onClose: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    // Currently support only closed and open popup
    const closeSetting = () => {
      props.onClose()
    }

    return () => (
      <div id="setting-container"
           class="position-fixed"
      >
        {/*Main Setting Popup*/}
        <div id="setting" class="p-2">
          {/*Title and exit button*/}
          <div id="setting-header" class="d-flex justify-content-between">
            <h4 class="text-white mt-4">Setting</h4>
            <i class="cursor-pointer bi bi-x-lg" onClick={closeSetting}></i>
          </div>
        </div>
      </div>
    )
  }
})
