import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './contexts/ContextProvider.jsx'; // Ensure the path is correct



import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
  <ContextProvider>
    <App />
  </ContextProvider>
  </BrowserRouter>
</StrictMode>
)
