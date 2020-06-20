import { ReactNode } from "react";
import * as React from "react";

import * as styles from "./Home.module.scss";

import ContextComponent from "../../../classes/util/context-component";

export default class Home extends ContextComponent {
  public render(): ReactNode {
    return (
      <div className={ styles.home }>
      </div>
    );
  }
}
