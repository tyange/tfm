import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => ipcRenderer.invoke("open-file"),
  saveFile: (data: unknown) => ipcRenderer.invoke("save-file", data),
  readingFileListInFolder: () =>
    ipcRenderer.invoke("reading-file-list-in-folder"),
});
