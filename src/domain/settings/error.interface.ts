// Interfaces para el manejo de errores estandarizados

export interface IErrorDetail {
    field?: string;
    message: string;
    value?: any;
}

export interface IErrorResponse {
    success: false;
    error: string;
    message: string;
    details?: IErrorDetail[];
    timestamp: string;
    path?: string;
    method?: string;
    status_code: number;
}

export interface IValidationErrorResponse extends IErrorResponse {
    error: "Validation Error";
    details: IErrorDetail[];
}

export interface IAuthenticationErrorResponse extends IErrorResponse {
    error: "Authentication Error";
}

export interface IAuthorizationErrorResponse extends IErrorResponse {
    error: "Authorization Error";
}

export interface INotFoundErrorResponse extends IErrorResponse {
    error: "Not Found";
}

export interface IServerErrorResponse extends IErrorResponse {
    error: "Internal Server Error";
}

export interface IDatabaseErrorResponse extends IErrorResponse {
    error: "Database Error";
}

// Tipos de error para el frontend
export type ErrorType = 
    | "Validation Error"
    | "Authentication Error"
    | "Authorization Error"
    | "Not Found"
    | "Internal Server Error"
    | "Database Error"
    | "Network Error"
    | "Unknown Error";

// Interfaz para errores del frontend
export interface IFrontendError {
    type: ErrorType;
    message: string;
    details?: IErrorDetail[];
    statusCode?: number;
    timestamp: string;
    originalError?: any;
}

// Función para crear errores del frontend
export const createFrontendError = (
    type: ErrorType,
    message: string,
    details?: IErrorDetail[],
    statusCode?: number,
    originalError?: any
): IFrontendError => ({
    type,
    message,
    details,
    statusCode,
    timestamp: new Date().toISOString(),
    originalError
});

// Función para convertir errores del backend a errores del frontend
export const convertBackendError = (errorResponse: IErrorResponse): IFrontendError => {
    return createFrontendError(
        errorResponse.error as ErrorType,
        errorResponse.message,
        errorResponse.details,
        errorResponse.status_code,
        errorResponse
    );
};
