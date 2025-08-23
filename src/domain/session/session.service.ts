import { get, post, put ,remove} from '../settings/http.service';
import { BACKEND_ENDPOINTS } from '../settings/backend.config';
import type { 
    ISessionDto, 
    ISessionCreateDto, 
    ISessionUpdateDto, 
    IPaginatedSessionsResponse 
} from './session.interface';

// Obtener todas las sesiones con paginación
const getAllSessions = async (page: number = 1, size: number = 20): Promise<IPaginatedSessionsResponse> => {
    try {
        const response = await get<IPaginatedSessionsResponse>({
            url: `?page=${page}&size=${size}`,
            baseURL: BACKEND_ENDPOINTS.sessions,
        });
        return response;
    } catch (error) {
        console.error('❌ Error al cargar sesiones:', error);
        throw error;
    }
};

// Obtener sesiones por evento
const getSessionsByEvent = async (eventId: number, page: number = 1, size: number = 20): Promise<IPaginatedSessionsResponse> => {
    try {
        const response = await get<IPaginatedSessionsResponse>({
            url: `event/${eventId}?page=${page}&size=${size}`,
            baseURL: BACKEND_ENDPOINTS.sessions,
        });
        return response;
    } catch (error) {
        console.error('❌ Error al cargar sesiones del evento:', error);
        throw error;
    }
};

// Obtener sesión por ID
const getSessionById = async (sessionId: number): Promise<ISessionDto> => {
    try {
        const response = await get<ISessionDto>({
            url: `${sessionId}`,
            baseURL: BACKEND_ENDPOINTS.sessions,
        });
        return response;
    } catch (error) {
        console.error('❌ Error al cargar sesión:', error);
        throw error;
    }
};

// Crear nueva sesión
const createSession = async (sessionData: ISessionCreateDto): Promise<ISessionDto> => {
    try {
        const response = await post<ISessionDto>({
            url: '',
            baseURL: BACKEND_ENDPOINTS.sessions,
            payload: sessionData,
        });
        return response;
    } catch (error) {
        console.error('❌ Error al crear sesión:', error);
        throw error;
    }
};

// Actualizar sesión
const updateSession = async (sessionId: number, sessionData: ISessionUpdateDto): Promise<ISessionDto> => {
    try {
        const response = await put<ISessionDto>({
            url: `${sessionId}`,
            baseURL: BACKEND_ENDPOINTS.sessions,
            payload: sessionData,
        });
        return response;
    } catch (error) {
        console.error('❌ Error al actualizar sesión:', error);
        throw error;
    }
};

// Eliminar sesión
const deleteSession = async (sessionId: number): Promise<{ message: string }> => {
    try {
        const response = await remove<{ message: string }>({
            url: `${sessionId}`,
            baseURL: BACKEND_ENDPOINTS.sessions,
        });
        return response;
    } catch (error) {
        console.error('❌ Error al eliminar sesión:', error);
        throw error;
    }
};

// Crear sesión para un evento específico
const createEventSession = async (eventId: number, sessionData: Omit<ISessionCreateDto, 'event_id'>): Promise<ISessionDto> => {
    try {
        const response = await post<ISessionDto>({
            url: `${eventId}/sessions`,
            baseURL: BACKEND_ENDPOINTS.events,
            payload: sessionData,
        });
        return response;
    } catch (error) {
        console.error('❌ Error al crear sesión para el evento:', error);
        throw error;
    }
};

const sessionServices = {
    getAllSessions,
    getSessionsByEvent,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    createEventSession,
};

export { sessionServices };
