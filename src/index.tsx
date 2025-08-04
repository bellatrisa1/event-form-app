import React from "react";
import ReactDOM from "react-dom/client";
import AppWithProviders from "./AppWithProviders";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
