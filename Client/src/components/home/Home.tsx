import { Component } from "react";
import * as React from "react";

import * as styles from "./Home.module.scss";

export default class Home extends Component<any, any> {
  public render() {
    return (
      <div className={ styles.home }>
        <h1 className={ styles.homeClass }>Home</h1>
      </div>
    );
  }
}
