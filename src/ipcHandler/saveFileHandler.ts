import { app, dialog } from "electron";
import { writeFile } from "fs/promises";
import path from "path";
import fswin from "fswin";

export default async function saveFileHandler(data: Uint8Array) {
  try {
    const result = await dialog.showSaveDialog({
      title: "파일 저장",
      defaultPath: path.join(app.getPath("downloads"), "data.tfm"),
    });

    if (!result.canceled) {
      const splitPathParts = result.filePath.split("/");
      const fileName = splitPathParts[splitPathParts.length - 1];
      splitPathParts[splitPathParts.length - 1] = `.${fileName}`;
      const prefixedFilePath = splitPathParts.join("/");
      const isWindow = process.platform.startsWith("win");

      writeFile(prefixedFilePath, data);

      if (isWindow) {
        fswin.setAttributes(
          prefixedFilePath,
          { IS_HIDDEN: true },
          (succeeded) => console.log(succeeded)
        );
      }

      return { success: true, path: prefixedFilePath };
    }
  } catch (err) {
    console.error(err);
  }
}
