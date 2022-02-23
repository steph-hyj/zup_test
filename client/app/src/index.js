import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";

import { MaterialUIControllerProvider } from "./context";

ReactDOM.render(
  <HashRouter>
    <MaterialUIControllerProvider>
      <App />
    </MaterialUIControllerProvider>
  </HashRouter>,
  document.getElementById("root")
);
