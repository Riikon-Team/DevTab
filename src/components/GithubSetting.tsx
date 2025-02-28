import {defineComponent, type Ref, ref} from "vue";
import {GithubLayoutChart, GithubTheme} from "@/enums/github-setting.ts";

export default defineComponent({
  name: 'GithubSetting',
  // props: {
  //   onStyleChange: {
  //     type: Function<(ref: Ref, value: string) => void>,
  //     required: true
  //   }
  // },
  setup() {
    const githubStatTheme = ref(localStorage.getItem("githubStatCard") || "tokyonight")
    const githubStreakTheme = ref(localStorage.getItem("githubStreak") || "tokyonight")
    const githubTopLanguageTheme = ref(localStorage.getItem("githubTopLanguage") || "tokyonight")
    const githubTopLanguageCount = ref(localStorage.getItem("githubTopLanguageCount") || "6")
    const githubTopLanguageLayout = ref(localStorage.getItem("githubTopLanguageLayout") || "compact")
    const githubTopLanguageHide = ref(localStorage.getItem("githubTopLanguageHide") || "")

    // const countLanguage = isNaN(parseInt(githubTopLanguageCount.value)) ? 6 : parseInt(githubTopLanguageCount.value)

    const changeTheme = (themeType: string, component: Element, refElement: Ref) => {
      const value = component.options[component.selectedIndex].text
      if (value !== 'nothing') {
        localStorage.setItem(themeType, value)
        refElement.value = value
        // props.onStyleChange(refElement, value)
      }
    }

    const changeInputValue = (type: string, component: Element, element: Ref) => {
      const value = component.value
      if (value) {
        localStorage.setItem(type, value.toString())
        element.value = value
      }
    }

    return () => (
      <div class="mt-5">
        <h5>Github</h5>
        <hr class="mb-3"/>

        {/*Stat Theme*/}
        <div class="row mt-1 p-2">
          <p class="col m-0">Github Stat Theme: </p>
          <select
            class="col rounded py-1" name="github-stat" id="setting--github__stat"
            onChange={() =>
              changeTheme("githubStatCard", document.querySelector("#setting--github__stat"), githubStatTheme)
            }>
            <option hidden={true} selected={true} disabled={true}
                    value={localStorage.getItem("githubStatCard") || "nothing"}>
              {localStorage.getItem("githubStatCard") || "Choose a theme"}
            </option>
            {
              Object.entries(GithubTheme).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))
            }
          </select>
        </div>

        {/*Streak Theme*/}
        <div class="row mt-1 p-2">
          <p class="col m-0">Streak Theme: </p>
          <select
            class="col rounded py-1" name="github-stat" id="setting--github__streak"
            onChange={() =>
              changeTheme("githubStreak", document.querySelector("#setting--github__streak"), githubStreakTheme)
            }
          >
            <option hidden={true} selected={true} disabled={true}
                    value={localStorage.getItem("githubStreak") || "nothing"}>
              {localStorage.getItem("githubStreak") || "Choose a theme"}
            </option>
            {
              Object.entries(GithubTheme).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))
            }
          </select>
        </div>

        {/*Top Language Theme*/}
        <div class="row mt-1 p-2">
          <p class="col m-0">Top Language Theme: </p>
          <select
            class="col rounded py-1" name="github-stat" id="setting--github__top-language"
            onChange={() =>
              changeTheme("githubTopLanguage", document.querySelector("#setting--github__top-language"), githubTopLanguageTheme)
            }
          >
            <option hidden={true} selected={true} disabled={true}
                    value={localStorage.getItem("githubTopLanguage") || "nothing"}>
              {localStorage.getItem("githubTopLanguage") || "Choose a theme"}
            </option>
            {
              Object.entries(GithubTheme).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))
            }
          </select>
        </div>

        {/*Top Language Count*/}
        <div class="row mt-1 p-2">
          <p class="col m-0">Top Language Count: </p>
          <input type="number" class="col rounded py-1"
                 name="github-language-count" id="setting--github__top-language__count"
                 min="1" max="20"
                 value={githubTopLanguageCount.value}
                 onBlur={() => changeInputValue("githubTopLanguageCount", document.querySelector("#setting--github__top-language__count", githubTopLanguageCount))}
          />
        </div>

        {/*Top Language Layout*/}
        <div class="row mt-1 p-2">
          <p class="col m-0">Top Language Layout: </p>
          <select
            class="col rounded py-1" name="github-top-language-layout" id="setting--github__top-language__layout"
            onChange={() =>
              changeInputValue("githubTopLanguageLayout", document.querySelector("#setting--github__top-language__layout"), githubTopLanguageLayout)
            }
          >
            <option hidden={true} selected={true} disabled={true}
                    value={localStorage.getItem("githubTopLanguageLayout") || "compact"}>
              {localStorage.getItem("githubTopLanguageLayout") || "compact"}
            </option>
            {
              Object.entries(GithubLayoutChart).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))
            }
          </select>
        </div>

        {/*Top Language Hide*/}
        <div class="row mt-1 p-2">
          <p class="col m-0">Hide Top Language: </p>
          <input type="text" class="col rounded py-1"
                 name="github-language-hide" id="setting--github__top-language__hide"
                 value={githubTopLanguageHide.value}
                 onBlur={() => changeInputValue("githubTopLanguageHide", document.querySelector("#setting--github__top-language__hide", githubTopLanguageHide))}
          />
          <p class="text-end mt-1 mb-1 fw-light" style={{fontSize: '12px'}}>Example:  <span class="fw-normal">html,css,js</span></p>
        </div>

        <p class="mt-4 mb-1 fw-light" style={{fontSize: '12px'}}>Note: Reload to take effect</p>
      </div>
    )
  }
})
