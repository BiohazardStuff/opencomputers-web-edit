import * as React from "react";
import { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Home from "../home/Home";
import Test from "../test/Test";
import AppBody from "../app-body/AppBody";
import PageHeader from "../page-header/PageHeader";

export default class App extends Component<any, any> {
  render() {
    return (
      <div id="app">
        <Router>
          <PageHeader />

          <AppBody>
            <Switch>
              <Route path="/test">
                <Test />
              </Route>

              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </AppBody>
        </Router>
      </div>
    );
  }
}
