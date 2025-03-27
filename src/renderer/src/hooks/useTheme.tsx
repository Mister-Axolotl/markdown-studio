import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to load a saved color or use default
const loadSavedColor = (
  theme: ThemeMode,
  key: string,
  defaultValue: string,
): string => {
  const savedValue = localStorage.getItem(`theme-color-${theme}-${key}`);
  return savedValue || defaultValue;
};

// Helper function to load a saved markdown element color
const loadSavedMdColor = (
  theme: ThemeMode,
  key: string,
  defaultValue: string,
): string => {
  const savedValue = localStorage.getItem(`theme-md-${theme}-${key}`);
  return savedValue || defaultValue;
};

// Initialize CSS variables based on the current theme
const initializeThemeColors = (theme: ThemeMode) => {
  const root = document.documentElement;

  // Define color mappings with their defaults
  const defaultThemeColors = {
    background: theme === "dark" ? "#1e1e1e" : "#ffffff",
    text: theme === "dark" ? "#e0e0e0" : "#333333",
    "toolbar-bg": theme === "dark" ? "#252526" : "#f9f9f9",
    border: theme === "dark" ? "#444444" : "#e5e5e5",
    "button-hover": theme === "dark" ? "#3e3e3e" : "#e0e0e0",
    "code-bg": theme === "dark" ? "#2d2d2d" : "#f6f8fa",
    "code-text": theme === "dark" ? "#e0e0e0" : "#333333",
    link: theme === "dark" ? "#58a6ff" : "#0366d6",
    blockquote: theme === "dark" ? "#9e9e9e" : "#6a737d",
    "table-header": theme === "dark" ? "#2d2d2d" : "#f6f8fa",
  };

  // Apply each color, using saved values if available
  Object.entries(defaultThemeColors).forEach(([key, defaultValue]) => {
    const value = loadSavedColor(theme, key, defaultValue);
    root.style.setProperty(`--color-${key}`, value);
  });

  // Define markdown element color mappings
  const markdownElementMappings = {
    h1: theme === "dark" ? "#e0e0e0" : "#333333",
    h2: theme === "dark" ? "#e0e0e0" : "#333333",
    h3: theme === "dark" ? "#e0e0e0" : "#333333",
    h4: theme === "dark" ? "#e0e0e0" : "#333333",
    paragraph: theme === "dark" ? "#e0e0e0" : "#333333",
    "list-item": theme === "dark" ? "#e0e0e0" : "#333333",
    "blockquote-text": theme === "dark" ? "#9e9e9e" : "#6a737d",
    "blockquote-border": theme === "dark" ? "#444444" : "#dfe2e5",
    "code-inline": theme === "dark" ? "#e0e0e0" : "#333333",
    "link-text": theme === "dark" ? "#58a6ff" : "#0366d6",
    "table-border": theme === "dark" ? "#444444" : "#dfe2e5",
    "table-header-text": theme === "dark" ? "#e0e0e0" : "#333333",
    hr: theme === "dark" ? "#444444" : "#e1e4e8",
  };

  // Apply markdown element colors
  Object.entries(markdownElementMappings).forEach(([key, defaultValue]) => {
    const value = loadSavedMdColor(theme, key, defaultValue);
    root.style.setProperty(`--md-${key}-color`, value);
  });
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Check if user has previously set theme or use system preference
  const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem("theme") as ThemeMode;

    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      return savedTheme;
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }

    return "light";
  };

  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  // Apply theme class to document and initialize colors
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove previous theme class
    root.classList.remove("light", "dark");

    // Add current theme class
    root.classList.add(theme);

    // Initialize theme colors
    initializeThemeColors(theme);

    // Save theme to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
