import { ReactNode } from "react";
import * as React from "react";

import * as styles from "./Home.module.scss";

import ContextComponent from "../../../classes/util/context-component";
import FileTreeRoot from "../../file-tree/file-tree-root/FileTreeRoot";
import CodeEditorRoot from "../../code-editor/code-editor-root/CodeEditorRoot";

export default class Home extends ContextComponent {
  public render(): ReactNode {
    return (
      <div className={ styles.home }>
        <FileTreeRoot />

        <div className={ styles.codeEditorWrapper }>
          <CodeEditorRoot />
        </div>
      </div>
    );
  }
}
