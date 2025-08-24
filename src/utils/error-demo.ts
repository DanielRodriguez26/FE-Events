// Demostración del sistema de manejo de errores
// Este archivo muestra ejemplos de cómo usar el sistema

import { ErrorService } from '@domain/settings/error.service';
import { createFrontendError } from '@domain/settings/error.interface';
import type { IFrontendError } from '@domain/settings/error.interface';

// Ejemplo de error del backend (simulado)
const mockBackendError = {
    success: false,
    error: "Validation Error",
    message: "Los datos proporcionados no son válidos",
    details: [
        {
            field: "email",
            message: "El email debe ser válido",
            value: "invalid-email"
        },
        {
            field: "password",
            message: "La contraseña debe tener al menos 8 caracteres",
            value: "123"
        }
    ],
    timestamp: "2024-01-15T10:30:00Z",
    path: "/api/v1/auth/login",
    method: "POST",
    status_code: 422
};

// Ejemplo de error de red (simulado)
const mockNetworkError = {
    request: {},
    message: "Network Error",
    code: "ECONNREFUSED"
};

// Función para demostrar el procesamiento de errores
export const demonstrateErrorHandling = () => {
    console.log('🔧 Demostración del Sistema de Manejo de Errores\n');

    // 1. Procesar error del backend
    console.log('1️⃣ Procesando error del backend:');
    const backendError = ErrorService.processAxiosError({
        response: {
            status: 422,
            data: mockBackendError
        }
    } as any);
    
    console.log('Error procesado:', backendError);
    console.log('Es error de validación:', ErrorService.isValidationError(backendError));
    console.log('Errores de campo:', ErrorService.getFieldErrors(backendError));
    console.log('Mensaje amigable:', ErrorService.getUserFriendlyMessage(backendError));
    console.log('');

    // 2. Procesar error de red
    console.log('2️⃣ Procesando error de red:');
    const networkError = ErrorService.processAxiosError({
        request: mockNetworkError,
        message: "Network Error"
    } as any);
    
    console.log('Error procesado:', networkError);
    console.log('Es error de red:', ErrorService.isNetworkError(networkError));
    console.log('Mensaje amigable:', ErrorService.getUserFriendlyMessage(networkError));
    console.log('');

    // 3. Crear error personalizado
    console.log('3️⃣ Creando error personalizado:');
    const customError = createFrontendError(
        "Authentication Error",
        "Credenciales inválidas",
        undefined,
        401
    );
    
    console.log('Error personalizado:', customError);
    console.log('Es error de autenticación:', ErrorService.isAuthenticationError(customError));
    console.log('');

    // 4. Logging de errores
    console.log('4️⃣ Logging de errores:');
    ErrorService.logError(backendError, 'Demo Component');
    console.log('');

    // 5. Ejemplos de uso en componentes
    console.log('5️⃣ Ejemplos de uso en componentes:');
    console.log(`
    // En un componente React:
    import { useError } from '@application/hooks';
    import ErrorDisplay from '@components/ui/ErrorDisplay';

    const MyComponent = () => {
        const { error, clearError, handleError } = useError();

        const handleSubmit = async () => {
            try {
                await api.submitData();
            } catch (err) {
                handleError(err, 'MyComponent');
            }
        };

        return (
            <div>
                <ErrorDisplay 
                    error={error} 
                    onDismiss={clearError}
                    onRetry={handleSubmit}
                />
            </div>
        );
    };
    `);
};

// Función para simular diferentes tipos de errores
export const simulateErrors = () => {
    console.log('🎭 Simulando diferentes tipos de errores:\n');

    const errorTypes = [
        {
            name: "Validation Error",
            error: createFrontendError("Validation Error", "Datos inválidos")
        },
        {
            name: "Authentication Error", 
            error: createFrontendError("Authentication Error", "Sesión expirada")
        },
        {
            name: "Authorization Error",
            error: createFrontendError("Authorization Error", "Sin permisos")
        },
        {
            name: "Not Found",
            error: createFrontendError("Not Found", "Recurso no encontrado")
        },
        {
            name: "Network Error",
            error: createFrontendError("Network Error", "Sin conexión")
        },
        {
            name: "Internal Server Error",
            error: createFrontendError("Internal Server Error", "Error del servidor")
        }
    ];

    errorTypes.forEach(({ name, error }) => {
        console.log(`${name}:`);
        console.log(`  - Tipo: ${error.type}`);
        console.log(`  - Mensaje: ${error.message}`);
        console.log(`  - Amigable: ${ErrorService.getUserFriendlyMessage(error)}`);
        console.log('');
    });
};

// Exportar para uso en consola del navegador
if (typeof window !== 'undefined') {
    (window as any).errorDemo = {
        demonstrateErrorHandling,
        simulateErrors,
        ErrorService,
        createFrontendError
    };
    
    console.log('🚀 Sistema de errores cargado. Usa:');
    console.log('  - errorDemo.demonstrateErrorHandling()');
    console.log('  - errorDemo.simulateErrors()');
}
