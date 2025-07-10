import React, { Suspense } from "react";
import "./App.css";
import Clock from "./components/Clock/Clock";
// import Weather from "./components/Weather/Weather";
// import Background from "./components/Background/Background";
import Setting from "./components/Setting/Setting";
import SearchBar from "./components/SearchEngine/SearchBar";
// import Bookmark from "./components/Bookmark/Bookmark";
// import Githubv2 from "./components/Github/Githubv2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useGenaralSettings } from "./hooks/useSettings";
// import Notes from "./components/Notes/Notes";
import LoadingOverlay from "./components/Common/LoadingOverlay";

const LazyBackground = React.lazy(() => import("./components/Background/Background"));
const LazyBookmark = React.lazy(() => import("./components/Bookmark/Bookmark"));
const LazyGithubv2 = React.lazy(() => import("./components/Github/Githubv2"));
const LazyWeather = React.lazy(() => import("./components/Weather/Weather"));
const LazyNotes = React.lazy(() => import("./components/Notes/Notes"));
const LazyPomodoro = React.lazy(() => import("./components/Common/Pomodoro/Pomodoro"));
const LazyNewsFeed = React.lazy(() => import("./components/NewsFeed/NewsFeed"));

function App() {
  const { generalSettings, updateGeneralSettings } = useGenaralSettings();

  return (
    <>
      <LoadingOverlay />
      <Suspense fallback={<div>Loading background...</div>}>
        <LazyBackground />
      </Suspense>
      <header id="app-header">
        {generalSettings.explanded && (
          <Suspense fallback={<div>Loading bookmarks...</div>}>
            <LazyBookmark />
          </Suspense>
        )}
      </header>
      <div id="app">
        {generalSettings.explanded && (
          <section id="app-left">
            <Suspense fallback={<div>Loading github...</div>}>
              <LazyGithubv2 />
            </Suspense>
          </section>
        )}
        <section id="app-center">
          <h1>DevTab</h1>
          <SearchBar />
        </section>
        {generalSettings.explanded && (
          <section id="app-right">
            <div className="fade-in-zoom-in"><Clock /></div>
            <Suspense fallback={<div>Loading weather...</div>}>
              <div className="fade-in-zoom-in"><LazyWeather /></div>
            </Suspense>
            <Suspense fallback={<div>Loading notes...</div>}>
              <div className="fade-in-zoom-in"><LazyNotes /></div>
            </Suspense>
            {generalSettings.enablePomodoro && (
              <Suspense fallback={<div>Loading pomodoro...</div>}>
                <div className="fade-in-zoom-in"><LazyPomodoro enable={true} /></div>
              </Suspense>
            )}
            {generalSettings.enableNewsFeed && (
              <Suspense fallback={<div>Loading newsfeed...</div>}>
                <div className="fade-in-zoom-in"><LazyNewsFeed enable={true} /></div>
              </Suspense>
            )}
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
