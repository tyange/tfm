declare global {
  interface Window {
    electronAPI: {
      openFile: () => Promise<{
        canceled: boolean;
        filePath?: string;
        files?: string[];
      }>;
      saveFile: (data) => Promise<{
        success: boolean;
        path: string;
      }>;
      readingFileListInFolder: () => Promise<Dirent[]>;
    };
  }
}

export {};
