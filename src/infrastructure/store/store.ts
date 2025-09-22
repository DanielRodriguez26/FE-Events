import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {
	createHomeSlice,
	createAuthSlice,
	createEventSlice,
	createSpeakerSlice,
	createEventRegistrationSlice,
	createSessionSlice
} from './slices';

type TypeGlobalActions = {
	clearStorage: () => void;
};

// Tipo unificado para el estado global
export type MyEvenState = TypeGlobalActions & {
	// Home state
	allHomeEvents: any;
	setAllHomeEvents: (page?: number, size?: number, filters?: any) => Promise<void>;

	// Auth state
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

	// Event state
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

	// Speaker state
	speaker: any;

	// Event Registration state
	myregistrations: any;

	// Session state
	sessions: any;
	currentSession: any;
};

const useStore = create<MyEvenState>()(
	devtools(
		persist(
			set => ({
				...createHomeSlice(set),
				...createAuthSlice(set),
				...createEventSlice(set),
				...createSpeakerSlice(set),
				...createEventRegistrationSlice(set),
				...createSessionSlice(set),
				clearStorage: () => {
					localStorage.removeItem('my-even-storage');
				},
			}),
			{
				name: 'my-even-storage',
				partialize: (state: MyEvenState) => ({
					allHomeEvents: state.allHomeEvents,
					allevents: state.allevents,
					speaker: state.speaker,
					user: state.user,
					token: state.token,
					refreshToken: state.refreshToken,
					isAuthenticated: state.isAuthenticated,
					myregistrations: state.myregistrations,
				}),
			}
		)
	)
);

export default useStore;