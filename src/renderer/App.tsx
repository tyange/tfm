import { useState } from "react";

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
    try {
      const result = await window.electronAPI.readingFileListInFolder();
      setFiles(result);
    } catch (err) {
      console.error(err);
    }
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

  async function handleOpenFile(dirent: Dirent) {
    try {
      await window.electronAPI.openFile(dirent);
    } catch (err) {
      console.error(err);
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
            onDoubleClick={() => handleOpenFile(item.dirent)}
          >
            {item.dirent.name}
          </li>
        ))}
      </ul>
    </>
  );
}
