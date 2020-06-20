import * as React from "react";
import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Home from "../home/Home";
import Test from "../test/Test";
import AppBody from "../app-body/AppBody";
import PageHeader from "../page-header/PageHeader";
import RouteManager from "../../classes/route-manager";

const routeManager: RouteManager = new RouteManager();

routeManager.registerRoute(
  "Home",
  Home,
  {
    path: "/"
  }
);

routeManager.registerRoute(
  "Test Tools",
  Test,
  {
    path: "/test"
  }
);

export default class App extends Component {
  render() {
    return (
      <div id="app">
        <Router>
          <PageHeader navData={ routeManager.getNavData() } />

          <AppBody>
            { routeManager.outputSwitch() }
          </AppBody>
        </Router>
      </div>
    );
  }
}
