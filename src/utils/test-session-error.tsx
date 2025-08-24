import React from 'react';
import { useError } from '@application/hooks';
import ErrorDisplay from '@components/ui/ErrorDisplay';
import { createFrontendError } from '@domain/settings/error.interface';

// Componente de prueba específico para errores de sesiones
const TestSessionError: React.FC = () => {
    const { error, setError, clearError } = useError();

    const testSessionValidationError = () => {
        // Simular el error específico de sesiones que viste
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

    const testSessionConflictError = () => {
        const mockError = createFrontendError(
            "Validation Error",
            "Conflicto con los datos existentes",
            undefined,
            409,
            {
                detail: "Ya existe una sesión programada en este horario",
                statusCode: 409,
                timestamp: new Date().toISOString(),
                type: "Validation Error"
            }
        );
        
        setError(mockError);
    };

    const testSessionNotFoundError = () => {
        const mockError = createFrontendError(
            "Not Found",
            "Sesión no encontrada",
            undefined,
            404,
            {
                detail: "La sesión con ID 123 no existe",
                statusCode: 404,
                timestamp: new Date().toISOString(),
                type: "Not Found"
            }
        );
        
        setError(mockError);
    };

    const testSessionAuthError = () => {
        const mockError = createFrontendError(
            "Authorization Error",
            "No tienes permisos para realizar esta acción",
            undefined,
            403,
            {
                detail: "Solo los organizadores pueden crear sesiones",
                statusCode: 403,
                timestamp: new Date().toISOString(),
                type: "Authorization Error"
            }
        );
        
        setError(mockError);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Prueba de Errores de Sesiones</h1>
            
            <div className="mb-6 space-y-2">
                <button
                    onClick={testSessionValidationError}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                >
                    Error de Validación de Horario
                </button>
                
                <button
                    onClick={testSessionConflictError}
                    className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 mr-2"
                >
                    Error de Conflicto de Horario
                </button>
                
                <button
                    onClick={testSessionNotFoundError}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                >
                    Error de Sesión No Encontrada
                </button>
                
                <button
                    onClick={testSessionAuthError}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2"
                >
                    Error de Autorización
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
                onRetry={() => console.log('Reintentando crear sesión...')}
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

            {/* Instrucciones */}
            <div className="mt-6 p-4 bg-blue-50 rounded">
                <h3 className="font-bold mb-2">Instrucciones:</h3>
                <ul className="text-sm space-y-1">
                    <li>• <strong>Error de Validación de Horario:</strong> Simula el error que viste en la consola</li>
                    <li>• <strong>Error de Conflicto:</strong> Simula cuando hay dos sesiones en el mismo horario</li>
                    <li>• <strong>Error de Sesión No Encontrada:</strong> Simula cuando se busca una sesión que no existe</li>
                    <li>• <strong>Error de Autorización:</strong> Simula cuando un usuario sin permisos intenta crear sesiones</li>
                </ul>
            </div>
        </div>
    );
};

export default TestSessionError;
