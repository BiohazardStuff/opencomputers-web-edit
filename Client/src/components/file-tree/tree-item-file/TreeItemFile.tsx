import * as path from "path";

import { Component, ReactNode } from "react";
import * as React from "react";
import { IconType } from "react-icons";
import { FaFile, FaFileAlt, FaFileCode, FaFileCsv } from "react-icons/fa";

import { TreeItemProps } from "../file-tree-root/FileTreeRoot";
import FileTreeLabel from "../file-tree-label/FileTreeLabel";

const fileTypeIcons: { [key: string]: IconType } = {
  csv: FaFileCsv,
  json: FaFileCode,
  lua: FaFileCode,
  txt: FaFileAlt,
};

export default class TreeItemFile extends Component<TreeItemProps> {
  public render(): ReactNode {
    return (
      <div>
        <FileTreeLabel
          label={ this.props.label }
          icon={ this.fileIcon() }
        />
      </div>
    );
  }

  private fileIcon(): IconType {
    const rawFileExtension: string = path.extname(this.props.path);
    const fileExtension: string = rawFileExtension.split(".").pop() || "";

    return fileTypeIcons[fileExtension] || FaFile;
  }
}
