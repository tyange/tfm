import { useState, useCallback, DragEventHandler, useEffect } from "react";

import { Dirent } from "fs";

type FileWithId = {
  id: string;
  dirent: Dirent;
};

type UseDraggableItemsProps = {
  items: FileWithId[];
};

export default function useDraggableItems({ items }: UseDraggableItemsProps): {
  isDragging: boolean;
  currentDraggingNode: null | HTMLElement;
  dragStart: DragEventHandler;
  dragEnter: DragEventHandler;
  dragOver: DragEventHandler;
  dragEnd: DragEventHandler;
  draggableItems: FileWithId[];
} {
  const [isDragging, setIsDragging] = useState(false);
  const [currentDraggingNode, setCurrentDraggingNode] =
    useState<null | HTMLElement>();
  const [draggableItems, setDraggableItems] = useState(items);

  const dragStart = useCallback<DragEventHandler>((e) => {
    setIsDragging(true);

    if (e.target instanceof HTMLElement) {
      setCurrentDraggingNode(e.target);
    }
  }, []);

  const dragEnter = useCallback<DragEventHandler>((e) => {
    e.preventDefault();
  }, []);

  const dragOver = useCallback<DragEventHandler>(
    (e) => {
      const currentTarget = e.currentTarget;

      if (!isDragging || !currentDraggingNode || !currentTarget) return;

      setDraggableItems((prevItems) => {
        const currentItems = [...prevItems];

        const draggedIndex = currentItems.findIndex(
          (item) => item.id === currentDraggingNode.id
        );
        const hoverIndex = currentItems.findIndex(
          (item) => item.id === currentTarget.id
        );

        if (draggedIndex === hoverIndex) return currentItems;

        const newItems = [...currentItems];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);

        return newItems;
      });
    },
    [isDragging, currentDraggingNode]
  );

  const dragEnd = useCallback<DragEventHandler>(() => {
    setIsDragging(false);
    setCurrentDraggingNode(null);
  }, []);

  useEffect(() => {
    setDraggableItems(items);
  }, [items]);

  return {
    isDragging,
    currentDraggingNode,
    dragStart,
    dragEnter,
    dragOver,
    dragEnd,
    draggableItems: [...draggableItems],
  };
}
