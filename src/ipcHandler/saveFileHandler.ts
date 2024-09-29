import { app, dialog } from "electron";
import { writeFile } from "fs/promises";
import path from "path";

export default async function saveFileHandler(data: Uint8Array) {
  try {
    const result = await dialog.showSaveDialog({
      title: "파일 저장",
      defaultPath: path.join(app.getPath("downloads"), "data.tfm"),
    });

    if (!result.canceled) {
      writeFile(result.filePath, data);
      return { success: true, path: result.filePath };
    }
  } catch (err) {
    console.error(err);
  }
}
