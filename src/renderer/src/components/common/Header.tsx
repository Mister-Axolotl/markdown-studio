import React from "react";
import { useTheme } from "../../hooks/useTheme";
import {
  FaSave,
  FaFileExport,
  FaFileImport,
  FaCog,
  FaGithub,
} from "react-icons/fa";
import "../layout/_header.scss";

interface HeaderProps {
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  onSettings: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  fileName: string;
  canUndo?: boolean;
  canRedo?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSave,
  onExport,
  onImport,
  onSettings,
  fileName,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`app-header ${theme === "dark" ? "dark-theme" : ""}`}>
      {/* Logo and title */}
      <div className="title-area">
        <h1 className="app-title">Markdown Studio</h1>
        <span className="file-name">{fileName || "Untitled.md"}</span>
      </div>

      {/* Actions */}
      <div className="header-actions">
        <button
          onClick={onSave}
          className="header-button"
          title="Save (Ctrl+S)"
        >
          <FaSave />
        </button>
        <button onClick={onExport} className="header-button" title="Export">
          <FaFileExport />
        </button>
        <button onClick={onImport} className="header-button" title="Import">
          <FaFileImport />
        </button>
        <button
          onClick={toggleTheme}
          className="header-button theme-toggle"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className={`theme-icon ${theme === "dark" ? "rotate-in" : ""}`}>
            {theme === "dark" ? "☀️" : "🌙"}
          </span>
        </button>
        <button onClick={onSettings} className="header-button" title="Settings">
          <FaCog />
        </button>
        <a
          href="https://github.com/Mister-Axolotl/markdown-studio"
          target="_blank"
          rel="noopener noreferrer"
          className="header-button github-link"
          title="GitHub Repository"
        >
          <FaGithub />
        </a>
      </div>
    </header>
  );
};

export default Header;
