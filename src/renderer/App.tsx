import { useState } from "react";
import { Dirent } from "fs";

import jsonToUint8Array from "../utils/jsonToUint8Array";

export default function App(): React.ReactNode {
  const [files, setFiles] = useState<Dirent[]>([]);
  const [filePath, setFilePath] = useState<string>("");

  async function handleFileListInFolder() {
    const fileList = await window.electronAPI.readingFileListInFolder();
    setFiles(fileList);
  }

  async function handleReadingFile() {
    const result = await window.electronAPI.openFile();
    if (!result.canceled && result.files && result.filePath) {
      const byteArray = Object.values(result.files).map((v) => Number(v));
      const str = String.fromCharCode(...byteArray);

      console.log(JSON.parse(str));
      console.log(result.filePath);
    }
  }

  async function handleSaveFile() {
    const arrayBuffer = jsonToUint8Array({ message: "hi" });

    try {
      const result = await window.electronAPI.saveFile(arrayBuffer);
      console.log("File saved successfully at:", result.path);
    } catch (error) {
      console.error("Failed to save file:", error);
    }
  }

  return (
    <>
      <div>this is React App</div>
      <div>
        <button onClick={handleReadingFile}>open tfm</button>
        <p>{filePath}</p>
        <ul>
          {files.map((f) => (
            <li>{f.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleSaveFile}>save file</button>
      </div>
      <div>
        <button onClick={handleFileListInFolder}>reading folder</button>
      </div>
    </>
  );
}
