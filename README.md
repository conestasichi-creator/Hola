# 🎬 Videos con Remotion: promo de FreshiDev y explainer «¿Qué es el tiempo?»

Video publicitario para negocio de desarrollo de software, hecho con
[Remotion](https://www.remotion.dev) (React → video). Estética "hacker":
lluvia de código, terminal que tipea, glitch RGB, grilla synthwave, neón y scanlines CRT.

## Escenas (~38 s total, 30 fps)

| # | Escena | Qué pasa |
|---|--------|----------|
| 1 | Intro | Terminal estilo macOS tipeando comandos sobre lluvia de código |
| 2 | Marca | Nombre con efecto glitch + tagline + badges |
| 3 | Servicios | 4 tarjetas que entran deslizando, cada una con un snippet de código |
| 4 | Stats | Contadores animados (proyectos, soporte, etc.) |
| 5 | CTA | Llamado a la acción + datos de contacto |

Hay tres composiciones:
- `Promo` → 1920×1080 (YouTube, web, presentaciones)
- `PromoVertical` → 1080×1920 (Reels, TikTok, Shorts)
- `Cosmos` → 1920×1080, explainer de ~2:30 «¿Qué es el tiempo?» (ver más abajo)

## 🌌 Explainer: ¿Qué es el tiempo?

Video educativo de 11 escenas que escala desde la rotación de la Tierra hasta el universo
observable para explicar qué es el tiempo. Código en `src/cosmos/`, guion en
`tools/guion-cosmos.json`, voz en `public/voice-cosmos/`, música en `public/cosmos-music.mp3`.

| # | Escena | Idea / datos en pantalla |
|---|--------|--------------------------|
| 0 | Intro | ¿Qué es el tiempo? Un viaje desde la Tierra hasta el borde del universo |
| 1 | La Tierra gira | 1 día = 1 rotación · 24 h · 1.670 km/h en el ecuador · 12.742 km |
| 2 | La Tierra orbita | 1 año = 1 órbita · 150 M km (1 UA) · 30 km/s · 940 M km por vuelta |
| 3 | El Sol gira | Rotación diferencial: 25 días en el ecuador, ~35 en los polos · 1.392.000 km · 1,3 M de Tierras |
| 4 | La velocidad de la luz | 300.000 km/s · Sol→Tierra 8 min 20 s · Sol→Neptuno 4 h 10 min |
| 5 | Próxima Centauri | 4,24 años luz · 40 billones de km · Voyager 1 tardaría ~75.000 años |
| 6 | La Vía Láctea | 100.000 años luz · 200–400 mil M de estrellas · Sol a 230 km/s · año galáctico 230 M de años · ~20 vueltas |
| 7 | El universo observable | Anillos de escala hasta 93.000 M de años luz · 13.800 M de años · ~2 billones de galaxias |
| 8 | Calendario cósmico | Si el universo fuera un año: Sol 31 ago, dinosaurios 25–30 dic, humanos 31 dic 23:52, historia escrita = últimos 14 s |
| 9 | Relatividad | Relojes GPS adelantan 38 µs/día · sin corrección, ~10 km/día de error |
| 10 | Cierre | El tiempo es la forma en que medimos el cambio: una rotación, una órbita, un latido |

Las escenas duran lo que necesita su locución (`SCENES` se calcula en `src/cosmos/Cosmos.tsx`
a partir de `src/cosmos/voice-cues.ts`), así que si cambiás el guion no hace falta ajustar tiempos.

```bash
python3 tools/make_voice.py --guion tools/guion-cosmos.json --out public/voice-cosmos --cues src/cosmos/voice-cues.ts
python3 tools/make_music.py 150.5 public/cosmos-music.mp3   # duración = frames/30 + 0.6
npx remotion render Cosmos out/cosmos.mp4 --concurrency=2
node scripts/stills.mjs Cosmos out/stills 120 462 944       # stills rápidos para revisar escenas
```

## Personalizar

Todo el contenido está en **`src/config.ts`**: nombre, tagline, líneas de la
terminal, servicios, stats, contacto y paleta de colores. Editá ese archivo y
listo, no hace falta tocar las escenas.

Duración de cada escena: `SCENES` en `src/Promo.tsx`. Si cambiás el guion y una línea queda más larga que su escena, alargá esa escena ahí (los frames de cada clip están en `src/voice-cues.ts`).

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

El video incluye **música original** (chill / lo-fi tranquilo, 78 BPM: teclas tipo
Rhodes, pad cálido, bajo suave y percusión liviana que entra con la marca; generada por
síntesis con numpy, sin samples de terceros) y **voz en off** masculina generada con
Piper TTS, 100 % offline. La música baja de volumen automáticamente mientras habla el
locutor (ducking).

### Guion

| Escena | Locución |
|--------|----------|
| Intro | Toda gran empresa empieza con una línea de código. |
| Marca | Somos FreshiDev. Hacemos software a medida, con código que escala. |
| Servicios | Desarrollamos sitios web, aplicaciones móviles, automatizaciones y sistemas en la nube. Todo pensado para que tu negocio crezca sin límites. |
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
  Soundtrack.tsx       ← música con ducking + clips de voz por escena
  cosmos/              ← explainer «¿Qué es el tiempo?» (escenas, ui, voice-cues)
scripts/stills.mjs     ← renderiza varios stills con un solo bundle
tools/
  guion.json           ← guion de la locución (promo)
  guion-cosmos.json    ← guion del explainer
  check_voice.py       ← verifica tono y transcribe los clips con Whisper
  make_voice.py        ← genera la voz en off con Piper
  make_music.py        ← compone la música
public/
  fonts/               ← JetBrains Mono y Space Grotesk (locales, sin depender de internet)
  music.mp3            ← pista musical
  voice/vo-*.mp3       ← un clip por escena
```
