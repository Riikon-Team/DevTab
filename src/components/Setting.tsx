import {defineComponent, type PropType} from "vue";
import '../assets/setting.css'
import GithubSetting from "@/components/GithubSetting.tsx";

export default defineComponent({
  name: 'Setting',
  props: {
    onClose: {
      type: Function as PropType<() => void>,
      required: true
    },
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
        <div id="setting" class="rounded p-4">
          {/*Title and exit button*/}
          <div id="setting-header" class="d-flex justify-content-between">
            <h3 class="text-white mt-4">Setting</h3>
            <i class="cursor-pointer bi bi-x-lg" onClick={closeSetting}></i>
          </div>
          {/*Body setting*/}
          <div id="setting-body">
            <GithubSetting/>
          </div>
          {/*Footer setting*/}
          <div id="setting-footer" class="row">

          </div>
        </div>
      </div>
    )
  }
})


