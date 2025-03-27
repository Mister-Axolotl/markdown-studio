import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useNotification } from "../../hooks/useNotification";
import "../layout/_settings_parameters.scss";
import {
  FaArrowLeft,
  FaUndo,
  FaCheck,
  FaPalette,
  FaCode,
  FaMarkdown,
} from "react-icons/fa";

// Define color configuration type
interface ColorConfig {
  key: string;
  label: string;
  cssVariable: string;
  lightDefault: string;
  darkDefault: string;
  description?: string;
}

// Define markdown element configuration type
interface MarkdownElementConfig {
  key: string;
  label: string;
  cssVariable: string;
  lightDefault: string;
  darkDefault: string;
  previewText: string;
  elementType: string;
}

const Parameters: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const { addNotification } = useNotification();

  // Add tabs state
  const [activeTab, setActiveTab] = useState<"theme" | "markdown">("theme");
  const [previewMode, setPreviewMode] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  // Define all color configurations
  const colorConfigs: ColorConfig[] = [
    {
      key: "background",
      label: "Background",
      cssVariable: "--color-background",
      lightDefault: "var(--color-background)",
      darkDefault: "var(--color-background)",
      description: "Main background color for the application",
    },
    {
      key: "text",
      label: "Text",
      cssVariable: "--color-text",
      lightDefault: "var(--color-text)",
      darkDefault: "var(--color-text)",
      description: "Main text color throughout the application",
    },
    {
      key: "toolbar",
      label: "Toolbar Background",
      cssVariable: "--color-toolbar-bg",
      lightDefault: "var(--color-toolbar-bg)",
      darkDefault: "var(--color-toolbar-bg)",
      description: "Background color for toolbars and headers",
    },
    {
      key: "border",
      label: "Border",
      cssVariable: "--color-border",
      lightDefault: "var(--color-border)",
      darkDefault: "var(--color-border)",
      description: "Color used for borders and dividers",
    },
    {
      key: "button",
      label: "Button Hover",
      cssVariable: "--color-button-hover",
      lightDefault: "var(--color-button-hover)",
      darkDefault: "var(--color-button-hover)",
      description: "Background color when hovering buttons",
    },
    {
      key: "code-bg",
      label: "Code Background",
      cssVariable: "--color-code-bg",
      lightDefault: "var(--color-code-bg)",
      darkDefault: "var(--color-code-bg)",
      description: "Background color for code blocks",
    },
    {
      key: "code-text",
      label: "Code Text",
      cssVariable: "--color-code-text",
      lightDefault: "var(--color-code-text)",
      darkDefault: "var(--color-code-text)",
      description: "Text color inside code blocks",
    },
    {
      key: "link",
      label: "Links",
      cssVariable: "--color-link",
      lightDefault: "var(--color-link)",
      darkDefault: "var(--color-link)",
      description: "Color used for links and primary actions",
    },
    {
      key: "blockquote",
      label: "Blockquote",
      cssVariable: "--color-blockquote",
      lightDefault: "var(--color-blockquote)",
      darkDefault: "var(--color-blockquote)",
      description: "Text color for blockquote elements",
    },
    {
      key: "table-header",
      label: "Table Header",
      cssVariable: "--color-table-header",
      lightDefault: "var(--color-table-header)",
      darkDefault: "var(--color-table-header)",
      description: "Background color for table headers",
    },
  ];

  // Define markdown element configurations
  const markdownConfigs: MarkdownElementConfig[] = [
    {
      key: "h1",
      label: "Heading 1",
      cssVariable: "--md-h1-color",
      lightDefault: "var(--color-text)",
      darkDefault: "var(--color-text)",
      previewText: "Heading 1",
      elementType: "h1",
    },
    {
      key: "h2",
      label: "Heading 2",
      cssVariable: "--md-h2-color",
      lightDefault: "var(--color-text)",
      darkDefault: "var(--color-text)",
      previewText: "Heading 2",
      elementType: "h2",
    },
    {
      key: "h3",
      label: "Heading 3",
      cssVariable: "--md-h3-color",
      lightDefault: "var(--color-text)",
      darkDefault: "var(--color-text)",
      previewText: "Heading 3",
      elementType: "h3",
    },
    {
      key: "h4",
      label: "Heading 4",
      cssVariable: "--md-h4-color",
      lightDefault: "var(--color-text)",
      darkDefault: "var(--color-text)",
      previewText: "Heading 4",
      elementType: "h4",
    },
    {
      key: "paragraph",
      label: "Paragraph",
      cssVariable: "--md-paragraph-color",
      lightDefault: "var(--color-text)",
      darkDefault: "var(--color-text)",
      previewText:
        "This is a paragraph of text showing how content will appear in your document.",
      elementType: "p",
    },
    {
      key: "list-item",
      label: "List Item",
      cssVariable: "--md-list-color",
      lightDefault: "var(--color-text)",
      darkDefault: "var(--color-text)",
      previewText: "List item with custom styling",
      elementType: "li",
    },
    {
      key: "blockquote-text",
      label: "Blockquote Text",
      cssVariable: "--md-blockquote-text-color",
      lightDefault: "var(--color-blockquote)",
      darkDefault: "var(--color-blockquote)",
      previewText: "This is a blockquote with custom text color.",
      elementType: "blockquote",
    },
    {
      key: "blockquote-border",
      label: "Blockquote Border",
      cssVariable: "--md-blockquote-border-color",
      lightDefault: "var(--color-border)",
      darkDefault: "var(--color-border)",
      previewText: "Blockquote with custom border color.",
      elementType: "blockquote-border",
    },
    {
      key: "code-inline",
      label: "Inline Code",
      cssVariable: "--md-code-inline-color",
      lightDefault: "var(--color-code-text)",
      darkDefault: "var(--color-code-text)",
      previewText: "Text with inline code element.",
      elementType: "code-inline",
    },
    {
      key: "link-text",
      label: "Link Text",
      cssVariable: "--md-link-color",
      lightDefault: "var(--color-link)",
      darkDefault: "var(--color-link)",
      previewText: "Text with a link element.",
      elementType: "a",
    },
    {
      key: "table-border",
      label: "Table Border",
      cssVariable: "--md-table-border-color",
      lightDefault: "var(--color-border)",
      darkDefault: "var(--color-border)",
      previewText: "Table with custom border color.",
      elementType: "table-border",
    },
    {
      key: "table-header-text",
      label: "Table Header Text",
      cssVariable: "--md-table-header-text-color",
      lightDefault: "var(--color-text)",
      darkDefault: "var(--color-text)",
      previewText: "Table header text color.",
      elementType: "th",
    },
    {
      key: "hr",
      label: "Horizontal Rule",
      cssVariable: "--md-hr-color",
      lightDefault: "var(--color-border)",
      darkDefault: "var(--color-border)",
      previewText: "Horizontal rule with custom color.",
      elementType: "hr",
    },
  ];

  // Get current CSS values or defaults
  const getInitialColorValue = (
    config: ColorConfig | MarkdownElementConfig,
  ) => {
    const computedStyle = getComputedStyle(document.documentElement);

    // First try to get the actual CSS variable value
    let currentValue = computedStyle
      .getPropertyValue(config.cssVariable)
      .trim();

    if (!currentValue) {
      // If it's not set, get the default for this theme
      const defaultVarName =
        theme === "dark" ? config.darkDefault : config.lightDefault;

      // If default is a CSS variable (starts with var(--)
      if (
        typeof defaultVarName === "string" &&
        defaultVarName.startsWith("var(--")
      ) {
        // Extract the variable name from var(--name)
        const varName = defaultVarName.match(/var\((.*?)\)/)?.[1];
        if (varName) {
          currentValue = computedStyle.getPropertyValue(varName).trim();
        }
      } else {
        currentValue = defaultVarName;
      }
    }

    return currentValue;
  };

  // Initialize state with current values
  const [colorValues, setColorValues] = useState<Record<string, string>>(
    colorConfigs.reduce(
      (acc, config) => {
        acc[config.key] = getInitialColorValue(config);
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  // Initialize markdown element values
  const [markdownValues, setMarkdownValues] = useState<Record<string, string>>(
    markdownConfigs.reduce(
      (acc, config) => {
        acc[config.key] = getInitialColorValue(config);
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  // Handle color change
  const handleColorChange = (key: string, value: string) => {
    setColorValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update DOM immediately if in preview mode
    if (previewMode) {
      const config = colorConfigs.find((c) => c.key === key);
      if (config) {
        document.documentElement.style.setProperty(config.cssVariable, value);
      }
    }
  };

  // Handle markdown element color change
  const handleMarkdownColorChange = (key: string, value: string) => {
    setMarkdownValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update DOM immediately if in preview mode
    if (previewMode) {
      const config = markdownConfigs.find((c) => c.key === key);
      if (config) {
        document.documentElement.style.setProperty(config.cssVariable, value);
      }
    }
  };

  // Apply color changes
  const applyColors = () => {
    // Apply theme colors
    colorConfigs.forEach((config) => {
      document.documentElement.style.setProperty(
        config.cssVariable,
        colorValues[config.key],
      );

      // Save to localStorage
      localStorage.setItem(
        `theme-color-${theme}-${config.key}`,
        colorValues[config.key],
      );
    });

    // Apply markdown element colors
    markdownConfigs.forEach((config) => {
      document.documentElement.style.setProperty(
        config.cssVariable,
        markdownValues[config.key],
      );

      // Save to localStorage
      localStorage.setItem(
        `theme-md-${theme}-${config.key}`,
        markdownValues[config.key],
      );
    });

    // Show notification
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);

    addNotification("success", "Color settings saved successfully!", 3000);
    onBack();
  };

  // Reset to defaults
  const resetToDefaults = () => {
    const newColorValues = {} as Record<string, string>;
    const newMarkdownValues = {} as Record<string, string>;
    const computedStyle = getComputedStyle(document.documentElement);

    // Reset theme colors
    colorConfigs.forEach((config) => {
      const defaultVarName =
        theme === "dark" ? config.darkDefault : config.lightDefault;
      let defaultValue = defaultVarName;

      // Handle CSS variable references
      if (
        typeof defaultVarName === "string" &&
        defaultVarName.startsWith("var(--")
      ) {
        const varName = defaultVarName.match(/var\((.*?)\)/)?.[1];
        if (varName) {
          defaultValue = computedStyle.getPropertyValue(varName).trim();
        }
      }

      newColorValues[config.key] = defaultValue;

      // Update DOM immediately if in preview mode
      if (previewMode) {
        document.documentElement.style.setProperty(
          config.cssVariable,
          defaultValue,
        );
      }

      // Remove from localStorage
      localStorage.removeItem(`theme-color-${theme}-${config.key}`);
    });

    // Reset markdown element colors
    markdownConfigs.forEach((config) => {
      const defaultVarName =
        theme === "dark" ? config.darkDefault : config.lightDefault;
      let defaultValue = defaultVarName;

      // Handle CSS variable references
      if (
        typeof defaultVarName === "string" &&
        defaultVarName.startsWith("var(--")
      ) {
        const varName = defaultVarName.match(/var\((.*?)\)/)?.[1];
        if (varName) {
          defaultValue = computedStyle.getPropertyValue(varName).trim();
        }
      }

      newMarkdownValues[config.key] = defaultValue;

      // Update DOM immediately if in preview mode
      if (previewMode) {
        document.documentElement.style.setProperty(
          config.cssVariable,
          defaultValue,
        );
      }

      // Remove from localStorage
      localStorage.removeItem(`theme-md-${theme}-${config.key}`);
    });

    setColorValues(newColorValues);
    setMarkdownValues(newMarkdownValues);

    addNotification("info", "Colors reset to defaults", 3000);
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    const newPreviewMode = !previewMode;
    setPreviewMode(newPreviewMode);

    // If enabling preview, apply current values
    if (newPreviewMode) {
      // Apply theme colors
      colorConfigs.forEach((config) => {
        document.documentElement.style.setProperty(
          config.cssVariable,
          colorValues[config.key],
        );
      });

      // Apply markdown element colors
      markdownConfigs.forEach((config) => {
        document.documentElement.style.setProperty(
          config.cssVariable,
          markdownValues[config.key],
        );
      });
    } else {
      // If disabling preview, restore original values
      colorConfigs.forEach((config) => {
        const savedValue = localStorage.getItem(
          `theme-color-${theme}-${config.key}`,
        );
        const valueToApply = savedValue || getInitialColorValue(config);
        document.documentElement.style.setProperty(
          config.cssVariable,
          valueToApply,
        );
      });

      markdownConfigs.forEach((config) => {
        const savedValue = localStorage.getItem(
          `theme-md-${theme}-${config.key}`,
        );
        const valueToApply = savedValue || getInitialColorValue(config);
        document.documentElement.style.setProperty(
          config.cssVariable,
          valueToApply,
        );
      });
    }
  };

  // Render markdown element preview
  const renderMarkdownPreview = (config: MarkdownElementConfig) => {
    switch (config.elementType) {
      case "h1":
        return (
          <h1 style={{ color: markdownValues[config.key] }}>
            {config.previewText}
          </h1>
        );
      case "h2":
        return (
          <h2 style={{ color: markdownValues[config.key] }}>
            {config.previewText}
          </h2>
        );
      case "h3":
        return (
          <h3 style={{ color: markdownValues[config.key] }}>
            {config.previewText}
          </h3>
        );
      case "h4":
        return (
          <h4 style={{ color: markdownValues[config.key] }}>
            {config.previewText}
          </h4>
        );
      case "p":
        return (
          <p style={{ color: markdownValues[config.key] }}>
            {config.previewText}
          </p>
        );
      case "li":
        return (
          <ul>
            <li style={{ color: markdownValues[config.key] }}>
              {config.previewText}
            </li>
          </ul>
        );
      case "blockquote":
        return (
          <blockquote style={{ color: markdownValues[config.key] }}>
            {config.previewText}
          </blockquote>
        );
      case "blockquote-border":
        return (
          <blockquote style={{ borderLeftColor: markdownValues[config.key] }}>
            {config.previewText}
          </blockquote>
        );
      case "code-inline":
        return (
          <p>
            This is a text with{" "}
            <code style={{ color: markdownValues[config.key] }}>
              inline code
            </code>{" "}
            element.
          </p>
        );
      case "a":
        return (
          <p>
            This is a text with{" "}
            <a href="#" style={{ color: markdownValues[config.key] }}>
              a link
            </a>{" "}
            element.
          </p>
        );
      case "table-border":
        return (
          <div className="table-preview-container">
            <table style={{ borderColor: markdownValues[config.key] }}>
              <thead>
                <tr>
                  <th style={{ borderColor: markdownValues[config.key] }}>
                    Header
                  </th>
                  <th style={{ borderColor: markdownValues[config.key] }}>
                    Header
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ borderColor: markdownValues[config.key] }}>
                    Cell
                  </td>
                  <td style={{ borderColor: markdownValues[config.key] }}>
                    Cell
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "th":
        return (
          <div className="table-preview-container">
            <table>
              <thead>
                <tr>
                  <th style={{ color: markdownValues[config.key] }}>Header</th>
                  <th style={{ color: markdownValues[config.key] }}>Header</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "hr":
        return <hr style={{ backgroundColor: markdownValues[config.key] }} />;
      default:
        return <p>{config.previewText}</p>;
    }
  };

  return (
    <div
      className={`parameters-container ${theme === "dark" ? "dark-theme" : ""}`}
    >
      <div className="parameters-header">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Back
        </button>
        <h1>Style Settings</h1>
        <div className="header-actions">
          <button
            className={`preview-toggle ${previewMode ? "active" : ""}`}
            onClick={togglePreviewMode}
            title="Preview changes in real-time"
          >
            <FaCheck /> Live Preview
          </button>
        </div>
      </div>

      <div className="parameters-content">
        <div className="theme-info">
          <h2>Customize Your Experience</h2>
          <p>
            Personalize the appearance of Markdown Studio by adjusting the
            colors for both interface elements and markdown rendering. Changes
            will be saved per theme.
          </p>
        </div>

        {showSaveNotification && (
          <div className="save-notification">
            <FaCheck /> Settings saved successfully
          </div>
        )}

        <div className="tabs">
          <button
            className={activeTab === "theme" ? "active" : ""}
            onClick={() => setActiveTab("theme")}
          >
            <FaPalette /> Interface Colors
          </button>
          <button
            className={activeTab === "markdown" ? "active" : ""}
            onClick={() => setActiveTab("markdown")}
          >
            <FaMarkdown /> Markdown Elements
          </button>
        </div>

        {activeTab === "theme" && (
          <div className="color-grid">
            {colorConfigs.map((config) => (
              <div className="color-item" key={config.key}>
                <div className="color-header">
                  <label htmlFor={`color-${config.key}`}>{config.label}</label>
                  <div className="color-icon">
                    <FaPalette />
                  </div>
                </div>
                <div className="color-description">{config.description}</div>
                <div className="color-input-group">
                  <input
                    type="color"
                    id={`color-${config.key}`}
                    value={colorValues[config.key]}
                    onChange={(e) =>
                      handleColorChange(config.key, e.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={colorValues[config.key]}
                    onChange={(e) =>
                      handleColorChange(config.key, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "markdown" && (
          <div className="markdown-customizer">
            {markdownConfigs.map((config) => (
              <div className="markdown-item" key={config.key}>
                <div className="markdown-header">
                  <label htmlFor={`md-${config.key}`}>{config.label}</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      id={`md-${config.key}`}
                      value={markdownValues[config.key]}
                      onChange={(e) =>
                        handleMarkdownColorChange(config.key, e.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={markdownValues[config.key]}
                      onChange={(e) =>
                        handleMarkdownColorChange(config.key, e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="markdown-preview-item">
                  {renderMarkdownPreview(config)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="action-buttons">
          <button className="primary-button" onClick={applyColors}>
            <FaCheck /> Apply Changes
          </button>
          <button className="outline-button" onClick={resetToDefaults}>
            <FaUndo /> Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default Parameters;
