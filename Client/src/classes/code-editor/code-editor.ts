import { RefObject } from "react";

export default interface CodeEditor {
  readonly rootReference: RefObject<HTMLDivElement>,

  create(): void,
  dispose(): void,

  setContent(content: string): void,

  addContent(content: string, path: string): string,
  removeContent(id: string): void,

  hasContentWithId(id: string): boolean,
  hasContentWithPath(path: string): boolean,

  switchToContentWithId(id: string): void,
  switchToContentWithPath(path: string): void,
}
