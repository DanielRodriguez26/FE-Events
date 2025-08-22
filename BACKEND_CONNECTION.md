# Conexión con Backend

## Configuración Actual

Tu frontend ya está configurado para conectarse con el backend en `http://127.0.0.1:8000/events/`.

### Archivos de Configuración

1. **`src/domain/settings/backend.config.ts`** - Configuración específica del backend
2. **`src/domain/settings/envairoment.ts`** - Variables de entorno y endpoints
3. **`src/domain/settings/http.service.ts`** - Servicio HTTP con configuración mejorada

### Estructura de la Conexión

```
Frontend (React + Vite) → HTTP Service → Backend (http://127.0.0.1:8000)
```

## Pasos para Conectar

### 1. Asegúrate de que el Backend esté Corriendo

Tu backend debe estar ejecutándose en `http://127.0.0.1:8000` y debe tener un endpoint `/events/` que responda a peticiones GET.

### 2. Verificar la Configuración

Los archivos ya están configurados correctamente:

- **URL del Backend**: `http://127.0.0.1:8000`
- **Endpoint de Eventos**: `http://127.0.0.1:8000/events/`
- **Headers**: `Content-Type: application/json`
- **Timeout**: 10 segundos

### 3. Probar la Conexión

Para probar la conexión, puedes usar la función de prueba en la consola del navegador:

```javascript
// En la consola del navegador
import { testBackendConnection } from './src/utils/api-test';
testBackendConnection().then(success => {
    console.log('Conexión exitosa:', success);
});
```

### 4. Verificar en el Componente

El componente `Home.tsx` ya está configurado para cargar eventos automáticamente cuando se monta.

## Posibles Problemas y Soluciones

### Error de CORS

Si ves errores de CORS, asegúrate de que tu backend permita peticiones desde `http://127.0.0.1:5173` (tu frontend).

### Backend No Responde

1. Verifica que el backend esté corriendo en el puerto 8000
2. Prueba acceder directamente a `http://127.0.0.1:8000/events/` en el navegador
3. Verifica que el endpoint devuelva datos en formato JSON

### Timeout

Si las peticiones tardan mucho, puedes ajustar el timeout en `backend.config.ts`:

```typescript
export const REQUEST_TIMEOUT = 15000; // 15 segundos
```

## Estructura de Datos Esperada

El backend debe devolver un array de eventos con esta estructura:

```json
[
  {
    "id": 1,
    "name": "Nombre del Evento",
    "description": "Descripción del evento",
    "date": "2024-01-01",
    "location": "Ubicación del evento"
  }
]
```

## Logs de Depuración

El servicio HTTP incluye logs detallados que te ayudarán a debuggear:

- 🌐 URL de la petición
- 📡 Respuesta del servidor
- ❌ Errores detallados

## Comandos Útiles

```bash
# Verificar si el backend responde
curl http://127.0.0.1:8000/events/

# Probar con headers específicos
curl -H "Content-Type: application/json" http://127.0.0.1:8000/events/
```

## Configuración Adicional

Si necesitas agregar más endpoints, puedes modificar `backend.config.ts`:

```typescript
export const BACKEND_ENDPOINTS = {
    events: `${BACKEND_BASE_URL}/events/`,
    users: `${BACKEND_BASE_URL}/users/`,
    auth: `${BACKEND_BASE_URL}/auth/`,
};
```
