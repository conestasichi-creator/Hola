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
npm run audio             # regenera música + voz (ver sección Audio)
```

## 🔊 Audio: música y voz en off

El video incluye **música original** (synthwave / electrónica, 112 BPM, generada por
síntesis con numpy) y **voz en off** en español rioplatense (Piper TTS, voz
`es_AR-daniela-high`, 100 % offline). La música baja de volumen automáticamente
mientras habla la locutora (ducking).

### Guion

| Escena | Locución |
|--------|----------|
| Intro | Toda gran empresa empieza con una línea de código. |
| Marca | Somos DevForge. Software a medida, código que escala. |
| Servicios | Desarrollamos sitios web, apps móviles, automatizaciones y sistemas en la nube. Todo pensado para que tu negocio crezca sin límites. |
| Stats | Más de cincuenta proyectos entregados, código cien por ciento a medida, y soporte técnico las veinticuatro horas. |
| CTA | ¿Tenés una idea? La convertimos en software. Escribinos hoy, y arrancamos. |

El guion vive en **`tools/guion.json`**. Para cambiar el texto o la voz:

```bash
pip install piper-tts numpy scipy     # una sola vez
python3 tools/make_voice.py           # regenera public/voice/*.mp3 y src/voice-cues.ts
python3 tools/make_voice.py es_ES-davefx-medium   # voz masculina (acento de España)
python3 tools/make_music.py           # regenera public/music.mp3 (BPM, drop, etc. en el script)
```

Otras voces disponibles: `es_MX-claude-high` (masculina, México), `es_ES-sharvard-medium`.
Los modelos se descargan solos a `.voices/` la primera vez. Escribí los números en letras
("cincuenta") para que la locutora los pronuncie bien.

> Si querés usar una locución grabada por una persona, reemplazá los `public/voice/vo-*.mp3`
> y ajustá `durationInFrames` en `src/voice-cues.ts`.

Para renderizar **sin audio**: `npm run render:mute`.

## Estructura

```
src/
  config.ts            ← datos del negocio y colores
  Root.tsx             ← registra las composiciones
  Promo.tsx            ← secuencia de escenas + transiciones
  scenes/              ← Intro, Brand, Services, Stats, CTA
  components/          ← CodeRain, Grid, GlitchText, Typewriter, Terminal, Particles...
  voice-cues.ts        ← duraciones de cada línea de voz (generado)
tools/
  guion.json           ← guion de la locución
  make_voice.py        ← genera la voz en off con Piper
  make_music.py        ← compone la música
public/
  fonts/               ← JetBrains Mono y Space Grotesk (locales, sin depender de internet)
  music.mp3            ← pista musical
  voice/vo-*.mp3       ← un clip por escena
```
