// Configuración específica para el backend
// Centraliza todas las configuraciones relacionadas con la API

// URL base del backend
export const BACKEND_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Endpoints específicos del backend
export const BACKEND_ENDPOINTS = {
    // endpoints de autenticación
    auth: `${BACKEND_BASE_URL}/auth/`,
    login: `${BACKEND_BASE_URL}/auth/login/`,
	register: `${BACKEND_BASE_URL}/auth/register/`,
	refresh: `${BACKEND_BASE_URL}/auth/refresh/`,
	logout: `${BACKEND_BASE_URL}/auth/logout/`,

    // endpoints de eventos
    events: `${BACKEND_BASE_URL}/events/`,

    // endpoints de usuarios
    users: `${BACKEND_BASE_URL}/users/`,

    // endpoints de ponentes
    speakers: `${BACKEND_BASE_URL}/speakers/`,

    // endpoints de registro de eventos
    eventRegistration: `${BACKEND_BASE_URL}/event-registrations/`,

    // Aquí puedes agregar más endpoints según necesites
};

// Configuración de headers por defecto
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

// Configuración de timeout para las peticiones
export const REQUEST_TIMEOUT = 10000; // 10 segundos

// Configuración para CORS (si es necesaria)
export const CORS_CONFIG = {
    withCredentials: false, // Cambiar a true si tu backend requiere cookies
};
