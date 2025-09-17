# ⚛️ Frontend - MisEventos Web App

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

## 📋 Descripción

Aplicación web moderna desarrollada con **React 19** y **TypeScript** para la gestión de eventos. Implementa arquitectura hexagonal con separación clara de capas, gestión de estado con Zustand, y una interfaz de usuario responsiva y accesible.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                        │
├─────────────────────────────────────────────────────────────┤
│  📁 Application Layer (Pages & Use Cases)                  │
│  ├── Pages: Componentes de página principales              │
│  ├── Layouts: Estructura común de páginas                  │
│  └── Hooks: Lógica de negocio reutilizable                 │
├─────────────────────────────────────────────────────────────┤
│  📁 Components Layer (UI Components)                       │
│  ├── UI: Componentes básicos reutilizables                 │
│  ├── Forms: Componentes de formularios                     │
│  └── Event: Componentes específicos de eventos             │
├─────────────────────────────────────────────────────────────┤
│  📁 Domain Layer (Business Logic)                          │
│  ├── Services: Lógica de negocio y API calls               │
│  ├── Models: Interfaces y tipos TypeScript                 │
│  └── Store: Gestión de estado global (Zustand)             │
├─────────────────────────────────────────────────────────────┤
│  📁 Infrastructure Layer (External Concerns)               │
│  ├── Router: Configuración de rutas                        │
│  ├── API: Cliente HTTP y configuración                     │
│  └── Utils: Utilidades y helpers                           │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0+ | Framework de UI |
| **TypeScript** | 5.0+ | Tipado estático |
| **Vite** | 5.0+ | Build tool y dev server |
| **Tailwind CSS** | 3.4+ | Framework de CSS |
| **Zustand** | 4.4+ | Gestión de estado |
| **React Router** | 6.20+ | Enrutamiento |
| **Axios** | 1.6+ | Cliente HTTP |
| **Jest** | 29.0+ | Framework de testing |
| **React Testing Library** | 14.0+ | Testing de componentes |

## 📁 Estructura del Proyecto

```
FE-Events/
├── 📁 public/                        # Archivos estáticos
│   ├── favicon.ico                   # Favicon
│   └── index.html                    # HTML principal
├── 📁 src/
│   ├── 📁 application/               # Capa de aplicación
│   │   ├── 📁 pages/                 # Páginas principales
│   │   │   ├── 📁 auth/              # Páginas de autenticación
│   │   │   │   ├── Login.tsx         # Página de login
│   │   │   │   └── Register.tsx      # Página de registro
│   │   │   ├── 📁 event/             # Páginas de eventos
│   │   │   │   ├── EventList.tsx     # Lista de eventos
│   │   │   │   ├── EventDetail.tsx   # Detalle de evento
│   │   │   │   ├── EventCreate.tsx   # Crear evento
│   │   │   │   ├── EventEdit.tsx     # Editar evento
│   │   │   │   ├── EventRegister.tsx # Registro a evento
│   │   │   │   └── EventSessions.tsx # Sesiones de evento
│   │   │   ├── 📁 profile/           # Páginas de perfil
│   │   │   │   └── Profile.tsx       # Perfil de usuario
│   │   │   ├── 📁 dashboard/         # Páginas de dashboard
│   │   │   │   └── Dashboard.tsx     # Dashboard principal
│   │   │   └── Home.tsx              # Página de inicio
│   │   ├── 📁 layout/                # Layouts
│   │   │   ├── Layout.tsx            # Layout principal
│   │   │   └── AuthLayout.tsx        # Layout de autenticación
│   │   └── 📁 hooks/                 # Hooks personalizados
│   │       ├── useAuth.ts            # Hook de autenticación
│   │       ├── useEvents.ts          # Hook de eventos
│   │       └── useSessions.ts        # Hook de sesiones
│   ├── 📁 components/                # Componentes reutilizables
│   │   ├── 📁 ui/                    # Componentes básicos
│   │   │   ├── Button.tsx            # Botón reutilizable
│   │   │   ├── Input.tsx             # Input reutilizable
│   │   │   ├── Modal.tsx             # Modal reutilizable
│   │   │   ├── Loading.tsx           # Componente de carga
│   │   │   └── ErrorMessage.tsx      # Mensaje de error
│   │   ├── 📁 forms/                 # Componentes de formularios
│   │   │   ├── EventForm.tsx         # Formulario de eventos
│   │   │   ├── SessionForm.tsx       # Formulario de sesiones
│   │   │   └── UserForm.tsx          # Formulario de usuarios
│   │   ├── 📁 event/                 # Componentes de eventos
│   │   │   ├── EventCard.tsx         # Tarjeta de evento
│   │   │   ├── EventList.tsx         # Lista de eventos
│   │   │   ├── EventSearch.tsx       # Búsqueda de eventos
│   │   │   ├── SessionManager.tsx    # Gestor de sesiones
│   │   │   └── SessionSchedule.tsx   # Calendario de sesiones
│   │   └── 📁 dashboard/             # Componentes de dashboard
│   │       ├── DashboardCard.tsx     # Tarjeta de estadísticas
│   │       └── StatsChart.tsx        # Gráfico de estadísticas
│   ├── 📁 domain/                    # Lógica de dominio
│   │   ├── 📁 auth/                  # Servicios de autenticación
│   │   │   ├── auth.service.ts       # Servicio de auth
│   │   │   └── auth.types.ts         # Tipos de auth
│   │   ├── 📁 event/                 # Servicios de eventos
│   │   │   ├── event.service.ts      # Servicio de eventos
│   │   │   └── event.types.ts        # Tipos de eventos
│   │   ├── 📁 session/               # Servicios de sesiones
│   │   │   ├── session.service.ts    # Servicio de sesiones
│   │   │   └── session.types.ts      # Tipos de sesiones
│   │   ├── 📁 user/                  # Servicios de usuarios
│   │   │   ├── user.service.ts       # Servicio de usuarios
│   │   │   └── user.types.ts         # Tipos de usuarios
│   │   ├── 📁 statistics/            # Servicios de estadísticas
│   │   │   ├── statistics.service.ts # Servicio de estadísticas
│   │   │   └── statistics.types.ts   # Tipos de estadísticas
│   │   └── 📁 store/                 # Gestión de estado
│   │       └── store.ts              # Store principal (Zustand)
│   ├── 📁 infrastructure/            # Infraestructura
│   │   ├── 📁 api/                   # Cliente API
│   │   │   ├── client.ts             # Cliente HTTP
│   │   │   └── endpoints.ts          # Endpoints de la API
│   │   ├── 📁 router/                # Configuración de rutas
│   │   │   └── index.tsx             # Router principal
│   │   └── 📁 config/                # Configuración
│   │       └── constants.ts          # Constantes de la app
│   ├── 📁 utils/                     # Utilidades
│   │   ├── timeValidation.ts         # Validación de horarios
│   │   ├── formatters.ts             # Formateadores
│   │   ├── validators.ts             # Validadores
│   │   └── helpers.ts                # Funciones auxiliares
│   ├── 📁 styles/                    # Estilos globales
│   │   ├── globals.css               # Estilos globales
│   │   └── tailwind.css              # Configuración de Tailwind
│   ├── App.tsx                       # Componente principal
│   └── main.tsx                      # Punto de entrada
├── 📁 tests/                         # Pruebas
│   ├── 📁 __mocks__/                 # Mocks
│   ├── 📁 components/                # Tests de componentes
│   └── setupTests.ts                 # Configuración de tests
├── 📄 package.json                   # Dependencias y scripts
├── 📄 tsconfig.json                  # Configuración de TypeScript
├── 📄 tailwind.config.js             # Configuración de Tailwind
├── 📄 vite.config.ts                 # Configuración de Vite
└── 📄 README.md                      # Este archivo
```

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+
- npm 9+ o yarn 1.22+

### **Instalación**

```bash
# Clonar el repositorio
git clone <repository-url>
cd FE-Events

# Instalar dependencias
npm install

# O usando yarn
yarn install
```

### **Configuración**

```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar variables de entorno
# .env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=MisEventos
VITE_APP_VERSION=1.0.0
```

## 🏃‍♂️ Ejecución

### **Desarrollo**
```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en:
# http://localhost:5173
```

### **Build de Producción**
```bash
# Construir para producción
npm run build

# Preview del build
npm run preview
```

### **Scripts Disponibles**

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "lint:fix": "eslint src --ext ts,tsx --fix"
}
```

## 🎨 Diseño y UI

### **Sistema de Diseño**

#### **Colores Principales**
```css
/* Tailwind CSS Custom Colors */
:root {
  --primary: #3B82F6;      /* Blue-500 */
  --primary-dark: #1D4ED8; /* Blue-700 */
  --secondary: #10B981;    /* Emerald-500 */
  --accent: #8B5CF6;       /* Violet-500 */
  --danger: #EF4444;       /* Red-500 */
  --warning: #F59E0B;      /* Amber-500 */
  --success: #10B981;      /* Emerald-500 */
}
```

#### **Tipografía**
- **Fuente Principal:** Inter (Google Fonts)
- **Tamaños:** text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
- **Pesos:** font-light, font-normal, font-medium, font-semibold, font-bold

#### **Espaciado**
- **Sistema:** Basado en múltiplos de 4px (0.25rem)
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

### **Componentes Principales**

#### **Button Component**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

#### **Input Component**
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
```

## 🔄 Gestión de Estado

### **Zustand Store**

```typescript
// store.ts
interface AppState {
  // Auth State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Events State
  events: Event[];
  currentEvent: Event | null;
  myRegistrations: EventRegistration[];
  
  // Sessions State
  sessions: Session[];
  currentSession: Session | null;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setEvents: (events: Event[]) => void;
  setCurrentEvent: (event: Event | null) => void;
  // ... más acciones
}
```

### **Uso del Store**

```tsx
// En un componente
import useStore from '@/domain/store/store';

const MyComponent = () => {
  const { user, events, setEvents } = useStore();
  
  useEffect(() => {
    // Cargar eventos
    loadEvents();
  }, []);
  
  return (
    <div>
      <h1>Hola {user?.name}</h1>
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};
```

## 🛣️ Enrutamiento

### **Estructura de Rutas**

```typescript
// router/index.tsx
const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/events',
    element: <EventList />
  },
  {
    path: '/event/:id',
    element: <EventDetail />
  },
  {
    path: '/event/:id/edit',
    element: <ProtectedRoute><EventEdit /></ProtectedRoute>
  },
  {
    path: '/events/session/:id',
    element: <EventSessions />
  },
  {
    path: '/events/session/:id/manage',
    element: <ProtectedRoute><EventSessions /></ProtectedRoute>
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  }
];
```

### **Rutas Protegidas**

```tsx
// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

## 🔌 Integración con API

### **Cliente HTTP**

```typescript
// api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### **Servicios**

```typescript
// domain/event/event.service.ts
export class EventService {
  static async getEvents(): Promise<Event[]> {
    const response = await apiClient.get('/api/events');
    return response.data;
  }
  
  static async createEvent(eventData: CreateEventDto): Promise<Event> {
    const response = await apiClient.post('/api/events', eventData);
    return response.data;
  }
  
  static async updateEvent(id: number, eventData: UpdateEventDto): Promise<Event> {
    const response = await apiClient.put(`/api/events/${id}`, eventData);
    return response.data;
  }
  
  static async deleteEvent(id: number): Promise<void> {
    await apiClient.delete(`/api/events/${id}`);
  }
}
```

## 🧪 Testing

### **Configuración de Tests**

```typescript
// setupTests.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });
```

### **Ejecutar Tests**

```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage

# Tests específicos
npm test -- EventCard.test.tsx
```

### **Ejemplo de Test**

```typescript
// tests/components/EventCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from '@/components/event/EventCard';

const mockEvent = {
  id: 1,
  title: 'Test Event',
  description: 'Test Description',
  start_date: '2024-06-15T09:00:00',
  location: 'Test Location',
  capacity: 100,
  registered_attendees: 50
};

describe('EventCard', () => {
  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<EventCard event={mockEvent} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith(mockEvent);
  });
});
```

## 🔧 Desarrollo

### **Hooks Personalizados**

```typescript
// hooks/useEvents.ts
export const useEvents = () => {
  const { events, setEvents, loading, setLoading } = useStore();
  
  const loadEvents = async () => {
    setLoading(true);
    try {
      const eventsData = await EventService.getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const createEvent = async (eventData: CreateEventDto) => {
    try {
      const newEvent = await EventService.createEvent(eventData);
      setEvents([...events, newEvent]);
      return newEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };
  
  return {
    events,
    loading,
    loadEvents,
    createEvent
  };
};
```

### **Validaciones**

```typescript
// utils/validators.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateEventDate = (date: string): boolean => {
  return new Date(date) > new Date();
};
```

### **Formateadores**

```typescript
// utils/formatters.ts
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};
```

## 🚀 Despliegue

### **Build de Producción**

```bash
# Construir aplicación
npm run build

# Los archivos se generan en /dist
```

### **Variables de Entorno de Producción**

```env
VITE_API_BASE_URL=https://api.tudominio.com
VITE_APP_NAME=MisEventos
VITE_APP_VERSION=1.0.0
```

### **Docker**

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Nginx Configuration**

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📱 Responsive Design

### **Breakpoints**

```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### **Ejemplo Responsive**

```tsx
const EventCard = ({ event }: { event: Event }) => {
  return (
    <div className="
      w-full
      sm:w-1/2
      lg:w-1/3
      xl:w-1/4
      p-4
    ">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{event.description}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">
            Ver Detalles
          </button>
          <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded">
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};
```

## 🔒 Seguridad

### **Características de Seguridad**
- ✅ Validación de entrada en formularios
- ✅ Sanitización de datos
- ✅ Protección XSS
- ✅ Rutas protegidas
- ✅ Manejo seguro de tokens
- ✅ Headers de seguridad

### **Mejores Prácticas**
- Validar todos los inputs del usuario
- Usar HTTPS en producción
- Implementar CSP (Content Security Policy)
- Sanitizar datos antes de renderizar
- Manejar errores de forma segura

## 🎯 Performance

### **Optimizaciones**
- ✅ Code splitting con React.lazy
- ✅ Memoización con React.memo
- ✅ Lazy loading de imágenes
- ✅ Bundle optimization
- ✅ Tree shaking

### **Ejemplo de Lazy Loading**

```tsx
// Lazy loading de componentes
const EventDetail = lazy(() => import('@/application/pages/event/EventDetail'));
const Dashboard = lazy(() => import('@/application/pages/dashboard/Dashboard'));

// Uso con Suspense
<Suspense fallback={<Loading />}>
  <EventDetail />
</Suspense>
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

**¡Desarrollado con ❤️ usando React y TypeScript!**