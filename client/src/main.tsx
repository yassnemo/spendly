import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

console.log("main.tsx loaded");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log("Root created, rendering app...");
  
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
