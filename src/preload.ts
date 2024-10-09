import { contextBridge, ipcRenderer } from "electron";
import { Dirent } from "fs";

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: (dirent: Dirent) => ipcRenderer.invoke("open-file", dirent),
  Dirent: (data: unknown) => ipcRenderer.invoke("save-file", data),
  readingFileListInFolder: () =>
    ipcRenderer.invoke("reading-file-list-in-folder"),
});
