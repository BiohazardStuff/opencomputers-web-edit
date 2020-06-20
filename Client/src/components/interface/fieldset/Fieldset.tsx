import { Component, ReactNode } from "react";
import * as React from "react";

interface props {
  label: string
}

export default class Fieldset extends Component<props> {
  public render(): ReactNode {
    return (
      <fieldset>
        <legend>{ this.props.label }</legend>

        <div className="fieldset-body">
          { this.props.children }
        </div>
      </fieldset>
    );
  }
}
