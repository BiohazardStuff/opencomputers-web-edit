import { Component, ReactNode } from "react";
import * as React from "react";

import VerticalAlign from "../vertical-align/VerticalAlign";

import * as styles from "./PageHeader.module.scss";

interface props {
  headerText: string,
}

export default class PageHeader extends Component<props> {
  public render(): ReactNode {
    return (
      <div className={ styles.pageHeader }>
        <VerticalAlign>
          <div className={ styles.brandText }>OpenComputers Web Edit</div>
        </VerticalAlign>

        <VerticalAlign>
          <div className={ styles.headerText }>{ this.props.headerText }</div>
        </VerticalAlign>
      </div>
    );
  }
}
