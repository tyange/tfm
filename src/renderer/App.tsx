import { useState } from "react";

import { Dirent } from "fs";

import jsonToUint8Array from "../utils/jsonToUint8Array";
import useDraggableItems from "../renderer/hooks/useDraggableItems";

type FileWithId = {
  id: string;
  dirent: Dirent;
};

export default function App(): React.ReactNode {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  async function handleFileListInFolder(): Promise<void> {
    setIsLoading(true);

    try {
      const result = await window.electronAPI.readingFileListInFolder();

      console.log(result);

      setFiles(result);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    }
    setIsLoading(false);
  }

  async function handleSaveFile(): Promise<void> {
    setIsLoading(true);

    const arrayBuffer = jsonToUint8Array({ data: draggableItems });

    try {
      await window.electronAPI.saveFile(arrayBuffer);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to save file:", error);
      setIsError(true);
    }

    setIsLoading(false);
  }

  async function handleOpenFile(dirent: Dirent): Promise<void> {
    setIsLoading(true);

    try {
      await window.electronAPI.openFile(dirent);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsError(true);
    }
    setIsLoading(false);
  }

  function renderer(): React.ReactNode {
    let status: "isLoading" | "isError" | "isEmpty" | "isSuccess" = "isEmpty";

    if (isLoading) {
      status = "isLoading";
    } else if (isError) {
      status = "isError";
    } else if (isSuccess && files.length > 0) {
      status = "isSuccess";
    }

    switch (status) {
      case "isLoading":
        return <p>Loading...</p>;
      case "isError":
        return <p>Error Occurred!</p>;
      case "isSuccess":
        return (
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
        );
      default:
        return <p>No data.</p>;
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
      <div>{renderer()}</div>
    </>
  );
}
