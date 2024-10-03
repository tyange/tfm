import { BrowserWindow, dialog } from "electron";
import { readFile } from "node:fs/promises";

export default async function openFileHandler(mainWindow: BrowserWindow) {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
    });

    if (result.canceled) {
      return { canceled: true };
    }

    const filePath = result.filePaths[0];

    const files = await readFile(filePath);

    return {
      canceled: false,
      filePath: filePath,
      files,
    };
  } catch (err) {
    console.error(err);
  }
}
