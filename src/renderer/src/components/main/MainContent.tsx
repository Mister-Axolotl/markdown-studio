import React, { useState, useEffect, useRef } from "react";
import { useNotification } from "../../hooks/useNotification";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { useTheme } from "../../hooks/useTheme";
import "../layout/_main-content.scss";
import "highlight.js/styles/github-dark.css";

import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaLink,
  FaImage,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaTable,
  FaHeading,
  FaUndo,
  FaRedo,
  FaGripLinesVertical,
} from "react-icons/fa";

interface MainContentProps {
  initialMarkdown?: string;
  onChange?: (markdown: string) => void;
  onSave?: (markdown: string) => void;
  onUndoStateChange?: (canUndo: boolean, canRedo: boolean) => void;
  undoRef?: React.MutableRefObject<(() => void) | null>;
  redoRef?: React.MutableRefObject<(() => void) | null>;
}

/**
 * Main content component for the Markdown editor
 * Provides split view with editor and preview panes
 */
const MainContent: React.FC<MainContentProps> = ({
  initialMarkdown = "# Welcome to Markdown Studio\n\nStart typing your markdown here...",
  onChange,
  onSave,
  onUndoStateChange,
  undoRef,
  redoRef,
}) => {
  const { theme } = useTheme();
  const { addNotification } = useNotification();

  useEffect(() => {
    // This empty dependency effect ensures the component
    // re-renders when theme context changes
  }, [theme]);

  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [html, setHtml] = useState("");
  const [splitView, setSplitView] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // History states for undo/redo functionality
  const [history, setHistory] = useState<string[]>([initialMarkdown]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isUndoRedo, setIsUndoRedo] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);

  // Track current image being resized
  const [activeResizeImage, setActiveResizeImage] =
    useState<HTMLImageElement | null>(null);
  const [initialImageSize, setInitialImageSize] = useState({
    width: 0,
    height: 0,
  });
  const [initialMousePosition, setInitialMousePosition] = useState({
    x: 0,
    y: 0,
  });

  // Max history limit
  const MAX_HISTORY = 100;

  // Add this effect for the resizer functionality
  useEffect(() => {
    const container = containerRef.current;
    const resizer = resizerRef.current;

    if (!container || !resizer || !splitView) return;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      // Calculate new editor width as percentage
      let newWidth = (mouseX / containerWidth) * 100;

      // Limit width to reasonable values
      newWidth = Math.max(20, Math.min(newWidth, 80));

      setEditorWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    resizer.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      resizer.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, splitView]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--editor-width",
        `${editorWidth}%`,
      );
    }
  }, [editorWidth]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content =
      "default-src 'self'; img-src * data: https:; style-src 'self' 'unsafe-inline'";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Configure marked with highlight.js and extensions
  useEffect(() => {
    // Configure custom extensions
    const renderer = new marked.Renderer();

    // Replace the default image renderer
    renderer.image = function (imageInfo) {
      const { href, title, text } = imageInfo;

      // Extract width and height if they exist in the title
      let width = "";
      let height = "";
      let cleanTitle = title || "";

      if (title && title.includes("|")) {
        const parts = title.split("|");
        cleanTitle = parts[0].trim();

        const dimensions = parts[1].trim();
        const widthMatch = dimensions.match(/width=(\d+)/);
        const heightMatch = dimensions.match(/height=(\d+)/);

        if (widthMatch) width = widthMatch[1];
        if (heightMatch) height = heightMatch[1];
      }

      const sizeAttributes =
        width || height
          ? `${width ? 'width="' + width + '"' : ""} ${height ? 'height="' + height + '"' : ""}`
          : "";

      // Important: make sure to use single quotes for HTML attributes to avoid issues with the string
      return `
        <div class="image-container">
        <img src="${href}" alt="${text}" title="${cleanTitle}" ${sizeAttributes} class="resizable-image" data-original-src="${href}" />
        <button class="resize-button" title="Resize Image">
            <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22,22H20V20H22V22M22,18H20V16H22V18M18,22H16V20H18V22M18,18H16V16H18V18M14,22H12V20H14V22M22,14H20V12H22V14Z"></path>
            </svg>
        </button>
        </div>
    `;
    };

    marked.setOptions({
      renderer: renderer,
      breaks: true,
      gfm: true,
      pedantic: false,
    });

    // Configure highlight.js for code syntax highlighting
    marked.use({
      renderer: {
        code(token) {
          const { text, lang } = token;
          const validLanguage = hljs.getLanguage(lang || "")
            ? lang
            : "plaintext";
          return (
            '<pre><code class="hljs language-' +
            validLanguage +
            '">' +
            hljs.highlight(text, { language: validLanguage || "plaintext" })
              .value +
            "</code></pre>"
          );
        },
      },
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Parse markdown to HTML whenever markdown content changes
  useEffect(() => {
    try {
      // marked.parse can return Promise<string> or string, we need to handle both cases
      const result = marked.parse(markdown);
      if (result instanceof Promise) {
        result
          .then((parsedHtml) => {
            setHtml(parsedHtml);
          })
          .catch((error) => {
            console.error("Error parsing markdown:", error);
          });
      } else {
        setHtml(result);
      }

      // Notify parent component if onChange handler is provided
      if (onChange) onChange(markdown);
    } catch (error) {
      console.error("Error parsing markdown:", error);
    }
  }, [markdown, onChange]);

  // Set up image resize handlers after HTML is updated
  useEffect(() => {
    if (html && previewRef.current) {
      const timerId = setTimeout(() => {
        setupImageResizing();
      }, 150); // Increased timeout to ensure DOM is fully rendered

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [html]); // Depend on html instead of markdown for more reliable updates

  // Setup image resize handlers on rendered images
  useEffect(() => {
    const previewPane = previewRef.current;
    if (!previewPane) return;

    // Function to add resize borders and event listeners to images
    const setupImageResizing = () => {
      const previewPane = previewRef.current;
      if (!previewPane) {
        console.log("Preview pane not found");
        return;
      }

      console.log("Setting up image resizing...");

      // First check for resize buttons
      const resizeButtons = previewPane.querySelectorAll(".resize-button");
      console.log(`Found ${resizeButtons.length} resize buttons`);

      if (resizeButtons.length > 0) {
        // Clear any existing event listeners
        resizeButtons.forEach((button) => {
          button.removeEventListener("mousedown", () => {});
        });

        resizeButtons.forEach((button, index) => {
          const container = button.closest(".image-container");
          const img = container?.querySelector(
            "img.resizable-image",
          ) as HTMLImageElement;

          if (!img) {
            console.log(`No image found for button ${index}`);
            return;
          }

          console.log(
            `Setting up resize button for image ${index}: ${img.getAttribute("src")?.substring(0, 30)}...`,
          );

          // Handle button click to start resizing
          button.addEventListener("mousedown", (e: Event) => {
            e.preventDefault();
            const mouseEvent = e as MouseEvent;

            setActiveResizeImage(img);
            setInitialImageSize({
              width: img.width,
              height: img.height,
            });
            setInitialMousePosition({
              x: mouseEvent.clientX,
              y: mouseEvent.clientY,
            });

            document.body.style.cursor = "nwse-resize";
            img.classList.add("img-resizing");
          });
        });
      } else {
        // If no resize buttons found, try setting up the images directly (fallback)
        const images = previewPane.querySelectorAll("img.resizable-image");
        console.log(`Found ${images.length} resizable images`);

        // If there are images but no buttons, try to add resize buttons
        if (images.length > 0 && resizeButtons.length === 0) {
          console.log("Adding missing resize buttons");
          images.forEach((img, i) => {
            const existingContainer = img.closest(".image-container");

            // Only create a new container if one doesn't exist
            if (!existingContainer) {
              const newContainer = document.createElement("div");
              newContainer.className = "image-container";

              // Insert the container before the image
              img.parentNode?.insertBefore(newContainer, img);

              // Move the image into the container
              newContainer.appendChild(img);

              // Create and add the resize button
              const resizeBtn = document.createElement("button");
              resizeBtn.className = "resize-button";
              resizeBtn.title = "Resize Image";
              resizeBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22,22H20V20H22V22M22,18H20V16H22V18M18,22H16V20H18V22M18,18H16V16H18V18M14,22H12V20H14V22M22,14H20V12H22V14Z"></path>
            </svg>
          `;
              newContainer.appendChild(resizeBtn);

              console.log(`Added resize button to image ${i}`);
            }
          });

          // Try again after adding buttons
          setTimeout(setupImageResizing, 50);
        }
      }
    };

    // Call setupImageResizing directly to handle initial load
    setupImageResizing();

    // Handle window mouse move and up for resizing
    const handleMouseMove = (e: MouseEvent) => {
      if (!activeResizeImage) return;

      const deltaX = e.clientX - initialMousePosition.x;
      const deltaY = e.clientY - initialMousePosition.y;

      // Calculate new dimensions while maintaining aspect ratio
      const aspectRatio = initialImageSize.width / initialImageSize.height;
      let newWidth = initialImageSize.width + deltaX;
      let newHeight = initialImageSize.height + deltaY;

      // Simple aspect ratio preservation - can be improved
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newHeight = newWidth / aspectRatio;
      } else {
        newWidth = newHeight * aspectRatio;
      }

      // Apply new dimensions
      activeResizeImage.width = Math.max(20, newWidth);
      activeResizeImage.height = Math.max(20, newHeight);
    };

    const handleMouseUp = () => {
      if (!activeResizeImage) return;

      document.body.style.cursor = "default";

      // Update markdown with new image dimensions
      updateMarkdownImageSize(
        activeResizeImage.getAttribute("data-original-src") || "",
        activeResizeImage.getAttribute("alt") || "",
        activeResizeImage.getAttribute("title") || "",
        Math.round(activeResizeImage.width),
        Math.round(activeResizeImage.height),
      );

      activeResizeImage.classList.remove("img-resizing");
      activeResizeImage.classList.remove("img-resize-hover");
      setActiveResizeImage(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activeResizeImage, initialImageSize, initialMousePosition]);

  // Update markdown with new image dimensions
  const updateMarkdownImageSize = (
    src: string,
    alt: string,
    title: string,
    width: number,
    height: number,
  ) => {
    // First, escape special characters for regex
    const escapedSrc = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Create regex pattern that matches the image markdown
    // This pattern is simplified and may need to be more robust depending on your markdown structure
    const imagePattern = new RegExp(
      `!\\[(${alt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|[^\\]]*)\\]\\(${escapedSrc}(?:\\s+["']([^"']*)["'])?\\)`,
      "g",
    );

    const cleanTitle = title.split("|")[0]?.trim() || title;
    const dimensionString = `${cleanTitle}|width=${width},height=${height}`;

    let updatedMarkdown = markdown;
    let found = false;

    // Replace the image markdown with updated dimensions
    updatedMarkdown = markdown.replace(imagePattern, (_match, _foundAlt) => {
      found = true;
      return `![${alt}](${src} "${dimensionString}")`;
    });

    if (found) {
      setMarkdown(updatedMarkdown);

      // Add to history
      const newHistory = [
        ...history.slice(0, historyIndex + 1),
        updatedMarkdown,
      ];
      const limitedHistory =
        newHistory.length > MAX_HISTORY
          ? newHistory.slice(newHistory.length - MAX_HISTORY)
          : newHistory;

      setHistory(limitedHistory);
      setHistoryIndex(limitedHistory.length - 1);
    }
  };

  // Handle external links - open in default browser instead of within the app
  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const target = e.target as HTMLElement;
      const anchor = target.closest("a") as HTMLAnchorElement;

      if (anchor && anchor.href && !anchor.href.startsWith("javascript:")) {
        mouseEvent.preventDefault();

        // Use type assertion approach instead of global declaration
        const electronApi = window.electron as
          | {
              openExternal?: (url: string) => Promise<void>;
            }
          | undefined;

        if (electronApi?.openExternal) {
          electronApi.openExternal(anchor.href);
        } else {
          window.open(anchor.href, "_blank", "noopener,noreferrer");
        }
      }
    };

    const previewPane = previewRef.current;
    if (previewPane) {
      previewPane.addEventListener("click", handleLinkClick);
    }

    return () => {
      if (previewPane) {
        previewPane.removeEventListener("click", handleLinkClick);
      }
    };
  }, []);

  // Update undo/redo states when history changes
  useEffect(() => {
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    if (onUndoStateChange) {
      onUndoStateChange(canUndo, canRedo);
    }
  }, [history, historyIndex, onUndoStateChange]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save with Ctrl+S
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault(); // Prevent browser's save dialog
        if (onSave) {
          onSave(markdown);
        }
      }

      // Undo with Ctrl+Z
      if (e.ctrlKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo with Ctrl+Y or Ctrl+Shift+Z
      if (
        (e.ctrlKey && e.key === "y") ||
        (e.ctrlKey && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [markdown, onSave, historyIndex, history]);

  // Handle changes in the editor textarea
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMarkdown = e.target.value;
    setMarkdown(newMarkdown);

    // Don't add to history if this change was from an undo/redo operation
    if (!isUndoRedo) {
      // Add to history, removing any future states if we're in the middle of the history
      const newHistory = [...history.slice(0, historyIndex + 1), newMarkdown];

      // Limit history size
      const limitedHistory =
        newHistory.length > MAX_HISTORY
          ? newHistory.slice(newHistory.length - MAX_HISTORY)
          : newHistory;

      setHistory(limitedHistory);
      setHistoryIndex(limitedHistory.length - 1);
    } else {
      // Reset the flag after handling the undo/redo
      setIsUndoRedo(false);
    }
  };

  // Undo the last change
  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedo(true);
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMarkdown(history[newIndex]);
    }
  };

  // Redo the last undone change
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedo(true);
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setMarkdown(history[newIndex]);
    }
  };

  useEffect(() => {
    if (undoRef) undoRef.current = handleUndo;
    if (redoRef) redoRef.current = handleRedo;
  }, [handleUndo, handleRedo, undoRef, redoRef]);

  // Toggle between split view and preview-only modes
  const toggleView = () => {
    setSplitView(!splitView);
  };

  /**
   * Insert text formatting at the current cursor position or around selected text
   * @param before Text to insert before selection
   * @param after Text to insert after selection (optional)
   */
  const insertText = (before: string, after: string = "") => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);

    const newText =
      markdown.substring(0, start) +
      before +
      selectedText +
      after +
      markdown.substring(end);

    setMarkdown(newText);

    // Add to history
    const newHistory = [...history.slice(0, historyIndex + 1), newText];
    const limitedHistory =
      newHistory.length > MAX_HISTORY
        ? newHistory.slice(newHistory.length - MAX_HISTORY)
        : newHistory;

    setHistory(limitedHistory);
    setHistoryIndex(limitedHistory.length - 1);

    // Set cursor position intelligently:
    // - If text was selected, place cursor after the formatted text
    // - If no text was selected, place cursor between formatting marks
    setTimeout(() => {
      textarea.focus();

      let newPosition;
      if (selectedText.length === 0) {
        // No text selected, place cursor between the formatting marks
        newPosition = start + before.length;
      } else {
        // Text was selected, place cursor after the formatted text
        newPosition =
          start + before.length + selectedText.length + after.length;
      }

      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Collection of formatting actions for the toolbar
  const formatActions = {
    bold: () => insertText("**", "**"),
    italic: () => insertText("_", "_"),
    strikethrough: () => insertText("~~", "~~"),
    heading: () => insertText("# "),
    code: () => insertText("```\n", "\n```"),
    inlineCode: () => insertText("`", "`"),
    link: () => insertText("[", "](https://)"),
    image: () => insertText("![alt text](", ")"),
    unorderedList: () => insertText("* "),
    orderedList: () => insertText("1. "),
    quote: () => insertText("> "),
    table: () =>
      insertText(
        "| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |",
      ),
  };

  // Setup image resizing function
  const setupImageResizing = () => {
    const previewPane = previewRef.current;
    if (!previewPane) {
      console.log("Preview pane not found");
      return;
    }

    console.log("Setting up image resizing...");

    // Recherche spécifiquement les boutons de redimensionnement
    const resizeButtons = previewPane.querySelectorAll(".resize-button");
    console.log(`Found ${resizeButtons.length} resize buttons`);

    if (resizeButtons.length > 0) {
      // Supprimer les écouteurs existants pour éviter les doublons
      resizeButtons.forEach((button) => {
        button.removeEventListener("mousedown", () => {});
      });

      resizeButtons.forEach((button, index) => {
        const container = button.closest(".image-container");
        const img = container?.querySelector(
          "img.resizable-image",
        ) as HTMLImageElement;

        if (!img) {
          console.log(`No image found for button ${index}`);
          return;
        }

        console.log(
          `Setting up resize button for image ${index}: ${img.getAttribute("src")?.substring(0, 30)}...`,
        );

        // Attacher l'événement de redimensionnement au bouton
        button.addEventListener("mousedown", (e: Event) => {
          e.preventDefault();
          const mouseEvent = e as MouseEvent;

          setActiveResizeImage(img);
          setInitialImageSize({
            width: img.width,
            height: img.height,
          });
          setInitialMousePosition({
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
          });

          document.body.style.cursor = "nwse-resize";
          img.classList.add("img-resizing");
        });
      });
    }
  };

  return (
    <div className={`main-content ${theme === "dark" ? "dark-theme" : ""}`}>
      {/* Formatting toolbar */}
      <div className="toolbar">
        <div className="format-tools">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className={historyIndex <= 0 ? "disabled" : ""}
            title="Undo (Ctrl+Z)"
          >
            <FaUndo />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className={historyIndex >= history.length - 1 ? "disabled" : ""}
            title="Redo (Ctrl+Y)"
          >
            <FaRedo />
          </button>
          <span className="divider"></span>
          <button onClick={formatActions.bold} title="Bold (Ctrl+B)">
            <FaBold />
          </button>
          <button onClick={formatActions.italic} title="Italic (Ctrl+I)">
            <FaItalic />
          </button>
          <button onClick={formatActions.strikethrough} title="Strikethrough">
            <FaStrikethrough />
          </button>
          <span className="divider"></span>
          <button onClick={formatActions.heading} title="Heading">
            <FaHeading />
          </button>
          <button onClick={formatActions.quote} title="Quote">
            <FaQuoteRight />
          </button>
          <button onClick={formatActions.code} title="Code Block">
            <FaCode />
          </button>
          <span className="divider"></span>
          <button onClick={formatActions.link} title="Link">
            <FaLink />
          </button>
          <button onClick={formatActions.image} title="Image">
            <FaImage />
          </button>
          <span className="divider"></span>
          <button onClick={formatActions.unorderedList} title="Bulleted List">
            <FaListUl />
          </button>
          <button onClick={formatActions.orderedList} title="Numbered List">
            <FaListOl />
          </button>
          <button onClick={formatActions.table} title="Table">
            <FaTable />
          </button>
        </div>
        <button className="view-toggle" onClick={toggleView}>
          {splitView ? "Preview Only" : "Split View"}
        </button>
      </div>

      {/* Editor and Preview container */}
      <div
        ref={containerRef}
        className={`editor-container ${splitView ? "split" : "preview-only"} ${isDragging ? "dragging" : ""}`}
      >
        {/* Editor pane */}
        {(splitView || !splitView) && (
          <div className="editor-pane">
            <textarea
              ref={editorRef}
              className="markdown-editor"
              value={markdown}
              onChange={handleEditorChange}
              placeholder="Type your markdown here..."
              spellCheck="false"
            />
          </div>
        )}

        {/* Resizer handle */}
        {splitView && (
          <div ref={resizerRef} className="pane-resizer">
            <FaGripLinesVertical />
          </div>
        )}

        {/* Preview pane */}
        {(splitView || !splitView) && (
          <div className="preview-pane">
            <div
              ref={previewRef}
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
