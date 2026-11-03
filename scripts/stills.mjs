// Renderiza varios stills de una composición con un solo bundle.
// Uso: node scripts/stills.mjs <Composicion> <carpetaSalida> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [, , id, outDir, ...frames] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const composition = await selectComposition({ serveUrl, id });
console.log(id, "duración:", composition.durationInFrames, "frames");
for (const f of frames) {
  const frame = Number(f);
  await renderStill({ composition, serveUrl, output: path.join(outDir, `${id}-${frame}.jpg`), frame, imageFormat: "jpeg", jpegQuality: 85 });
  console.log("still", frame);
}
