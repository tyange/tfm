import { BrowserWindow, dialog } from "electron";
import { Dirent } from "node:fs";
import { stat, readdir, readFile } from "node:fs/promises";
import { exec } from "child_process";
import util from "util";
import path from "path";
import os from "os";

const execPromise = util.promisify(exec);

export default async function readingFileListInFolderHandler(
  mainWindow: BrowserWindow
): Promise<{ id: string; dirent: Dirent }[]> {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    const directoryPath = result.filePaths[0];

    try {
      const { stdout, stderr } = await execPromise(`ls -la "${directoryPath}"`);
      console.log("Directory contents:", stdout);
      if (stderr) console.error("Error:", stderr);
    } catch (err) {
      console.error("Error executing command:", err);
    }

    console.log(directoryPath);

    const stats = await stat(directoryPath);
    console.log(`경로가 존재합니다. 디렉토리입니까? ${stats.isDirectory()}`);

    const files = await readdir(directoryPath, {
      withFileTypes: true,
      recursive: true,
    });

    if (files.length === 0) {
      console.log("USB 드라이브가 비어 있습니다.");
      console.log("현재 사용자:", os.userInfo().username);
    }

    const TFMFile = files.find((file) => {
      const splitFileName = file.name.split(".");

      return splitFileName[splitFileName.length - 1] === "tfm";
    });

    if (TFMFile) {
      const file = await readFile(path.join(TFMFile.parentPath, TFMFile.name));
      const byteArray = Object.values(file).map((v) => Number(v));
      const str = String.fromCharCode(...byteArray);
      const jsonData = JSON.parse(str);

      return jsonData.data;
    }

    return files.map((file) => ({ id: crypto.randomUUID(), dirent: file }));
  } catch (err) {
    console.log(err);
  }
}
