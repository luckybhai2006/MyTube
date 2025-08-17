// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./context/userContext.jsx";
import { LoaderProvider } from "./context/loaderContext";
import Loader from "./components/Loader";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Apply full screen styles to body
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.width = "100%";
document.body.style.height = "100%";

root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
