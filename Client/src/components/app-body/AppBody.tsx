import { Component } from "react";
import * as React from "react";

export default class AppBody extends Component<any, any> {
  public render() {
    return (
      <div id="app-body">
        { this.props.children }
      </div>
    );
  }
}
