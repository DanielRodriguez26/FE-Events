# Mis Eventos - Frontend

Una aplicación web moderna para la gestión de eventos desarrollada con React, TypeScript y Tailwind CSS.

## 🚀 Características

- **Gestión de Eventos**: Crear, editar, listar y gestionar eventos
- **Sistema de Autenticación**: Login y registro de usuarios
- **Perfil de Usuario**: Gestión de información personal y eventos registrados
- **Sesiones de Eventos**: Visualización y gestión de sesiones dentro de eventos
- **Interfaz Responsiva**: Diseño adaptativo para dispositivos móviles y desktop
- **Estado Global**: Gestión de estado con Zustand
- **Routing**: Navegación con React Router
- **Componentes Reutilizables**: Arquitectura modular y escalable

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework de CSS utilitario
- **Zustand** - Gestión de estado global
- **React Router** - Enrutamiento de la aplicación
- **Vite** - Herramienta de construcción
- **Jest** - Framework de testing
- **ESLint** - Linter para JavaScript/TypeScript

## 📁 Estructura del Proyecto

```
src/
├── application/           # Capa de aplicación
│   ├── hooks/            # Hooks personalizados
│   ├── layout/           # Componentes de layout
│   └── pages/            # Páginas de la aplicación
│       ├── auth/         # Páginas de autenticación
│       ├── event/        # Páginas de eventos
│       ├── home/         # Página principal
│       ├── profile/      # Página de perfil
│       └── registerEvent/ # Páginas de registro a eventos
├── components/           # Componentes reutilizables
│   ├── cardEvent/        # Componentes de tarjetas de eventos
│   ├── common/           # Componentes comunes
│   ├── filter/           # Componentes de filtros
│   ├── navbar/           # Componente de navegación
│   ├── paginator/        # Componente de paginación
│   ├── table/            # Componente de tabla
│   └── ui/               # Componentes de UI básicos
├── domain/               # Capa de dominio
│   ├── auth/             # Lógica de autenticación
│   ├── event/            # Lógica de eventos
│   ├── home/             # Lógica de página principal
│   ├── settings/         # Configuraciones
│   └── speaker/          # Lógica de speakers
├── infrastructure/       # Capa de infraestructura
│   └── router/           # Configuración de rutas
├── store/                # Estado global (Zustand)
└── utils/                # Utilidades
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd FE-Events
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar el archivo `.env` con las configuraciones necesarias:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_APP_NAME=Mis Eventos
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## 📋 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción
- `npm run test` - Ejecutar tests
- `npm run test:coverage` - Ejecutar tests con cobertura
- `npm run lint` - Ejecutar linter
- `npm run lint:fix` - Corregir errores de linting automáticamente

## 🧪 Testing

La aplicación incluye tests unitarios y de integración:

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## 🏗️ Arquitectura

### Patrón de Arquitectura

La aplicación sigue una arquitectura hexagonal (Clean Architecture) con las siguientes capas:

1. **Presentation Layer** (`components/`, `application/pages/`)
   - Componentes de UI
   - Páginas de la aplicación
   - Hooks personalizados

2. **Application Layer** (`application/`)
   - Casos de uso
   - Lógica de aplicación
   - Hooks de estado

3. **Domain Layer** (`domain/`)
   - Entidades de negocio
   - Interfaces de servicios
   - Lógica de dominio

4. **Infrastructure Layer** (`infrastructure/`)
   - Configuración de rutas
   - Servicios externos
   - Adaptadores

### Gestión de Estado

Se utiliza Zustand para la gestión del estado global, organizado en slices:

- **Auth Store**: Estado de autenticación
- **Event Store**: Estado de eventos
- **Home Store**: Estado de la página principal
- **Speaker Store**: Estado de speakers

## 🎨 Componentes Principales

### Páginas

- **Home**: Página principal con eventos destacados
- **Events**: Lista de eventos con filtros y paginación
- **EventDetail**: Detalle completo de un evento
- **EventCreate**: Formulario de creación de eventos
- **EventSessions**: Sesiones de un evento específico
- **Profile**: Perfil del usuario con eventos registrados
- **Login/Register**: Páginas de autenticación

### Componentes Reutilizables

- **Table**: Tabla de eventos con paginación
- **CardEvent**: Tarjeta de evento
- **Filter**: Filtros de búsqueda
- **Navbar**: Navegación principal
- **ProtectedRoute**: Ruta protegida por autenticación

## 🔐 Autenticación

El sistema de autenticación incluye:

- Login con email y contraseña
- Registro de nuevos usuarios
- Protección de rutas
- Gestión de tokens JWT
- Persistencia de sesión

## 📱 Responsive Design

La aplicación está diseñada para ser completamente responsiva:

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: Adaptación a tablets y desktop
- **Componentes Flexibles**: Adaptación automática del contenido

## 🚀 Despliegue

### Construcción para Producción

```bash
npm run build
```

### Docker

```bash
# Construir imagen
docker build -t mis-eventos-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 mis-eventos-frontend
```

## 📊 Métricas y Performance

- **Lighthouse Score**: Optimizado para rendimiento
- **Bundle Size**: Minimizado con Vite
- **Code Splitting**: Carga lazy de componentes
- **Caching**: Estrategias de caché implementadas

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:

- Email: soporte@miseventos.com
- Documentación: [docs.miseventos.com](https://docs.miseventos.com)
- Issues: [GitHub Issues](https://github.com/miseventos/frontend/issues)

## 🔄 Changelog

### v1.0.0 (2024-03-15)
- ✅ Sistema de autenticación completo
- ✅ Gestión de eventos CRUD
- ✅ Perfil de usuario
- ✅ Sesiones de eventos
- ✅ Interfaz responsiva
- ✅ Tests unitarios
- ✅ Documentación completa

---

**Desarrollado con ❤️ por el equipo de Mis Eventos**
