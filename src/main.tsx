import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import GithubStatDialog from './components/sidebar-dialog/GithubStatDialog'
import { ThemeProvider } from './components/ThemeProvider'
import { SidebarProvider } from './components/ui/sidebar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <SidebarProvider className="absolute">
          <App />
        </SidebarProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
