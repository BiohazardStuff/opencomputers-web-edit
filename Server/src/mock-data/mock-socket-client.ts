import { DirectoryTree, FileTree } from "../classes/socket-client/mock-computer-client";

interface MockData {
  directoryTree: DirectoryTree
  fileTree: FileTree
}

const mockData: MockData = {
  "directoryTree": {
    "/": [
      {
        "path": "home",
        "directory": true
      },
      {
        "path": "bigDir",
        "directory": true
      },
      {
        "path": "init.lua",
        "directory": false
      }
    ],
    "/home/": [
      {
        "path": "subDir",
        "directory": true
      },
      {
        "path": "test.lua",
        "directory": false
      }
    ],
    "/home/subDir/": [
      {
        "path": "example.lua",
        "directory": false
      },
      {
        "path": "logs.txt",
        "directory": false
      }
    ],
    "/bigDir/": []
  },
  "fileTree": {
    "/init.lua": "print(\"Hello World\")",
    "/home/test.lua": "local term = require(\"term\")\nterm.write(\"This is a test output\")",
    "/home/subDir/example.lua": "local term = require(\"term\")\n\nlocal gpu = term.gpu()\n\ngpu.setBackground(0xFF0000)\nterm.write(\"Red Background!\")",
    "/home/subDir/logs.txt": "20200601-120000: Client Initialized\n20200601-120005: Client Connected to Server\n20200601-120500: Client Disconnected"
  }
};

for (let i: number = 1; i <= 100; i++) {
  const path: string = `dir${ i }`;

  mockData.directoryTree["/bigDir/"]!.push({
    path,
    directory: true
  });

  mockData.directoryTree[`/bigDir/${ path }/`] = [];
}

export default mockData;
