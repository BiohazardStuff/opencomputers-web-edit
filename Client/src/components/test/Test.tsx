import { Component, ComponentProps, ReactNode, RefObject } from "react";
import * as React from "react";

import WebEditClient from "../../classes/web-edit-client";

import * as styles from "./Test.module.scss";

export default class Test extends Component<any, any> {
  private readonly _accessCodeInput: RefObject<HTMLInputElement>;
  private readonly _directoryPathInput: RefObject<HTMLInputElement>;
  private readonly _filePathInput: RefObject<HTMLInputElement>;

  private _client: WebEditClient;

  constructor(props: ComponentProps<any>) {
    super(props);

    this._accessCodeInput = React.createRef<HTMLInputElement>();
    this._directoryPathInput = React.createRef<HTMLInputElement>();
    this._filePathInput = React.createRef<HTMLInputElement>();

    this._client = new WebEditClient();
    this._client.connect("ws://localhost:8080/web");
  }

  public render(): ReactNode {
    return (
      <div className={ styles.test }>
        <h1>Test Tool</h1>

        <div className={styles.labeledField}>
          <label>Computer UUID</label>
          <span id="computer-uuid"/>
        </div>

        <form>
          <div className={ styles.labeledField }>
            <label htmlFor="access-code">Access Code</label>
            <input id="access-code" ref={ this._accessCodeInput }/>
            <button type="submit" id="submit-access-code" onClick={ this.onAccessCodeSubmit }>Submit</button>
          </div>


          <div className={ styles.labeledField }>
            <label htmlFor="directory-path">Directory</label>
            <input id="directory-path" defaultValue="/" ref={ this._directoryPathInput }/>
            <button type="submit" id="submit-directory-path" onClick={ this.onDirectoryPathSubmit }>Pull</button>
          </div>

          <div className={ styles.labeledField }>
            <label htmlFor="file-path">File</label>
            <input id="file-path" ref={ this._filePathInput }/>
            <button type="submit" id="submit-file-path" onClick={ this.onFilePathSubmit }>Pull</button>
          </div>
        </form>

        <div className={ styles.labeledField }>
          <label htmlFor="file-content">File Content</label>
          <textarea readOnly id="file-content" className={ styles.fileContent }/>
        </div>

        <div className={ styles.labeledField }>
          <label>Message Log</label>
          <div id="message-log" className={ styles.messageLog }/>
        </div>
      </div>
    );
  }

  private onAccessCodeSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
    event.preventDefault();

    if (this._accessCodeInput.current === null) {
      return;
    }

    const accessCode = this._accessCodeInput.current.value.trim();

    this._client.sendMessage(
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

    this._client.sendMessage(
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

    this._client.sendMessage(
      "pull_file",
      {
        path,
      }
    );

  };
}
