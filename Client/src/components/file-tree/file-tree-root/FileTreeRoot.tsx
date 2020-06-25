import { HTMLProps, ReactNode } from "react";
import * as React from "react";

import * as styles from "./FileTreeRoot.module.scss";

import ContextComponent from "../../../classes/util/context-component";
import TreeItemDirectory from "../tree-item-directory/TreeItemDirectory";
import { AppContextType } from "../../core/context-provider/ContextProvider";

export interface TreeItemProps {
  label: string,
  path: string,
}

interface state {
  fileTree: ReactNode
}

export default class FileTreeRoot extends ContextComponent<any, state> {
  constructor(props: HTMLProps<any>, context: AppContextType) {
    super(props, context);

    this.state = {
      fileTree: undefined,
    };

    this.context.client.clearCallbacks();
    this.context.client.onUUIDChanged = this.populateFileTree;
  }

  public componentDidMount(): void {
    if (this.context.client.isConfirmed()) {
      this.populateFileTree();
    }
  }

  public render(): ReactNode {
    return (
      <div className={ styles.fileTreeRoot }>
        { this.state.fileTree }
      </div>
    );
  }

  private populateFileTree = (): void => {
    this.setState({
      fileTree: <TreeItemDirectory label="/" path="/" expanded />
    });
  };
}
