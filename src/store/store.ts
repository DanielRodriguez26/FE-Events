import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createHomeState, type IHomeStore } from '@domain/home/home';
import { createAuthState, type IAuthStore } from '@domain/auth/auth';
import { createEventState, type IEventStore } from '@/domain/event/event';

type TypeGlobalActions = {
	clearStorage: () => void;
};

export type MyEvenState = TypeGlobalActions & 
							IHomeStore & 
							IAuthStore & 
							IEventStore;

const useStore = create<MyEvenState>()(
	devtools(
		persist(
			set => ({
				...createHomeState(set),
				...createAuthState(set),
				...createEventState(set),
				clearStorage: () => {
					localStorage.removeItem('my-even-storage');
				},
			}),
			{
				name: 'my-even-storage',
				partialize: (state: MyEvenState) => ({
					allHomeEvents: state.allHomeEvents,
					allevents: state.allevents,
					user: state.user,
					token: state.token,
					refreshToken: state.refreshToken,
					isAuthenticated: state.isAuthenticated,
				}),
			}
		)
	)
);

export default useStore;