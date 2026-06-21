export type RGB = [number, number, number];

/* A reused 1×1 scratch canvas. getComputedStyle() returns oklch()-authored
   colors verbatim as `oklch(L C H)`, so regex-ing the numbers and treating them
   as sRGB channels is wrong (the L/C/H components are not 0–255 RGB). Painting
   the resolved color onto a 2D canvas and reading the pixel yields true sRGB for
   any CSS color — rgb(), oklch(), color(), … — across browsers. */
let scratch: CanvasRenderingContext2D | null | undefined;
function scratchCtx(): CanvasRenderingContext2D | null {
  if (scratch !== undefined) return scratch;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  scratch = canvas.getContext("2d", { willReadFrequently: true });
  return scratch;
}

/** Convert a *concrete* CSS color string (as returned by getComputedStyle) to
 *  true 0–255 sRGB channels. */
export function cssColorToRgb(color: string): RGB {
  const ctx = scratchCtx();
  if (!ctx) return [0, 0, 0];
  ctx.fillStyle = "#000";
  ctx.fillStyle = color; // ignored if `color` is unparseable → stays #000
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}
