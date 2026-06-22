import { RAW_LETTER_STROKES } from "@/lib/gps-art/letter-strokes-data";
import {
  normalizeLetterStrokes,
  strokesToSvgPolylines,
  templateToSvgPolyline,
  type TemplatePoint,
} from "@/lib/gps-art/template-point";
import { GPS_ART_MAX_LETTERS } from "@/types/gps-art";

export const GPS_ART_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") as [
  string,
  ...string[],
];

function orientLetterForMap(points: TemplatePoint[]): TemplatePoint[] {
  return points.map((point) => ({ x: point.x, y: -point.y }));
}

function buildLetterStrokes(_letter: string, raw: TemplatePoint[][]): TemplatePoint[][] {
  return normalizeLetterStrokes(raw.map((stroke) => orientLetterForMap(stroke)));
}

export const LETTER_STROKES: Record<string, TemplatePoint[][]> = Object.fromEntries(
  GPS_ART_ALPHABET.map((letter) => {
    const raw = RAW_LETTER_STROKES[letter] ?? RAW_LETTER_STROKES.O;
    return [letter, buildLetterStrokes(letter, raw)];
  })
);

export function getLetterStrokes(char: string): TemplatePoint[][] {
  const letter = char.toUpperCase();
  return LETTER_STROKES[letter] ?? LETTER_STROKES.O;
}

export function getLetterStrokeSvgPolylines(char: string): string[] {
  return strokesToSvgPolylines(getLetterStrokes(char), 100, 100, 8);
}

/** Flattened vertices — preview fallback only. */
export function getLetterTemplate(char: string): TemplatePoint[] {
  return getLetterStrokes(char).flat();
}

export function getLetterTemplateSvg(char: string): string {
  return templateToSvgPolyline(getLetterTemplate(char));
}

export function buildAlphabetStrokes(text: string): TemplatePoint[][] {
  const chars = text.toUpperCase().replace(/[^A-Z]/g, "").slice(0, GPS_ART_MAX_LETTERS);
  if (chars.length === 0) {
    throw new Error(`Enter up to ${GPS_ART_MAX_LETTERS} letters (A-Z).`);
  }

  const spacing = 1.1;
  const combined: TemplatePoint[][] = [];

  chars.split("").forEach((char, index) => {
    const offsetX = index * spacing;
    for (const stroke of getLetterStrokes(char)) {
      combined.push(stroke.map((point) => ({ x: point.x + offsetX, y: point.y })));
    }
  });

  return combined;
}

export function buildAlphabetPreviewStrokes(text: string): TemplatePoint[][] {
  const chars = text.toUpperCase().replace(/[^A-Z]/g, "").slice(0, GPS_ART_MAX_LETTERS);
  if (chars.length === 0) return [];
  return buildAlphabetStrokes(text);
}

/** @deprecated Use buildAlphabetStrokes */
export function buildAlphabetTemplate(text: string): TemplatePoint[] {
  return buildAlphabetStrokes(text).flat();
}

/** @deprecated Use buildAlphabetPreviewStrokes */
export function buildAlphabetPreviewTemplate(text: string): TemplatePoint[] {
  return buildAlphabetPreviewStrokes(text).flat();
}
