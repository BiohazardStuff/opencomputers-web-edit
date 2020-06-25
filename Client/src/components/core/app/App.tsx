import * as React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Home from "../../page/home/Home";
import Test from "../../page/test/Test";
import AppBody from "../app-body/AppBody";
import PageHeader from "../app-header/AppHeader";
import RouteManager from "../../../classes/route-manager";
import ContextComponent from "../../../classes/util/context-component";

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

export default class App extends ContextComponent {
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

  public componentDidMount(): void {
    if (this.context.development) {
      this.context.client.onConnected = client => {
        client.sendMessage(
          "check_access_code",
          {
            accessCode: "123ABC",
          }
        );
      };
    }

    this.context.client.connect("ws://localhost:8080/web");
  }

  public componentWillUnmount(): void {
    this.context.client.disconnect();
  }
}
