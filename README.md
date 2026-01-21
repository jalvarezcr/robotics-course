# RoboLab - Curso de Robótica 🤖

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Plataforma educativa de acceso libre para estudiantes de ingeniería. Aprende Arduino, Electrónica y Programación con un enfoque moderno y práctico.

## 🚀 Características

- ✨ Diseño moderno con tema oscuro y efectos neón
- 📱 Completamente responsive
- 🎨 Sistema de componentes reutilizables
- 🔍 Búsqueda y filtrado en tiempo real
- 📚 Estructura modular y escalable
- 🌐 Optimizado para GitHub Pages

## 📁 Estructura del Proyecto

```
robotics-course/
├── index.html              # Página principal
├── blocks-gallery.html     # Sistema de diseño y componentes
├── css/
│   ├── main.css           # Estilos principales
│   └── tailwind-config.css # Configuración de Tailwind
├── js/
│   ├── main.js            # Lógica principal (index)
│   ├── components.js      # Componentes interactivos
│   └── tailwind-config.js # Config Tailwind JS
├── topics/
│   └── topic-1.html       # Ejemplo de tema del curso
└── assets/                # Recursos multimedia (imágenes, PDFs, etc.)
```

## 🎨 Sistema de Diseño

El proyecto utiliza:
- **Tailwind CSS** para estilos utilitarios
- **Phosphor Icons** para iconografía
- **Google Fonts** (Inter + Space Grotesk)
- Tema de colores personalizado:
  - Dark BG: `#0B0F19`
  - Neon Blue: `#38bdf8`
  - Neon Purple: `#c084fc`
  - Neon Green: `#34d399`

## 🛠️ Uso Local

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/robotics-course.git
cd robotics-course
```

2. Abre `index.html` en tu navegador o usa un servidor local:
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

3. Accede a `http://localhost:8000`

## 📝 Agregar Nuevo Tema

Para agregar un nuevo tema del curso:

1. Crea un nuevo archivo HTML en `topics/topic-N.html`
2. Usa `topic-1.html` como plantilla base
3. Agrega el tema al array `topics` en `js/main.js`:

```javascript
{
    id: 7,
    title: "Tu Nuevo Tema",
    description: "Descripción breve...",
    category: "hardware", // hardware, software, mechanics
    level: "Básico",      // Básico, Intermedio, Avanzado
    color: "blue",        // blue, green, purple
    date: "1h atrás",
    icon: "ph-cpu"        // Phosphor icon class
}
```

## 🌐 Despliegue en GitHub Pages

1. Ve a Settings → Pages
2. Selecciona la rama `main` como fuente
3. Guarda y espera el despliegue automático
4. Tu sitio estará en: `https://tu-usuario.github.io/robotics-course/`

## 🧩 Componentes Disponibles

- **Tarjetas de Temas** (Topic Cards)
- **Modal de Detalles** (Detail Modal)
- **Tabs** (Code Tabs)
- **Accordion** (FAQ)
- **Slider/Carousel**
- **Quiz Interactivo**
- **Bloques de Alerta** (Info, Warning, Success)
- **Terminal Emulator**

Ver `blocks-gallery.html` para ejemplos completos.

## 📚 Recursos Externos

- [Tailwind CSS](https://tailwindcss.com)
- [Phosphor Icons](https://phosphoricons.com)
- [Highlight.js](https://highlightjs.org) (para bloques de código)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de acceso libre para fines educativos.

## 👤 Autor

**RoboLab OpenCourseWare**

---

⭐ Si te resulta útil este proyecto, considera darle una estrella en GitHub
