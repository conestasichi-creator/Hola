import { continueRender, delayRender, staticFile } from "remotion";

// Fuentes locales (en /public/fonts) para que el render no dependa de internet
const faces = [
  { family: "JetBrains Mono", file: "fonts/JetBrainsMono-400.woff2", weight: "400" },
  { family: "JetBrains Mono", file: "fonts/JetBrainsMono-700.ttf", weight: "700" },
  { family: "Space Grotesk", file: "fonts/SpaceGrotesk-var.woff2", weight: "300 700" },
];

let loaded = false;

export const loadFonts = () => {
  if (loaded || typeof document === "undefined") return;
  loaded = true;
  const handle = delayRender("Cargando fuentes");
  Promise.all(
    faces.map((f) =>
      new FontFace(f.family, `url(${staticFile(f.file)})`, { weight: f.weight })
        .load()
        .then((ff) => (document.fonts as unknown as { add: (f: FontFace) => void }).add(ff)),
    ),
  )
    .catch((e) => console.error("No se pudieron cargar las fuentes", e))
    .finally(() => continueRender(handle));
};
