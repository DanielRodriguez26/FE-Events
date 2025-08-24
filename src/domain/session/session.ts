import type { SetState } from 'zustand';
import { sessionServices } from './session.service';
import type { ISessionDto, ISessionCreateDto, ISessionUpdateDto, IPaginatedSessionsResponse } from './session.interface';

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
	createEventSession: (sessionData: Omit<ISessionCreateDto, 'event_id'>) => Promise<boolean>;
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
		const response = await sessionServices.getAllSessions(page, size);
		set({ sessions: response.items, isLoading: false });
	},

	// Cargar sesiones por evento
	setSessionsByEvent: async (eventId: number, page: number = 1, size: number = 20) => {
		const response = await sessionServices.getSessionsByEvent(eventId, page, size);
		set({ sessionsByEvent: response, isLoading: false });
	},

	// Cargar sesión por ID
	setSessionById: async (sessionId: number) => {
		const session = await sessionServices.getSessionById(sessionId);
		set({ currentSession: session, isLoading: false });
	},

	// Crear sesión
	createSession: async (sessionData: ISessionCreateDto) => {
		console.log('sessionData', sessionData);
		const newSession = await sessionServices.createSession(sessionData);
		set({
			currentSession: newSession,
			isLoading: false,
		});
		return true;
	},

	// Actualizar sesión
	updateSession: async (sessionId: number, sessionData: ISessionUpdateDto) => {
		const updatedSession = await sessionServices.updateSession(sessionId, sessionData);
		set({
			currentSession: updatedSession,
			isLoading: false,
		});
		return true;
	},

	// Eliminar sesión
	deleteSession: async (sessionId: number) => {
		await sessionServices.deleteSession(sessionId);
		set({
			currentSession: null,
			isLoading: false,
		});
		return true;
	},

	// Crear sesión para evento específico
	createEventSession: async (sessionData: Omit<ISessionCreateDto, 'event_id'>) => {
		const newSession = await sessionServices.createEventSession(sessionData);
		set({
				currentSession: newSession,
				isLoading: false,
		});
		return true;
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

interface ISessionStore {
	sessions: ISessionDto[] | null;
	currentSession: ISessionDto | null;
	sessionsByEvent: IPaginatedSessionsResponse | null;
	isLoading: boolean;
	error: string | null;
}

export { createSessionState, createSessionInitialState, type ISessionStore };
