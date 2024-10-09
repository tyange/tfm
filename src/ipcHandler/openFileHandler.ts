import { shell } from "electron";
import { Dirent } from "fs";
import path from "path";

export default async function openFileHandler(dirent: Dirent) {
  const fullPath = path.join(dirent.parentPath, dirent.name);
  await shell.openPath(fullPath);
}
