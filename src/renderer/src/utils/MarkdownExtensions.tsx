import { marked } from "marked";

// Extension pour les shortcodes
export function setupMarkdownExtensions() {
  const renderer = {
    link(token) {
      const href = token.href;
      const match = /^(.*?)\{(.*?)\}/.exec(href);
      if (match) {
        const actualHref = match[1];
        const attrs = match[2]
          .split(/\s+/)
          .map((attr) => {
            if (attr.startsWith("#")) {
              return `id="${attr.slice(1)}"`;
            } else if (attr.startsWith(".")) {
              return `class="${attr.slice(1)}"`;
            }
            return "";
          })
          .join(" ");

        return `<a href="${actualHref}" ${attrs} ${token.title ? `title="${token.title}"` : ""}>${token.text}</a>`;
      }

      return false; // Utiliser le renderer par défaut
    },
  };

  // Extension pour les shortcodes d'alignement
  const extensions = [
    {
      name: "shortcodes",
      level: "inline",
      start(src) {
        return src.match(/\[(left|center|right|color|fa)/)?.index;
      },
      tokenizer(src) {
        // Pour les shortcodes d'alignement [left], [center], [right]
        const alignMatch =
          /^\[(left|center|right)\](.*?)\[\/(left|center|right)\]/.exec(src);
        if (alignMatch && alignMatch[1] === alignMatch[3]) {
          return {
            type: "html",
            raw: alignMatch[0],
            text: `<div style="text-align: ${alignMatch[1]}">${alignMatch[2]}</div>`,
          };
        }

        // Pour les shortcodes de couleur [color=#XXX]
        const colorMatch =
          /^\[color=(#[0-9A-Fa-f]{3,6})\](.*?)\[\/color\]/.exec(src);
        if (colorMatch) {
          return {
            type: "html",
            raw: colorMatch[0],
            text: `<span style="color: ${colorMatch[1]}">${colorMatch[2]}</span>`,
          };
        }

        // Pour les shortcodes FontAwesome
        const faMatch = /^\[fa=(.*?)(\s+extras=(.*?))?\s*\/\]/.exec(src);
        if (faMatch) {
          const icon = faMatch[1];
          const extras = faMatch[3] ? faMatch[3].split(",").join(" ") : "";
          return {
            type: "html",
            raw: faMatch[0],
            text: `<i class="fa fa-${icon} ${extras}"></i>`,
          };
        }

        return undefined;
      },
      renderer(token) {
        return token.text;
      },
    },
  ];

  // Appliquer les extensions
  marked.use({ renderer, extensions });

  return marked;
}
