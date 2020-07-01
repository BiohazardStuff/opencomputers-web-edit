import * as path from "path";

import { ReactNode } from "react";
import * as React from "react";
import { IconType } from "react-icons";
import { FaFile, FaFileAlt, FaFileCode, FaFileCsv } from "react-icons/fa";

import { TreeItemProps } from "../file-tree-root/FileTreeRoot";
import FileTreeLabel from "../file-tree-label/FileTreeLabel";
import ContextComponent from "../../../classes/util/context-component";

const fileTypeIcons: { [key: string]: IconType } = {
  csv: FaFileCsv,
  json: FaFileCode,
  lua: FaFileCode,
  txt: FaFileAlt,
};

export default class TreeItemFile extends ContextComponent<TreeItemProps> {
  public render(): ReactNode {
    return (
      <div>
        <FileTreeLabel
          label={ this.props.label }
          icon={ this.fileIcon() }
          onClick={ this.onFileClick }
        />
      </div>
    );
  }

  private fileIcon(): IconType {
    const rawFileExtension: string = path.extname(this.props.path);
    const fileExtension: string = rawFileExtension.split(".").pop() || "";

    return fileTypeIcons[fileExtension] || FaFile;
  }

  private onFileClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    event.stopPropagation();

    this.context.client.sendMessage(
      "pull_file",
      {
        path: this.props.path,
      }
    );
  };
}
