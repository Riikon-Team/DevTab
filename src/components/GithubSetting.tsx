import {defineComponent, type Ref, ref, inject} from "vue";
import GithubTheme from "@/enums/github-stat-theme.ts";

export default defineComponent({
  name: 'GithubSetting',
  props: {
    onStyleChange: {
      type: Function<(ref: Ref, value: string) => void>,
      required: true
    }
  },
  setup(props) {
    const githubStatTheme = ref(localStorage.getItem("githubStatCard") || "tokyonight")
    const githubStreakTheme = ref(localStorage.getItem("githubStreak") || "tokyonight")
    const githubTopLanguageTheme = ref(localStorage.getItem("githubTopLanguage") || "tokyonight")

    const changeTheme = (themeType: string, component: Element, refElement: Ref) => {
      const value = component.options[component.selectedIndex].text
      if (value !== 'nothing') {
        localStorage.setItem(themeType, value)
        props.onStyleChange(refElement, value)
      }
    }

    return () => (
      <div class="mt-5">
        <h5>Github</h5>
        <hr class="mb-3"/>
        <div class="row mt-1 p-2">
          <p class="col m-0">Github Stat Theme: </p>
          <select
            class="col rounded py-1" name="github-stat" id="setting--github__stat"
            onChange={() =>
              changeTheme("githubStatCard", document.querySelector("#setting--github__stat"), githubStatTheme)
            }>
            <option hidden={true} selected={true} disabled={true} value={localStorage.getItem("githubStatCard") || "nothing"}>
              {localStorage.getItem("githubStatCard") || "Choose a theme"}
            </option>
            {
              Object.entries(GithubTheme).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))
            }
          </select>
        </div>
        <div class="row mt-1 p-2">
          <p class="col m-0">Streak Theme: </p>
          <select
            class="col rounded py-1" name="github-stat" id="setting--github__streak"
            onChange={() =>
              changeTheme("githubStreak", document.querySelector("#setting--github__streak"), githubStreakTheme)
            }
          >
            <option hidden={true} selected={true} disabled={true} value={localStorage.getItem("githubStreak") || "nothing"}>
              {localStorage.getItem("githubStreak") || "Choose a theme"}
            </option>
            {
              Object.entries(GithubTheme).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))
            }
          </select>
        </div>
        <div class="row mt-1 p-2">
          <p class="col m-0">Top Language Theme: </p>
          <select
            class="col rounded py-1" name="github-stat" id="setting--github__top-language"
            onChange={() =>
              changeTheme("githubTopLanguage", document.querySelector("#setting--github__top-language"), githubTopLanguageTheme)
            }
          >
            <option hidden={true} selected={true} disabled={true} value={localStorage.getItem("githubTopLanguage") || "nothing"}>
              {localStorage.getItem("githubTopLanguage") || "Choose a theme"}
            </option>
            {
              Object.entries(GithubTheme).map(([key, value]) => (
                <option key={key} value={value}>{value}</option>
              ))
            }
          </select>
        </div>
      </div>
    )
  }
})
