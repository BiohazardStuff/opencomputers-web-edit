import { Component, ReactNode } from "react";
import * as React from "react";

import PageHeader from "../page-header/PageHeader";

import * as styles from "./Home.module.scss";

export default class Home extends Component<any, any> {
  public render(): ReactNode {
    return (
      <div className={ styles.home }>
        <PageHeader headerText="Home" />
      </div>
    );
  }
}
