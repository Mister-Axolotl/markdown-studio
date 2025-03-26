import React, { useState, useCallback, useRef } from "react";
import Header from "./components/common/Header";
import MainContent from "./components/main/MainContent";
import { ThemeProvider } from "./hooks/useTheme";

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState(
    "# Welcome to Markdown Studio\n\nStart typing your markdown here...",
  );
  const [fileName] = useState("Untitled.md");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const undoFunctionRef = useRef<(() => void) | null>(null);
  const redoFunctionRef = useRef<(() => void) | null>(null);

  // Handle markdown changes
  const handleMarkdownChange = useCallback((newMarkdown: string) => {
    setMarkdown(newMarkdown);
  }, []);

  // Handle save action
  const handleSave = useCallback(() => {
    console.log("Saving file:", fileName);
    // Implement actual save functionality here
    // For example, using Electron's dialog and fs modules
  }, [fileName, markdown]);

  // Handle export action
  const handleExport = useCallback(() => {
    console.log("Exporting to HTML or PDF");
    // Implement export functionality
  }, [markdown]);

  // Handle import action
  const handleImport = useCallback(() => {
    console.log("Importing file");
    // Implement import functionality
  }, []);

  // Handle settings action
  const handleSettings = useCallback(() => {
    console.log("Opening settings");
    // Implement settings dialog
  }, []);

  // Undo/Redo handlers that use the refs to call MainContent's functions
  const handleUndo = useCallback(() => {
    if (undoFunctionRef.current) {
      undoFunctionRef.current();
    }
  }, []);

  const handleRedo = useCallback(() => {
    if (redoFunctionRef.current) {
      redoFunctionRef.current();
    }
  }, []);

  // Track undo/redo state
  const handleUndoStateChange = useCallback(
    (canUndoNew: boolean, canRedoNew: boolean) => {
      setCanUndo(canUndoNew);
      setCanRedo(canRedoNew);
    },
    [],
  );

  return (
    <ThemeProvider>
      <div className="app-container flex flex-col h-screen">
        <Header
          onSave={handleSave}
          onExport={handleExport}
          onImport={handleImport}
          onSettings={handleSettings}
          onUndo={handleUndo}
          onRedo={handleRedo}
          fileName={fileName}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <MainContent
          initialMarkdown={markdown}
          onChange={handleMarkdownChange}
          onSave={handleSave}
          onUndoStateChange={handleUndoStateChange}
          undoRef={undoFunctionRef}
          redoRef={redoFunctionRef}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
