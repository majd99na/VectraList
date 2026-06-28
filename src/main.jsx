import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { DataApiProvider } from "./Contexts/DataAPI.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <DataApiProvider>
        <App />
      </DataApiProvider>
    </BrowserRouter>
  </StrictMode>,
);
