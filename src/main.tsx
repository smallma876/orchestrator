import { StrictMode } from "react";
import { BrowserRouter as Router } from "react-router";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root-container")!).render(
  <StrictMode>
    <Router basename="u">
      <App />
    </Router>
  </StrictMode>,
);
