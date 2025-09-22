import type { SetState } from 'zustand';
import type { MyEvenState } from './store';

// Importar servicios de dominio con DI
import { createHomeService } from '../../domain/home/home.service';
import { createEventService } from '../../domain/event/event.service';
import { createAuthService } from '../../domain/auth/auth.service';
import { createSessionService } from '../../domain/session/session.service';

// Importar contenedor de dependencias
import { diContainer } from '../di/container';

// Inicializar servicios con dependencias
const homeService = createHomeService(diContainer.eventRepository);
const eventService = createEventService(diContainer.eventRepository);
const authService = createAuthService(diContainer.authRepository);
const sessionService = createSessionService(diContainer.sessionRepository);

// Interfaces para los slices
interface IHomeStore {
	allHomeEvents: any;
	setAllHomeEvents: (page?: number, size?: number, filters?: any) => Promise<void>;
}

interface IAuthStore {
	user: any;
	token: any;
	refreshToken: any;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: any;
	login: (credentials: any) => Promise<boolean>;
	register: (credentials: any) => Promise<boolean>;
	logout: () => void;
	refreshTokenAction: () => Promise<boolean>;
	clearError: () => void;
	setLoading: (loading: boolean) => void;
}

interface IEventStore {
	createEvent: any;
	allevents: any;
	eventById: any;
	alleventssearch: any;
	currentFilters: any;
	deleteEvent: any;
	setAllevents: (page?: number, size?: number) => Promise<void>;
	setEventById: (id: number) => Promise<void>;
	setEventSearch: (filter: any, page?: number, size?: number) => Promise<void>;
	setCreateEvent: (event: any) => Promise<void>;
	setDeleteEvent: (id: number) => Promise<void>;
	setUpdateEvent: (id: number, event: any) => Promise<void>;
}

interface ISpeakerStore {
	speaker: any;
}

interface IEventRegistrationStore {
	myregistrations: any;
}

interface ISessionStore {
	sessions: any;
	currentSession: any;
}

// Slice para Home
export const createHomeSlice = (set: SetState<MyEvenState>): IHomeStore => ({
	allHomeEvents: null,
	setAllHomeEvents: async (page = 1, size = 6, filters) => {
		const events = await homeService.getAllEvents(page, size, filters);
		set({ allHomeEvents: events });
	},
});

// Slice para Auth
export const createAuthSlice = (set: SetState<MyEvenState>): IAuthStore => ({
	user: null,
	token: null,
	refreshToken: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
	login: async (credentials) => {
		set({ isLoading: true, error: null });

		try {
			const response = await authService.loginUser(credentials);

			set({
				user: response.user || null,
				token: response.token,
				refreshToken: response.refreshToken || null,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});

			return true;
		} catch (error) {
			console.error('❌ Error en login store:', error);
			const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
			set({
				isLoading: false,
				error: errorMessage,
			});
			return false;
		}
	},
	register: async (credentials) => {
		set({ isLoading: true, error: null });

		try {
			const response = await authService.registerUser(credentials);

			set({
				user: response.user || null,
				token: response.token || null,
				refreshToken: response.refreshToken || null,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});

			return true;
		} catch (error) {
			console.error('❌ Error en registro store:', error);
			const errorMessage = error instanceof Error ? error.message : 'Error de registro';
			set({
				isLoading: false,
				error: errorMessage,
			});
			return false;
		}
	},
	logout: () => {
		// Intentar hacer logout en el servidor si hay token
		const currentState = (set as any).getState?.() || {};
		if (currentState.token) {
			authService.logoutUser(currentState.token).catch(() => {
				// Error handled silently
			});
		}

		// Limpiar estado local
		set({
			user: null,
			token: null,
			refreshToken: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
		});
	},
	refreshTokenAction: async () => {
		const currentState = (set as any).getState?.() || {};
		if (!currentState.refreshToken) {
			return false;
		}

		set({ isLoading: true, error: null });

		try {
			const response = await authService.refreshUserToken(currentState.refreshToken);

			set({
				token: response.token,
				refreshToken: response.refreshToken || currentState.refreshToken,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});

			return true;
		} catch {
			// Si falla el refresh, hacer logout
			set({
				user: null,
				token: null,
				refreshToken: null,
				isAuthenticated: false,
				isLoading: false,
				error: 'Sesión expirada',
			});
			return false;
		}
	},
	clearError: () => set({ error: null }),
	setLoading: (loading) => set({ isLoading: loading }),
});

// Slice para Events
export const createEventSlice = (set: SetState<MyEvenState>): IEventStore => ({
	createEvent: {},
	allevents: null,
	eventById: null,
	alleventssearch: null,
	currentFilters: null,
	deleteEvent: null,
	setAllevents: async (page = 1, size = 6) => {
		const events = await eventService.getAllEvents(page, size);
		set({ allevents: events });
	},
	setEventById: async (id: number) => {
		const event = await eventService.getEventById(id);
		set({ eventById: event });
	},
	setEventSearch: async (filter, page = 1, size = 10) => {
		const event = await eventService.getEventSearch(filter, page, size);
		set({ allevents: event, currentFilters: filter });
	},
	setCreateEvent: async (event) => {
		const newEvent = await eventService.createEvent(event);
		set({ createEvent: newEvent });
	},
	setDeleteEvent: async (id: number) => {
		await eventService.deleteEvent(id);
		set({ deleteEvent: null });
	},
	setUpdateEvent: async (id: number, event) => {
		const updatedEvent = await eventService.updateEvent(id, event);
		set({ eventById: updatedEvent });
	},
});

// Slices placeholder para otros módulos
export const createSpeakerSlice = (set: SetState<MyEvenState>): ISpeakerStore => ({
	speaker: null,
});

export const createEventRegistrationSlice = (set: SetState<MyEvenState>): IEventRegistrationStore => ({
	myregistrations: [],
});

export const createSessionSlice = (set: SetState<MyEvenState>): ISessionStore => ({
	sessions: [],
	currentSession: null,
});