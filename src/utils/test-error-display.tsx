import React from 'react';
import { useError } from '@application/hooks';
import ErrorDisplay from '@components/ui/ErrorDisplay';
import { createFrontendError } from '@domain/settings/error.interface';

// Componente de prueba para verificar el sistema de errores
const TestErrorDisplay: React.FC = () => {
    const { error, setError, clearError } = useError();

    const testBackendError = () => {
        // Simular el error que viste en la consola
        const mockError = createFrontendError(
            "Validation Error",
            "Los datos enviados no son válidos",
            undefined,
            400,
            {
                detail: "Session schedule must be within the event's date range",
                statusCode: 400,
                timestamp: "2025-08-24T03:15:38.712Z",
                type: "Validation Error"
            }
        );
        
        setError(mockError);
    };

    const testNetworkError = () => {
        const mockError = createFrontendError(
            "Network Error",
            "No se pudo conectar con el servidor",
            undefined,
            undefined,
            { code: "ECONNREFUSED" }
        );
        
        setError(mockError);
    };

    const testValidationError = () => {
        const mockError = createFrontendError(
            "Validation Error",
            "Los datos proporcionados no son válidos",
            [
                { field: "email", message: "El email debe ser válido", value: "invalid-email" },
                { field: "password", message: "La contraseña debe tener al menos 8 caracteres", value: "123" }
            ],
            422
        );
        
        setError(mockError);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Prueba del Sistema de Errores</h1>
            
            <div className="mb-6 space-y-2">
                <button
                    onClick={testBackendError}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                    Probar Error del Backend
                </button>
                
                <button
                    onClick={testNetworkError}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                >
                    Probar Error de Red
                </button>
                
                <button
                    onClick={testValidationError}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                >
                    Probar Error de Validación
                </button>
                
                <button
                    onClick={clearError}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Limpiar Error
                </button>
            </div>

            {/* Mostrar el error actual */}
            <ErrorDisplay 
                error={error} 
                onDismiss={clearError}
                onRetry={() => console.log('Reintentando...')}
                showDetails={true}
            />

            {/* Información de debug */}
            {error && (
                <div className="mt-6 p-4 bg-gray-100 rounded">
                    <h3 className="font-bold mb-2">Información de Debug:</h3>
                    <pre className="text-xs overflow-auto">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default TestErrorDisplay;
