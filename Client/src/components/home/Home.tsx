import { Component, ReactNode } from "react";
import * as React from "react";

import * as styles from "./Home.module.scss";

export default class Home extends Component<any, any> {
  public render(): ReactNode {
    return (
      <div className={ styles.home }>
      </div>
    );
  }
}
