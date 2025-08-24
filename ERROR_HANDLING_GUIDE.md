# Guía de Manejo de Errores

Esta guía explica cómo funciona el sistema completo de manejo de errores implementado en MisEventos, tanto en el backend como en el frontend.

## 🏗️ Arquitectura del Sistema

### Backend (FastAPI)
- **Esquemas de Error**: Respuestas estandarizadas para todos los tipos de error
- **Excepciones Personalizadas**: Clases específicas para cada tipo de error
- **Manejadores Globales**: Interceptores que procesan automáticamente todos los errores
- **Logging**: Registro detallado de errores para debugging

### Frontend (React)
- **Servicio de Errores**: Procesamiento centralizado de errores de Axios
- **Hooks Personalizados**: Manejo de estado de errores en componentes
- **Componentes UI**: Visualización estandarizada de errores
- **Interceptores**: Procesamiento automático de errores HTTP

## 🔧 Backend - Implementación

### 1. Esquemas de Error

```python
# app/api/schemas/error_schemas.py
class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    message: str
    details: Optional[List[ErrorDetail]] = None
    timestamp: datetime
    path: Optional[str] = None
    method: Optional[str] = None
    status_code: int
```

### 2. Excepciones Personalizadas

```python
# app/core/exceptions.py
class ValidationException(BaseAPIException):
    def __init__(self, message: str = "Validation error", details=None):
        super().__init__(
            status_code=422,
            message=message,
            error_type="Validation Error",
            details=details
        )

class NotFoundException(BaseAPIException):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            status_code=404,
            message=message,
            error_type="Not Found"
        )
```

### 3. Uso en Controladores

```python
@router.get("/{event_id}")
async def get_event_by_id(event_id: int, db: DBSession = Depends(get_db)):
    try:
        event_service = EventService(db)
        event = event_service.get_event_by_id(event_id)
        if not event:
            raise NotFoundException("Evento no encontrado")
        return event
    except (NotFoundException, ValidationException):
        raise
    except Exception as e:
        raise ServerException(f"Error interno: {str(e)}")
```

### 4. Manejadores Globales

```python
# app/main.py
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(BaseAPIException, custom_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)
```

## 🎨 Frontend - Implementación

### 1. Servicio de Errores

```typescript
// src/domain/settings/error.service.ts
export class ErrorService {
    static processAxiosError(error: AxiosError): IFrontendError {
        if (error.response) {
            const { status, data } = error.response;
            
            // Verificar si es un error estructurado del backend
            if (this.isStructuredError(data)) {
                return convertBackendError(data as IErrorResponse);
            }
            
            // Crear error basado en status code
            return this.createErrorFromStatusCode(status, data);
        }
        
        // Error de red
        return createFrontendError(
            "Network Error",
            "No se pudo conectar con el servidor"
        );
    }
}
```

### 2. Hook de Errores

```typescript
// src/application/hooks/useError.ts
export const useError = (): UseErrorReturn => {
    const [error, setError] = useState<IFrontendError | null>(null);

    const handleError = useCallback((error: any, context?: string) => {
        const processedError = ErrorService.processAxiosError(error);
        ErrorService.logError(processedError, context);
        setError(processedError);
    }, []);

    return {
        error,
        setError,
        clearError: () => setError(null),
        handleError,
        isError: error !== null
    };
};
```

### 3. Componente de Visualización

```typescript
// src/components/ui/ErrorDisplay.tsx
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    error,
    onRetry,
    onDismiss,
    showDetails = false
}) => {
    if (!error) return null;

    return (
        <div className={`border-l-4 p-4 ${getErrorColor(error.type)}`}>
            <div className="flex items-start">
                <span className="text-xl">{getErrorIcon(error.type)}</span>
                <div className="flex-1">
                    <h3 className="text-sm font-medium">{error.type}</h3>
                    <p className="mt-1 text-sm">
                        {ErrorService.getUserFriendlyMessage(error)}
                    </p>
                    {onRetry && (
                        <button onClick={onRetry}>Reintentar</button>
                    )}
                </div>
            </div>
        </div>
    );
};
```

## 📝 Uso en Componentes

### 1. Manejo Básico de Errores

```typescript
import { useError } from '@application/hooks';
import ErrorDisplay from '@components/ui/ErrorDisplay';

const MyComponent = () => {
    const { error, clearError, handleError } = useError();

    const fetchData = async () => {
        try {
            const data = await api.getData();
            // Procesar datos
        } catch (err) {
            handleError(err, 'MyComponent');
        }
    };

    return (
        <div>
            <ErrorDisplay 
                error={error} 
                onDismiss={clearError}
                onRetry={fetchData}
            />
            {/* Resto del componente */}
        </div>
    );
};
```

### 2. Errores de Validación

```typescript
import { useValidationError } from '@application/hooks';

const FormComponent = () => {
    const { error, fieldErrors, clearError, handleError } = useValidationError();

    const handleSubmit = async (formData) => {
        try {
            await api.submitForm(formData);
        } catch (err) {
            handleError(err, 'FormComponent');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                name="email"
                className={fieldErrors.email ? 'border-red-500' : ''}
            />
            {fieldErrors.email && (
                <span className="text-red-500">{fieldErrors.email}</span>
            )}
            
            <ErrorDisplay error={error} onDismiss={clearError} />
        </form>
    );
};
```

### 3. Errores de Autenticación

```typescript
import { useAuthError } from '@application/hooks';

const ProtectedComponent = () => {
    const { error, isAuthError, clearError } = useAuthError();

    // Si hay error de autenticación, redirigir al login
    useEffect(() => {
        if (isAuthError) {
            navigate('/login');
        }
    }, [isAuthError]);

    return (
        <div>
            <ErrorDisplay error={error} onDismiss={clearError} />
        </div>
    );
};
```

## 🎯 Tipos de Error Soportados

### Backend
- **Validation Error** (422): Errores de validación de datos
- **Authentication Error** (401): Problemas de autenticación
- **Authorization Error** (403): Problemas de permisos
- **Not Found** (404): Recursos no encontrados
- **Conflict** (409): Conflictos de datos
- **Database Error** (500): Errores de base de datos
- **Internal Server Error** (500): Errores internos

### Frontend
- **Validation Error**: Errores de formularios y validación
- **Authentication Error**: Problemas de login/sesión
- **Authorization Error**: Falta de permisos
- **Not Found**: Recursos no encontrados
- **Network Error**: Problemas de conexión
- **Internal Server Error**: Errores del servidor
- **Unknown Error**: Errores no clasificados

## 🔍 Debugging

### Backend
```python
# Los errores se logean automáticamente con detalles completos
# Incluyen: timestamp, path, method, status_code, detalles específicos
```

### Frontend
```typescript
// Los errores se logean en la consola con contexto
ErrorService.logError(error, 'ComponentName');

// Para debugging detallado
console.log('Error completo:', error);
console.log('Detalles del campo:', ErrorService.getFieldErrors(error));
```

## 🚀 Mejores Prácticas

### Backend
1. **Usar excepciones específicas**: No usar `HTTPException` genérico
2. **Incluir contexto**: Siempre incluir path y method en errores
3. **Validar datos**: Usar Pydantic para validación automática
4. **Logging detallado**: Registrar errores con contexto completo

### Frontend
1. **Usar hooks especializados**: `useValidationError`, `useAuthError`
2. **Mostrar errores apropiados**: Usar `ErrorDisplay` para consistencia
3. **Manejar reintentos**: Proporcionar opción de reintentar cuando sea apropiado
4. **Limpiar errores**: Limpiar errores al cambiar de página o componente

## 🔧 Configuración

### Backend
```python
# app/main.py
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(BaseAPIException, custom_exception_handler)
```

### Frontend
```typescript
// src/domain/settings/axios.config.ts
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        const processedError = ErrorService.processAxiosError(error);
        return Promise.reject(processedError);
    }
);
```

## 📊 Ejemplo de Respuesta de Error

```json
{
    "success": false,
    "error": "Validation Error",
    "message": "Los datos proporcionados no son válidos",
    "details": [
        {
            "field": "email",
            "message": "El email debe ser válido",
            "value": "invalid-email"
        }
    ],
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/api/v1/events/",
    "method": "POST",
    "status_code": 422
}
```

Este sistema proporciona un manejo de errores completo, consistente y fácil de usar en toda la aplicación.
