import { Component, createElement, ReactNode } from "react";
import * as React from "react";
import { IconType } from "react-icons";

import * as styles from "./FileTreeLabel.module.scss";

import VerticalAlign from "../../util/vertical-align/VerticalAlign";

interface props {
  label: string,
  icon: IconType,
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

export default class FileTreeLabel extends Component<props> {
  public render(): ReactNode {
    return (
      <div className={ styles.fileTreeLabel } onClick={ this.props.onClick }>
        <VerticalAlign>
          { createElement(this.props.icon) }
        </VerticalAlign>
        <span>{ this.props.label }</span>
      </div>
    );
  }
}
