import Squirrel from "electron-squirrel-startup";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

import openFileHandler from "./ipcHandler/openFileHandler";
import saveFileHandler from "./ipcHandler/saveFileHandler";
import readingFileListInFolderHandler from "./ipcHandler/readingFileListInFolderHandler";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (Squirrel) {
  app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// ipc handlers
ipcMain.handle("open-file", (_, dirent) => openFileHandler(dirent));
ipcMain.handle("save-file", (_, data) => saveFileHandler(data));
ipcMain.handle("reading-file-list-in-folder", () =>
  readingFileListInFolderHandler(mainWindow)
);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
