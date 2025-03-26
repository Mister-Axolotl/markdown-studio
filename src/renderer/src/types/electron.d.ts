interface Window {
  electron?: {
    openExternal: (url: string) => Promise<void>;
    resolveLocalFilePath?: (path: string) => string;
  };
}
