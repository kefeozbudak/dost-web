import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx'

window.addEventListener('error', (e) => {
  document.body.innerHTML += `<div style="position:fixed;top:0;left:0;z-index:9999;background:red;color:white;padding:20px;">${e.message}</div>`;
});
window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML += `<div style="position:fixed;top:0;left:0;z-index:9999;background:red;color:white;padding:20px;">${e.reason}</div>`;
});;
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
