import { BrowserWindow, dialog } from "electron";
import { Dirent } from "node:fs";
import { readdir } from "node:fs/promises";

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
): Promise<Dirent[]> {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    const directoryPath = result.filePaths[0];

    const files = await readDirectoryRecursively(directoryPath);

    return files;
  } catch (err) {
    console.log(err);
  }
}
