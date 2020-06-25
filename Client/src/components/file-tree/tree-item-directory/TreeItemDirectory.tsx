import { ComponentClass, createElement, ReactNode } from "react";
import * as React from "react";
import { FaFolder, FaFolderOpen } from "react-icons/fa";

import * as styles from "./TreeItemDirectory.module.scss";

import ContextComponent from "../../../classes/util/context-component";
import { AppContextType } from "../../core/context-provider/ContextProvider";
import { DirectoryItem } from "../../../classes/web-edit-client";
import TreeItemFile from "../tree-item-file/TreeItemFile";
import { TreeItemProps } from "../file-tree-root/FileTreeRoot";
import FileTreeLabel from "../file-tree-label/FileTreeLabel";

interface props extends TreeItemProps {
  expanded?: boolean,
}

interface state {
  expanded: boolean,
  children?: ReactNode,
}

export default class TreeItemDirectory extends ContextComponent<props, state> {
  constructor(props: props, context: AppContextType) {
    super(props, context);

    this.state = {
      expanded: this.props.expanded || false,
      children: undefined,
    };

    this.context.client.registerDirectoryCallback(this.props.path, this.onDirectoryPush);
  }

  public componentDidMount(): void {
    if (this.state.expanded) {
      this.populateChildren();
    }
  }

  public render(): ReactNode {
    return (
      <div className={ styles.treeItemDirectory }>
        <FileTreeLabel
          label={ this.props.label }
          icon={ this.state.expanded ? FaFolderOpen : FaFolder }
          onClick={ this.onDirectoryClick }
        />

        <div className={ styles.treeItemDirectoryItems + (!this.state.expanded ? " hidden" : "") }>
          { this.state.children }
        </div>
      </div>
    );
  }

  private populateChildren(): void {
    // todo: for best UX make this a placeholder element instead of literal text
    this.setState({ children: (<div key={ this.props.path + "_loading" }>Loading...</div>) });

    this.context.client.sendMessage(
      "pull_directory",
      {
        path: this.props.path,
      }
    );
  }

  private onDirectoryClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    event.stopPropagation();

    const expanded: boolean = !this.state.expanded;

    if (
      expanded &&
      this.state.children === undefined
    ) {
      this.populateChildren();
    }

    this.setState({ expanded });
  };

  private onDirectoryPush = (content: DirectoryItem[]): void => {
    const children: ReactNode[] = content.map((directoryItem: DirectoryItem) => {
      const childComponent: ComponentClass<TreeItemProps> = (directoryItem.directory ? TreeItemDirectory : TreeItemFile);
      const childPath: string = (directoryItem.directory ? directoryItem.path + "/" : directoryItem.path);

      return createElement<TreeItemProps>(
        childComponent,
        {
          label: directoryItem.path,
          path: this.props.path + childPath,
          key: this.props.path + childPath,
        }
      );
    });

    this.setState({ children });
  };
}
