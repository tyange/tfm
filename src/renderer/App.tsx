import { useState } from "react";

import { encode } from "@msgpack/msgpack";

export default function App(): React.ReactNode {
  const [files, setFiles] = useState<string[]>([]);
  const [filePath, setFilePath] = useState<string>("");

  function jsonToUint8Array(jsonData: any): Uint8Array {
    // JSON 객체를 문자열로 변환
    const jsonString: string = JSON.stringify(jsonData);

    // 문자열을 UTF-8로 인코딩된 Uint8Array로 변환
    const encoder = new TextEncoder();
    return encoder.encode(jsonString);
  }
  async function handleReadingFileList() {
    const result = await window.electronAPI.openFile();
    if (!result.canceled && result.files && result.filePath) {
      const byteArray = Object.values(result.files).map((v) => Number(v));
      const str = String.fromCharCode(...byteArray);

      console.log(JSON.parse(str));
      console.log(result.filePath);
    }
  }

  async function handleSaveFile(data: unknown) {
    console.log("hi");

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
        <button onClick={handleReadingFileList}>open tfm</button>
        <p>{filePath}</p>
        <ul>
          {files.map((f) => (
            <span>{f}</span>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleSaveFile}>save file</button>
      </div>
    </>
  );
}
