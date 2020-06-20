import { Component, ReactNode } from "react";
import * as React from "react";

import * as styles from "./LabeledElement.module.scss";

interface props {
  label: string,
  for?: string,
  inline?: boolean,
}

export default class LabeledElement extends Component<props> {
  public render(): ReactNode {
    let className: string = styles.labeledElement;
    if (this.props.inline) {
      className += ` ${ styles.inline }`;
    }

    return (
      <div className={ className }>
        <label htmlFor={ this.props.for }>{ this.props.label }</label>

        { this.props.children }
      </div>
    );
  }
}
