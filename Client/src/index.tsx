import * as ReactDOM from "react-dom";
import * as React from "react";

import "./css/base.scss";

import App from "./components/core/app/App";
import ContextProvider from "./components/core/context-provider/ContextProvider";

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
