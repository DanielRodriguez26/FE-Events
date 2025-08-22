# FE-Events - Aplicación de Gestión de Eventos

## 📋 Descripción

Aplicación frontend para la gestión de eventos desarrollada con React, TypeScript y Zustand. La aplicación utiliza una arquitectura limpia con separación de responsabilidades y gestión de estado moderna.

## 🚀 Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Zustand** - Gestión de estado ligera y moderna
- **Vite** - Bundler y servidor de desarrollo
- **React Router DOM** - Enrutamiento del lado del cliente
- **Axios** - Cliente HTTP para peticiones a APIs
- **Tailwind CSS** - Framework CSS utility-first

## 📁 Estructura del Proyecto

```
src/
├── application/          # Capa de aplicación
│   ├── layout/          # Componentes de layout
│   └── pages/           # Páginas de la aplicación
├── components/          # Componentes reutilizables
├── domain/             # Capa de dominio
│   ├── home/           # Módulo de home
│   └── settings/       # Configuraciones
├── infrastructure/     # Capa de infraestructura
│   └── router/         # Configuración de rutas
└── store/              # Gestión de estado (Zustand)
```

## 🏗️ Arquitectura

### Capas de la Aplicación

1. **Domain** - Lógica de negocio y entidades
2. **Application** - Casos de uso y páginas
3. **Infrastructure** - Configuración técnica y servicios externos

### Gestión de Estado

- **Zustand** para gestión de estado global
- **Persistencia** en localStorage para eventos
- **DevTools** para debugging
- **Separación** por módulos (home, etc.)

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio
cd FE-Events

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Construcción

```bash
# Construir para producción
npm run build

# Vista previa de la build
npm run preview
```

### Linting

```bash
# Ejecutar linter
npm run lint
```

## 📝 Funcionalidades

### Módulo Home
- ✅ Lista de eventos
- ✅ Estados de carga y error
- ✅ Persistencia de datos
- ✅ Gestión de estado asíncrono

### Sistema de Autenticación
- ✅ Login y registro de usuarios
- ✅ Protección de rutas con tokens JWT
- ✅ Renovación automática de tokens
- ✅ Persistencia de sesión
- ✅ Manejo automático de errores 401
- ✅ Logout automático en tokens expirados

### Características Técnicas
- ✅ TypeScript estricto
- ✅ Alias de importación (@components, @store, etc.)
- ✅ Enrutamiento con React Router
- ✅ Cliente HTTP centralizado con interceptores
- ✅ Gestión de errores
- ✅ Responsive design
- ✅ Arquitectura limpia con separación de capas

## 🔧 Configuración

### Alias de Importación

El proyecto utiliza alias para facilitar las importaciones:

```typescript
import Component from '@components/Component';
import { useStore } from '@store/store';
import { homeService } from '@domain/home/home.service';
```

### Variables de Entorno

Configuración en `src/domain/settings/envairoment.ts`:

```typescript
const ENDPOINT = 'http://127.0.0.1:5173/';
const MICROSERVICES = {
  event: 'event.json'
};
```

## 📚 Uso del Store

### Acceso al Estado

```typescript
import useStore from '@store/store';

const MyComponent = () => {
  const { events, loading, error, fetchEvents } = useStore();
  
  // Usar el estado y acciones
};
```

### Acciones Disponibles

- `fetchEvents()` - Obtener eventos de la API
- `setEvents(events)` - Actualizar lista de eventos
- `setLoading(loading)` - Controlar estado de carga
- `setError(error)` - Manejar errores
- `clearEvents()` - Limpiar eventos
- `clearStorage()` - Limpiar almacenamiento

## 🔐 Sistema de Autenticación

### Uso del Hook de Autenticación

```typescript
import { useAuth } from '@application/hooks';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    getAuthHeaders 
  } = useAuth();
  
  // Usar funcionalidades de autenticación
};
```

### Protección de Rutas

```typescript
import ProtectedRoute from '@components/common/ProtectedRoute';

// Ruta protegida
<ProtectedRoute>
  <MyProtectedComponent />
</ProtectedRoute>

// Ruta solo para usuarios no autenticados
<ProtectedRoute requireAuth={false}>
  <LoginComponent />
</ProtectedRoute>
```

### Documentación Completa

Para más detalles sobre el sistema de autenticación, consulta el archivo [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md).

## 🐛 Solución de Problemas

### Error de JSON Parse
Si encuentras errores de JSON parse, asegúrate de que el `package.json` no contenga comentarios.

### Errores de TypeScript
Ejecuta `npm run lint` para identificar y corregir errores de tipos.

### Problemas de Importación
Verifica que los alias estén correctamente configurados en `vite.config.ts` y `tsconfig.app.json`.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- Daniel Rodriguez - Desarrollo inicial

## 🙏 Agradecimientos

- Zustand por la excelente gestión de estado
- Vite por el bundler rápido
- React por la biblioteca de UI
