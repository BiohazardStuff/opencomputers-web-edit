import { createRef, ReactNode, RefObject } from "react";
import * as React from "react";

import * as styles from "./CodeEditorRoot.module.scss";

import CodeEditor from "../../../classes/code-editor/code-editor";
import CodeEditorMonaco from "../../../classes/code-editor/code-editor-monaco";
import CodeEditorContent from "../code-editor-content/CodeEditorContent";
import ContextComponent from "../../../classes/util/context-component";
import { AppContextType } from "../../core/context-provider/ContextProvider";

export default class CodeEditorRoot extends ContextComponent {
  private readonly _codeEditor: CodeEditor;
  private readonly _editorReference: RefObject<HTMLDivElement>;

  constructor(props: any, context: AppContextType) {
    super(props, context);

    this._editorReference = createRef<HTMLDivElement>();

    this._codeEditor = new CodeEditorMonaco(this._editorReference);

    this.context.client.registerFileCallback("*", this.onFileCallback);
  }

  public componentDidMount(): void {
    this._codeEditor.create();
  }

  public componentWillUnmount(): void {
    this._codeEditor.dispose();
  }

  public render(): ReactNode {
    return (
      <div className={ styles.codeEditorRoot }>
        <CodeEditorContent codeEditor={ this._codeEditor } />
      </div>
    );
  }

  private onFileCallback = (content: string, path: string): void => {
    if (this._codeEditor.hasContentWithPath(path)) {
      return this._codeEditor.switchToContentWithPath(path);
    }

    this._codeEditor.addContent(content, path);
  };
}
