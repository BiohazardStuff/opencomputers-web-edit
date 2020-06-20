import { ComponentProps, ReactNode } from "react";
import * as React from "react";

import * as styles from "./Test.module.scss";

import ContextComponent from "../../../classes/util/context-component";
import Fieldset from "../../interface/fieldset/Fieldset";
import LabeledElement from "../../interface/labeled-element/LabeledElement";
import InlineButtonField from "../../interface/inline-button-field/InlineButtonField";
import { AppContextType } from "../../core/context-provider/ContextProvider";

interface state {
  clientUUID: string|undefined,
}

export default class Test extends ContextComponent<any, state> {
  constructor(props: ComponentProps<any>, context: AppContextType) {
    super(props, context);

    this.state = {
      clientUUID: this.context.client.getUUID(),
    };

    this.context.client.onUUIDChanged = this.onUUIDChanged;
  }

  public render(): ReactNode {
    const pullDisabled = this.state.clientUUID === undefined;

    return (
      <div className={ styles.test }>
        <LabeledElement label="Computer UUID" inline>
          <span id="computer-uuid">{ this.state.clientUUID || "N/A" }</span>
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
            disabled={ pullDisabled }
          />

          <InlineButtonField
            label="File"
            buttonLabel="Pull"
            onSubmit={ this.onFilePathSubmit }
            disabled={ pullDisabled }
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

    this.setState({ clientUUID: uuid });
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
