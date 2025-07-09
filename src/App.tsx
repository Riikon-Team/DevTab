import { useState } from "react";
import "./App.css";
import Clock from "./components/Clock/Clock";
import Background from "./components/Background/Background";
import Setting from "./components/Setting/Setting";
import SearchBar from "./components/SearchEngine/SearchBar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Background brightness={0.5} />
      <header id="app-header"></header>
      <div id="app">
        <section id="app-left"></section>
        <section id="app-center">
          <h1>DevTab</h1>
          <SearchBar />
        </section>
        <section id="app-right">
          <Clock />
        </section>
      </div>
      <footer id="app-footer">
        <div id="footer-left">
          <p>DevTab © 2024</p>
        </div>
        <div id="footer-center">
          <p>Made with ❤️ by Riikon Team</p>
        </div>
        <div id="footer-right">
          <Setting />
        </div>
      </footer>
    </>
  );
}

export default App;
