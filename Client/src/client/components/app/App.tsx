import * as React from "react";
import { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom"

import Home from "../home/Home";
import Test from "../test/Test";

export default class App extends Component<any, any> {
  render() {
    return (
      <Router>
        <div id="router">
          <Switch>
            <Route path="/test">
              <Test />
            </Route>

            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
