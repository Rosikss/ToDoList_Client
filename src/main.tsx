// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StoreProvider } from "./app/stores/storeContext";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <App />
  </StoreProvider>,
)
