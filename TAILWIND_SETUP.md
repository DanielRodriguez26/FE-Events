# Configuración de Tailwind CSS

## ✅ Configuración Completada

Tailwind CSS ha sido configurado exitosamente en tu proyecto con las siguientes características:

### 📁 Archivos de Configuración

1. **`tailwind.config.js`** - Configuración principal de Tailwind
2. **`postcss.config.js`** - Configuración de PostCSS
3. **`src/index.css`** - Estilos base y componentes personalizados

### 🎨 Características Configuradas

#### Colores Personalizados
- **Primary**: Paleta de azules (`primary-50` a `primary-950`)
- **Secondary**: Paleta de grises (`secondary-50` a `secondary-950`)

#### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Sistema de fuentes**: Responsive y accesible

#### Animaciones Personalizadas
- `animate-fade-in`: Fade in suave
- `animate-slide-up`: Slide up desde abajo
- `animate-bounce-gentle`: Bounce suave

#### Componentes Predefinidos
- `.btn-primary`: Botón primario con hover y focus
- `.btn-secondary`: Botón secundario
- `.card`: Tarjeta con sombra y bordes
- `.input-field`: Campo de entrada estilizado

#### Utilidades Personalizadas
- `.text-gradient`: Texto con gradiente
- `.animate-fade-in`: Animación de fade in
- `.animate-slide-up`: Animación de slide up

### 🚀 Uso de las Clases

#### Botones
```jsx
<button className="btn-primary">Botón Primario</button>
<button className="btn-secondary">Botón Secundario</button>
```

#### Tarjetas
```jsx
<div className="card">
  <h3>Contenido de la tarjeta</h3>
  <p>Descripción...</p>
</div>
```

#### Campos de Entrada
```jsx
<input type="text" className="input-field" placeholder="Escribe aquí..." />
```

#### Animaciones
```jsx
<div className="animate-fade-in">Contenido con fade in</div>
<div className="animate-slide-up">Contenido con slide up</div>
```

### 🌙 Modo Oscuro

El proyecto incluye soporte completo para modo oscuro:

```jsx
// Las clases automáticamente se adaptan al modo oscuro
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Contenido que se adapta al tema
</div>
```

### 📱 Responsive Design

Tailwind incluye breakpoints predefinidos:

- `sm:` - 640px y superior
- `md:` - 768px y superior
- `lg:` - 1024px y superior
- `xl:` - 1280px y superior
- `2xl:` - 1536px y superior

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Grid responsive */}
</div>
```

### 🎯 Ejemplos de Uso en el Proyecto

#### Navbar
- Navegación responsive
- Menú hamburguesa para móviles
- Transiciones suaves
- Soporte para modo oscuro

#### Página de Eventos
- Grid responsive de tarjetas
- Estados de carga y error
- Iconos SVG integrados
- Hover effects

### 🔧 Personalización

Para agregar nuevos estilos personalizados, edita `src/index.css`:

```css
@layer components {
  .mi-componente {
    @apply bg-blue-500 text-white px-4 py-2 rounded;
  }
}
```

### 📦 Dependencias Instaladas

- `tailwindcss@^4.1.12`
- `@tailwindcss/postcss@4.1.12`
- `autoprefixer@^10.4.21`
- `postcss@^8.5.6`

### 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Linting
npm run lint
```

### 🎨 Paleta de Colores

#### Primary (Azul)
- `primary-50`: #eff6ff
- `primary-500`: #3b82f6
- `primary-600`: #2563eb
- `primary-900`: #1e3a8a

#### Secondary (Gris)
- `secondary-50`: #f8fafc
- `secondary-500`: #64748b
- `secondary-600`: #475569
- `secondary-900`: #0f172a

### 📝 Notas Importantes

1. **Tailwind CSS v4**: El proyecto usa la versión más reciente con sintaxis actualizada
2. **PostCSS**: Configurado correctamente con el plugin oficial `@tailwindcss/postcss`
3. **Sintaxis v4**: Usa `@import "tailwindcss"` en lugar de las directivas `@tailwind`
4. **Performance**: Solo se incluyen las clases utilizadas en el build final
5. **Compatibilidad**: Funciona con React, TypeScript y Vite

### 🔄 Cambios en Tailwind CSS v4

#### Sintaxis Actualizada
```css
/* ❌ Sintaxis anterior (v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ✅ Sintaxis nueva (v4) */
@import "tailwindcss";
```

#### Configuración de PostCSS
```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

¡Tu proyecto está listo para usar Tailwind CSS v4 con todas las características modernas!
