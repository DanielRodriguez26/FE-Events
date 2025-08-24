import { useState, useCallback } from 'react';
import type { IFrontendError } from '@domain/settings/error.interface';
import { ErrorService } from '@domain/settings/error.service';
import { createFrontendError } from '@domain/settings/error.interface';

interface UseErrorReturn {
    error: IFrontendError | null;
    setError: (error: IFrontendError | null) => void;
    clearError: () => void;
    handleError: (error: any, context?: string) => void;
    isError: boolean;
}

export const useError = (): UseErrorReturn => {
    const [error, setError] = useState<IFrontendError | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const handleError = useCallback((error: any, context?: string) => {
        let processedError: IFrontendError;

        // Si ya es un error del frontend, usarlo directamente
        if (error && typeof error === 'object' && 'type' in error && 'message' in error) {
            processedError = error as IFrontendError;
        } else {
            // Si es un error de Axios o cualquier otro tipo
            try {
                processedError = ErrorService.processAxiosError(error);
            } catch {
                // Fallback para errores desconocidos
                processedError = createFrontendError(
                    "Unknown Error",
                    error?.message || "Ha ocurrido un error inesperado",
                    undefined,
                    undefined,
                    error
                );
            }
        }

        // Log del error
        ErrorService.logError(processedError, context);
        
        // Establecer el error
        setError(processedError);
    }, []);

    return {
        error,
        setError,
        clearError,
        handleError,
        isError: error !== null
    };
};

// Hook específico para errores de validación
export const useValidationError = () => {
    const { error, setError, clearError, handleError } = useError();
    
    const isValidationError = error ? ErrorService.isValidationError(error) : false;
    const fieldErrors = error ? ErrorService.getFieldErrors(error) : {};
    
    return {
        error,
        setError,
        clearError,
        handleError,
        isValidationError,
        fieldErrors,
        isError: error !== null
    };
};

// Hook específico para errores de autenticación
export const useAuthError = () => {
    const { error, setError, clearError, handleError } = useError();
    
    const isAuthError = error ? ErrorService.isAuthenticationError(error) : false;
    const isAuthzError = error ? ErrorService.isAuthorizationError(error) : false;
    
    return {
        error,
        setError,
        clearError,
        handleError,
        isAuthError,
        isAuthzError,
        isError: error !== null
    };
};
