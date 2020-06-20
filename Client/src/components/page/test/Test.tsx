import { ComponentProps, ReactNode, RefObject } from "react";
import * as React from "react";

import * as styles from "./Test.module.scss";

import ContextComponent from "../../../classes/util/context-component";
import Fieldset from "../../interface/fieldset/Fieldset";
import LabeledElement from "../../interface/labeled-element/LabeledElement";
import InlineButtonField from "../../interface/inline-button-field/InlineButtonField";

interface state {
  pullDisabled: boolean,
}

export default class Test extends ContextComponent<any, state> {
  private readonly _uuidOutput: RefObject<HTMLSpanElement>;

  constructor(props: ComponentProps<any>) {
    super(props);

    this.state = {
      pullDisabled: true,
    };

    this._uuidOutput = React.createRef<HTMLSpanElement>();
  }

  public componentDidMount(): void {
    this.context.client.onUUIDChanged = this.onUUIDChanged;
  };

  public render(): ReactNode {
    return (
      <div className={ styles.test }>
        <LabeledElement label="Computer UUID" inline>
          <span id="computer-uuid" ref={ this._uuidOutput }>N/A</span>
        </LabeledElement>

        <Fieldset label="Client Actions">
          <InlineButtonField
            label="Access Code"
            buttonLabel="Check"
            onSubmit={ this.onAccessCodeSubmit }
          />

          <InlineButtonField
            label="Directory"
            buttonLabel="Pull"
            onSubmit={ this.onDirectoryPathSubmit }
            disabled={ this.state.pullDisabled }
          />

          <InlineButtonField
            label="File"
            buttonLabel="Pull"
            onSubmit={ this.onFilePathSubmit }
            disabled={ this.state.pullDisabled }
          />

          <LabeledElement label="File Content" for="file-content">
            <textarea readOnly id="file-content" className={ styles.fileContent } />
          </LabeledElement>
        </Fieldset>

        <LabeledElement label="Message Log">
          <div id="message-log" className={ styles.messageLog } />
        </LabeledElement>
      </div>
    );
  }

  private onUUIDChanged = (uuid: string|undefined): void => {
    console.log(`UUID changed to ${ uuid }`);

    this.setState({pullDisabled: uuid === undefined});

    if (this._uuidOutput.current !== null) {
      this._uuidOutput.current.innerHTML = uuid || "N/A";
    }
  };

  private onAccessCodeSubmit = (accessCode: string): void => {
    this.context.client.sendMessage(
      "check_access_code",
      {
        accessCode,
      }
    );
  };

  private onDirectoryPathSubmit = (path: string): void => {
    this.context.client.sendMessage(
      "pull_directory",
      {
        path,
      }
    );
  };

  private onFilePathSubmit = (path: string): void => {
    this.context.client.sendMessage(
      "pull_file",
      {
        path,
      }
    );
  };
}
