# Sistema de Autenticación con Tokens

Este documento explica cómo funciona el sistema de autenticación implementado en la aplicación MisEventos.

## Características Principales

### 🔐 Autenticación JWT
- **Login/Registro**: Sistema completo de autenticación con JWT
- **Tokens de Acceso**: Tokens de corta duración para peticiones API
- **Tokens de Refresco**: Tokens de larga duración para renovar automáticamente
- **Persistencia**: Los tokens se guardan en localStorage y persisten entre sesiones

### 🛡️ Protección de Rutas
- **ProtectedRoute**: Componente que protege rutas que requieren autenticación
- **Redirección Automática**: Usuarios no autenticados son redirigidos al login
- **Guardado de Ubicación**: Se guarda la ruta original para volver después del login

### 🔄 Renovación Automática
- **Interceptores Axios**: Renovación automática de tokens expirados
- **Manejo de Errores 401**: Reintento automático de peticiones fallidas
- **Logout Automático**: Si falla la renovación, se hace logout automáticamente

## Estructura de Archivos

```
src/
├── domain/
│   └── auth/
│       ├── auth.interface.ts    # Interfaces de autenticación
│       ├── auth.service.ts      # Servicios de API para auth
│       └── auth.ts              # Store de autenticación (Zustand)
├── application/
│   ├── hooks/
│   │   └── useAuth.ts           # Hook personalizado para auth
│   └── pages/
│       └── auth/
│           ├── Login.tsx        # Página de login
│           └── Register.tsx     # Página de registro
├── components/
│   └── common/
│       └── ProtectedRoute.tsx   # Componente de protección de rutas
└── infrastructure/
    └── router/
        └── index.tsx            # Configuración de rutas protegidas
```

## Uso del Sistema

### 1. Proteger una Ruta

```tsx
import ProtectedRoute from '@components/common/ProtectedRoute';

// Ruta que requiere autenticación
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// Ruta solo para usuarios no autenticados (como login)
<Route 
  path="/login" 
  element={
    <ProtectedRoute requireAuth={false} redirectTo="/dashboard">
      <Login />
    </ProtectedRoute>
  } 
/>
```

### 2. Usar el Hook de Autenticación

```tsx
import { useAuth } from '@application/hooks';

const MyComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    getAuthHeaders 
  } = useAuth();

  const handleLogin = async () => {
    const success = await login({ email: 'user@example.com', password: 'password' });
    if (success) {
      // Redirigir o mostrar mensaje de éxito
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Hola, {user?.name}</p>
      ) : (
        <p>Por favor inicia sesión</p>
      )}
    </div>
  );
};
```

### 3. Hacer Peticiones Autenticadas

```tsx
import { get, post } from '@domain/settings/http.service';

// El token se incluye automáticamente en todas las peticiones
const fetchData = async () => {
  try {
    const data = await get({ url: '/api/protected-data' });
    console.log(data);
  } catch (error) {
    // El interceptor maneja automáticamente la renovación de tokens
    console.error('Error:', error);
  }
};
```

## Configuración del Backend

### Endpoints Requeridos

El backend debe implementar los siguientes endpoints:

```typescript
// POST /api/v1/auth/login/
{
  email: string;
  password: string;
}

// POST /api/v1/auth/register/
{
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// POST /api/v1/auth/refresh/
{
  refreshToken: string;
}

// POST /api/v1/auth/logout/
// Requiere Authorization: Bearer <token>
```

### Respuesta de Autenticación

```typescript
{
  token: string;           // JWT de acceso (corta duración)
  refreshToken: string;    // JWT de refresco (larga duración)
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  expiresIn?: number;      // Tiempo de expiración en segundos
}
```

## Flujo de Autenticación

1. **Login/Registro**: Usuario ingresa credenciales
2. **Validación**: Se validan las credenciales en el backend
3. **Tokens**: Se reciben token de acceso y refresh token
4. **Almacenamiento**: Los tokens se guardan en el store (Zustand)
5. **Persistencia**: Los tokens se guardan en localStorage
6. **Peticiones**: Todas las peticiones incluyen automáticamente el token
7. **Renovación**: Si el token expira, se renueva automáticamente
8. **Logout**: Se eliminan los tokens y se redirige al login

## Manejo de Errores

### Errores de Autenticación
- **401 Unauthorized**: Token expirado o inválido
- **403 Forbidden**: Usuario no tiene permisos
- **422 Validation Error**: Datos de formulario inválidos

### Recuperación Automática
- **Token Expirado**: Se intenta renovar automáticamente
- **Renovación Fallida**: Se hace logout y redirige al login
- **Errores de Red**: Se muestran mensajes de error apropiados

## Seguridad

### Buenas Prácticas Implementadas
- ✅ Tokens JWT con expiración
- ✅ Refresh tokens para renovación segura
- ✅ Almacenamiento seguro en localStorage
- ✅ Interceptores para manejo automático
- ✅ Logout automático en errores de autenticación
- ✅ Protección de rutas en el frontend

### Consideraciones Adicionales
- 🔒 Usar HTTPS en producción
- 🔒 Implementar rate limiting en el backend
- 🔒 Validar tokens en el servidor
- 🔒 Implementar logout en todos los dispositivos
- 🔒 Considerar 2FA para mayor seguridad

## Personalización

### Cambiar Rutas de Redirección
```tsx
<ProtectedRoute redirectTo="/custom-login">
  <MyComponent />
</ProtectedRoute>
```

### Agregar Roles y Permisos
```tsx
const { user } = useAuth();

// Verificar rol específico
if (user?.role === 'admin') {
  // Mostrar funcionalidad de administrador
}
```

### Personalizar Mensajes de Error
```tsx
const { error, clearError } = useAuth();

useEffect(() => {
  if (error) {
    // Mostrar error personalizado
    showCustomNotification(error);
    clearError();
  }
}, [error]);
```

## Troubleshooting

### Problemas Comunes

1. **Token no se incluye en peticiones**
   - Verificar que el store esté configurado correctamente
   - Revisar que el token se guarde después del login

2. **Renovación automática no funciona**
   - Verificar que el endpoint de refresh esté configurado
   - Revisar que el refresh token sea válido

3. **Redirección infinita**
   - Verificar la configuración de ProtectedRoute
   - Revisar que las rutas de login/register no requieran auth

4. **Errores de CORS**
   - Configurar correctamente los headers en el backend
   - Verificar que las URLs estén bien configuradas

### Debug

```tsx
// Habilitar logs de debug
const { token, refreshToken, isAuthenticated } = useAuth();
console.log('Auth State:', { token, refreshToken, isAuthenticated });
```
