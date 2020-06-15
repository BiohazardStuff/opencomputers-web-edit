import { Component, ReactNode } from "react";
import * as React from "react";

import * as styles from "./VerticalAlign.module.scss";

export default class VerticalAlign extends Component {
  render(): ReactNode {
    return (
      <div className={ styles.verticalAlign }>
        { this.props.children }
      </div>
    );
  }
}
