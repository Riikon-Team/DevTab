import { defineComponent, type PropType, ref } from "vue";
import '../assets/setting.css'
import GithubSetting from "@/components/GithubSetting.tsx";

type TabType = 'general' | 'github';

export default defineComponent({
  name: 'Setting',
  props: {
    onClose: {
      type: Function as PropType<() => void>,
      required: true
    },
  },
  setup(props) {
    const activeTab = ref<TabType>('general');
    const weatherLocation = ref<string>(localStorage.getItem('weatherLocation') || "")
    const tempatureScale = ref<string>(localStorage.getItem('tempatureScale') || "C")

    const setActiveTab = (tab: TabType) => {
      activeTab.value = tab;
    };

    const closeSetting = () => {
      props.onClose();
    };

    const getTempatureScaleString = (scale: string | null): string => {
      if (!scale) return 'Choose a tempature scale'
      
      switch (scale) {
        case 'C': return 'Celcius (°C)'
        case 'F': return 'Fahrenheit (°F)'
        default: return 'Choose a tempature scale'
      }
    }

    const submitSetting = (): void => {
      const locationComponent = document.getElementById("weather-location") as HTMLInputElement
      const tempatureScaleComponent = document.getElementById("tempature-scale") as HTMLSelectElement
      weatherLocation.value = locationComponent.value
      tempatureScale.value = tempatureScaleComponent.value === 'nothing' ? "C" : tempatureScale.value
      localStorage.setItem('weatherLocation', weatherLocation.value)
      localStorage.setItem('tempatureScale', tempatureScale.value)
    }

    return () => (
      <div id="setting-container" class="position-fixed">
        {/*Main Setting Popup*/}
        <div id="setting" class="rounded p-4 bg-dark bg-opacity-75">
          {/*Title and exit button*/}
          <div id="setting-header" class="d-flex justify-content-between align-items-center">
            <h3 class="text-white mb-3">Setting</h3>
            <button class="btn btn-link text-white p-0" onClick={closeSetting}>
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          {/*Tabs Navigation*/}
          <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
              <button
                class={`nav-link ${activeTab.value === 'general' ? 'active bg-dark bg-opacity-50 text-white' : 'text-white-50'}`}
                onClick={() => setActiveTab('general')}
              >
                <i class="bi bi-gear me-2"></i>
                General
              </button>
            </li>
            <li class="nav-item">
              <button
                class={`nav-link ${activeTab.value === 'github' ? 'active bg-dark bg-opacity-50 text-white' : 'text-white-50'}`}
                onClick={() => setActiveTab('github')}
              >
                <i class="bi bi-github me-2"></i>
                GitHub
              </button>
            </li>
          </ul>

          {/*Tab Content*/}
          <div class="tab-content">
            {/* General Tab */}
            <div class={`tab-pane fade ${activeTab.value === 'general' ? 'show active' : ''}`}>
              <div class="p-2">
                <h5 class="text-white">General Settings</h5>
                <hr class="mb-3" />
                <div class="row mt-1 p-2">
                  <p class="col m-0">Weather Location: </p>
                  <input type="text" class="col rounded py-1 _controls"
                    name="github-language-hide" id="weather-location"
                    value={weatherLocation.value}
                  />
                </div>

                <div class="row mt-1 p-2">
                  <p class="col m-0">Tempature Scale: </p>
                  <select
                    class="col rounded py-1 _controls" name="tempature-scale"
                    id="tempature-scale"
                  >
                    <option hidden={true} selected={true} disabled={true}
                      value={localStorage.getItem("tempatureScale") || "nothing"}>
                      {getTempatureScaleString(localStorage.getItem("tempatureScale"))}
                    </option>
                    <option value="C">Celcius (°C)</option>
                    <option value="F">Fahrenheit (°F)</option>
                  </select>
                </div>

                {/* <p class="text-white">Coming soon...</p> */}
              </div>
            </div>

            {/* GitHub Tab */}
            <div class={`tab-pane fade ${activeTab.value === 'github' ? 'show active' : ''}`}>
              <div class="p-2">
                <GithubSetting />
              </div>
            </div>
          </div>

          {/*Footer setting*/}
          <div id="setting-footer" class="row mt-4">
            <div class="col-12 text-end">
              <button class="btn btn-outline-secondary text-white me-2" onClick={closeSetting}>
                Cancel
              </button>
              <button class="btn btn-primary" onClick={() => {submitSetting(); closeSetting()}}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});