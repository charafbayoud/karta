import fs from "node:fs";
import path from "node:path";

export type LegalTocItem = {
  id: string;
  title: string;
};

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h3"; text: string };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  updated: string;
  intro: LegalBlock[];
  sections: LegalSection[];
  toc: LegalTocItem[];
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseInline(text: string): string {
  return text.trim();
}

function parseListItems(lines: string[], startIndex: number): { items: string[]; nextIndex: number } {
  const items: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index]?.trim();
    if (!line?.startsWith("- ")) break;
    items.push(parseInline(line.slice(2)));
    index += 1;
  }

  return { items, nextIndex: index };
}

function parseBlocks(lines: string[]): LegalBlock[] {
  const blocks: LegalBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: parseInline(line.slice(4)) });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const { items, nextIndex } = parseListItems(lines, index);
      blocks.push({ type: "ul", items });
      index = nextIndex;
      continue;
    }

    const paragraphLines = [line];
    index += 1;
    while (index < lines.length) {
      const next = lines[index]?.trim() ?? "";
      if (!next || next.startsWith("#") || next.startsWith("- ")) break;
      paragraphLines.push(next);
      index += 1;
    }

    blocks.push({ type: "p", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function parseFrontmatter(raw: string): { updated: string; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { updated: "June 14, 2026", body: raw };
  }

  const frontmatter = match[1];
  const updatedMatch = frontmatter.match(/^updated:\s*(.+)$/m);
  return {
    updated: updatedMatch?.[1]?.trim() ?? "June 14, 2026",
    body: match[2],
  };
}

export function loadLegalDocument(filename: "privacy.md" | "terms.md"): LegalDocument {
  const filePath = path.join(process.cwd(), "content", filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { updated, body } = parseFrontmatter(raw);
  const chunks = body.split(/^## /m).filter(Boolean);

  const introLines = chunks[0]?.split("\n") ?? [];
  const intro = parseBlocks(introLines);
  const sections: LegalSection[] = [];
  const toc: LegalTocItem[] = [];

  for (const chunk of chunks.slice(1)) {
    const [titleLine, ...rest] = chunk.split("\n");
    const title = titleLine.trim();
    const id = slugify(title);
    const blocks = parseBlocks(rest);

    sections.push({ id, title, blocks });
    toc.push({ id, title });
  }

  return { updated, intro, sections, toc };
}
