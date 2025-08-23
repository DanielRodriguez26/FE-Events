import type { SetState } from 'zustand';
import { loginUser, registerUser, refreshUserToken, logoutUser } from './auth.service';
import type { IAuthStore, ILoginCredentials, IRegisterCredentials } from './auth.interface';
import useStore from '@store/store';

// Estado inicial de autenticación
const createAuthInitialState = {
	user: null,
	token: null,
	refreshToken: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
};

// Función que crea el slice de autenticación
const createAuthState = (set: SetState<IAuthStore>): IAuthStore => ({
	// Estado inicial
	...createAuthInitialState,

	// Acciones
	login: async (credentials: ILoginCredentials) => {

		set({ isLoading: true, error: null });
		
		try {
			const response = await loginUser(credentials);

			
			set({
				user: response.user || null,
				token: response.token,
				refreshToken: response.refreshToken || null,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
			
			// Verificar que el estado se actualizó correctamente
			const updatedState = useStore.getState();
			console.log('✅ Estado después de actualizar:', {
				user: updatedState.user,
				token: updatedState.token,
				isAuthenticated: updatedState.isAuthenticated
			});
			
			// Verificar que los datos se guardaron en localStorage
			const storedData = localStorage.getItem('my-even-storage');
			console.log('✅ Datos en localStorage:', storedData ? JSON.parse(storedData) : 'No hay datos');
			
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

	register: async (credentials: IRegisterCredentials) => {
		console.log('🔍 Iniciando proceso de registro...');
		set({ isLoading: true, error: null });
		
		try {
			const response = await registerUser(credentials);
			console.log('✅ Registro exitoso, actualizando estado:', response);
			
			set({
				user: response.user || null,
				token: response.token || null,
				refreshToken: response.refreshToken || null,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
			
			// Verificar que el estado se actualizó correctamente
			const updatedState = useStore.getState();
			console.log('✅ Estado después del registro:', {
				user: updatedState.user,
				token: updatedState.token,
				isAuthenticated: updatedState.isAuthenticated
			});
			
			// Verificar que los datos se guardaron en localStorage
			const storedData = localStorage.getItem('my-even-storage');
			console.log('✅ Datos en localStorage después del registro:', storedData ? JSON.parse(storedData) : 'No hay datos');
			
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
		const currentState = useStore.getState();
		if (currentState.token) {
			logoutUser(currentState.token).catch(console.error);
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
		const currentState = useStore.getState();
		if (!currentState.refreshToken) {
			return false;
		}

		set({ isLoading: true, error: null });
		
		try {
			const response = await refreshUserToken(currentState.refreshToken);
			
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

	clearError: () => {
		set({ error: null });
	},

	setLoading: (loading: boolean) => {
		set({ isLoading: loading });
	},
});

export { createAuthState, createAuthInitialState };
export type { IAuthStore };
