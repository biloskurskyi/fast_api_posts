const ELLIPSIS = "…";
const PARAGRAPH_BREAK = /\r?\n\s*\r?\n/;

export const toExcerpt = (content: string, maxLength: number): string => {
  const [firstParagraph = ""] = content.split(PARAGRAPH_BREAK);
  const paragraph = firstParagraph.trim();
  if (paragraph.length <= maxLength) return paragraph;

  return `${paragraph.slice(0, maxLength).trimEnd()}${ELLIPSIS}`;
};
