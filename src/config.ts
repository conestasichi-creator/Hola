// ============================================================
//  EDITÁ ESTE ARCHIVO para personalizar el video con tus datos
// ============================================================

export const brand = {
  // Nombre del negocio (se muestra con efecto glitch)
  name: "DevForge",
  // Extensión / sufijo que aparece en otro color (puede ir vacío)
  suffix: ".dev",
  // Frase corta debajo del nombre
  tagline: "Software a medida. Código que escala.",
  // Lo que escribe la terminal en la intro
  terminalLines: [
    "$ npx create-your-business --stack=full",
    "✔ Analizando tu idea...",
    "✔ Diseñando arquitectura...",
    "✔ Compilando tu éxito...",
    "> Listo. Deployando en 3, 2, 1...",
  ],
  services: [
    {
      icon: "</>",
      title: "Desarrollo Web",
      desc: "Sitios y plataformas rápidas, modernas y responsive.",
      code: "const site = await build({ seo: true, speed: 'max' });",
    },
    {
      icon: "📱",
      title: "Apps Móviles",
      desc: "iOS y Android con una sola base de código.",
      code: "export default function App() { return <Éxito />; }",
    },
    {
      icon: "⚙",
      title: "Automatización",
      desc: "Bots, integraciones y procesos que trabajan por vos.",
      code: "cron.schedule('* * * * *', () => ahorrarTiempo());",
    },
    {
      icon: "☁",
      title: "APIs & Cloud",
      desc: "Backends robustos, seguros y listos para crecer.",
      code: "app.listen(PORT, () => log('🚀 online'));",
    },
  ],
  stats: [
    { value: 50, prefix: "+", suffix: "", label: "Proyectos entregados" },
    { value: 100, prefix: "", suffix: "%", label: "Código a medida" },
    { value: 24, prefix: "", suffix: "/7", label: "Soporte técnico" },
    { value: 0, prefix: "", suffix: "", label: "bugs (bueno, casi)" },
  ],
  cta: {
    headline: "¿Tenés una idea?",
    sub: "La convertimos en software.",
    contact: "hola@devforge.dev",
    phone: "+54 9 11 1234-5678",
    web: "www.devforge.dev",
    social: "@devforge.dev",
  },
};

export const colors = {
  bg: "#070a0f",
  bg2: "#0d1320",
  green: "#39ff14",
  cyan: "#00e5ff",
  magenta: "#ff2bd6",
  yellow: "#ffd60a",
  text: "#e6edf3",
  muted: "#8b98a9",
};

export const fonts = {
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  display: "'Space Grotesk', 'Inter', sans-serif",
};
