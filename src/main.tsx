
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import "./index.css";

// Firebase ve vite HMR kaynaklı zararsız veritabanı hatalarını yoksayalım
window.addEventListener("unhandledrejection", (event) => {
  if (event.reason && event.reason.message && (event.reason.message.includes("Database is closing/hidden") || event.reason.message.includes("Database is closed"))) {
    event.preventDefault();
    console.warn("Ignored Firebase HMR IndexedDB error:", event.reason.message);
  }
});

window.addEventListener("error", (event) => {
  if (event.error && event.error.message && (event.error.message.includes("Database is closing/hidden") || event.error.message.includes("Database is closed"))) {
    event.preventDefault();
    console.warn("Ignored Firebase HMR IndexedDB error:", event.error.message);
  }
});


createRoot(document.getElementById("root")!).render(
  
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  ,
);
