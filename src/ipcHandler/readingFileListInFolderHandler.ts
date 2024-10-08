import { BrowserWindow, dialog } from "electron";
import { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "path";

async function readDirectoryRecursively(directory: string): Promise<Dirent[]> {
  const fileList: Dirent[] = [];

  // 현재 디렉토리의 내용을 읽습니다.
  const items = await readdir(directory, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      // 하위 디렉토리인 경우, 재귀적으로 함수를 호출합니다.
      await readDirectoryRecursively(item.parentPath);
    } else {
      // 파일인 경우, 목록에 추가합니다.
      fileList.push(item);
    }
  }

  return fileList;
}

export default async function readingFileListInFolderHandler(
  mainWindow: BrowserWindow
): Promise<{ id: string; dirent: Dirent }[]> {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    const directoryPath = result.filePaths[0];

    const files = await readDirectoryRecursively(directoryPath);

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

    return files.map((file) => ({ id: file.name, dirent: file }));
  } catch (err) {
    console.log(err);
  }
}
