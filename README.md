# 🎬 Video promocional — Remotion

Video publicitario para negocio de desarrollo de software, hecho con
[Remotion](https://www.remotion.dev) (React → video). Estética "hacker":
lluvia de código, terminal que tipea, glitch RGB, grilla synthwave, neón y scanlines CRT.

## Escenas (30 s total, 30 fps)

| # | Escena | Qué pasa |
|---|--------|----------|
| 1 | Intro | Terminal estilo macOS tipeando comandos sobre lluvia de código |
| 2 | Marca | Nombre con efecto glitch + tagline + badges |
| 3 | Servicios | 4 tarjetas que entran deslizando, cada una con un snippet de código |
| 4 | Stats | Contadores animados (proyectos, soporte, etc.) |
| 5 | CTA | Llamado a la acción + datos de contacto |

Hay dos composiciones:
- `Promo` → 1920×1080 (YouTube, web, presentaciones)
- `PromoVertical` → 1080×1920 (Reels, TikTok, Shorts)

## Personalizar

Todo el contenido está en **`src/config.ts`**: nombre, tagline, líneas de la
terminal, servicios, stats, contacto y paleta de colores. Editá ese archivo y
listo, no hace falta tocar las escenas.

Duración de cada escena: `SCENES` en `src/Promo.tsx`.

## Comandos

```bash
npm install
npm start                 # abre Remotion Studio para previsualizar en el navegador
npm run render            # genera out/promo.mp4 (horizontal)
npm run render:vertical   # genera out/promo-vertical.mp4 (vertical)
npm run still             # thumbnail PNG de un frame
```

### Música de fondo
Poné un `music.mp3` en `public/` y renderizá con:

```bash
npx remotion render Promo out/promo.mp4 --props='{"withMusic":true}'
```

## Estructura

```
src/
  config.ts            ← datos del negocio y colores
  Root.tsx             ← registra las composiciones
  Promo.tsx            ← secuencia de escenas + transiciones
  scenes/              ← Intro, Brand, Services, Stats, CTA
  components/          ← CodeRain, Grid, GlitchText, Typewriter, Terminal, Particles...
public/fonts/          ← JetBrains Mono y Space Grotesk (locales, sin depender de internet)
```
