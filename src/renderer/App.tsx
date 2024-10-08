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
    const result = await window.electronAPI.readingFileListInFolder();
    setFiles(result);
  }

  async function handleSaveFile() {
    const arrayBuffer = jsonToUint8Array({ data: draggableItems });

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
        <button className="btn" onClick={handleSaveFile}>
          save file
        </button>
      </div>
      <div>
        <button className="btn" onClick={handleFileListInFolder}>
          reading folder
        </button>
      </div>
      <ul className="flex flex-col gap-3">
        {draggableItems.map((item) => (
          <li
            className="border border-zinc-300"
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
