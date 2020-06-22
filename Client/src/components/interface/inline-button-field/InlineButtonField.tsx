import { Component, createRef, ReactNode, RefObject } from "react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

import * as styles from "./InlineButtonField.module.scss";

import LabeledElement from "../labeled-element/LabeledElement";

interface props {
  disabled?: boolean,
  label?: string,
  inputClassName?: string,

  buttonLabel: string,
  onSubmit?: (value: string, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
}

export default class InlineButtonField extends Component<props> {
  private readonly _inputId: string|undefined;
  private readonly _inputReference: RefObject<HTMLInputElement>;
  private readonly _buttonReference: RefObject<HTMLButtonElement>;

  constructor(props: props) {
    super(props);

    this._inputId = this.inputId();

    this._inputReference = createRef<HTMLInputElement>();
    this._buttonReference = createRef<HTMLButtonElement>();
  }

  public render(): ReactNode {
    const node: ReactNode = (
      <div className={ styles.inlineButtonField }>
        <input
          id={ this._inputId }
          ref={ this._inputReference }
          className={ this.props.inputClassName }
          onKeyUp={ this.onInputKeyUp }
          disabled={ this.props.disabled }
        />
        <button
          type="button"
          ref={ this._buttonReference }
          onClick={ this.onButtonClick }
          disabled={ this.props.disabled }
          tabIndex={ -1 }
        >
          { this.props.buttonLabel }
        </button>
      </div>
    );

    if (this.props.label !== undefined) {
      return (
        <LabeledElement label={ this.props.label } for={ this._inputId }>
          { node }
        </LabeledElement>
      );
    }

    return node;
  }

  private inputId(): string|undefined {
    // We only need to generate an id if we're returning the label wrapper
    if (this.props.label === undefined) {
      return undefined;
    }

    return uuidv4();
  }

  private onInputKeyUp = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.keyCode !== 13) {
      return;
    }

    event.preventDefault();

    this._buttonReference.current?.click();
  };

  private onButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();

    if (
      this._inputReference.current === null ||
      this.props.onSubmit === undefined
    ) {
      return;
    }

    this.props.onSubmit(this._inputReference.current.value.trim(), event);
  };
}

