import { ComponentProps, ReactNode, RefObject } from "react";
import * as React from "react";

import * as styles from "./Test.module.scss";

import ContextComponent from "../../../classes/util/context-component";
import Fieldset from "../../interface/fieldset/Fieldset";

export default class Test extends ContextComponent {
  private readonly _accessCodeInput: RefObject<HTMLInputElement>;
  private readonly _directoryPathInput: RefObject<HTMLInputElement>;
  private readonly _filePathInput: RefObject<HTMLInputElement>;
  private readonly _uuidOutput: RefObject<HTMLSpanElement>;

  constructor(props: ComponentProps<any>) {
    super(props);

    this._accessCodeInput = React.createRef<HTMLInputElement>();
    this._directoryPathInput = React.createRef<HTMLInputElement>();
    this._filePathInput = React.createRef<HTMLInputElement>();
    this._uuidOutput = React.createRef<HTMLSpanElement>();
  }

  public componentDidMount(): void {
    this.context.client.onUUIDChanged = this.onUUIDChanged;
  };

  public render(): ReactNode {
    return (
      <div className={ styles.test }>
        <div className="labeled-field inline">
          <label>Computer UUID: </label>
          <span id="computer-uuid" ref={ this._uuidOutput }>N/A</span>
        </div>

        <Fieldset label="Client Actions">
          <div className="labeled-field">
            <label htmlFor="access-code">Access Code</label>
            <div className="inline-button-field">
              <input id="access-code" ref={ this._accessCodeInput } />
              <button type="button" id="submit-access-code" onClick={ this.onAccessCodeSubmit }>Check</button>
            </div>
          </div>

          <div className="labeled-field">
            <label htmlFor="directory-path">Directory</label>
            <div className="inline-button-field">
              <input id="directory-path" defaultValue="/" ref={ this._directoryPathInput } />
              <button type="button" id="submit-directory-path" onClick={ this.onDirectoryPathSubmit }>Pull</button>
            </div>
          </div>

          <div className="labeled-field">
            <label htmlFor="file-path">File</label>
            <div className="inline-button-field">
              <input id="file-path" ref={ this._filePathInput } />
              <button type="button" id="submit-file-path" onClick={ this.onFilePathSubmit }>Pull</button>
            </div>
          </div>

          <div className="labeled-field">
            <label htmlFor="file-content">File Content</label>
            <textarea readOnly id="file-content" className={ styles.fileContent } />
          </div>
        </Fieldset>

        <div className="labeled-field">
          <label>Message Log</label>
          <div id="message-log" className={ styles.messageLog } />
        </div>
      </div>
    );
  }

  private onUUIDChanged = (uuid: string|undefined): void => {
    console.log(`UUID changed to ${ uuid }`);

    if (this._uuidOutput.current !== null) {
      this._uuidOutput.current.innerHTML = uuid || "N/A";
    }
  };

  private onAccessCodeSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();

    if (this._accessCodeInput.current === null) {
      return;
    }

    const accessCode = this._accessCodeInput.current.value.trim();

    this.context.client.sendMessage(
      "check_access_code",
      {
        accessCode,
      }
    );

  };

  private onDirectoryPathSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();

    if (this._directoryPathInput.current === null) {
      return;
    }

    const path = this._directoryPathInput.current.value.trim();

    this.context.client.sendMessage(
      "pull_directory",
      {
        path,
      }
    );

  };

  private onFilePathSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();

    if (this._filePathInput.current === null) {
      return;
    }

    const path = this._filePathInput.current.value.trim();

    this.context.client.sendMessage(
      "pull_file",
      {
        path,
      }
    );

  };
}
