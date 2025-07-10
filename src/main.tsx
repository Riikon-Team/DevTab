import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from "./contexts/SettingsProvider";
import MuiThemeProvider from "./contexts/MuiThemeProvider";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </SettingsProvider>
  </StrictMode>,
)
