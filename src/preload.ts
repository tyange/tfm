import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openFile: () => ipcRenderer.invoke("open-file-dialog"),
  saveFile: (data: unknown) => ipcRenderer.invoke("save-file", data),
});
