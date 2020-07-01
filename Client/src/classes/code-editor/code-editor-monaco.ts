import { editor, editor as monacoEditor, Uri } from "monaco-editor";
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import ITextModel = editor.ITextModel;
import { RefObject } from "react";
import { v4 as uuidv4 } from "uuid";

import CodeEditor from "./code-editor";

interface EditorContent {
  path: string,
  model: ITextModel,
}

export default class CodeEditorMonaco implements CodeEditor {
  private _editorInstance: IStandaloneCodeEditor;
  private _content: Map<string, EditorContent>;
  private _contentIdByPath: Map<string, string>;

  constructor(public readonly rootReference: RefObject<HTMLDivElement>) {
    this._content = new Map<string, EditorContent>();
    this._contentIdByPath = new Map<string, string>();
  }

  public create(): void {
    if (this.rootReference.current === null) {
      throw Error("Attempted to create new editor using invalid reference");
    }

    this._editorInstance = monacoEditor.create(
      this.rootReference.current,
      {
        // Default readonly, to be toggled when content id added / removed
        readOnly: true,
      }
    );
  }

  public dispose(): void {
    this._editorInstance.dispose();

    this._content.forEach((content: EditorContent) => {
      content.model.dispose();
    });
  }

  private updateReadOnly(): boolean {
    const readOnly: boolean = this._content.size === 0;

    this._editorInstance.updateOptions({ readOnly });

    return readOnly;
  }

  public setContent(content: string): void {
    this._editorInstance.setValue(content);
  }

  public addContent(content: string, path: string): string {
    const contentId: string = uuidv4();
    const model: ITextModel = monacoEditor.createModel(content, undefined, Uri.file(path));

    this._contentIdByPath.set(path, contentId);
    this._content.set(
      contentId,
      {
        path,
        model
      }
    );

    this._editorInstance.setModel(model);

    this.updateReadOnly();

    return contentId;
  }

  public hasContentWithId(id: string): boolean {
    return this._content.has(id);
  }

  public hasContentWithPath(path: string): boolean {
    return (
      this._contentIdByPath.has(path) &&
      this._content.has(this._contentIdByPath.get(path)!)
    );
  }

  public removeContent(id: string): void {
    if (!this._content.has(id)) {
      throw Error(`Attempted to remove invalid content with ID ${ id }`);
    }

    const content: EditorContent = this._content.get(id)!;

    this._contentIdByPath.delete(content.path);
    this._content.delete(id);

    this.updateReadOnly();
  }

  public switchToContentWithId(id: string): void {
    if (!this._content.has(id)) {
      throw Error(`Attempted to switch to invalid content with ID ${ id }`);
    }

    const content: EditorContent = this._content.get(id)!;

    this._editorInstance.setModel(content.model);
  }

  public switchToContentWithPath(path: string): void {
    if (!this._contentIdByPath.has(path)) {
      throw Error(`Attempted to switch to invalid content with path ${ path }`);
    }

    this.switchToContentWithId(this._contentIdByPath.get(path)!);
  }
}
