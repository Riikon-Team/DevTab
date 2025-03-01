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

    const setActiveTab = (tab: TabType) => {
      activeTab.value = tab;
    };

    const closeSetting = () => {
      props.onClose();
    };

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
                <hr class="mb-3"/>
                <p class="text-white">Coming soon...</p>
              </div>
            </div>
            
            {/* GitHub Tab */}
            <div class={`tab-pane fade ${activeTab.value === 'github' ? 'show active' : ''}`}>
              <div class="p-2">
                <GithubSetting/>
              </div>
            </div>
          </div>
          
          {/*Footer setting*/}
          <div id="setting-footer" class="row mt-4">
            <div class="col-12 text-end">
              <button class="btn btn-outline-secondary text-white me-2" onClick={closeSetting}>
                Cancel
              </button>
              <button class="btn btn-primary" onClick={closeSetting}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});