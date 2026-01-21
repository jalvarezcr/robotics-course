# 📊 Estructura del Proyecto - RoboLab

```
robotics-course/
│
├── 📄 index.html                    # Página principal con grid de temas
├── 📄 blocks-gallery.html           # Galería de componentes y sistema de diseño
├── 📄 README.md                     # Documentación principal
├── 📄 LICENSE                       # Licencia MIT
├── 📄 .gitignore                    # Archivos ignorados por Git
│
├── 📁 css/                          # 🎨 Estilos CSS
│   ├── main.css                     # Estilos principales del proyecto
│   └── tailwind-config.css          # Configuración adicional de Tailwind
│
├── 📁 js/                           # 💻 JavaScript
│   ├── main.js                      # Lógica principal (index.html)
│   ├── components.js                # Componentes interactivos reutilizables
│   └── tailwind-config.js           # Configuración de Tailwind
│
├── 📁 topics/                       # 📚 Temas del curso
│   ├── README.md                    # Guía para crear nuevos temas
│   ├── _template.html               # Plantilla para nuevos temas
│   ├── topic-1.html                 # Ejemplo: Primer tema
│   ├── topic-2.html                 # (Crear según necesites)
│   └── ...
│
└── 📁 assets/                       # 🖼️ Recursos multimedia
    ├── README.md                    # Guía de organización de assets
    ├── images/                      # Imágenes generales
    ├── topics/                      # Recursos por tema
    │   ├── topic-1/
    │   ├── topic-2/
    │   └── ...
    ├── pdfs/                        # Documentos PDF
    └── code/                        # Archivos de código fuente
```

---

## 🔗 Flujo de Archivos

### index.html
```
index.html
  ├─→ js/tailwind-config.js
  ├─→ css/main.css
  └─→ js/main.js
```

### blocks-gallery.html
```
blocks-gallery.html
  ├─→ js/tailwind-config.js
  ├─→ css/main.css
  └─→ js/components.js
```

### topics/*.html
```
topics/topic-N.html
  ├─→ ../js/tailwind-config.js
  ├─→ ../css/main.css
  └─→ (opcional) ../js/components.js
```

---

## 📦 Dependencias Externas (CDN)

- **Tailwind CSS**: https://cdn.tailwindcss.com
- **Google Fonts**: Inter + Space Grotesk
- **Phosphor Icons**: https://unpkg.com/@phosphor-icons/web
- **Highlight.js**: https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/

---

## 🚀 Comandos Útiles

### Desarrollo Local
```bash
# Servidor Python
python -m http.server 8000

# Servidor Node.js
npx http-server
```

### Git Workflow
```bash
# Agregar nuevo tema
git add topics/topic-N.html js/main.js
git commit -m "Agrega tema N: [Título]"
git push origin main

# Verificar estado
git status

# Ver cambios
git diff
```

---

## 🎯 Checklist de Nuevo Tema

- [ ] Copiar `_template.html` → `topic-N.html`
- [ ] Editar contenido del HTML
- [ ] Agregar entrada al array `topics` en `js/main.js`
- [ ] Crear carpeta en `assets/topics/topic-N/`
- [ ] Subir recursos (PDFs, imágenes, código)
- [ ] Actualizar enlaces de descarga
- [ ] Probar navegación
- [ ] Commit y push a GitHub

---

## 📈 Próximas Mejoras Sugeridas

1. **Sistema de búsqueda mejorado** - Búsqueda por contenido completo
2. **Progreso del estudiante** - LocalStorage para trackear avance
3. **Modo offline** - Service Worker para PWA
4. **Comentarios** - Integración con Disqus o utterances
5. **Analytics** - Google Analytics o alternativa
6. **Versión PDF** - Generación automática de PDFs por tema
7. **Multi-idioma** - i18n para inglés/español

---

**Última actualización:** 20 de Enero 2026
