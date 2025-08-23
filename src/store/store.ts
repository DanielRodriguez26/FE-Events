import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createHomeState, type IHomeStore } from '@domain/home/home';
import { createAuthState, type IAuthStore } from '@domain/auth/auth';
import { createEventState, type IEventStore } from '@/domain/event/event';
import { createSpeakerState, type ISpeakerStore } from '@/domain/speaker/speaker';
import { createEventRegistration, type IEventRegistrationStore } from '@/domain/event-registration/event-registration';
import { createSessionState, type ISessionStore } from '@/domain/session/session';

type TypeGlobalActions = {
	clearStorage: () => void;
};

export type MyEvenState = TypeGlobalActions & 
							IHomeStore & 
							IAuthStore & 
							IEventStore &
							ISpeakerStore &
							IEventRegistrationStore &
							ISessionStore;

const useStore = create<MyEvenState>()(
	devtools(
		persist(
			set => ({
				...createHomeState(set),
				...createAuthState(set),
				...createEventState(set),
				...createSpeakerState(set),
				...createEventRegistration(set),
				...createSessionState(set),
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