# Guía para Agregar Nuevos Temas

## 📝 Pasos para crear un nuevo tema del curso

### 1. Crear el archivo HTML

1. Copia el archivo `_template.html` en la carpeta `topics/`
2. Renómbralo según el número de tema: `topic-N.html`
3. Edita el contenido según tu lección

### 2. Personalizar el contenido

Reemplaza los siguientes placeholders:

- `[Título del Tema]` - Título principal
- `[Descripción del tema]` - Meta descripción para SEO
- Badge de categoría: `HARDWARE`, `SOFTWARE`, o `MECHANICS`
- Fecha de publicación
- Contenido de las secciones

### 3. Agregar al índice principal

Edita `js/main.js` y agrega tu tema al array `topics`:

```javascript
{
    id: 7,  // Número consecutivo
    title: "Nombre del Tema",
    description: "Breve descripción (1-2 líneas)",
    category: "hardware",  // hardware | software | mechanics
    level: "Básico",       // Básico | Intermedio | Avanzado
    color: "blue",         // blue | green | purple
    date: "Hoy",          // Texto libre
    icon: "ph-cpu"        // Icono de Phosphor
}
```

### 4. Agregar recursos

Si tu tema incluye archivos descargables:

1. Crea una carpeta en `assets/topics/topic-N/`
2. Coloca PDFs, códigos, imágenes, etc.
3. Actualiza los enlaces en el HTML:

```html
<a href="../assets/topics/topic-N/archivo.pdf">...</a>
```

### 5. Componentes disponibles

#### Bloques de alerta

**Información:**
```html
<div class="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex gap-3">
    <i class="ph ph-info text-neon-blue text-xl flex-shrink-0 mt-0.5"></i>
    <div>
        <h5 class="text-neon-blue font-bold text-sm mb-1">Título</h5>
        <p class="text-sm text-blue-200/70">Contenido...</p>
    </div>
</div>
```

**Advertencia:**
```html
<div class="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3">
    <i class="ph ph-warning text-neon-yellow text-xl flex-shrink-0 mt-0.5"></i>
    <div>
        <h5 class="text-neon-yellow font-bold text-sm mb-1">Precaución</h5>
        <p class="text-sm text-yellow-200/70">Contenido...</p>
    </div>
</div>
```

**Éxito:**
```html
<div class="p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex gap-3">
    <i class="ph ph-check-circle text-neon-green text-xl flex-shrink-0 mt-0.5"></i>
    <div>
        <h5 class="text-neon-green font-bold text-sm mb-1">Completado</h5>
        <p class="text-sm text-green-200/70">Contenido...</p>
    </div>
</div>
```

#### Bloques de código

```html
<div class="glass-panel p-6 rounded-2xl mb-6">
    <h3 class="text-lg font-bold text-white mb-4">Título</h3>
    <pre class="bg-[#1e1e1e] rounded-xl p-4 overflow-x-auto"><code class="language-cpp text-sm text-slate-300">// Tu código aquí
void setup() {
  // ...
}</code></pre>
</div>
```

#### Tarjeta de recurso descargable

```html
<a href="#" class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition group">
    <div class="flex items-center gap-3">
        <i class="ph ph-file-pdf text-red-400 text-xl"></i>
        <span class="text-slate-300 group-hover:text-white transition">archivo.pdf</span>
    </div>
    <i class="ph ph-download-simple text-slate-500 group-hover:text-white transition"></i>
</a>
```

### 6. Iconos de Phosphor

Busca iconos en: https://phosphoricons.com

Ejemplos comunes:
- `ph-cpu` - Hardware
- `ph-code` - Software
- `ph-gear` - Mecánica
- `ph-lightning` - Electricidad
- `ph-chart-line` - Datos
- `ph-robot` - Robótica

### 7. Testing

Antes de publicar:

1. ✅ Verifica que todos los enlaces funcionen
2. ✅ Prueba en mobile y desktop
3. ✅ Comprueba que las imágenes carguen
4. ✅ Valida el HTML
5. ✅ Revisa ortografía

### 8. Publicar

```bash
git add .
git commit -m "Agrega topic-N: [Título]"
git push origin main
```

GitHub Pages se actualizará automáticamente en 1-2 minutos.

---

## 🎨 Colores del tema

- **Blue** (`blue`): Hardware, electrónica
- **Green** (`green`): Software, programación
- **Purple** (`purple`): Mecánica, diseño

## 📚 Más componentes

Para componentes avanzados (tabs, accordions, sliders, quiz), consulta `blocks-gallery.html`.
