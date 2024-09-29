declare global {
  interface Window {
    electronAPI: {
      openDirectory: () => Promise<{
        canceled: boolean;
        directoryPath?: string;
        files?: string[];
      }>;
    };
  }
}

export {};
