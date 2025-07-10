import "./App.css";
import Clock from "./components/Clock/Clock";
import Weather from "./components/Weather/Weather";
import Background from "./components/Background/Background";
import Setting from "./components/Setting/Setting";
import SearchBar from "./components/SearchEngine/SearchBar";
import Bookmark from "./components/Bookmark/Bookmark";
import Githubv2 from "./components/Github/Githubv2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useGenaralSettings } from "./hooks/useSettings";
import Notes from "./components/Notes/Notes";

function App() {
  const { generalSettings, updateGeneralSettings } = useGenaralSettings();

  return (
    <>
      <Background brightness={0.5} />
      <header id="app-header">
        <Bookmark showLabels={true} />
      </header>
      <div id="app">
        {generalSettings.explanded && (
          <section id="app-left">
            <Githubv2 />
          </section>
        )}
        <section id="app-center">
          <h1>DevTab</h1>
          <SearchBar />
        </section>
        {generalSettings.explanded && (
          <section id="app-right">
            <Clock />
            <Weather />
            <Notes />
          </section>
        )}
      </div>
      <footer id="app-footer">
        <div id="footer-left">
        </div>
        <div id="footer-center">
        </div>
        <div id="footer-right">
          <div style={{ display: "flex", alignItems: "center" }} className="footer-right-content">
            <Setting />
            <div className="expand-button btn" onClick={() => updateGeneralSettings({ explanded: !generalSettings.explanded })}>
              {generalSettings.explanded ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
