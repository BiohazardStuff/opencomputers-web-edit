import { Component, ReactNode } from "react";
import * as React from "react";

import * as styles from "./CodeEditorContent.module.scss";

import CodeEditor from "../../../classes/code-editor/code-editor";

interface props {
  codeEditor: CodeEditor,
}

export default class CodeEditorContent extends Component<props> {
  public render(): ReactNode {
    return (
      <div ref={ this.props.codeEditor.rootReference } className={ styles.codeEditorContent } />
    );
  }
}
