import type { SetState } from "zustand";
import { sessionServices } from "./session.service";
import type { 
    ISessionDto, 
    ISessionCreateDto, 
    ISessionUpdateDto, 
    IPaginatedSessionsResponse 
} from "./session.interface";

interface ISessionStore {
    // Estado
    sessions: ISessionDto[] | null;
    currentSession: ISessionDto | null;
    sessionsByEvent: IPaginatedSessionsResponse | null;
    isLoading: boolean;
    error: string | null;

    // Acciones
    setSessions: (page?: number, size?: number) => Promise<void>;
    setSessionsByEvent: (eventId: number, page?: number, size?: number) => Promise<void>;
    setSessionById: (sessionId: number) => Promise<void>;
    createSession: (sessionData: ISessionCreateDto) => Promise<boolean>;
    updateSession: (sessionId: number, sessionData: ISessionUpdateDto) => Promise<boolean>;
    deleteSession: (sessionId: number) => Promise<boolean>;
    createEventSession: (eventId: number, sessionData: Omit<ISessionCreateDto, 'event_id'>) => Promise<boolean>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

const createSessionInitialState = {
    sessions: null,
    currentSession: null,
    sessionsByEvent: null,
    isLoading: false,
    error: null,
};

const createSessionState = (set: SetState<ISessionStore>): ISessionStore => ({
    // Estado inicial
    ...createSessionInitialState,

    // Cargar todas las sesiones
    setSessions: async (page: number = 1, size: number = 20) => {
        set({ isLoading: true, error: null });
        try {
            const response = await sessionServices.getAllSessions(page, size);
            set({ sessions: response.items, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar sesiones';
            set({ error: errorMessage, isLoading: false });
        }
    },

    // Cargar sesiones por evento
    setSessionsByEvent: async (eventId: number, page: number = 1, size: number = 20) => {
        set({ isLoading: true, error: null });
        try {
            const response = await sessionServices.getSessionsByEvent(eventId, page, size);
            set({ sessionsByEvent: response, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar sesiones del evento';
            set({ error: errorMessage, isLoading: false });
        }
    },

    // Cargar sesión por ID
    setSessionById: async (sessionId: number) => {
        set({ isLoading: true, error: null });
        try {
            const session = await sessionServices.getSessionById(sessionId);
            set({ currentSession: session, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar sesión';
            set({ error: errorMessage, isLoading: false });
        }
    },

    // Crear sesión
    createSession: async (sessionData: ISessionCreateDto) => {
        set({ isLoading: true, error: null });
        try {
            const newSession = await sessionServices.createSession(sessionData);
            set({ 
                currentSession: newSession, 
                isLoading: false 
            });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear sesión';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    // Actualizar sesión
    updateSession: async (sessionId: number, sessionData: ISessionUpdateDto) => {
        set({ isLoading: true, error: null });
        try {
            const updatedSession = await sessionServices.updateSession(sessionId, sessionData);
            set({ 
                currentSession: updatedSession, 
                isLoading: false 
            });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar sesión';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    // Eliminar sesión
    deleteSession: async (sessionId: number) => {
        set({ isLoading: true, error: null });
        try {
            await sessionServices.deleteSession(sessionId);
            set({ 
                currentSession: null, 
                isLoading: false 
            });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar sesión';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    // Crear sesión para evento específico
    createEventSession: async (eventId: number, sessionData: Omit<ISessionCreateDto, 'event_id'>) => {
        set({ isLoading: true, error: null });
        try {
            const newSession = await sessionServices.createEventSession(eventId, sessionData);
            set({ 
                currentSession: newSession, 
                isLoading: false 
            });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear sesión para el evento';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    // Limpiar error
    clearError: () => {
        set({ error: null });
    },

    // Establecer estado de carga
    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },
});

export { createSessionState, createSessionInitialState };
