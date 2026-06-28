import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { DataApiProvider } from "./Contexts/DataAPI.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContextProvider } from "./Contexts/ToastsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContextProvider>
        <DataApiProvider>
          <App />
        </DataApiProvider>
      </ToastContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
