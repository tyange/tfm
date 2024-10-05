import { useEffect, useState } from "react";
import { Dirent } from "fs";

import jsonToUint8Array from "../utils/jsonToUint8Array";
import useDraggableItems from "../renderer/hooks/useDraggableItems";

type FileWithId = {
  id: string;
  dirent: Dirent;
};

export default function App(): React.ReactNode {
  const [files, setFiles] = useState<FileWithId[]>([]);

  const {
    isDragging,
    currentDraggingNode,
    dragStart,
    dragEnter,
    dragOver,
    dragEnd,
    draggableItems,
  } = useDraggableItems({ items: files });

  async function handleFileListInFolder() {
    const fileList = await window.electronAPI.readingFileListInFolder();
    setFiles(fileList.map((file) => ({ id: file.name, dirent: file })));
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
      </div>
      <div>
        <button onClick={handleSaveFile}>save file</button>
      </div>
      <div>
        <button onClick={handleFileListInFolder}>reading folder</button>
      </div>
      <ul className="flex flex-col gap-3">
        {draggableItems.map((item) => (
          <li
            key={item.id}
            id={item.id}
            draggable
            onDragStart={dragStart}
            onDragEnter={dragEnter}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
          >
            {item.dirent.name}
          </li>
        ))}
      </ul>
    </>
  );
}
