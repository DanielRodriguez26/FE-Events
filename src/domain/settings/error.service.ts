import axios, { AxiosError, AxiosResponse } from 'axios';
import type { 
    IErrorResponse, 
    IFrontendError, 
    ErrorType,
    createFrontendError,
    convertBackendError 
} from './error.interface';

// Servicio para manejar errores de manera centralizada
export class ErrorService {
    
    /**
     * Procesa errores de Axios y los convierte a errores estandarizados
     */
    static processAxiosError(error: AxiosError): IFrontendError {
        console.error('🔴 Error de Axios:', error);
        
        // Si hay respuesta del servidor
        if (error.response) {
            const { status, data } = error.response;
            
            // Verificar si es un error estructurado del backend
            if (this.isStructuredError(data)) {
                return convertBackendError(data as IErrorResponse);
            }
            
            // Si no es estructurado, crear error basado en el status code
            return this.createErrorFromStatusCode(status, data);
        }
        
        // Si no hay respuesta (error de red)
        if (error.request) {
            return createFrontendError(
                "Network Error",
                "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
                undefined,
                undefined,
                error
            );
        }
        
        // Error desconocido
        return createFrontendError(
            "Unknown Error",
            "Ha ocurrido un error inesperado",
            undefined,
            undefined,
            error
        );
    }
    
    /**
     * Verifica si el error es estructurado (del backend)
     */
    private static isStructuredError(data: any): data is IErrorResponse {
        return (
            data &&
            typeof data === 'object' &&
            data.success === false &&
            typeof data.error === 'string' &&
            typeof data.message === 'string' &&
            typeof data.status_code === 'number'
        );
    }
    
    /**
     * Crea un error basado en el código de estado HTTP
     */
    private static createErrorFromStatusCode(status: number, data: any): IFrontendError {
        let type: ErrorType;
        let message: string;
        
        switch (status) {
            case 400:
                type = "Validation Error";
                message = "Los datos enviados no son válidos";
                break;
            case 401:
                type = "Authentication Error";
                message = "No tienes autorización para acceder a este recurso";
                break;
            case 403:
                type = "Authorization Error";
                message = "No tienes permisos para realizar esta acción";
                break;
            case 404:
                type = "Not Found";
                message = "El recurso solicitado no fue encontrado";
                break;
            case 409:
                type = "Validation Error";
                message = "Conflicto con los datos existentes";
                break;
            case 422:
                type = "Validation Error";
                message = "Los datos proporcionados no son válidos";
                break;
            case 500:
                type = "Internal Server Error";
                message = "Error interno del servidor";
                break;
            case 502:
            case 503:
            case 504:
                type = "Server Error";
                message = "El servidor no está disponible en este momento";
                break;
            default:
                type = "Unknown Error";
                message = `Error ${status}: ${data?.message || 'Error desconocido'}`;
        }
        
        return createFrontendError(
            type,
            message,
            undefined,
            status,
            data
        );
    }
    
    /**
     * Obtiene mensajes de error de validación para campos específicos
     */
    static getFieldErrors(error: IFrontendError): Record<string, string> {
        const fieldErrors: Record<string, string> = {};
        
        if (error.details) {
            error.details.forEach(detail => {
                if (detail.field) {
                    fieldErrors[detail.field] = detail.message;
                }
            });
        }
        
        return fieldErrors;
    }
    
    /**
     * Verifica si el error es de validación
     */
    static isValidationError(error: IFrontendError): boolean {
        return error.type === "Validation Error";
    }
    
    /**
     * Verifica si el error es de autenticación
     */
    static isAuthenticationError(error: IFrontendError): boolean {
        return error.type === "Authentication Error";
    }
    
    /**
     * Verifica si el error es de autorización
     */
    static isAuthorizationError(error: IFrontendError): boolean {
        return error.type === "Authorization Error";
    }
    
    /**
     * Verifica si el error es de red
     */
    static isNetworkError(error: IFrontendError): boolean {
        return error.type === "Network Error";
    }
    
    /**
     * Obtiene un mensaje de error amigable para el usuario
     */
    static getUserFriendlyMessage(error: IFrontendError): string {
        switch (error.type) {
            case "Validation Error":
                return "Por favor, verifica los datos ingresados y vuelve a intentar.";
            case "Authentication Error":
                return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
            case "Authorization Error":
                return "No tienes permisos para realizar esta acción.";
            case "Not Found":
                return "El recurso que buscas no existe.";
            case "Network Error":
                return "Problema de conexión. Verifica tu internet y vuelve a intentar.";
            case "Internal Server Error":
            case "Database Error":
                return "Error del servidor. Por favor, intenta más tarde.";
            default:
                return error.message || "Ha ocurrido un error inesperado.";
        }
    }
    
    /**
     * Log del error para debugging
     */
    static logError(error: IFrontendError, context?: string): void {
        console.group(`🔴 Error${context ? ` en ${context}` : ''}`);
        console.error('Tipo:', error.type);
        console.error('Mensaje:', error.message);
        console.error('Status Code:', error.statusCode);
        console.error('Timestamp:', error.timestamp);
        if (error.details) {
            console.error('Detalles:', error.details);
        }
        if (error.originalError) {
            console.error('Error Original:', error.originalError);
        }
        console.groupEnd();
    }
}
