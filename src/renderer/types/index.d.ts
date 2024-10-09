declare global {
  interface Window {
    electronAPI: {
      openFile: (fileName) => Promise<void>;
      saveFile: (data) => Promise<{
        success: boolean;
        path: string;
      }>;
      readingFileListInFolder: () => Promise<Dirent[]>;
    };
  }
}

export {};
